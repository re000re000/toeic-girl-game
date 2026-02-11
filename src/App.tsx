import { useState } from 'react';
import { GameProvider, useGame } from './GameContext';
import { HomeScreen } from './HomeScreen';
import { QuizScreen } from './QuizScreen';
import { StageClearScreen } from './StageClearScreen';
import { GameOverScreen } from './GameOverScreen';

type GameScreen = 'home' | 'quiz' | 'stageClear' | 'gameOver';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const { initializeGame, resetGame } = useGame();

  const handleSelectLevel = async (level: number) => {
    await initializeGame(level);
    setCurrentScreen('quiz');
  };

  const handleGameOver = () => {
    setCurrentScreen('gameOver');
  };

  const handleStageClear = () => {
    setCurrentScreen('stageClear');
  };

  const handleRetry = async () => {
    resetGame();
    setCurrentScreen('home');
  };

  const handleHome = () => {
    resetGame();
    setCurrentScreen('home');
  };

  return (
    <div>
      {currentScreen === 'home' && <HomeScreen onSelectLevel={handleSelectLevel} />}
      {currentScreen === 'quiz' && (
        <QuizScreen onGameOver={handleGameOver} onStageClear={handleStageClear} />
      )}
      {currentScreen === 'stageClear' && (
        <StageClearScreen onRetry={handleRetry} onHome={handleHome} />
      )}
      {currentScreen === 'gameOver' && (
        <GameOverScreen onRetry={handleRetry} onHome={handleHome} />
      )}
    </div>
  );
}

export function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
