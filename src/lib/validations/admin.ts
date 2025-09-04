import { z } from 'zod';

// Esquema para paginación
export const paginationSchema = z.object({
  page: z.string().optional().default('1').transform(val => {
    const num = parseInt(val);
    return isNaN(num) || num < 1 ? 1 : num;
  }),
  limit: z.string().optional().default('10').transform(val => {
    const num = parseInt(val);
    return isNaN(num) || num < 1 || num > 100 ? 10 : num;
  })
});

// Esquema para filtros de búsqueda
export const searchSchema = z.object({
  query: z.string().optional(),
  dateFrom: z.string().optional().transform(val => {
    if (!val) return undefined;
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }),
  dateTo: z.string().optional().transform(val => {
    if (!val) return undefined;
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  })
});

// Esquema para actualizar estado de mensaje
export const messageStatusSchema = z.object({
  status: z.enum(['read', 'unread', 'archived']),
  messageId: z.string().min(1, 'ID del mensaje requerido')
});

// Esquema para actualizar estado de pedido
export const pedidoStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  pedidoId: z.string().min(1, 'ID del pedido requerido'),
  notes: z.string().optional()
});

// Esquema para filtros de pedidos
export const pedidoFiltersSchema = z.object({
  status: z.string().optional(),
  dateFrom: z.string().optional().transform(val => {
    if (!val) return undefined;
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }),
  dateTo: z.string().optional().transform(val => {
    if (!val) return undefined;
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }),
  minTotal: z.string().optional().transform(val => {
    if (!val) return undefined;
    const num = parseFloat(val);
    return isNaN(num) ? undefined : num;
  }),
  maxTotal: z.string().optional().transform(val => {
    if (!val) return undefined;
    const num = parseFloat(val);
    return isNaN(num) ? undefined : num;
  })
});
