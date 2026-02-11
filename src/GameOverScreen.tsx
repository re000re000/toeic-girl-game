
import { useGame } from './GameContext';

interface GameOverScreenProps {
  onRetry: () => void;
  onHome: () => void;
}

export function GameOverScreen({ onRetry, onHome }: GameOverScreenProps) {
  const { gameState } = useGame();

  if (!gameState) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-100 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        {/* タイトル */}
        <h1 className="text-4xl font-bold text-red-600 mb-8">💔 ゲームオーバー</h1>

        {/* スコア表示 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
          <p className="text-gray-600 mb-2">正解数</p>
          <p className="text-5xl font-bold text-red-600 mb-4">{gameState.correctAnswers}/10</p>
          <p className="text-gray-600 mb-4">Level {gameState.level}</p>

          {gameState.missedWords.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-300">
              <p className="text-gray-600 mb-3">間違えた単語</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {gameState.missedWords.map((word, index) => (
                  <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    <p className="font-bold">{word.word}</p>
                    <p className="text-gray-600">{word.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all hover:scale-105"
          >
            もう一度チャレンジ
          </button>
          <button
            onClick={onHome}
            className="w-full py-4 px-6 bg-gray-500 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all hover:scale-105"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
