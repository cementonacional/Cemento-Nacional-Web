import { z } from 'zod';

export const contactSchema = z.object({
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
  mensaje: z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede tener más de 1000 caracteres')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
