import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Message } from '@/lib/models';
import { getSessionFromRequest, isAuthenticated } from '@/lib/auth';
import { paginationSchema, searchSchema } from '@/lib/validations';

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

    // Validar parámetros de búsqueda
    const searchParams = {
      query: request.nextUrl.searchParams.get('query') || undefined,
      dateFrom: request.nextUrl.searchParams.get('dateFrom') || undefined,
      dateTo: request.nextUrl.searchParams.get('dateTo') || undefined
    };
    
    const { query, dateFrom, dateTo } = searchSchema.parse(searchParams);

    // Construir filtros de búsqueda
    const filter: any = {};
    
    if (query) {
      filter.$or = [
        { nombre: { $regex: query, $options: 'i' } },
        { correo: { $regex: query, $options: 'i' } },
        { compania: { $regex: query, $options: 'i' } },
        { mensaje: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = dateFrom;
      if (dateTo) filter.createdAt.$lte = dateTo;
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Message.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    
    // Manejar errores de validación
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Parámetros inválidos', errors: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}
