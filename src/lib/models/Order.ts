import mongoose from 'mongoose';

export interface IOrder {
  stripeSessionId: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amountTotal: number;
  currency: string;
  customerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  stripeSessionId: {
    type: String,
    required: [true, 'El ID de sesión de Stripe es requerido'],
    unique: true,
    trim: true
  },
  status: {
    type: String,
    required: [true, 'El estado es requerido'],
    enum: {
      values: ['pending', 'paid', 'failed', 'cancelled'],
      message: 'El estado debe ser: pending, paid, failed, o cancelled'
    },
    default: 'pending'
  },
  amountTotal: {
    type: Number,
    required: [true, 'El monto total es requerido'],
    min: [0, 'El monto total no puede ser negativo']
  },
  currency: {
    type: String,
    required: [true, 'La moneda es requerida'],
    default: 'MXN',
    uppercase: true,
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar updatedAt automáticamente
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Índices para mejorar el rendimiento
orderSchema.index({ stripeSessionId: 1 }, { unique: true });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ customerEmail: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
