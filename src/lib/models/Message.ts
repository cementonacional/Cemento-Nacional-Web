import mongoose from 'mongoose';

export interface IMessage {
  nombre: string;
  correo: string;
  telefono?: string;
  compania?: string;
  mensaje: string;
  createdAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
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
  mensaje: {
    type: String,
    required: [true, 'El mensaje es requerido'],
    trim: true,
    maxlength: [1000, 'El mensaje no puede tener más de 1000 caracteres']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para mejorar el rendimiento de las consultas
messageSchema.index({ createdAt: -1 });
messageSchema.index({ correo: 1 });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
