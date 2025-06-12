// src/components/PictionaryGame.js

import React, { useState, useEffect, useRef, useCallback } from 'react';

function PictionaryGame({ players, allowedDifficulties, onExitGame }) {
  const [initialGameData, setInitialGameData] = useState([]);
  const [activeGameQueue, setActiveGameQueue] = useState([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [elementsCompleted, setElementsCompleted] = useState(0);

  const [currentPistaIndex, setCurrentPistaIndex] = useState(0);
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [showChangePlayerMessage, setShowChangePlayerMessage] = useState(false);
  const [showFailedMessage, setShowFailedMessage] = useState(false); 
  const [changePlayerTimer, setChangePlayerTimer] = useState(0);
  const [hintTimer, setHintTimer] = useState(0);
  const [failedMessageTimer, setFailedMessageTimer] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [guessTimeLeft, setGuessTimeLeft] = useState(45);

  const changePlayerTimerRef = useRef(null);
  const hintTimerRef = useRef(null);
  const guessTimerRef = useRef(null);
  const failedMessageTimerRef = useRef(null);


  // startGuessTimer ahora solo se usa para INICIAR un nuevo turno, no para reanudar
  const startGuessTimer = useCallback(() => {
    clearInterval(guessTimerRef.current);
    setGuessTimeLeft(45);
    setIsGameActive(true);
    setShowFailedMessage(false);
  }, []);

  const handleNextElementLogic = useCallback(() => {
    clearInterval(guessTimerRef.current);

    const nextQueueIndex = currentQueueIndex + 1;

    if (activeGameQueue.length > 0 && nextQueueIndex < activeGameQueue.length) {
      setCurrentQueueIndex(nextQueueIndex);
      setCurrentPistaIndex(0);
      setElementsCompleted(prev => prev + 1);
      startGuessTimer(); // Inicia el temporizador para el NUEVO elemento
      setIsGameActive(true);
    } else if (activeGameQueue.length > 0 && nextQueueIndex >= activeGameQueue.length && initialGameData.length > 0) {
        setCurrentQueueIndex(0);
        setCurrentPistaIndex(0);
        setElementsCompleted(prev => prev + 1);
        startGuessTimer(); // Inicia el temporizador para el NUEVO elemento (rotado)
        setIsGameActive(true);
    }
    else {
      console.log("¡Juego de Pictionary Terminado!");
      setIsGameActive(false);
      clearInterval(guessTimerRef.current);
      if (onExitGame) {
        onExitGame();
      }
    }
  }, [currentQueueIndex, activeGameQueue, initialGameData.length, onExitGame, startGuessTimer]);


  // Carga y mezcla los datos del juego al inicio
  useEffect(() => {
    const pictionaryData = require('../mock/pictionary_data.json');

    const filteredData = pictionaryData.filter(item =>
      item.Dificultad && allowedDifficulties.includes(item.Dificultad)
    );

    const mappedData = filteredData.map(item => ({
      elemento: item.Elemento,
      pistas: item.Pistas_Pictionary,
      dificultad: item.Dificultad
    }));

    const selectedElements = [];
    if (mappedData.length > 0) {
      const shuffledData = [...mappedData].sort(() => 0.5 - Math.random());
      for (let i = 0; i < 5 && i < shuffledData.length; i++) {
        selectedElements.push(shuffledData[i]);
      }
    }
    setInitialGameData(selectedElements);
    setActiveGameQueue([...selectedElements]);
    setCurrentQueueIndex(0);
    setElementsCompleted(0);
    setCurrentPistaIndex(0);
    setIsGameActive(true);
    setShowHintPopup(false);
    setShowChangePlayerMessage(false);
    setShowFailedMessage(false);
    setChangePlayerTimer(0);
    setHintTimer(0);
    setFailedMessageTimer(0);
    startGuessTimer(); // Inicia el temporizador al cargar el juego por primera vez


    return () => {
      clearInterval(changePlayerTimerRef.current);
      clearInterval(hintTimerRef.current);
      clearInterval(guessTimerRef.current);
      clearInterval(failedMessageTimerRef.current);
    };
  }, [allowedDifficulties, startGuessTimer]);

  // --- Lógica del Pop-up de Pistas ---
  useEffect(() => {
    if (showHintPopup && hintTimer > 0) {
      hintTimerRef.current = setInterval(() => {
        setHintTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (hintTimer === 0 && showHintPopup) {
      // Cuando el temporizador de pista se agota, simplemente cierra el pop-up
      // El temporizador principal de adivinanza se reanudará solo porque showHintPopup será false
      closeHintPopupInternal(); 
    }
    return () => clearInterval(hintTimerRef.current);
  }, [showHintPopup, hintTimer]); // Dependencias: solo estos dos estados

  // --- Lógica del Temporizador de Cambio de Jugador ---
  useEffect(() => {
    if (showChangePlayerMessage && changePlayerTimer > 0) {
      changePlayerTimerRef.current = setInterval(() => {
        setChangePlayerTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (changePlayerTimer === 0 && showChangePlayerMessage) {
      clearInterval(changePlayerTimerRef.current);
      setShowChangePlayerMessage(false);
      handleNextElementLogic(); 
    }
    return () => clearInterval(changePlayerTimerRef.current);
  }, [showChangePlayerMessage, changePlayerTimer, handleNextElementLogic]);

  // --- Lógica del Temporizador para "No Adivinaste" ---
  useEffect(() => {
    if (showFailedMessage && failedMessageTimer > 0) {
      failedMessageTimerRef.current = setInterval(() => {
        setFailedMessageTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (failedMessageTimer === 0 && showFailedMessage) {
      clearInterval(failedMessageTimerRef.current);
      setShowFailedMessage(false);
      setShowChangePlayerMessage(true);
      setChangePlayerTimer(7);
    }
    return () => clearInterval(failedMessageTimerRef.current);
  }, [showFailedMessage, failedMessageTimer]);


  // --- Lógica del Temporizador Principal de Adivinanza (45 segundos) ---
  useEffect(() => {
    // El temporizador principal solo corre si el juego está activo
    // Y NO hay ningún pop-up o mensaje modal visible (pista, cambio de jugador, no adivinaste)
    if (isGameActive && guessTimeLeft > 0 && !showHintPopup && !showChangePlayerMessage && !showFailedMessage) {
      guessTimerRef.current = setInterval(() => {
        setGuessTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else { // Si alguna condición no se cumple (se pausó o el tiempo llegó a 0)
      clearInterval(guessTimerRef.current); // Detiene el temporizador
      if (guessTimeLeft === 0 && isGameActive) { // Si el tiempo llegó a 0 y el juego estaba activo
        console.log("¡Tiempo agotado para adivinar!");
        setIsGameActive(false);
        setShowFailedMessage(true);
        setFailedMessageTimer(3);

        setActiveGameQueue(prevQueue => prevQueue.filter((_, idx) => idx !== currentQueueIndex));
        setCurrentQueueIndex(0);
      }
    }
    return () => clearInterval(guessTimerRef.current);
  }, [guessTimeLeft, isGameActive, showHintPopup, showChangePlayerMessage, showFailedMessage, currentQueueIndex]);


  const handleShowHint = () => {
    const currentElement = activeGameQueue[currentQueueIndex];
    if (currentElement && currentElement.pistas) {
      clearInterval(guessTimerRef.current); // Pausa el temporizador de adivinanza
      
      const nextPistaIndex = (currentPistaIndex + 1) % currentElement.pistas.length;
      setCurrentPistaIndex(nextPistaIndex);

      setShowHintPopup(true);
      setHintTimer(3); // Inicia el temporizador para el pop-up de pista
    }
  };

  // Función interna para cerrar el pop-up de pistas, SIN reiniciar el temporizador de adivinanza
  const closeHintPopupInternal = useCallback(() => {
    clearInterval(hintTimerRef.current); // Limpia el temporizador del pop-up de pista
    setShowHintPopup(false); // Oculta el pop-up
    // No se llama a startGuessTimer() aquí; el useEffect principal de guessTimeLeft
    // se reanudará solo porque showHintPopup ahora es false.
  }, []); // Sin dependencias que cambien frecuentemente, para que sea estable

  const handleAdivine = () => {
    clearInterval(guessTimerRef.current);
    setIsGameActive(false);
    setShowChangePlayerMessage(true);
    setChangePlayerTimer(7);
    
    setActiveGameQueue(prevQueue => prevQueue.filter((_, idx) => idx !== currentQueueIndex));
    setCurrentQueueIndex(0); 
  };

  const handlePassElement = () => {
    clearInterval(guessTimerRef.current);
    setIsGameActive(false); 
    
    const currentElement = activeGameQueue[currentQueueIndex];

    if (currentElement) {
        setActiveGameQueue(prevQueue => {
            const updatedQueue = prevQueue.filter((_, idx) => idx !== currentQueueIndex);
            updatedQueue.push(currentElement);
            return updatedQueue;
        });
        setCurrentQueueIndex(0);
    }
    
    setCurrentPistaIndex(0);
    startGuessTimer(); // Este SÍ debe reiniciar el tiempo porque es un "nuevo intento" de objeto
  };


  if (initialGameData.length === 0 && !isGameActive) {
    return (
      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Cargando juego Pictionary...</h2>
        <p className="text-gray-600">Asegúrate de que hay datos de Pictionary para las dificultades seleccionadas.</p>
        <button onClick={onExitGame} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Salir del Juego
        </button>
      </div>
    );
  }

  if (activeGameQueue.length === 0 && elementsCompleted === initialGameData.length && initialGameData.length > 0 && !isGameActive && !showChangePlayerMessage && !showFailedMessage) {
    return (
      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">¡Juego de Pictionary Terminado!</h2>
        <p className="text-gray-600">Gracias por jugar. ¡Vuelve pronto!</p>
        <button onClick={onExitGame} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Volver al Selector de Juego
        </button>
      </div>
    );
  }

  const currentElement = activeGameQueue[currentQueueIndex];
  const currentPista = currentElement?.pistas?.[currentPistaIndex];


  const progressPercentage = (guessTimeLeft / 45) * 100;

  return (
    <div className="game-container bg-white p-6 rounded-lg shadow-md text-center relative">
      <button
        onClick={onExitGame}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
      >
        &#8592;
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">¡Pictionary!</h2>

      <p className="text-lg text-gray-700 mb-4">Elemento {elementsCompleted + 1} de {initialGameData.length}</p>

      {/* Barra de progreso del tiempo de adivinanza */}
      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-6">
        <div
          className="bg-red-500 h-4 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* --- Mensajes de estado (se muestran condicionalmente) --- */}
      {showChangePlayerMessage ? (
        <div className="my-10">
          <p className="text-green-600 text-5xl font-bold mb-4">¡Cambia de Jugador!</p>
          <p className="text-gray-700 text-3xl">Siguiente elemento en {changePlayerTimer}s</p>
        </div>
      ) : showFailedMessage ? (
        <div className="my-10">
          <p className="text-red-600 text-5xl font-bold mb-4 animate-bounce">¡No Adivinaste!</p>
          <p className="text-gray-700 text-3xl">Continuando en {failedMessageTimer}s...</p>
        </div>
      ) : (
        // --- Muestra el Elemento principal del juego ---
        <>
          <div className="text-5xl font-extrabold text-purple-700 my-8">
            "{currentElement?.elemento}"
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleAdivine}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
            >
              ¡Adiviné!
            </button>
            <button
              onClick={handleShowHint}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
            >
              Pista
            </button>
            <button
              onClick={handlePassElement}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
            >
              Paso
            </button>
          </div>
        </>
      )}

      {/* --- Pop-up de Pistas --- */}
      {showHintPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeHintPopupInternal} // Usa la función interna para cerrar
        >
          <div 
            className="bg-white p-8 rounded-lg shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Pista:</h3>
            <p className="text-blue-600 text-4xl font-extrabold mb-6">"{currentPista}"</p>
            <p className="text-gray-500 text-lg">Cerrando en {hintTimer}s...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PictionaryGame;