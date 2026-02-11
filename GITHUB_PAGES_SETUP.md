# GitHub Pages 公開手順ガイド

このガイドでは、TOEIC英単語 美少女魔法バトルをGitHub Pagesで公開する方法を説明します。

## 前提条件

- GitHubアカウント（無料で作成可能）
- Git がインストールされていること

## ステップ1: GitHub にリポジトリを作成

1. https://github.com/new にアクセス
2. リポジトリ情報を入力：
   - **Repository name**: `toeic-girl-game`
   - **Description**: TOEIC英単語 美少女魔法バトル
   - **Public** を選択
   - **Add a README file** は チェックしない（既にあるため）
3. **Create repository** をクリック

## ステップ2: ローカルリポジトリをGitHubにプッシュ

リポジトリ作成後、以下のコマンドを実行：

```bash
cd /home/ubuntu/toeic-girl-game-web

# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/toeic-girl-game.git

# mainブランチにプッシュ
git push -u origin main
```

**YOUR_USERNAME** を実際のGitHubユーザー名に置き換えてください。

## ステップ3: GitHub Pages を有効化

1. GitHub でリポジトリを開く
2. **Settings** をクリック（右上のギアアイコン）
3. 左側メニューで **Pages** をクリック
4. **Build and deployment** セクションで以下を設定：
   - **Source**: **Deploy from a branch** を選択
   - **Branch**: **main** を選択
   - **Folder**: **/ (root)** を選択
5. **Save** をクリック

## ステップ4: デプロイ確認

1. **Settings** → **Pages** で、デプロイ状態を確認
2. 数分後、以下のURLでゲームが公開されます：

```
https://YOUR_USERNAME.github.io/toeic-girl-game/
```

このURLにアクセスすれば、ゲームがプレイできます！

## 📱 ゲームの遊び方

1. **ホーム画面** でレベルを選択
2. **クイズ画面** で英単語の意味を3択から選ぶ
3. **正解** するとキャラクターが成長し、💥エフェクトが表示
4. **不正解** するとハートが1つ減る
5. **10問正解** でステージクリア
6. **ハートが0** になるとゲームオーバー

## 🎨 実装されている演出

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

## 🔄 更新方法

ゲームを更新する場合：

```bash
cd /home/ubuntu/toeic-girl-game-web

# 変更をコミット
git add .
git commit -m "Update: [変更内容]"

# GitHubにプッシュ
git push origin main
```

GitHub Pagesが自動的に更新されます（数分待つ）。

## ⚙️ トラブルシューティング

### ページが表示されない

1. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）
2. 数分待つ（デプロイ中の可能性）
3. Settings → Pages でデプロイ状態を確認

### 画像が表示されない

1. ブラウザのコンソール（F12）でエラーを確認
2. URL が `/toeic-girl-game/characters/...` になっているか確認
3. リポジトリ名が `toeic-girl-game` になっているか確認

### ゲームが動作しない

1. ブラウザのコンソール（F12）でエラーを確認
2. ネットワークタブで `/toeic-girl-game/data/words_data.json` が読み込まれているか確認

## 📊 プロジェクト情報

- **リポジトリ**: https://github.com/YOUR_USERNAME/toeic-girl-game
- **ゲームURL**: https://YOUR_USERNAME.github.io/toeic-girl-game/
- **ビルドサイズ**: 約23MB
- **技術スタック**: React 18, TypeScript, Tailwind CSS, Vite

## 🎯 確認事項

✅ ハート減少演出が実装されている
✅ 攻撃エフェクト（💥）が実装されている
✅ キャラクター成長が実装されている
✅ 5つのレベルが実装されている
✅ GitHub Pages対応のビルドが完了している
✅ ローカルリポジトリが作成されている

---

**準備完了！** 

上記の手順に従ってGitHub Pagesを有効化すれば、24/7 アクセス可能なゲームサイトが完成します！
