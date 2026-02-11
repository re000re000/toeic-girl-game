# TOEIC英単語 美少女魔法バトル - GitHub Pages版

Expoプロジェクトをベースに、GitHub Pagesで公開できるWeb版に変換したプロジェクトです。

## 特徴

✅ **ハート減少演出** - 不正解時にハートが1つ減る
✅ **攻撃エフェクト** - 正解時に💥エフェクトと画面揺れが発生
✅ **キャラクター成長** - 正解するとキャラクターが段階的に成長
✅ **5つのレベル** - Level 1～5で難易度が異なる
✅ **GitHub Pages対応** - URLを開いた瞬間にゲームが始まる

## 技術スタック

- React 18
- TypeScript
- Tailwind CSS
- Vite

## セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ビルド
npm run build
```

## GitHub Pagesでの公開手順

### 1. GitHubにプッシュ

```bash
git init
git add .
git commit -m "Initial commit: TOEIC game web version"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/toeic-girl-game.git
git push -u origin main
```

### 2. GitHub Pagesを有効化

1. GitHubでリポジトリを開く
2. **Settings** をクリック
3. 左側メニューで **Pages** をクリック
4. **Source** セクションで以下を設定：
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. **Save** をクリック

### 3. デプロイ確認

数分後、以下のURLでゲームが公開されます：

```
https://YOUR_USERNAME.github.io/toeic-girl-game/
```

## ファイル構成

```
toeic-girl-game-web/
├── src/
│   ├── App.tsx              # メインアプリケーション
│   ├── GameContext.tsx      # ゲーム状態管理
│   ├── HomeScreen.tsx       # ホーム画面
│   ├── QuizScreen.tsx       # クイズ画面（ハート・エフェクト実装）
│   ├── StageClearScreen.tsx # ステージクリア画面
│   ├── GameOverScreen.tsx   # ゲームオーバー画面
│   ├── types.ts             # TypeScript型定義
│   ├── utils.ts             # ユーティリティ関数
│   ├── main.tsx             # エントリーポイント
│   └── index.css            # グローバルスタイル
├── public/
│   ├── characters/          # キャラクター画像（75枚）
│   └── data/                # 単語データ
├── index.html               # HTMLテンプレート
├── vite.config.ts           # Vite設定
├── tailwind.config.js       # Tailwind設定
├── package.json             # 依存関係
└── README.md                # このファイル
```

## ゲームの遊び方

1. **ホーム画面** でレベルを選択
2. **クイズ画面** で英単語の意味を3択から選ぶ
3. **正解** するとキャラクターが成長し、攻撃エフェクト（💥）が表示
4. **不正解** するとハートが1つ減る
5. **10問正解** でステージクリア
6. **ハートが0** になるとゲームオーバー

## 実装されている演出

### ハート減少演出
- 不正解時にハートが1つ減少
- ハート数は画面上部に表示
- ハートが0になるとゲームオーバー

### 攻撃エフェクト
- 正解時に💥エフェクトが表示
- 赤いフラッシュが0.5秒間表示
- 画面が左右に揺れるアニメーション

### キャラクター成長
- 正解するたびにキャラクターの衣装が変わる
- 4段階の成長ステージ

## トラブルシューティング

### ゲームが読み込まれない

1. ブラウザのコンソール（F12）でエラーを確認
2. キャッシュをクリア（Ctrl+Shift+Delete）
3. ネットワークタブで `/toeic-girl-game/data/words_data.json` が読み込まれているか確認

### 画像が表示されない

1. `/public/characters/` フォルダが存在するか確認
2. ビルド後に `dist/characters/` フォルダが生成されているか確認

### GitHub Pagesで404エラー

1. リポジトリ名が `toeic-girl-game` になっているか確認
2. Settings → Pages で Branch が `main` に設定されているか確認
3. `vite.config.ts` の `base` が `/toeic-girl-game/` になっているか確認

## ライセンス

プライベート用

---

**作成日**: 2026年2月11日
**バージョン**: 1.0.0
