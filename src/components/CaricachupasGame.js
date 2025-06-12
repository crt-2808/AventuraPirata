// src/components/CaricachupasGame.js

import React, { useState, useEffect, useCallback } from 'react';
import caricachupasData from '../mock/caricachupas.json'; // Importa los datos de Caricachupas

function CaricachupasGame({ onExitGame }) { // No necesitamos 'players' para filtrar por audiencia aquí
  const [currentTopic, setCurrentTopic] = useState(null);
  const [availableTopics, setAvailableTopics] = useState([]);

  // Función para obtener un tema aleatorio
  const getRandomTopic = useCallback(() => {
    if (availableTopics.length === 0) {
      console.warn("No hay temas disponibles para Caricachupas.");
      return null;
    }
    const randomIndex = Math.floor(Math.random() * availableTopics.length);
    return availableTopics[randomIndex];
  }, [availableTopics]);

  // Efecto para cargar los temas al inicio
  useEffect(() => {
    // Caricachupas no tiene filtrado por audiencia, simplemente carga todos los temas
    setAvailableTopics(caricachupasData);

    // Iniciar con un tema aleatorio si hay disponibles
    if (caricachupasData.length > 0 && !currentTopic) {
        setCurrentTopic(caricachupasData[Math.floor(Math.random() * caricachupasData.length)]);
    }

  }, [currentTopic]); // Dependencia para re-ejecutar si currentTopic es null y hay datos


  // Manejador para el botón "Siguiente"
  const handleNextTopic = () => {
    const nextTopic = getRandomTopic();
    if (nextTopic) {
      setCurrentTopic(nextTopic);
    } else {
      console.warn("No hay más temas para mostrar. Considera reiniciar el juego.");
      // Opcional: Podrías volver al primer tema si quieres que el ciclo se repita
      // setCurrentTopic(availableTopics[0]);
    }
  };

  // Manejador para el botón "A comer"
  const handleExitToGameSelector = () => {
    if (onExitGame) {
      onExitGame(); // Llama a la función proporcionada por App.js para regresar
    }
  };

  return (
    <div className="game-container bg-white p-6 rounded-lg shadow-md text-center relative">
      {/* Botón de regreso */}
      <button
        onClick={handleExitToGameSelector}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
      >
        &#8592;
      </button>

      <h2 className="text-3xl font-bold mb-8 text-gray-800">¡Caricachupas!</h2>

      {currentTopic ? (
        <>
          <div className="my-10 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-32 flex items-center justify-center">
            <p className="text-4xl font-semibold text-purple-700 leading-tight">
              "{currentTopic.Tema}"
            </p>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleNextTopic}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
            >
              Siguiente
            </button>
            <button
              onClick={handleExitToGameSelector}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
            >
              A comer
            </button>
          </div>
        </>
      ) : (
        <div className="text-gray-600 text-xl my-8">Cargando temas de Caricachupas...</div>
      )}
    </div>
  );
}

export default CaricachupasGame;