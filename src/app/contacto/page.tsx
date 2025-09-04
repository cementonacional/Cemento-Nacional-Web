'use client';

import { useState } from 'react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { contactSchema } from '@/lib/validations';
import ValidatedInput from '@/components/ValidatedInput';
import ValidatedTextarea from '@/components/ValidatedTextarea';

export default function ContactoPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const initialValues = {
    nombre: '',
    correo: '',
    telefono: '',
    compania: '',
    mensaje: ''
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit: handleFormSubmit,
    reset
  } = useFormValidation({
    schema: contactSchema,
    initialValues,
    onSubmit: handleSubmit
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-black mb-8 text-center">
        Contáctanos
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Información de contacto */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-brand-black">
            Información de Contacto
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-brand-black">Email</h3>
                <p className="text-brand-black">contacto@cementonacional.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-brand-black">Teléfono</h3>
                <p className="text-brand-black">+52 (81) 1234-5678</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-brand-black">Dirección</h3>
                <p className="text-brand-black">
                  Av. Industrial 123<br />
                  Monterrey, N.L. 64000<br />
                  México
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formulario de contacto */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-brand-black mb-6">
            Envíanos un Mensaje
          </h2>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <ValidatedInput
              label="Nombre"
              name="nombre"
              value={values.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              error={errors.nombre}
              required
              placeholder="Tu nombre completo"
            />
            
            <ValidatedInput
              label="Correo Electrónico"
              name="correo"
              type="email"
              value={values.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
              error={errors.correo}
              required
              placeholder="tu@email.com"
            />
            
            <ValidatedInput
              label="Teléfono"
              name="telefono"
              type="tel"
              value={values.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              error={errors.telefono}
              placeholder="+52 (81) 1234-5678"
              helperText="Opcional"
            />
            
            <ValidatedInput
              label="Compañía"
              name="compania"
              value={values.compania}
              onChange={(e) => handleChange('compania', e.target.value)}
              error={errors.compania}
              placeholder="Nombre de tu empresa"
              helperText="Opcional"
            />
            
            <ValidatedTextarea
              label="Mensaje"
              name="mensaje"
              value={values.mensaje}
              onChange={(e) => handleChange('mensaje', e.target.value)}
              error={errors.mensaje}
              required
              placeholder="¿En qué podemos ayudarte?"
              rows={4}
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-red text-white py-3 px-6 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
            
            {submitStatus === 'success' && (
              <div className="text-green-600 text-sm text-center">
                ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="text-red-600 text-sm text-center">
                Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
