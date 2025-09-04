import mongoose from 'mongoose';

export interface ILocation {
  lat: number;
  lng: number;
}

export interface IPedido {
  nombre: string;
  correo: string;
  telefono?: string;
  compania?: string;
  bolsas: number;
  precioUnitario: number;
  subtotal: number;
  flete: number;
  totalFinal: number;
  address?: string;
  location?: ILocation;
  distanceKm?: number;
  notas?: string;
  createdAt: Date;
}

const locationSchema = new mongoose.Schema<ILocation>({
  lat: {
    type: Number,
    required: [true, 'La latitud es requerida'],
    min: [-90, 'La latitud debe estar entre -90 y 90'],
    max: [90, 'La latitud debe estar entre -90 y 90']
  },
  lng: {
    type: Number,
    required: [true, 'La longitud es requerida'],
    min: [-180, 'La longitud debe estar entre -180 y 180'],
    max: [180, 'La longitud debe estar entre -180 y 180']
  }
});

const pedidoSchema = new mongoose.Schema<IPedido>({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido']
  },
  telefono: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono no puede tener más de 20 caracteres']
  },
  compania: {
    type: String,
    trim: true,
    maxlength: [100, 'El nombre de la compañía no puede tener más de 100 caracteres']
  },
  bolsas: {
    type: Number,
    required: [true, 'El número de bolsas es requerido'],
    min: [1, 'Debe pedir al menos 1 bolsa'],
    max: [1000, 'No puede pedir más de 1000 bolsas']
  },
  precioUnitario: {
    type: Number,
    required: [true, 'El precio unitario es requerido'],
    min: [0, 'El precio unitario no puede ser negativo']
  },
  subtotal: {
    type: Number,
    required: [true, 'El subtotal es requerido'],
    min: [0, 'El subtotal no puede ser negativo']
  },
  flete: {
    type: Number,
    required: [true, 'El flete es requerido'],
    min: [0, 'El flete no puede ser negativo']
  },
  totalFinal: {
    type: Number,
    required: [true, 'El total final es requerido'],
    min: [0, 'El total final no puede ser negativo']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'La dirección no puede tener más de 500 caracteres']
  },
  location: {
    type: locationSchema,
    required: false
  },
  distanceKm: {
    type: Number,
    min: [0, 'La distancia no puede ser negativa']
  },
  notas: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas no pueden tener más de 1000 caracteres']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para mejorar el rendimiento
pedidoSchema.index({ createdAt: -1 });
pedidoSchema.index({ correo: 1 });
pedidoSchema.index({ nombre: 1 });
pedidoSchema.index({ 'location.lat': 1, 'location.lng': 1 });

export default mongoose.models.Pedido || mongoose.model<IPedido>('Pedido', pedidoSchema);
