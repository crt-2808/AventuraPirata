// src/components/BastaGame.js

import React, { useState, useEffect, useRef } from 'react';
// Para la ruleta, necesitarás instalar una librería. Por ejemplo:
// npm install react-roulette-wheel
// import RouletteWheel from 'react-roulette-wheel'; // Si usas esta librería

// Importar el sonido
import tenSecondsSound from '../assets/sounds/10seconds_sound.m4a'; // <--- Ajusta la ruta si es diferente

// Array de letras para la ruleta
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWYZ'.split('');

function BastaGame({ players, playersWithIcons, onExitGame, allowedDifficulties }) {
    const [gameState, setGameState] = useState('spinning'); // 'spinning', 'playing', 'bastaClicked', 'finished'
    const [selectedLetter, setSelectedLetter] = useState('');
    const [timer, setTimer] = useState(0); // Inicia en 0, se establecerá después de la letra
    const [isSpinning, setIsSpinning] = useState(false);
    const intervalRef = useRef(null); // Para el temporizador
    const audioRef = useRef(new Audio(tenSecondsSound)); // Para el sonido

    const rouletteRef = useRef(null); // Referencia para el elemento de la ruleta

    // --- Lógica de la Ruleta y Animación ---
    const spinRoulette = () => {
        setIsSpinning(true);
        const randomSpins = Math.random() * 3600 + 720;
        const randomIndex = Math.floor(Math.random() * LETTERS.length);
        const letter = LETTERS[randomIndex];
        const segmentAngle = 360 / LETTERS.length;
        const targetRotation = (360 * 10) - (randomIndex * segmentAngle) - (segmentAngle / 2);

        if (rouletteRef.current) {
            rouletteRef.current.style.transition = 'none';
            rouletteRef.current.style.transform = `rotate(0deg)`;
            rouletteRef.current.offsetHeight;

            requestAnimationFrame(() => {
                if (rouletteRef.current) {
                    rouletteRef.current.style.transition = 'transform 3s ease-out';
                    rouletteRef.current.style.transform = `rotate(${targetRotation}deg)`;
                }
            });
        }

        setTimeout(() => {
            setIsSpinning(false);
            setSelectedLetter(letter);
            setGameState('playing');
        }, 3000);
    };

    // --- Lógica del Temporizador ---
    const startTimer = (duration) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setTimer(duration);
        intervalRef.current = setInterval(() => {
            setTimer(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
                    setGameState('finished');
                    setTimeout(() => {
                        onExitGame(); // <--- LLAMA A onExitGame, que ahora te lleva a BastaResultsPage si estás en demo
                        console.log("Tiempo terminado. Navegando a resultados.");
                    }, 1000);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    // --- Efecto para manejar cambios de estado y timers ---
    useEffect(() => {
        if (gameState === 'spinning') {
            spinRoulette();
        } else if (gameState === 'playing' && selectedLetter) {
            startTimer(60);
        } else if (gameState === 'bastaClicked') {
            startTimer(10);
            audioRef.current.play().catch(e => console.error("Error al reproducir el sonido:", e));
        }

        // Limpieza al desmontar el componente
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [gameState, selectedLetter, onExitGame]); // Añadir onExitGame a las dependencias

    // --- Manejar el botón ¡Basta! ---
    const handleBastaClick = () => {
        if (gameState === 'playing') {
            setGameState('bastaClicked');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // --- Renderizado del componente ---
    return (
        <div className="game-container bg-white p-6 rounded-lg shadow-md text-center">
            <button
                onClick={onExitGame} // Este botón también debería llevarte a la pantalla de resultados ahora
                className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
            >
                &#8592; {/* Flecha de regreso */}
            </button>

            <h2 className="text-3xl font-bold mb-6 text-gray-800">¡A jugar Basta!</h2>

            {gameState === 'spinning' && (
                <div className="mb-8">
                    <p className="text-xl text-gray-600 mb-4">Girando la ruleta...</p>
                    <div className="roulette-wheel-container relative w-48 h-48 mx-auto border-4 border-yellow-500 rounded-full flex items-center justify-center overflow-hidden">
                        {/* Indicador de la letra */}
                        <div className="absolute top-0 left-1/2 -ml-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-red-500 z-10"></div>

                        {/* Ruleta: Con una librería esto sería reemplazado por el componente de la librería */}
                        <div ref={rouletteRef} className="roulette-content w-full h-full rounded-full flex items-center justify-center"
                             style={{
                                 background: `conic-gradient(
                                    ${LETTERS.map((_, i) => `${i % 2 === 0 ? '#fdd835' : '#ffc107'} ${i * (360 / LETTERS.length)}deg ${(i + 1) * (360 / LETTERS.length)}deg`).join(', ')}
                                 )`
                             }}>
                            {/* Letras dentro de la ruleta (posición aproximada) */}
                            {LETTERS.map((letter, index) => (
                                <div key={letter} className="absolute text-xl font-bold text-gray-800"
                                     style={{
                                         transform: `rotate(${index * (360 / LETTERS.length)}deg) translate(0, -70px) rotate(-${index * (360 / LETTERS.length)}deg)`,
                                         transformOrigin: 'center center'
                                     }}>
                                    {letter}
                                </div>
                            ))}
                        </div>
                        {isSpinning && <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white text-3xl font-bold">GIRANDO...</div>}
                    </div>
                </div>
            )}

            {(gameState === 'playing' || gameState === 'bastaClicked') && (
                <div className="mb-8">
                    <p className="text-xl text-gray-600 mb-2">Letra seleccionada:</p>
                    <p className="text-6xl font-extrabold text-blue-700 mb-6 animate-pulse">{selectedLetter}</p>

                    <p className="text-lg text-gray-600 mb-2">Tiempo restante:</p>
                    <p className={`text-5xl font-extrabold mb-8 ${timer <= 10 && gameState === 'bastaClicked' ? 'text-red-500 animate-bounce' : 'text-green-600'}`}>
                        {formatTime(timer)}
                    </p>

                    <button
                        onClick={handleBastaClick}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-2xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={gameState === 'bastaClicked'}
                    >
                        ¡Basta!
                    </button>
                </div>
            )}

            {gameState === 'finished' && (
                <div className="text-2xl font-bold text-gray-800">
                    ¡Tiempo terminado! ¡A revisar las respuestas!
                    {/* Aquí eventualmente se redirigirá a la pantalla de resultados */}
                </div>
            )}
        </div>
    );
}

export default BastaGame;