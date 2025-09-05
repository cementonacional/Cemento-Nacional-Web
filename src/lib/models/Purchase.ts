import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  // Información del cliente
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  
  // Información del producto
  productName: string;
  productDescription: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  
  // Información de pago
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  
  // Información de la transacción
  totalAmount: number;
  currency: string;
  stripeFee?: number;
  netAmount?: number;
  
  // Información de envío
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  // Metadatos
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  // Información del cliente
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  customerPhone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  customerCompany: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Información del producto
  productName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 1000
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Información de pago
  stripeSessionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  stripePaymentIntentId: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    trim: true
  },
  
  // Información de la transacción
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'MXN',
    uppercase: true
  },
  stripeFee: {
    type: Number,
    min: 0
  },
  netAmount: {
    type: Number,
    min: 0
  },
  
  // Información de envío
  shippingAddress: {
    street: {
      type: String,
      trim: true,
      maxlength: 200
    },
    city: {
      type: String,
      trim: true,
      maxlength: 100
    },
    state: {
      type: String,
      trim: true,
      maxlength: 100
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: 20
    },
    country: {
      type: String,
      trim: true,
      maxlength: 100
    }
  },
  
  // Metadatos
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }]
}, {
  timestamps: true,
  collection: 'purchases'
});

// Índices para optimizar consultas
PurchaseSchema.index({ customerEmail: 1 });
PurchaseSchema.index({ stripeSessionId: 1 });
PurchaseSchema.index({ paymentStatus: 1 });
PurchaseSchema.index({ createdAt: -1 });
PurchaseSchema.index({ totalAmount: 1 });

// Middleware para calcular netAmount
PurchaseSchema.pre('save', function(next) {
  if (this.stripeFee && this.totalAmount) {
    this.netAmount = this.totalAmount - this.stripeFee;
  }
  next();
});

export default mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);
