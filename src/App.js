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
import CaricachupasGame from './components/CaricachupasGame';
import BastaGame from './components/BastaGame';
import BastaResultsPage from './components/BastaResultsPage';
import './styles.css';

import { DEMO_PLAYER_ICONS } from './mock/playerIcons';

function AppWrapper() {
  const [adultPlayers, setAdultPlayers] = useState(0);
  const [childPlayers, setChildPlayers] = useState(0);
  const [allowedDifficulties, setAllowedDifficulties] = useState([]);
  const [selectedGameType, setSelectedGameType] = useState(null);
  const [selectedGameName, setSelectedGameName] = useState(null);
  const [playersWithIcons, setPlayersWithIcons] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const navigate = useNavigate();

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
    setIsDemoMode(false);
    setAdultPlayers(adults);
    setChildPlayers(children);
    setPlayersWithIcons([]);
    navigate('/gameSelector');
  };

  const handleBackToPlayerCounter = () => {
    setAdultPlayers(0);
    setChildPlayers(0);
    setPlayersWithIcons([]);
    setIsDemoMode(false);
    navigate('/');
  };

  const handleSelectGameType = (gameType) => {
    if (isDemoMode) {
      if (gameType === 'physical') {
        setSelectedGameName('Basta');
        console.log("Modo Demo: Iniciando juego Basta");
        navigate('/play/basta');
      } else if (gameType === 'creative') {
        setSelectedGameName('Preguntas sobre un tema en específico para conversar');
        console.log("Modo Demo: Iniciando juego de Conversación");
        navigate('/play/conversation-starters');
      }
    } else {
      setSelectedGameType(gameType);
      navigate('/gameRecommendation');
    }
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
    } else if (gameName === 'Caricachupas') {
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
    if (isDemoMode && selectedGameName === 'Basta') {
      navigate('/bastaResults');
    } else {
      navigate('/gameSelector');
    }
  };

  const handleDemoMode = () => {
    setIsDemoMode(true);

    const demoPlayers = [
      { name: "Manuel Tonatiuh", type: "adult", iconId: "pirata_niño1" },
      { name: "Mario Alonso", type: "adult", iconId: "pirata_niño2" },
      { name: "Mayra Bustamante", type: "adult", iconId: "pirata_niña1" },
      { name: "Raul Brandon", type: "adult", iconId: "pirata_niño3" },
      { name: "Luisa Fernanda", type: "adult", iconId: "pirata_niña2" },
      { name: "Diego Aldair", type: "adult", iconId: "pirata_niño1" },
      { name: "Lorena Morales", type: "adult", iconId: "pirata_niña3" },
      { name: "Juan Manuel", type: "adult", iconId: "pirata_niño2" },
      { name: "Ivanna Valentina", type: "adult", iconId: "pirata_niña1" },
      { name: "Cristian", type: "child", iconId: "pirata_niño3" },
      { name: "Adrian", type: "child", iconId: "pirata_niño1" },
      { name: "Azul Ximena", type: "child", iconId: "pirata_niña2" },
      { name: "Daniela", type: "child", iconId: "pirata_niña3" },
      { name: "Alonso", type: "adult", iconId: "pirata_niño2" },
    ];

    let currentAdults = 0;
    let currentChildren = 0;
    const playersWithAssignedIcons = demoPlayers.map((player) => {
        const iconInfo = DEMO_PLAYER_ICONS.find(icon => icon.id === player.iconId);
        if (!iconInfo) {
            console.warn(`Icono con ID ${player.iconId} no encontrado para ${player.name}. Asignando por defecto.`);
            return {
                playerId: player.name,
                iconId: 'default',
                iconUrl: DEMO_PLAYER_ICONS[0]?.url || ''
            };
        }

        if (player.type === "adult") {
            currentAdults++;
        } else {
            currentChildren++;
        }

        return {
            playerId: player.name,
            iconId: iconInfo.id,
            iconUrl: iconInfo.url,
            type: player.type
        };
    });

    setAdultPlayers(currentAdults);
    setChildPlayers(currentChildren);
    setPlayersWithIcons(playersWithAssignedIcons);

    console.log("Usuarios cargados en modo Demo:");
    playersWithAssignedIcons.forEach(p => {
        console.log(`${p.playerId} (${p.type === 'adult' ? 'Adulto' : 'Niño'})`);
    });

    navigate('/gameSelector');
  };

  // Funciones para la pantalla de resultados de Basta
  const handleBastaPlayAgain = () => {
    navigate('/play/basta'); // Vuelve a la ruleta de Basta
  };

  const handleBastaExitToSelector = () => {
    // Mantener isDemoMode en true y solo navegar a /gameSelector
    // No reseteamos los jugadores ni el modo demo para que siga siendo demo.
    navigate('/gameSelector'); // <--- CAMBIO AQUÍ
  };


  const commonGameProps = {
    players: { adultPlayers, childPlayers },
    playersWithIcons: playersWithIcons,
    onExitGame: handleExitGame,
  };


  return (
    <div className="min-h-screen bg-blue-100 p-4">
      <PirateHeader />

      <div className="max-w-md mx-auto mt-8">
        <Routes>
          <Route path="/" element={
            <PlayerCounter
              onEmbark={handleEmbark}
              onDemo={handleDemoMode}
              adultPlayers={adultPlayers}
              childPlayers={childPlayers}
            />
          } />

          <Route path="/gameSelector" element={
            <GameSelector
              onSelectGameType={handleSelectGameType}
              onBack={handleBackToPlayerCounter}
              isDemoMode={isDemoMode}
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

          {/* Rutas de los juegos */}
          <Route path="/play/veo-veo" element={<VeoVeoGame {...commonGameProps} allowedDifficulties={allowedDifficulties} />} />
          <Route path="/play/pictionary" element={<PictionaryGame {...commonGameProps} allowedDifficulties={allowedDifficulties} />} />
          <Route path="/play/tetris" element={<TetrisGame {...commonGameProps} />} />
          <Route path="/play/jenga" element={<JengaGame {...commonGameProps} />} />
          <Route path="/play/conversation-starters" element={<ConversationStarterGame {...commonGameProps} />} />
          <Route path="/play/caricachupas" element={<CaricachupasGame {...commonGameProps} />} />
          <Route path="/play/basta" element={<BastaGame {...commonGameProps} />} />

          {/* Nueva ruta para la página de resultados de Basta */}
          <Route path="/bastaResults" element={
            <BastaResultsPage
              playersWithIcons={playersWithIcons}
              onPlayAgain={handleBastaPlayAgain}
              onExitGameToSelector={handleBastaExitToSelector}
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