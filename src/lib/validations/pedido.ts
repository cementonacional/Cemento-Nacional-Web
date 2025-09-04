import { z } from 'zod';

export const locationSchema = z.object({
  lat: z.number()
    .min(-90, 'La latitud debe estar entre -90 y 90')
    .max(90, 'La latitud debe estar entre -90 y 90'),
  lng: z.number()
    .min(-180, 'La longitud debe estar entre -180 y 180')
    .max(180, 'La longitud debe estar entre -180 y 180'),
});

export const pedidoSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .trim(),
  correo: z.string()
    .email('Por favor ingresa un correo válido')
    .min(5, 'El correo debe tener al menos 5 caracteres')
    .max(100, 'El correo no puede tener más de 100 caracteres')
    .trim()
    .toLowerCase(),
  telefono: z.string()
    .max(20, 'El teléfono no puede tener más de 20 caracteres')
    .trim()
    .optional(),
  compania: z.string()
    .max(100, 'El nombre de la compañía no puede tener más de 100 caracteres')
    .trim()
    .optional(),
  bolsas: z.number()
    .int('El número de bolsas debe ser un número entero')
    .min(1, 'Debe pedir al menos 1 bolsa')
    .max(1000, 'No puede pedir más de 1000 bolsas'),
  precioUnitario: z.number()
    .min(0, 'El precio unitario no puede ser negativo'),
  address: z.string()
    .max(500, 'La dirección no puede tener más de 500 caracteres')
    .trim()
    .optional(),
  location: locationSchema.optional(),
  notas: z.string()
    .max(1000, 'Las notas no pueden tener más de 1000 caracteres')
    .trim()
    .optional(),
});

export const quoteSchema = z.object({
  bolsas: z.number()
    .int('El número de bolsas debe ser un número entero')
    .min(1, 'Debe pedir al menos 1 bolsa')
    .max(1000, 'No puede pedir más de 1000 bolsas'),
  precioUnitario: z.number()
    .min(0, 'El precio unitario no puede ser negativo'),
  location: locationSchema.optional(),
});

export type PedidoFormData = z.infer<typeof pedidoSchema>;
export type QuoteFormData = z.infer<typeof quoteSchema>;
export type LocationData = z.infer<typeof locationSchema>;
