// src/components/PlayerCounter.js

import React from 'react';

function PlayerCounter({ onEmbark, onDemo, adultPlayers, childPlayers }) { // Recibe onDemo
  const totalPlayers = adultPlayers + childPlayers;

  // Funciones para manejar los clics de los botones de cantidad
  const handleAdultChange = (change) => {
    const newCount = Math.max(0, adultPlayers + change);
    onEmbark(newCount, childPlayers);
  };

  const handleChildChange = (change) => {
    const newCount = Math.max(0, childPlayers + change);
    onEmbark(adultPlayers, newCount);
  };

  // Deshabilitar botón "Embarcar" si no hay jugadores
  const isEmbarkDisabled = totalPlayers === 0;

  return (
    <div className="game-container bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">¿Cuántos piratas jugarán?</h2>

      <div className="mb-6">
        <p className="text-lg text-gray-600 mb-2">Total de jugadores:</p>
        <p className="text-5xl font-extrabold text-blue-700">{totalPlayers}</p>
      </div>

      <div className="space-y-4 mb-8">
        {/* Adultos */}
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <span className="text-xl font-semibold text-gray-700">Adultos:</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleAdultChange(-1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={adultPlayers === 0}
            >
              -
            </button>
            <span className="text-3xl font-bold text-blue-700 w-10">{adultPlayers}</span>
            <button
              onClick={() => handleAdultChange(1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-2xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Niños */}
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <span className="text-xl font-semibold text-gray-700">Niños:</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleChildChange(-1)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={childPlayers === 0}
            >
              -
            </button>
            <span className="text-3xl font-bold text-yellow-700 w-10">{childPlayers}</span>
            <button
              onClick={() => handleChildChange(1)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full text-2xl"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center space-x-4"> {/* Contenedor flex para los botones */}
        <button
          onClick={() => onEmbark(adultPlayers, childPlayers)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isEmbarkDisabled}
        >
          ¡Embarcar!
        </button>
        <button
          onClick={onDemo} // <--- ¡AQUÍ ESTÁ DE NUEVO EL BOTÓN "DEMO"!
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
        >
          Demo
        </button>
      </div>
    </div>
  );
}

export default PlayerCounter;