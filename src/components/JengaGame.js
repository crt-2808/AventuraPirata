import React, { useState, useEffect, useRef, useCallback } from 'react';

function JengaGame({ players, onExitGame }) {
  // Jenga no necesita tetrisPieces ni currentPiece
  // const [tetrisPieces, setTetrisPieces] = useState([]);
  // const [currentPiece, setCurrentPiece] = useState(null);

  const [turnTimeLeft, setTurnTimeLeft] = useState(10); // Tiempo restante en el turno actual
  const [showChangePlayerMessage, setShowChangePlayerMessage] = useState(false);
  const [changePlayerTimer, setChangePlayerTimer] = useState(3); // 3 segundos para cambio de jugador
  const [isGameActive, setIsGameActive] = useState(false);
  const [turnCounter, setTurnCounter] = useState(0); // Inicia en 0, se incrementa antes de cada turno.

  const turnTimerRef = useRef(null);
  const changePlayerTimerRef = useRef(null);

  // Función para calcular el tiempo base del turno según el contador
  // Misma lógica que en TetrisGame para la dificultad progresiva
  const getBaseTurnDuration = useCallback((currentTurn) => {
    let baseTime = 10; // Tiempo inicial base
    const reduction = Math.floor((currentTurn - 1) / 5); // Cada 5 turnos, reduce 1 segundo
    return Math.max(1, baseTime - reduction); // Mínimo de 1 segundo
  }, []);


  const startTurnTimer = useCallback((turnNumber) => {
    clearInterval(turnTimerRef.current);
    const duration = getBaseTurnDuration(turnNumber);
    setTurnTimeLeft(duration);
    setIsGameActive(true);
    console.log(`Jenga - Turno #${turnNumber}. Duración del turno: ${duration}s`); // Para depuración
  }, [getBaseTurnDuration]);


  // Lógica para avanzar al siguiente turno
  const handleNextTurnLogic = useCallback(() => {
    clearInterval(turnTimerRef.current);

    const nextTurnNumber = turnCounter + 1; // Calculamos el número del siguiente turno
    setTurnCounter(nextTurnNumber); // Actualizamos el contador de turnos

    // En Jenga, no hay una "pieza" que cargar, solo iniciar el siguiente turno
    startTurnTimer(nextTurnNumber); // Inicia el temporizador para el nuevo turno
    setIsGameActive(true);

    // No hay caso de "no hay más piezas" en Jenga, a menos que definas un límite de turnos
    // Si quisieras un límite, lo agregarías aquí, por ejemplo:
    // if (nextTurnNumber > MAX_JENGA_TURNS) {
    //    console.log("Juego de Jenga terminado por límite de turnos.");
    //    setIsGameActive(false);
    //    if (onExitGame) {
    //      onExitGame();
    //    }
    // }

  }, [turnCounter, onExitGame, startTurnTimer]);


  // useEffect para iniciar el juego de Jenga
  useEffect(() => {
    // En Jenga, no hay datos externos que cargar como en Tetris.
    // Simplemente iniciamos el primer turno.
    const initialTurnNumber = 1;
    setTurnCounter(initialTurnNumber); // Establece el turno inicial a 1
    startTurnTimer(initialTurnNumber); // Inicia el temporizador para el primer turno
    setIsGameActive(true);

    return () => {
      clearInterval(turnTimerRef.current);
      clearInterval(changePlayerTimerRef.current);
    };
  }, [startTurnTimer]);


  // --- Lógica del Temporizador de Turno ---
  useEffect(() => {
    if (isGameActive && turnTimeLeft > 0 && !showChangePlayerMessage) {
      turnTimerRef.current = setInterval(() => {
        setTurnTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (turnTimeLeft === 0 && isGameActive) {
      clearInterval(turnTimerRef.current);
      console.log("Jenga - ¡Tiempo agotado para el turno!");
      setIsGameActive(false);
      setShowChangePlayerMessage(true);
      setChangePlayerTimer(3); // Reinicia a 3 segundos para el mensaje de cambio de jugador
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
      handleNextTurnLogic(); // Avanza al siguiente turno
    }
    return () => clearInterval(changePlayerTimerRef.current);
  }, [showChangePlayerMessage, changePlayerTimer, handleNextTurnLogic]);


  const handleVale = () => {
    clearInterval(turnTimerRef.current);
    setIsGameActive(false); // Pausa el temporizador de turno
    setShowChangePlayerMessage(true); // Muestra el mensaje de cambio de jugador
    setChangePlayerTimer(3); // Inicia el temporizador de cambio de jugador
    // handleNextTurnLogic se llamará automáticamente después de 3 segundos
  };

  const handleTerminar = () => {
    clearInterval(turnTimerRef.current);
    clearInterval(changePlayerTimerRef.current);
    setIsGameActive(false);
    if (onExitGame) {
      onExitGame();
    }
  };

  // La barra de progreso se basa en el tiempo inicial del turno
  const currentTurnBaseDuration = getBaseTurnDuration(turnCounter > 0 ? turnCounter : 1);
  const progressPercentage = (turnTimeLeft / currentTurnBaseDuration) * 100;


  return (
    <div className="game-container bg-white p-6 rounded-lg shadow-md text-center relative">
      <button
        onClick={onExitGame}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
      >
        &#8592;
      </button>

      <h2 className="text-3xl font-bold mb-4 text-gray-800">¡Jenga!</h2>
      <p className="text-xl text-gray-700 mb-4">Turno #{turnCounter}</p>


      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-6">
        <div
          className="bg-red-500 h-4 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {showChangePlayerMessage ? (
        <div className="my-10">
          <p className="text-green-600 text-5xl font-bold mb-4">¡Cambia de Jugador!</p>
          <p className="text-gray-700 text-3xl">Siguiente turno en {changePlayerTimer}s</p>
        </div>
      ) : (
        // Muestra el tiempo restante grande y centrado
        <div className="my-8">
          <p className="text-8xl font-extrabold text-red-700 leading-none">
            {turnTimeLeft}
            <span className="text-4xl">s</span>
          </p>
          <p className="text-2xl text-gray-600 mt-4">Tiempo para tu movimiento</p>
        </div>
      )}

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
          Terminar Juego
        </button>
      </div>
    </div>
  );
}

export default JengaGame;