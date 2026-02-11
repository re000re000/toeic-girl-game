
import { useGame } from './GameContext';
import { getCharacterImagePath } from './utils';

interface StageClearScreenProps {
  onRetry: () => void;
  onHome: () => void;
}

export function StageClearScreen({ onRetry, onHome }: StageClearScreenProps) {
  const { gameState } = useGame();

  if (!gameState) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-100 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        {/* タイトル */}
        <h1 className="text-4xl font-bold text-green-600 mb-8">🎉 ステージクリア！</h1>

        {/* キャラクター画像 */}
        <div className="mb-8">
          <img
            src={getCharacterImagePath(gameState.currentCharacterId, gameState.characterState)}
            alt="Character"
            className="h-64 object-contain mx-auto"
          />
        </div>

        {/* スコア表示 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
          <p className="text-gray-600 mb-2">正解数</p>
          <p className="text-5xl font-bold text-blue-600 mb-4">{gameState.correctAnswers}/10</p>
          <p className="text-gray-600">Level {gameState.level} をクリアしました！</p>
        </div>

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all hover:scale-105"
          >
            次のレベルへ
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
