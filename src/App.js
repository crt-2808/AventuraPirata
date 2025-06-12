// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import PlayerCounter from './components/PlayerCounter';
import GameSelector from './components/GameSelector';
import GameRecommendation from './components/GameRecommendation';
import PirateHeader from './components/PirateHeader';
import VeoVeoGame from './components/VeoVeoGame'; 
import PictionaryGame from './components/PictionaryGame';
import TetrisGame from './components/TetrisGame';
import JengaGame from './components/JengaGame';
import ConversationStarterGame from './components/ConversationStarterGame';
import CaricachupasGame from './components/CaricachupasGame'; // <--- Importa el nuevo componente
import './styles.css';

function AppWrapper() {
  const [adultPlayers, setAdultPlayers] = useState(0);
  const [childPlayers, setChildPlayers] = useState(0);
  const [allowedDifficulties, setAllowedDifficulties] = useState([]);
  const [selectedGameType, setSelectedGameType] = useState(null);
  const [selectedGameName, setSelectedGameName] = useState(null);

  const navigate = useNavigate();

  // useEffect para calcular las dificultades cuando cambian los jugadores
  useEffect(() => {
    let difficulties = [];
    if (childPlayers > 0) {
      difficulties = ['facil', 'medio'];
    } else if (adultPlayers > 0) {
      difficulties = ['medio', 'dificil'];
    }
    setAllowedDifficulties(difficulties);
    console.log("Dificultades permitidas en App.js (calculadas):", difficulties);
  }, [adultPlayers, childPlayers]);

  const handleEmbark = (adults, children) => {
    setAdultPlayers(adults);
    setChildPlayers(children);
    navigate('/gameSelector');
  };

  const handleBackToPlayerCounter = () => {
    navigate('/');
  };

  const handleSelectGameType = (gameType) => {
    setSelectedGameType(gameType);
    navigate('/gameRecommendation');
  };

  const handleStartRecommendedGame = (gameName) => {
    setSelectedGameName(gameName);
    console.log("Intentando iniciar juego:", gameName);
    if (gameName === 'Veo Veo') {
      navigate('/play/veo-veo');
    } else if (gameName === 'Pictionary') {
      navigate('/play/pictionary');
    } else if (gameName === 'Tetris') {
      navigate('/play/tetris');
    } else if (gameName === 'Jenga') {
      navigate('/play/jenga');
    } else if (gameName === 'Preguntas sobre un tema en específico para conversar') {
      navigate('/play/conversation-starters');
    } else if (gameName === 'Caricachupas') { // <--- ¡AÑADE LA CONDICIÓN PARA CARICACHUPAS!
      navigate('/play/caricachupas');
    }
  };

  const handleBackToGameSelector = () => {
    setSelectedGameType(null);
    setSelectedGameName(null);
    navigate('/gameSelector');
  };

  const handleExitGame = () => {
    setSelectedGameType(null);
    setSelectedGameName(null);
    navigate('/gameSelector');
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4">
      <PirateHeader />

      <div className="max-w-md mx-auto mt-8">
        <Routes>
          <Route path="/" element={
            <PlayerCounter
              onEmbark={handleEmbark}
              adultPlayers={adultPlayers}
              childPlayers={childPlayers}
            />
          } />

          <Route path="/gameSelector" element={
            <GameSelector
              onSelectGameType={handleSelectGameType}
              onBack={handleBackToPlayerCounter}
            />
          } />

          <Route path="/gameRecommendation" element={
            <GameRecommendation
              gameType={selectedGameType}
              players={{ adultPlayers, childPlayers }}
              allowedDifficulties={allowedDifficulties}
              onBack={handleBackToGameSelector}
              onStartGame={handleStartRecommendedGame}
            />
          } />

          <Route path="/play/veo-veo" element={
            <VeoVeoGame
              players={{ adultPlayers, childPlayers }}
              allowedDifficulties={allowedDifficulties}
              onExitGame={handleExitGame}
            />
          } />

          <Route path="/play/pictionary" element={
            <PictionaryGame
              players={{ adultPlayers, childPlayers }}
              allowedDifficulties={allowedDifficulties}
              onExitGame={handleExitGame}
            />
          } />

          <Route path="/play/tetris" element={
            <TetrisGame
              players={{ adultPlayers, childPlayers }}
              onExitGame={handleExitGame}
            />
          } />

          <Route path="/play/jenga" element={
            <JengaGame
              players={{ adultPlayers, childPlayers }}
              onExitGame={handleExitGame}
            />
          } />

          <Route path="/play/conversation-starters" element={
            <ConversationStarterGame
              players={{ adultPlayers, childPlayers }}
              onExitGame={handleExitGame}
            />
          } />

          <Route path="/play/caricachupas" element={ // <--- ¡AÑADE LA RUTA PARA CARICACHUPAS!
            <CaricachupasGame
              onExitGame={handleExitGame}
            />
          } />

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;