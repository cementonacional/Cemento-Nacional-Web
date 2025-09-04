import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSession } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Usuario requerido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = loginSchema.parse(body);

    if (verifyCredentials(username, password)) {
      const sessionToken = createSession();
      
      const response = NextResponse.json({
        success: true,
        message: 'Autenticación exitosa'
      });

      // Establecer cookie de sesión
      response.cookies.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 horas
        path: '/'
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Datos inválidos', errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Sesión cerrada'
  });

  // Eliminar cookie de sesión
  response.cookies.set('admin-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });

  return response;
}
