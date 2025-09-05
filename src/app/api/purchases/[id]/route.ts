import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Purchase } from '@/lib/models';
import { z } from 'zod';

// Schema de validación para actualizar compra
const updatePurchaseSchema = z.object({
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  stripePaymentIntentId: z.string().optional(),
  paymentMethod: z.string().optional(),
  stripeFee: z.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional()
});

// GET /api/purchases/[id] - Obtener una compra específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const purchase = await Purchase.findById(params.id);
    
    if (!purchase) {
      return NextResponse.json({
        success: false,
        error: 'Compra no encontrada'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: purchase
    });
    
  } catch (error) {
    console.error('Error fetching purchase:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PATCH /api/purchases/[id] - Actualizar una compra
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validar datos
    const validatedData = updatePurchaseSchema.parse(body);
    
    // Actualizar compra
    const purchase = await Purchase.findByIdAndUpdate(
      params.id,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!purchase) {
      return NextResponse.json({
        success: false,
        error: 'Compra no encontrada'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: purchase
    });
    
  } catch (error) {
    console.error('Error updating purchase:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Datos inválidos',
        details: error.issues
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE /api/purchases/[id] - Eliminar una compra
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const purchase = await Purchase.findByIdAndDelete(params.id);
    
    if (!purchase) {
      return NextResponse.json({
        success: false,
        error: 'Compra no encontrada'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Compra eliminada correctamente'
    });
    
  } catch (error) {
    console.error('Error deleting purchase:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
