// src/components/ConversationStarterGame.js

import React, { useState, useEffect, useCallback } from 'react';
import startersData from '../mock/conversation_starters_data.json'; // Importa los datos

function ConversationStarterGame({ players, onExitGame }) {
  const [currentStarter, setCurrentStarter] = useState(null);
  const [availableStarters, setAvailableStarters] = useState([]);

  // Modificación de la función para determinar las audiencias aplicables
  const getApplicableAudiences = useCallback(() => {
    const hasChildren = players.childPlayers > 0;
    const hasAdults = players.adultPlayers > 0;

    let audiences = ['General']; // 'General' siempre está incluido

    if (hasChildren) {
      audiences.push('Niños'); // Si hay niños, incluye temas para niños
    } else if (hasAdults && !hasChildren) { // Si solo hay adultos (y no niños)
      audiences.push('Adultos'); // Incluye temas para adultos
    }
    // Si hay adultos Y niños, solo se incluyen 'General' y 'Niños' por la primera condición 'if (hasChildren)'.
    // Esto es lo que quieres: "Si hay al menos un Niño, la audiencia debe ser General y Niños"

    return audiences;
  }, [players.childPlayers, players.adultPlayers]); // Dependencias específicas

  // Función para obtener un tema aleatorio
  const getRandomStarter = useCallback(() => {
    if (availableStarters.length === 0) {
      console.warn("No hay temas disponibles.");
      return null;
    }
    const randomIndex = Math.floor(Math.random() * availableStarters.length);
    return availableStarters[randomIndex];
  }, [availableStarters]);

  // Efecto para cargar y filtrar los temas al inicio o cuando cambian los jugadores
  useEffect(() => {
    const applicableAudiences = getApplicableAudiences(); // Obtiene el array de audiencias

    const filteredStarters = startersData.filter(
      (starter) => applicableAudiences.includes(starter.Audiencia) // Filtra si la audiencia del tema está en las aplicables
    );

    // Evitar actualización innecesaria si la lista filtrada no ha cambiado
    // Esto es importante para que el `currentStarter` no se resetee si la lista es la misma
    const currentAvailableStartersJSON = JSON.stringify(availableStarters);
    const newFilteredStartersJSON = JSON.stringify(filteredStarters);

    if (newFilteredStartersJSON !== currentAvailableStartersJSON) {
      setAvailableStarters(filteredStarters);
      // Al actualizar la lista, reinicia el tema actual para asegurar que se muestre uno válido de la nueva lista
      if (filteredStarters.length > 0) {
        setCurrentStarter(filteredStarters[Math.floor(Math.random() * filteredStarters.length)]);
      } else {
        setCurrentStarter(null); // No hay temas disponibles
      }
    }
    // Si la lista no ha cambiado pero no hay currentStarter (ej. primera carga), selecciona uno
    else if (currentStarter === null && filteredStarters.length > 0) {
        setCurrentStarter(filteredStarters[Math.floor(Math.random() * filteredStarters.length)]);
    }


  }, [getApplicableAudiences, availableStarters, currentStarter]); // Dependencias para re-ejecutar el efecto


  // Manejador para el botón "Siguiente"
  const handleNextTopic = () => {
    const nextStarter = getRandomStarter();
    if (nextStarter) {
      setCurrentStarter(nextStarter);
    } else {
      console.warn("No hay más temas para mostrar. Considera reiniciar el juego.");
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
      {/* Botón de regreso, similar a otros juegos */}
      <button
        onClick={handleExitToGameSelector}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl"
      >
        &#8592;
      </button>

      <h2 className="text-3xl font-bold mb-8 text-gray-800">Iniciador de Conversación</h2>

      {currentStarter ? (
        <>
          <div className="my-10 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-32 flex items-center justify-center">
            <p className="text-4xl font-semibold text-blue-700 leading-tight">
              "{currentStarter.Tema}"
            </p>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleNextTopic}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300"
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
        <div className="text-gray-600 text-xl my-8">Cargando temas...</div>
      )}
    </div>
  );
}

export default ConversationStarterGame;