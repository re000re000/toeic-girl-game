import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameState, Word, QuizQuestion } from './types';
import {
  loadWordsData,
  getWordsByLevel,
  getRandomWord,
  generateQuizQuestion,
  getRandomCharacterId,
} from './utils';

interface GameContextType {
  gameState: GameState | null;
  currentQuestion: QuizQuestion | null;
  initializeGame: (level: number) => Promise<void>;
  answerQuestion: (selectedIndex: number) => Promise<{ isCorrect: boolean; isLevelComplete: boolean }>;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [levelWords, setLevelWords] = useState<Word[]>([]);

  // ゲームを初期化
  const initializeGame = useCallback(async (level: number) => {
    try {
      console.log(`[DEBUG] Initializing game for level: ${level}`);
      // データを読み込む（内部でキャッシュされる）
      await loadWordsData();

      // レベルに応じた単語を取得
      const levelSpecificWords = getWordsByLevel(level, []);
      if (levelSpecificWords.length === 0) {
        throw new Error(`レベル ${level} の単語データが見つかりませんでした。`);
      }
      
      setLevelWords(levelSpecificWords);

      const characterId = getRandomCharacterId(level);

      const newGameState: GameState = {
        level,
        currentQuestionIndex: 0,
        correctAnswers: 0,
        life: 3,
        currentCharacterId: characterId,
        characterState: 0,
        missedWords: [],
      };

      setGameState(newGameState);

      // 最初の問題を生成
      const word = getRandomWord(levelSpecificWords);
      const question = generateQuizQuestion(word, []);
      setCurrentQuestion(question);
      
      console.log(`[DEBUG] Game initialized successfully for level ${level}`);
    } catch (error) {
      console.error('[DEBUG] Failed to initialize game:', error);
      alert(error instanceof Error ? error.message : 'ゲームの初期化に失敗しました。');
      throw error; // App.tsx側でキャッチできるように再スロー
    }
  }, []);

  // 問題に答える
  const answerQuestion = useCallback(
    async (selectedIndex: number): Promise<{ isCorrect: boolean; isLevelComplete: boolean }> => {
      if (!gameState || !currentQuestion) {
        return { isCorrect: false, isLevelComplete: false };
      }

      const isCorrect = selectedIndex === currentQuestion.correctIndex;

      let newGameState = { ...gameState };

      if (isCorrect) {
        // 正解 - キャラクター状態を進める
        newGameState.correctAnswers += 1;
        newGameState.characterState = Math.min(newGameState.characterState + 1, 3);

        // 10問正解でクリア
        if (newGameState.correctAnswers >= 10) {
          setGameState(newGameState);
          return { isCorrect: true, isLevelComplete: true };
        }

        // 次の問題へ
        newGameState.currentQuestionIndex += 1;
      } else {
        // 不正解 - ライフ減少
        newGameState.life -= 1;
        newGameState.missedWords.push(currentQuestion.word);

        // ゲームオーバーチェック
        if (newGameState.life <= 0) {
          setGameState(newGameState);
          return { isCorrect: false, isLevelComplete: false };
        }
      }

      setGameState(newGameState);

      // 次の問題を生成
      const word = getRandomWord(levelWords);
      const question = generateQuizQuestion(word, []);
      setCurrentQuestion(question);

      return { isCorrect, isLevelComplete: false };
    },
    [gameState, currentQuestion, levelWords]
  );

  // ゲームをリセット
  const resetGame = useCallback(() => {
    setGameState(null);
    setCurrentQuestion(null);
    setLevelWords([]);
  }, []);

  return (
    <GameContext.Provider value={{ gameState, currentQuestion, initializeGame, answerQuestion, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
