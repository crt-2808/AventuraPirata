// src/components/GameSelector.js

import React from 'react';

function GameSelector({ onSelectGameType, onBack, isDemoMode }) { // Recibe isDemoMode
  return (
    <div className="game-container bg-white p-6 rounded-lg shadow-md text-center relative">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
      >
        &#8592;
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">¿Qué tipo de juego buscáis, camaradas?</h2>

      <div className="space-y-4">
        <button
          onClick={() => onSelectGameType('creative')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
        >
          Juegos Creativos
        </button>

        <button
          onClick={() => onSelectGameType('physical')}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
        >
          Juegos Físicos
        </button>

        {/* Solo mostrar el botón "Juegos Verbales" si NO estamos en modo Demo */}
        {!isDemoMode && (
          <button
            onClick={() => onSelectGameType('verbal')}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Juegos Verbales
          </button>
        )}
      </div>
    </div>
  );
}

export default GameSelector;