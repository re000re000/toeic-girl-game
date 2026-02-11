import { useState, useRef } from 'react';
import { useGame } from './GameContext';
import { getCharacterImagePath } from './utils';

interface QuizScreenProps {
  onGameOver: () => void;
  onStageClear: () => void;
}

export function QuizScreen({ onGameOver, onStageClear }: QuizScreenProps) {
  const { gameState, currentQuestion, answerQuestion } = useGame();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showDamageEffect, setShowDamageEffect] = useState(false);
  const [shakeOffset, setShakeOffset] = useState(0);
  const shakeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!gameState || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <p className="text-xl text-gray-700">読み込み中...</p>
      </div>
    );
  }

  // ダメージエフェクトアニメーション
  const triggerDamageEffect = () => {
    setShowDamageEffect(true);

    // 画面揺れアニメーション
    let shakeCount = 0;
    shakeIntervalRef.current = setInterval(() => {
      shakeCount++;
      if (shakeCount % 2 === 0) {
        setShakeOffset(10);
      } else {
        setShakeOffset(-10);
      }

      if (shakeCount >= 4) {
        setShakeOffset(0);
        if (shakeIntervalRef.current) {
          clearInterval(shakeIntervalRef.current);
        }
      }
    }, 100);

    // 0.5秒後にエフェクトを非表示
    setTimeout(() => {
      setShowDamageEffect(false);
    }, 500);
  };

  const handleAnswerSelect = async (index: number) => {
    if (isAnswering || !gameState || !currentQuestion) return;

    setSelectedIndex(index);
    setIsAnswering(true);

    const result = await answerQuestion(index);

    if (result.isCorrect) {
      // 正解時にダメージエフェクトを表示
      triggerDamageEffect();
    }

    setTimeout(() => {
      if (!result.isCorrect) {
        // 不正解 - 同じ問題を再表示
        setSelectedIndex(null);
        setIsAnswering(false);
      } else if (result.isLevelComplete) {
        // ステージクリア
        onStageClear();
      } else {
        // 次の問題へ
        setSelectedIndex(null);
        setIsAnswering(false);
      }
    }, 500);
  };

  // ゲームオーバーチェック
  if (gameState.life <= 0) {
    onGameOver();
    return null;
  }

  const hearts = '❤️'.repeat(gameState.life);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6 mt-4">
          <div className="text-lg font-bold text-gray-800">
            Level {gameState.level} - Q{gameState.currentQuestionIndex + 1}/10
          </div>
          <div className="text-2xl">{hearts}</div>
        </div>

        {/* キャラクター画像 - ダメージエフェクト付き */}
        <div
          className="flex justify-center mb-8 relative h-64"
          style={{
            transform: `translateX(${shakeOffset}px)`,
            transition: 'transform 0.05s ease-in-out',
          }}
        >
          <img
            src={getCharacterImagePath(gameState.currentCharacterId, gameState.characterState)}
            alt="Character"
            className="h-64 object-contain"
          />

          {/* ダメージエフェクト - 赤いフラッシュと💥 */}
          {showDamageEffect && (
            <div className="absolute inset-0 bg-red-500 bg-opacity-30 rounded-lg flex items-center justify-center">
              <span className="text-6xl font-bold">💥</span>
            </div>
          )}
        </div>

        {/* 単語表示 */}
        <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-blue-500">
          <p className="text-center text-4xl font-bold text-blue-900 mb-4">{currentQuestion.word.word}</p>
          <p className="text-center text-sm text-gray-600">この英単語の意味は？</p>
        </div>

        {/* 選択肢 */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isCorrect = index === currentQuestion.correctIndex;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswering}
                className={`w-full p-4 rounded-lg font-bold text-lg transition-all ${
                  isSelected && !isCorrect
                    ? 'bg-red-500 text-white scale-105'
                    : isSelected && isCorrect
                    ? 'bg-green-500 text-white scale-105'
                    : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-500'
                } ${isAnswering ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
