// src/components/BastaResultsPage.js

import React, { useState } from 'react';

function BastaResultsPage({ playersWithIcons, onPlayAgain, onExitGameToSelector }) {
  const initialPlayerScores = playersWithIcons.map(player => ({
    ...player,
    score: 0,
  }));

  const [playerScores, setPlayerScores] = useState(initialPlayerScores);
  const [winner, setWinner] = useState(null);
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);

  const handleScoreChange = (playerId, change) => {
    setPlayerScores(prevScores =>
      prevScores.map(player =>
        player.playerId === playerId
          ? { ...player, score: Math.max(0, player.score + change) }
          : player
      )
    );
  };

  const handleFinishRound = () => {
    if (playerScores.length === 0) {
      setWinner("Nadie");
    } else {
      let maxScore = -1;
      let winningPlayers = [];

      playerScores.forEach(player => {
        if (player.score > maxScore) {
          maxScore = player.score;
          winningPlayers = [player.playerId];
        } else if (player.score === maxScore) {
          winningPlayers.push(player.playerId);
        }
      });

      if (winningPlayers.length === 1) {
        setWinner(winningPlayers[0]);
      } else {
        setWinner(winningPlayers.join(" y "));
      }
    }
    setShowWinnerScreen(true);
  };

  if (showWinnerScreen) {
    return (
      <div className="game-container bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">¡El ganador es...</h2>
        <p className="text-5xl font-extrabold text-purple-700 mb-8 animate-bounce">{winner}!</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onPlayAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
          >
            ¡Otra ronda!
          </button>
          <button
            onClick={onExitGameToSelector}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
          >
            Terminar
          </button>
        </div>
      </div>
    );
  }

  const MAX_USERS_PER_COLUMN = 4;
  const numPlayers = playerScores.length;
  const numColumns = Math.max(1, Math.ceil(numPlayers / MAX_USERS_PER_COLUMN));

  const gridContainerStyle = {
    gridTemplateRows: `repeat(${MAX_USERS_PER_COLUMN}, 1fr)`,
    gridAutoFlow: 'column',
    gridTemplateColumns: `repeat(${numColumns}, minmax(180px, 1fr))`,
    alignContent: 'start', // Alinea las filas al inicio del contenedor grid
    justifyContent: 'center', // Centra las columnas si no llenan el ancho total
    alignItems: 'start', // Alinea las tarjetas al inicio de su celda verticalmente
  };

  return (
    // CONTENEDOR BLANCO PRINCIPAL
    // QUITAMOS 'text-center' de aquí para que solo afecte al título, no a todo el contenido,
    // y ajustamos el flexbox.
    <div className="game-container bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto flex flex-col"> {/* Quité 'items-center' aquí */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Resultados de la ronda</h2> {/* Añadí 'text-center' al h2 */}

      {/* Aquí el grid de las tarjetas */}
      <div
        className="grid gap-4 w-full justify-center" // Añadí 'justify-center' para centrar el grid horizontalmente si las columnas no llenan el ancho
        style={gridContainerStyle}
      >
        {playerScores.map(player => (
          <div
            key={player.playerId}
            className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col items-center justify-between w-full h-auto max-w-[180px] mx-auto"
          >
            <img src={player.iconUrl} alt={player.playerId} className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-yellow-500" />
            <span className="text-xl font-semibold text-gray-800 mb-2 text-center break-words overflow-hidden max-h-16 leading-tight">
              {player.playerId}
            </span>
            <div className="flex items-center space-x-3 mt-auto">
              <button
                onClick={() => handleScoreChange(player.playerId, -25)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={player.score === 0}
              >
                -
              </button>
              <span className="text-3xl font-bold text-blue-700 w-16 text-center">{player.score}</span>
              <button
                onClick={() => handleScoreChange(player.playerId, 25)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full text-lg"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contenedor del botón "Terminar Ronda" */}
      <div className="flex justify-center space-x-4 mt-8 w-full"> {/* Aseguramos que el div del botón también ocupe el ancho completo para centrado */}
        <button
          onClick={handleFinishRound}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
        >
          Terminar Ronda
        </button>
      </div>
    </div>
  );
}

export default BastaResultsPage;