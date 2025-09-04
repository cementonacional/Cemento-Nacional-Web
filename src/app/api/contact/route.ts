import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/contact';
import dbConnect from '@/lib/mongodb';
import Message from '@/lib/models/Message';

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnect();

    // Obtener el cuerpo de la petición
    const body = await request.json();

    // Validar los datos con Zod
    const validatedData = contactSchema.parse(body);

    // Crear el mensaje en la base de datos
    const message = await Message.create(validatedData);

    // Retornar respuesta exitosa
    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensaje enviado correctamente',
        data: {
          id: message._id,
          nombre: message.nombre,
          correo: message.correo,
          createdAt: message.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en /api/contact:', error);

    // Manejar errores de validación de Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Datos inválidos',
          errors: JSON.parse(error.message)
        },
        { status: 400 }
      );
    }

    // Manejar otros errores
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}
