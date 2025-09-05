import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Purchase } from '@/lib/models';
import { z } from 'zod';

// Schema de validación para crear una compra
const createPurchaseSchema = z.object({
  customerName: z.string().min(1, 'Nombre es requerido').max(100),
  customerEmail: z.string().email('Email inválido').max(100),
  customerPhone: z.string().optional(),
  customerCompany: z.string().optional(),
  productName: z.string().min(1, 'Nombre del producto es requerido').max(200),
  productDescription: z.string().min(1, 'Descripción del producto es requerida').max(500),
  quantity: z.number().min(1, 'Cantidad debe ser al menos 1').max(1000),
  unitPrice: z.number().min(0, 'Precio unitario debe ser positivo'),
  subtotal: z.number().min(0, 'Subtotal debe ser positivo'),
  stripeSessionId: z.string().min(1, 'Stripe Session ID es requerido'),
  totalAmount: z.number().min(0, 'Total debe ser positivo'),
  currency: z.string().default('MXN'),
  shippingAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional()
});

// Schema de validación para filtros de búsqueda
const getPurchasesSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  customerEmail: z.string().email().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  minAmount: z.string().optional(),
  maxAmount: z.string().optional()
});

// GET /api/purchases - Obtener todas las compras
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Validar parámetros
    const validatedParams = getPurchasesSchema.parse(params);
    
    const {
      page,
      limit,
      status,
      customerEmail,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount
    } = validatedParams;
    
    // Construir filtros
    const filter: Record<string, unknown> = {};
    
    if (status) {
      filter.paymentStatus = status;
    }
    
    if (customerEmail) {
      filter.customerEmail = customerEmail;
    }
    
    if (dateFrom || dateTo) {
      filter.createdAt = {} as Record<string, unknown>;
      if (dateFrom) {
        (filter.createdAt as Record<string, unknown>).$gte = new Date(dateFrom);
      }
      if (dateTo) {
        (filter.createdAt as Record<string, unknown>).$lte = new Date(dateTo);
      }
    }
    
    if (minAmount || maxAmount) {
      filter.totalAmount = {} as Record<string, unknown>;
      if (minAmount) {
        (filter.totalAmount as Record<string, unknown>).$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        (filter.totalAmount as Record<string, unknown>).$lte = parseFloat(maxAmount);
      }
    }
    
    // Calcular paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Obtener compras
    const purchases = await Purchase.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    // Contar total
    const total = await Purchase.countDocuments(filter);
    
    // Calcular estadísticas
    const stats = await Purchase.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalPurchases: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' },
          paidPurchases: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] }
          },
          pendingPurchases: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] }
          },
          failedPurchases: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] }
          }
        }
      }
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        purchases,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        stats: stats[0] || {
          totalRevenue: 0,
          totalPurchases: 0,
          averageOrderValue: 0,
          paidPurchases: 0,
          pendingPurchases: 0,
          failedPurchases: 0
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching purchases:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Parámetros inválidos',
        details: error.issues
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST /api/purchases - Crear una nueva compra
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validar datos
    const validatedData = createPurchaseSchema.parse(body);
    
    // Crear compra
    const purchase = new Purchase(validatedData);
    await purchase.save();
    
    return NextResponse.json({
      success: true,
      data: purchase
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating purchase:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Datos inválidos',
        details: error.issues
      }, { status: 400 });
    }
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({
        success: false,
        error: 'Ya existe una compra con este Stripe Session ID'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
