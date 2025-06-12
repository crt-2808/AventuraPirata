// src/components/GameSelector.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Asegúrate de que recibes onSelectGameType (¡No onGameSelected!) y onBack como props
function GameSelector({ onSelectGameType, onBack }) { // <-- ¡Cambio aquí!
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="game-selector-container bg-white p-6 rounded-lg shadow-md text-center">
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
      >
        &#8592;
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Elige tu tipo de batalla</h2>

      <div className="space-y-4">
        <button
          onClick={() => onSelectGameType('Juego Creativo')} // <-- ¡Cambio aquí!
          className="w-full py-4 px-6 rounded-lg bg-purple-200 text-purple-800 font-bold text-lg hover:bg-purple-300 transition duration-300 flex items-center justify-center"
        >
          <span role="img" aria-label="Creative Games icon" className="mr-2 text-2xl">🎨</span>
          Juegos Creativos
        </button>
        <button
          onClick={() => onSelectGameType('Juego Verbal')} // <-- ¡Cambio aquí!
          className="w-full py-4 px-6 rounded-lg bg-green-200 text-green-800 font-bold text-lg hover:bg-green-300 transition duration-300 flex items-center justify-center"
        >
          <span role="img" aria-label="Verbal Games icon" className="mr-2 text-2xl">💬</span>
          Juegos Verbales
        </button>
        <button
          onClick={() => onSelectGameType('Juego Físico')} // <-- ¡Cambio aquí!
          className="w-full py-4 px-6 rounded-lg bg-orange-200 text-orange-800 font-bold text-lg hover:bg-orange-300 transition duration-300 flex items-center justify-center"
        >
          <span role="img" aria-label="Physical Games icon" className="mr-2 text-2xl">🤸</span>
          Juegos Físicos
        </button>
      </div>
    </div>
  );
}

export default GameSelector;