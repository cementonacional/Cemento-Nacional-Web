import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Pedido } from '@/lib/models';
import { getSessionFromRequest, isAuthenticated } from '@/lib/auth';
import { paginationSchema, pedidoFiltersSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const sessionToken = await getSessionFromRequest(request);
    if (!isAuthenticated(sessionToken)) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Conectar a la base de datos
    await dbConnect();

    // Validar parámetros de paginación
    const paginationParams = {
      page: request.nextUrl.searchParams.get('page') || '1',
      limit: request.nextUrl.searchParams.get('limit') || '10'
    };
    
    const { page, limit } = paginationSchema.parse(paginationParams);
    const skip = (page - 1) * limit;

    // Validar filtros de pedidos
    const filterParams = {
      status: request.nextUrl.searchParams.get('status') || undefined,
      dateFrom: request.nextUrl.searchParams.get('dateFrom') || undefined,
      dateTo: request.nextUrl.searchParams.get('dateTo') || undefined,
      minTotal: request.nextUrl.searchParams.get('minTotal') || undefined,
      maxTotal: request.nextUrl.searchParams.get('maxTotal') || undefined
    };
    
    const { status, dateFrom, dateTo, minTotal, maxTotal } = pedidoFiltersSchema.parse(filterParams);

    // Construir filtros de búsqueda
    const filter: Record<string, any> = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = dateFrom;
      if (dateTo) filter.createdAt.$lte = dateTo;
    }
    
    if (minTotal !== undefined || maxTotal !== undefined) {
      filter.totalFinal = {};
      if (minTotal !== undefined) filter.totalFinal.$gte = minTotal;
      if (maxTotal !== undefined) filter.totalFinal.$lte = maxTotal;
    }

    const pedidos = await Pedido.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Pedido.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        pedidos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching pedidos:', error);
    
    // Manejar errores de validación
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Parámetros inválidos', errors: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
}
