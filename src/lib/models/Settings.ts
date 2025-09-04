import mongoose from 'mongoose';

export interface ILocation {
  lat: number;
  lng: number;
}

export interface IPricingSettings {
  tarifaPorKm: number;
  fleteMinimo: number;
  origen: ILocation;
}

export interface ISettings {
  key: string;
  pricing: IPricingSettings;
  updatedAt: Date;
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

const pricingSchema = new mongoose.Schema<IPricingSettings>({
  tarifaPorKm: {
    type: Number,
    required: [true, 'La tarifa por kilómetro es requerida'],
    min: [0, 'La tarifa por kilómetro no puede ser negativa'],
    default: 15 // MXN por km
  },
  fleteMinimo: {
    type: Number,
    required: [true, 'El flete mínimo es requerido'],
    min: [0, 'El flete mínimo no puede ser negativo'],
    default: 100 // MXN mínimo
  },
  origen: {
    type: locationSchema,
    required: [true, 'La ubicación de origen es requerida'],
    default: {
      lat: 25.6866, // Monterrey, México
      lng: -100.3161
    }
  }
});

const settingsSchema = new mongoose.Schema<ISettings>({
  key: {
    type: String,
    required: [true, 'La clave es requerida'],
    unique: true,
    trim: true
  },
  pricing: {
    type: pricingSchema,
    required: [true, 'La configuración de precios es requerida']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar updatedAt automáticamente
settingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Índices
settingsSchema.index({ key: 1 }, { unique: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
