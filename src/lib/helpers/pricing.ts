import dbConnect from '../mongodb';
import Settings from '../models/Settings';
import { IPricingSettings } from '../models/Settings';

const DEFAULT_PRICING: IPricingSettings = {
  tarifaPorKm: 15, // MXN por km
  fleteMinimo: 100, // MXN mínimo
  origen: {
    lat: 25.6866, // Monterrey, México
    lng: -100.3161
  }
};

/**
 * Obtiene la configuración de precios actual
 * Si no existe, crea una configuración por defecto
 */
export async function getPricing(): Promise<IPricingSettings> {
  await dbConnect();
  
  try {
    let settings = await Settings.findOne({ key: 'pricing' });
    
    if (!settings) {
      // Crear configuración por defecto si no existe
      settings = await Settings.create({
        key: 'pricing',
        pricing: DEFAULT_PRICING
      });
    }
    
    return settings.pricing;
  } catch (error) {
    console.error('Error al obtener configuración de precios:', error);
    return DEFAULT_PRICING;
  }
}

/**
 * Actualiza la configuración de precios
 */
export async function updatePricing(input: Partial<IPricingSettings>): Promise<IPricingSettings> {
  await dbConnect();
  
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: 'pricing' },
      { 
        $set: { 
          pricing: input,
          updatedAt: new Date()
        } 
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );
    
    return settings.pricing;
  } catch (error) {
    console.error('Error al actualizar configuración de precios:', error);
    throw new Error('No se pudo actualizar la configuración de precios');
  }
}

/**
 * Calcula el flete basado en la distancia y la configuración actual
 */
export async function calculateFlete(distanceKm: number): Promise<number> {
  const pricing = await getPricing();
  const fleteCalculado = distanceKm * pricing.tarifaPorKm;
  
  // Retorna el máximo entre el flete calculado y el mínimo
  return Math.max(fleteCalculado, pricing.fleteMinimo);
}

/**
 * Obtiene la ubicación de origen para cálculos de distancia
 */
export async function getOrigen(): Promise<{ lat: number; lng: number }> {
  const pricing = await getPricing();
  return pricing.origen;
}
