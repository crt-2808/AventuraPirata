// src/components/VeoVeoGame.js

import React, { useState, useEffect, useRef } from 'react';
// import Confetti from 'react-confetti'; // Descomentar si tienes instalado react-confetti

function VeoVeoGame({ players, allowedDifficulties, onExitGame }) {
  const [gameData, setGameData] = useState([]);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [currentPistaIndex, setCurrentPistaIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [nextObjectTimer, setNextObjectTimer] = useState(0);
  const [isGuessed, setIsGuessed] = useState(false);
  // Eliminamos showEndGameMessage como estado separado, lo integraremos en la lógica de nextObjectTimer
  const [isLastObject, setIsLastObject] = useState(false); // Nuevo estado para saber si estamos en el último objeto


  const timerRef = useRef(null);
  const nextObjectTimerRef = useRef(null);
  // No necesitamos endGameTimerRef si onExitGame se llama directamente después de la cuenta regresiva de 5s


  useEffect(() => {
    const veoveoData = require('../mock/veoveo_data.json');

    const filteredData = veoveoData.filter(item =>
      item.Dificultad && allowedDifficulties.includes(item.Dificultad)
    );

    const mappedData = filteredData.map(item => ({
      respuesta: item.Objeto,
      pistas: item.Pistas,
      dificultad: item.Dificultad
    }));

    const selectedObjects = [];
    if (mappedData.length > 0) {
      const shuffledData = [...mappedData].sort(() => 0.5 - Math.random());
      for (let i = 0; i < 5 && i < shuffledData.length; i++) {
        selectedObjects.push(shuffledData[i]);
      }
    }
    setGameData(selectedObjects);

    console.log("Datos de Veo Veo filtrados por dificultad:", selectedObjects);
    if (selectedObjects.length > 0) {
      setCurrentObjectIndex(0);
      setCurrentPistaIndex(0);
      setTimeLeft(25);
      setIsGameActive(true);
      setIsGuessed(false);
      setIsLastObject(false); // Asegúrate de que este estado sea falso al inicio de un nuevo juego
      if (!nextObjectTimerRef.current) {
         startMainTimer();
      }
    } else {
      setIsGameActive(false);
      console.log("No hay objetos de Veo Veo para la dificultad seleccionada.");
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(nextObjectTimerRef.current);
      // No necesitamos limpiar endGameTimerRef si no lo usamos
    };
  }, [allowedDifficulties]);

  useEffect(() => {
    // Solo si el juego está activo, queda tiempo, no estamos en la cuenta regresiva de siguiente objeto, y no es el último objeto.
    // Aunque la condición de isLastObject aquí no es estrictamente necesaria si handleNextObject lo maneja bien.
    if (isGameActive && timeLeft > 0 && nextObjectTimer === 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameActive) {
      clearInterval(timerRef.current);
      console.log("¡Se acabó el tiempo! El objeto era:", gameData[currentObjectIndex]?.respuesta);
      setIsGuessed(false);
      startNextObjectTimer(); // Llama a startNextObjectTimer para iniciar la cuenta regresiva del mensaje
      setIsGameActive(false); // Desactiva el juego principal
    }

    return () => clearInterval(timerRef.current);
  }, [timeLeft, isGameActive, nextObjectTimer, currentObjectIndex, gameData]);

  const startMainTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(25);
    setIsGameActive(true);
    setNextObjectTimer(0);
    setIsGuessed(false);
    setIsLastObject(false); // Reinicia este estado para un nuevo objeto
  };

  const startNextObjectTimer = () => {
    setShowConfetti(false);
    // Antes de iniciar el temporizador, verifica si es el último objeto
    // currentObjectIndex apunta al objeto actual. Si es el último, gameData.length - 1 es el índice.
    if (currentObjectIndex === gameData.length - 1) {
      setIsLastObject(true); // Marca que es el último objeto
    } else {
      setIsLastObject(false);
    }

    setNextObjectTimer(5); // Temporizador de 5 segundos para el mensaje
    clearInterval(nextObjectTimerRef.current);
    clearInterval(timerRef.current); // Asegúrate de que el temporizador principal esté detenido

    nextObjectTimerRef.current = setInterval(() => {
      setNextObjectTimer(prevTime => {
        if (prevTime <= 1) {
          clearInterval(nextObjectTimerRef.current);
          handleNextObject(); // Llama a handleNextObject cuando el temporizador llega a 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleNextObject = () => {
    // Si quedan objetos (no es el último objeto), pasa al siguiente
    if (currentObjectIndex < gameData.length - 1) {
      setCurrentObjectIndex(prevIndex => prevIndex + 1);
      setCurrentPistaIndex(0);
      startMainTimer();
    } else {
      // Si no quedan más objetos, el juego ha terminado
      console.log("¡Juego de Veo Veo Terminado!");
      setIsGameActive(false); // Asegúrate de que el juego no esté activo
      clearInterval(timerRef.current); // Detiene el temporizador principal
      clearInterval(nextObjectTimerRef.current); // Detiene el temporizador de siguiente objeto

      // Aquí se llama a onExitGame directamente si no se necesita un mensaje de fin de juego aparte
      // porque el mensaje de "Regresando a la selección de juegos" se manejará en el JSX.
      if (onExitGame) {
        onExitGame();
      }
    }
  };

  const handleAdivine = () => {
    clearInterval(timerRef.current);
    setIsGameActive(false);
    setShowConfetti(true);
    setIsGuessed(true);

    console.log("¡Adivinó el objeto:", gameData[currentObjectIndex]?.respuesta);
    startNextObjectTimer(); // Esto iniciará la cuenta regresiva y establecerá isLastObject
  };

  const handleOtraPista = () => {
    const currentObject = gameData[currentObjectIndex];
    if (currentObject) {
      if (currentPistaIndex < currentObject.pistas.length - 1) {
        setCurrentPistaIndex(prevIndex => prevIndex + 1);
      } else {
        setCurrentPistaIndex(0);
        console.log("Reiniciando pistas. Mostrando la primera pista de nuevo.");
      }
    }
  };

  const progressPercentage = (timeLeft / 25) * 100;

  // Ya no necesitamos un renderizado condicional completo aquí para showEndGameMessage
  // La lógica para el mensaje de fin de juego se moverá dentro del bloque de nextObjectTimer
  if (!isGameActive && gameData.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Cargando juego Veo Veo...</h2>
        <p className="text-gray-600">Asegúrate de que hay datos de Veo Veo para las dificultades seleccionadas.</p>
        <button onClick={onExitGame} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Salir del Juego
        </button>
      </div>
    );
  }

  // Si el juego ha terminado y no hay más objetos para mostrar (es decir, onExitGame ya se llamó o está por llamarse)
  // Este bloque es un fallback, pero la idea es que la transición de mensaje se maneje con nextObjectTimer
  if (!gameData[currentObjectIndex] && !isGameActive) {
      return (
          <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Juego Veo Veo Terminado</h2>
              <p className="text-gray-600">Gracias por jugar. ¡Vuelve pronto!</p>
              <button onClick={onExitGame} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Volver al Selector de Juego
              </button>
          </div>
      );
  }


  return (
    <div className="game-container bg-white p-6 rounded-lg shadow-md text-center relative">
      {showConfetti && (
        // <Confetti
        //   width={window.innerWidth}
        //   height={window.innerHeight}
        //   recycle={false}
        //   numberOfPieces={200}
        //   gravity={0.1}
        // />
        <div className="confetti-placeholder text-4xl mb-4">🎉 Confeti! 🎉</div>
      )}

      <button
        onClick={onExitGame}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
      >
        &#8592;
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">¡Veo Veo!</h2>

      <p className="text-lg text-gray-700 mb-4">Objeto {currentObjectIndex + 1} de {gameData.length}</p>

      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-6">
        <div
          className="bg-red-500 h-4 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Contenedor de la pista / mensaje de transición */}
      <div className="text-4xl font-extrabold my-8">
        {nextObjectTimer > 0 ? ( // Si el temporizador de siguiente objeto está activo
          isLastObject ? ( // Si es el último objeto y estamos en la transición final
            <>
              <p className="text-gray-800 mb-2 text-3xl font-bold">¡Juego Terminado!</p>
              <p className="text-gray-600 mb-2 text-2xl">Regresando a la selección de juegos en {nextObjectTimer}s</p>
            </>
          ) : isGuessed ? ( // Si fue adivinado y no es el último objeto
            <>
              <p className="text-green-600 mb-2">¡Adivinaste!</p>
              <p className="text-green-600 mb-2">Era: "{gameData[currentObjectIndex]?.respuesta}"</p>
              <p className="text-green-600">Siguiente objeto en {nextObjectTimer}s</p>
            </>
          ) : ( // Si el tiempo se agotó y no es el último objeto
            <>
              <p className="text-red-600 mb-2">¡Se acabó el tiempo!</p>
              <p className="text-red-600 mb-2">Era: "{gameData[currentObjectIndex]?.respuesta}"</p>
              <p className="text-red-600">Siguiente en {nextObjectTimer}s</p>
            </>
          )
        ) : ( // Si el temporizador de siguiente objeto no está activo, muestra "Yo veo veo" y la pista
          <>
            <p className="text-gray-700 text-3xl font-bold mb-2">Yo veo veo...</p>
            <p className="text-blue-600">"{gameData[currentObjectIndex]?.pistas[currentPistaIndex]}"</p>
          </>
        )}
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        {isGameActive && nextObjectTimer === 0 && (
          <>
            <button
              onClick={handleAdivine}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
            >
              ¡Adiviné!
            </button>
            <button
              onClick={handleOtraPista}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
            >
              Otra Pista
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VeoVeoGame;