// src/components/PlayerCounter.js

import React, { useState, useEffect } from 'react';

// Asegúrate de que las props que recibes incluyan onEmbark, adultPlayers y childPlayers
function PlayerCounter({ onEmbark, adultPlayers: initialAdults = 0, childPlayers: initialChildren = 0 }) {
  // Estados internos para el contador de jugadores
  const [totalPlayers, setTotalPlayers] = useState(initialAdults + initialChildren);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);

  // useEffect para actualizar el total cuando cambian adultos o niños
  useEffect(() => {
    setTotalPlayers(adults + children);
  }, [adults, children]);

  const handleAdultChange = (change) => {
    setAdults(prevAdults => Math.max(0, prevAdults + change));
  };

  const handleChildChange = (change) => {
    setChildren(prevChildren => Math.max(0, prevChildren + change));
  };

  // Función para manejar el clic en "¡Embarcar!"
  const handleEmbarkClick = () => {
    // Llama a la prop onEmbark pasando los valores actuales de adultos y niños
    if (onEmbark) {
      onEmbark(adults, children);
    }
  };

  return (
    <div className="player-counter-container bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">¿Cuántos piratas jugarán?</h2>
      <div className="mb-4">
        <p className="text-gray-600">Total de jugadores:</p>
        <span className="text-4xl font-extrabold text-blue-600">{totalPlayers}</span>
      </div>

      <div className="flex justify-around items-center mb-4">
        <p className="text-gray-700">Adultos:</p>
        <button
          onClick={() => handleAdultChange(-1)}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-xl font-bold"
        >
          -
        </button>
        <span className="text-2xl font-bold mx-2">{adults}</span>
        <button
          onClick={() => handleAdultChange(1)}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-xl font-bold"
        >
          +
        </button>
      </div>

      <div className="flex justify-around items-center mb-6">
        <p className="text-gray-700">Niños:</p>
        <button
          onClick={() => handleChildChange(-1)}
          className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xl font-bold"
        >
          -
        </button>
        <span className="text-2xl font-bold mx-2">{children}</span>
        <button
          onClick={() => handleChildChange(1)}
          className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xl font-bold"
        >
          +
        </button>
      </div>

      {/* Botón "¡Embarcar!" - Ahora llama a handleEmbarkClick */}
      <button
        onClick={handleEmbarkClick}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
      >
        ¡Embarcar!
      </button>
    </div>
  );
}

export default PlayerCounter;