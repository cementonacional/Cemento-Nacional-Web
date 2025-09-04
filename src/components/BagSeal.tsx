import React from 'react';

export default function BagSeal() {
  return (
    <div className="relative">
      {/* Sombra del sello */}
      <div className="absolute inset-0 bg-brand-red rounded-full shadow-[0_4px_0_0_rgba(28,28,28,0.8)] transform translate-y-1"></div>
      
      {/* Sello principal */}
      <div className="relative bg-brand-red rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        {/* Círculo exterior */}
        <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center shadow-inner">
          {/* Círculo interior blanco */}
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
            {/* Contenido del sello */}
            <div className="text-center">
              <div className="text-brand-red text-xs font-bold leading-tight">
                CEMENTO
              </div>
              <div className="text-brand-red text-xs font-bold leading-tight">
                NACIONAL
              </div>
              {/* Símbolo de registro */}
              <div className="text-brand-red text-[8px] mt-1">®</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
