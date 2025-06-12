// src/components/GameRecommendation.js

import React, { useState, useEffect } from 'react';
// Aseguramos que useNavigate esté importado si lo necesitamos más adelante. No se usa directamente aquí ya.

import { verbalGames, creativeGames, physicalGames } from '../mock/games.js';
import pictionaryData from '../mock/pictionary_data.json';
import veoveoData from '../mock/veoveo_data.json';

// Añadimos 'onStartGame' a las props
function GameRecommendation({ gameType, players, allowedDifficulties, onBack, onStartGame }) {
  const [recommendedGame, setRecommendedGame] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);

  // ... (useEffect para console.log de dificultades y jugadores - sin cambios)
  useEffect(() => {
    console.log("Dificultades permitidas recibidas en GameRecommendation:", allowedDifficulties);
    console.log("Tipo de juego seleccionado:", gameType);
    console.log("Jugadores:", players);
  }, [allowedDifficulties, gameType, players]);

  // ... (useEffect principal para la selección del juego - sin cambios de lógica interna por ahora)
  useEffect(() => {
    if (!gameType) return;

    let gamesOfType = [];
    if (gameType === 'Juego Verbal') {
      gamesOfType = verbalGames;
    } else if (gameType === 'Juego Creativo') {
      gamesOfType = creativeGames;
    } else if (gameType === 'Juego Físico') {
      gamesOfType = physicalGames;
    }

    if (gamesOfType.length > 0) {
      const randomIndex = Math.floor(Math.random() * gamesOfType.length);
      const selectedRandomGame = gamesOfType[randomIndex];
      setRecommendedGame(selectedRandomGame.name);

      if (selectedRandomGame.name === 'Veo Veo') {
        setGameDetails(veoveoData);
      } else if (selectedRandomGame.name === 'Pictionary') {
        setGameDetails(pictionaryData);
      } else {
        setGameDetails(null);
      }
    } else {
      setRecommendedGame("No hay juegos disponibles para esta categoría.");
      setGameDetails(null);
    }
  }, [gameType]);

  // Lógica para el botón "Comenzar el Juego" - ¡AHORA LLAMA A onStartGame!
  const handleStartGame = () => {
    if (onStartGame && recommendedGame) {
      onStartGame(recommendedGame); // Le pasamos el nombre del juego recomendado
    }
  };

  // Lógica para el botón "Cancelar" (sin cambios)
  const handleCancelGame = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="game-recommendation-container bg-white p-6 rounded-lg shadow-md text-center">
      {/* Botón de "atrás" para volver al selector de juego (sin cambios) */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
      >
        &#8592; {/* Carácter de flecha izquierda */}
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">¡Excelente elección!</h2>
      {recommendedGame && (
        <p className="text-xl text-gray-700">Tu juego recomendado es: <strong>{recommendedGame}</strong></p>
      )}

      {gameDetails && recommendedGame === 'Veo Veo' && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-700">Detalles para Veo Veo:</h3>
          <p className="text-gray-600">Juego Veo Veo seleccionado. ¡Preparando pistas!</p>
        </div>
      )}

      {gameDetails && recommendedGame === 'Pictionary' && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-700">Detalles para Pictionary:</h3>
          <p className="text-gray-600">Juego Pictionary seleccionado. ¡Preparando palabras!</p>
        </div>
      )}

      {/* Botones Comenzar y Cancelar (sin cambios en la apariencia) */}
      {recommendedGame && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleStartGame} // Llama a la nueva función handleStartGame
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Comenzar el Juego
          </button>
          <button
            onClick={handleCancelGame}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export default GameRecommendation;