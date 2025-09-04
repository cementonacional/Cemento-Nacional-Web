import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getSessionFromRequest, isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const sessionToken = await getSessionFromRequest(request);
    if (!isAuthenticated(sessionToken)) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Datos requeridos' },
        { status: 400 }
      );
    }

    // Generar QR Code como data URL
    const qrDataURL = await QRCode.toDataURL(JSON.stringify(data), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrDataURL,
        data: data
      }
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { success: false, message: 'Error al generar QR code' },
      { status: 500 }
    );
  }
}
