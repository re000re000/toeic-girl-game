import { useState } from 'react';
import { GameProvider, useGame } from './GameContext';
import { HomeScreen } from './HomeScreen';
import { QuizScreen } from './QuizScreen';
import { StageClearScreen } from './StageClearScreen';
import { GameOverScreen } from './GameOverScreen';

type GameScreen = 'home' | 'quiz' | 'stageClear' | 'gameOver';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [isLoading, setIsLoading] = useState(false);
  const { initializeGame, resetGame } = useGame();

  const handleSelectLevel = async (level: number) => {
    if (isLoading) return;
    
    console.log(`[DEBUG] handleSelectLevel called for level: ${level}`);
    setIsLoading(true);
    
    try {
      await initializeGame(level);
      console.log(`[DEBUG] initializeGame finished, switching to quiz screen`);
      setCurrentScreen('quiz');
    } catch (error) {
      console.error('[DEBUG] Error in handleSelectLevel:', error);
      // エラー時はホーム画面に留まる（initializeGame内でalertが出る）
    } finally {
      setIsLoading(false);
    }
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
      {currentScreen === 'home' && (
        <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
          <HomeScreen onSelectLevel={handleSelectLevel} />
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg font-bold">読み込み中...</div>
            </div>
          )}
        </div>
      )}
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
