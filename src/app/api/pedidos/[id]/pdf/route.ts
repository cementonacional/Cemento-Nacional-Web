import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import dbConnect from '@/lib/mongodb';
import { Pedido } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Conectar a la base de datos
    await dbConnect();

    // Buscar el pedido
    const pedido = await Pedido.findById(id);
    
    if (!pedido) {
      return NextResponse.json(
        { success: false, message: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // Crear PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();

    // Generar QR Code
    const qrData = {
      pedidoId: id,
      nombre: pedido.nombre,
      total: pedido.totalFinal,
      fecha: new Date(pedido.createdAt).toISOString(),
      adminUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/admin`,
      mapsUrl: pedido.location ? `https://www.google.com/maps?q=${pedido.location.lat},${pedido.location.lng}` : null
    };

    const qrContent = JSON.stringify(qrData);
    const qrCodeDataURL = await QRCode.toDataURL(qrContent, {
      width: 150,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Convertir QR Code a imagen
    const qrImage = await pdfDoc.embedPng(qrCodeDataURL);

    // Fuentes
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Colores
    const black = rgb(0, 0, 0);
    const red = rgb(0.8, 0.1, 0.1);
    const gray = rgb(0.5, 0.5, 0.5);

    // Título
    page.drawText('CEMENTO NACIONAL', {
      x: 50,
      y: height - 80,
      size: 24,
      font: boldFont,
      color: black,
    });

    page.drawText('La Fuerza del Presente', {
      x: 50,
      y: height - 105,
      size: 14,
      font: font,
      color: red,
    });

    page.drawText('PEDIDO DE CEMENTO', {
      x: 50,
      y: height - 140,
      size: 18,
      font: boldFont,
      color: black,
    });

    // Línea separadora
    page.drawLine({
      start: { x: 50, y: height - 160 },
      end: { x: width - 50, y: height - 160 },
      thickness: 2,
      color: black,
    });

    // Información del pedido
    let yPosition = height - 190;

    const drawField = (label: string, value: string, isBold = false) => {
      page.drawText(`${label}:`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: black,
      });
      
      page.drawText(value, {
        x: 200,
        y: yPosition,
        size: 12,
        font: isBold ? boldFont : font,
        color: black,
      });
      
      yPosition -= 25;
    };

    // Datos del cliente
    page.drawText('INFORMACIÓN DEL CLIENTE', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: red,
    });
    yPosition -= 30;

    drawField('Nombre', pedido.nombre);
    drawField('Correo', pedido.correo);
    drawField('Teléfono', pedido.telefono || 'No especificado');
    drawField('Compañía', pedido.compania || 'No especificada');

    yPosition -= 20;

    // Detalles del pedido
    page.drawText('DETALLES DEL PEDIDO', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: red,
    });
    yPosition -= 30;

    drawField('Bolsas', pedido.bolsas.toString());
    drawField('Precio Unitario', `$${pedido.precioUnitario.toFixed(2)} MXN`);
    drawField('Subtotal', `$${pedido.subtotal.toFixed(2)} MXN`);
    drawField('Flete', `$${pedido.flete.toFixed(2)} MXN`);
    drawField('Total Final', `$${pedido.totalFinal.toFixed(2)} MXN`, true);

    yPosition -= 20;

    // Ubicación
    if (pedido.location) {
      page.drawText('UBICACIÓN DE ENTREGA', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: red,
      });
      yPosition -= 30;

      drawField('Dirección', pedido.address || 'No especificada');
      drawField('Latitud', pedido.location.lat.toString());
      drawField('Longitud', pedido.location.lng.toString());
      drawField('Distancia', `${pedido.distanceKm.toFixed(1)} km`);
    }

    yPosition -= 20;

    // Notas
    if (pedido.notas) {
      page.drawText('NOTAS ADICIONALES', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: red,
      });
      yPosition -= 30;

      // Dividir notas en líneas si son muy largas
      const notes = pedido.notas;
      const maxWidth = 40;
      const words = notes.split(' ');
      let line = '';
      
      for (const word of words) {
        if ((line + word).length > maxWidth) {
          page.drawText(line, {
            x: 50,
            y: yPosition,
            size: 12,
            font: font,
            color: black,
          });
          yPosition -= 15;
          line = word + ' ';
        } else {
          line += word + ' ';
        }
      }
      
      if (line) {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 12,
          font: font,
          color: black,
        });
        yPosition -= 15;
      }
    }

    // Fecha y hora
    yPosition -= 30;
    page.drawText('FECHA DE PEDIDO', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: red,
    });
    yPosition -= 25;

    const fecha = new Date(pedido.createdAt).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    drawField('Fecha', fecha);

    // Pie de página
    yPosition = 100;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1,
      color: gray,
    });

    yPosition -= 20;
    
    // QR Code en la esquina inferior derecha
    const qrSize = 80;
    page.drawImage(qrImage, {
      x: width - 50 - qrSize,
      y: yPosition - qrSize,
      width: qrSize,
      height: qrSize,
    });

    // Texto del pie de página
    page.drawText('Cemento Nacional - La Fuerza del Presente', {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
      color: gray,
    });

    page.drawText(`ID: ${pedido._id}`, {
      x: width - 150,
      y: yPosition,
      size: 10,
      font: font,
      color: gray,
    });

    // Texto del QR Code
    yPosition -= qrSize + 10;
    page.drawText('QR Code:', {
      x: width - 50 - qrSize,
      y: yPosition,
      size: 8,
      font: boldFont,
      color: gray,
    });

    yPosition -= 15;
    page.drawText('• Escanea para ver en admin', {
      x: width - 50 - qrSize,
      y: yPosition,
      size: 7,
      font: font,
      color: gray,
    });

    yPosition -= 12;
    if (pedido.location) {
      page.drawText('• Ver ubicación en Maps', {
        x: width - 50 - qrSize,
        y: yPosition,
        size: 7,
        font: font,
        color: gray,
      });
    }

    // Generar PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pedido-${id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, message: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}
