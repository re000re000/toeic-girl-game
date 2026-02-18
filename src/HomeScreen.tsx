
interface HomeScreenProps {
  onSelectLevel: (level: number) => void;
}

export function HomeScreen({ onSelectLevel }: HomeScreenProps) {
  const handleLevelClick = (level: number) => {
    console.log(`[DEBUG] Level ${level} button clicked`);
    onSelectLevel(level);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* タイトル */}
        <div className="text-center mt-12 mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">TOEIC英単語</h1>
          <h2 className="text-3xl font-bold text-pink-600 mb-4">美少女魔法バトル</h2>
        </div>

        {/* ゲーム説明 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">ゲームの遊び方</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ 英単語の意味を3択から選ぶ</li>
            <li>✅ 10問正解でステージクリア</li>
            <li>✅ 間違えるとハートが1つ減る</li>
            <li>✅ ハートが0になるとゲームオーバー</li>
          </ul>
        </div>

        {/* レベル選択 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">レベルを選択</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => handleLevelClick(level)}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all hover:scale-105"
              >
                Level {level}
              </button>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="text-center text-sm text-gray-600">
          <p>難易度が高いほど、難しい単語が出題されます</p>
        </div>
      </div>
    </div>
  );
}
