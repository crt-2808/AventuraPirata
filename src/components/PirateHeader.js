// src/components/PirateHeader.js

import React from 'react';
import aventuraPirataLogo from '../img/Aventura Pirata icon.png'; // Ruta a tu logo

function PirateHeader() {
  return (
    // Hemos quitado 'overflow-hidden' del header.
    // Mantenemos una altura fija para el header (ej. h-40) para que el bloque naranja no se estire con la imagen,
    // pero la imagen ahora puede sobresalir.
    // flex, items-center y justify-center para centrar el contenido (el logo).
    <header className="bg-orange-800 text-white p-4 rounded-lg shadow-md flex items-center justify-center h-40"> {/* Ajusta h-40 a la altura deseada para el bloque naranja */}
      <img
        src={aventuraPirataLogo}
        alt="Aventura Pirata Logo"
        // Le damos a la imagen una altura mayor que la del header (ej. h-64 o más).
        // 'w-auto' para mantener proporciones.
        // 'object-contain' para que la imagen se vea completa aunque sobresalga.
        className="h-64 w-auto object-contain" // Puedes ajustar h-64 para que sobresalga más o menos
      />
    </header>
  );
}

export default PirateHeader;