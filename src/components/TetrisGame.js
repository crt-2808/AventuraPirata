// src/components/TetrisGame.js

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Si moviste las imágenes a `public` y ajustaste el JSON, esta función no es necesaria.
// Si aún usas `require()`, mantén la versión de la solución anterior.


function TetrisGame({ players, onExitGame }) {
  // turnTimeLeft será el tiempo restante en el turno actual
  // turnCounter rastrea el número de turnos completados
  const [tetrisPieces, setTetrisPieces] = useState([]);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [turnTimeLeft, setTurnTimeLeft] = useState(10); // Tiempo restante en el turno actual
  const [showChangePlayerMessage, setShowChangePlayerMessage] = useState(false);
  const [changePlayerTimer, setChangePlayerTimer] = useState(3);
  const [isGameActive, setIsGameActive] = useState(false);
  const [turnCounter, setTurnCounter] = useState(0); // Inicia en 0, se incrementa antes de cada turno.

  const turnTimerRef = useRef(null);
  const changePlayerTimerRef = useRef(null);

  // Función para calcular el tiempo base del turno según el contador
  const getBaseTurnDuration = useCallback((currentTurn) => {
    let baseTime = 10; // Tiempo inicial base

    // Cada 5 turnos (después del turno 5, 10, 15, etc.), reduce el tiempo en 1 segundo
    // Math.floor((currentTurn - 1) / 5) para que empiece a bajar *después* del turno 5
    // (ej. turno 6 -> 1, turno 11 -> 2)
    const reduction = Math.floor((currentTurn - 1) / 5);

    // Asegúrate de que el tiempo mínimo no sea negativo o cero si no es lo que quieres
    return Math.max(1, baseTime - reduction); // Mínimo de 1 segundo
  }, []);


  const getRandomPiece = useCallback((excludeFirstITetromino = false) => {
    if (tetrisPieces.length === 0) return null;

    let availablePieces = [...tetrisPieces];

    if (excludeFirstITetromino) {
      availablePieces = availablePieces.filter(piece => piece.nombre !== "Tetris_Oco_I");
      if (availablePieces.length === 0) {
        console.warn("No hay piezas disponibles después de excluir 'Tetris_Oco_I'.");
        return null;
      }
    }

    const randomIndex = Math.floor(Math.random() * availablePieces.length);
    return availablePieces[randomIndex];
  }, [tetrisPieces]);


  const startTurnTimer = useCallback((turnNumber) => {
    clearInterval(turnTimerRef.current);
    const duration = getBaseTurnDuration(turnNumber); // <--- Usa la nueva función
    setTurnTimeLeft(duration);
    setIsGameActive(true);
    console.log(`Turno #${turnNumber}. Duración del turno: ${duration}s`); // Para depuración
  }, [getBaseTurnDuration]); // Dependencia agregada


  const handleNextTurnLogic = useCallback(() => {
    clearInterval(turnTimerRef.current);

    const nextTurnNumber = turnCounter + 1; // Calculamos el número del siguiente turno
    setTurnCounter(nextTurnNumber); // Actualizamos el contador de turnos

    const nextPiece = getRandomPiece(false);
    if (nextPiece) {
      setCurrentPiece(nextPiece);
      startTurnTimer(nextTurnNumber); // Pasa el número de turno a startTurnTimer
      setIsGameActive(true);
    } else {
      console.log("No hay más piezas para jugar. Juego terminado.");
      setIsGameActive(false);
      if (onExitGame) {
        onExitGame();
      }
    }
  }, [turnCounter, getRandomPiece, onExitGame, startTurnTimer]); // Dependencia agregada `turnCounter`


  useEffect(() => {
    import('../mock/tetris_data.json')
      .then(module => {
        const data = module.default;
        setTetrisPieces(data);

        if (data.length === 0) {
          console.error("tetris_data.json está vacío o no contiene piezas.");
          setIsGameActive(false);
          return;
        }

        // Iniciar el juego con el primer turno
        const initialTurnNumber = 1;
        setTurnCounter(initialTurnNumber); // Establece el turno inicial a 1

        const firstPiece = getRandomPiece(true);
        if (firstPiece) {
          setCurrentPiece(firstPiece);
          startTurnTimer(initialTurnNumber); // Pasa el número de turno
          setIsGameActive(true);
        } else {
            console.error("No se pudo seleccionar la primera pieza de Tetris.");
            setIsGameActive(false);
        }
      })
      .catch(error => {
        console.error("Error al cargar los datos de Tetris:", error);
        setIsGameActive(false);
      });

    return () => {
      clearInterval(turnTimerRef.current);
      clearInterval(changePlayerTimerRef.current);
    };
  }, [getRandomPiece, startTurnTimer]);


  // --- Lógica del Temporizador de Turno ---
  useEffect(() => {
    if (isGameActive && turnTimeLeft > 0 && !showChangePlayerMessage) {
      turnTimerRef.current = setInterval(() => {
        setTurnTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (turnTimeLeft === 0 && isGameActive) {
      clearInterval(turnTimerRef.current);
      console.log("¡Tiempo agotado para el turno!");
      setIsGameActive(false);
      setShowChangePlayerMessage(true);
      setChangePlayerTimer(3);
    }
    return () => clearInterval(turnTimerRef.current);
  }, [turnTimeLeft, isGameActive, showChangePlayerMessage]);

  // --- Lógica del Temporizador de Cambio de Jugador ---
  useEffect(() => {
    if (showChangePlayerMessage && changePlayerTimer > 0) {
      changePlayerTimerRef.current = setInterval(() => {
        setChangePlayerTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (changePlayerTimer === 0 && showChangePlayerMessage) {
      clearInterval(changePlayerTimerRef.current);
      setShowChangePlayerMessage(false);
      handleNextTurnLogic(); // Esto ya incrementa turnCounter
    }
    return () => clearInterval(changePlayerTimerRef.current);
  }, [showChangePlayerMessage, changePlayerTimer, handleNextTurnLogic]);


  const handleVale = () => {
    clearInterval(turnTimerRef.current);
    setIsGameActive(false);
    setShowChangePlayerMessage(true);
    setChangePlayerTimer(3);
    // El handleNextTurnLogic que se llama después de 3s en el timer
    // ya se encargará de incrementar el turnCounter y reiniciar el juego.
  };

  const handleTerminar = () => {
    clearInterval(turnTimerRef.current);
    clearInterval(changePlayerTimerRef.current);
    setIsGameActive(false);
    if (onExitGame) {
      onExitGame();
    }
  };

  // La barra de progreso se basa en el tiempo inicial del turno, no en el actual
  const currentTurnBaseDuration = getBaseTurnDuration(turnCounter > 0 ? turnCounter : 1); // Asegura que siempre haya un valor para la barra
  const progressPercentage = (turnTimeLeft / currentTurnBaseDuration) * 100;


  return (
    <div className="game-container bg-white p-6 rounded-lg shadow-md text-center relative">
      <button
        onClick={onExitGame}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
      >
        &#8592;
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">¡Tetris!</h2>
      <p className="text-lg text-gray-700 mb-4">Turno #{turnCounter}</p>


      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-6">
        <div
          className="bg-purple-500 h-4 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>


      {showChangePlayerMessage ? (
        <div className="my-10">
          <p className="text-green-600 text-5xl font-bold mb-4">¡Cambia de Jugador!</p>
          <p className="text-gray-700 text-3xl">Siguiente pieza en {changePlayerTimer}s</p>
        </div>
      ) : (
        currentPiece ? (
          <>
            <div className="text-3xl font-extrabold text-blue-700 my-4">
            </div>
            <div className="my-8 flex justify-center">
              {/* Usa la url_imagen directamente si las moviste a public */}
              <img
                src={currentPiece.url_imagen}
                alt={currentPiece.nombre}
                className="max-h-64 object-contain shadow-lg rounded-lg"
              />
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={handleVale}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
              >
                ¡Vale!
              </button>
              <button
                onClick={handleTerminar}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
              >
                Terminar
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-600 text-xl my-8">Cargando pieza de Tetris...</div>
        )
      )}
    </div>
  );
}

export default TetrisGame;