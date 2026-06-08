# 暇人技術部 公式ホームページ

Himazin Technical Department の公式ホームページです。[GitHub Pages](https://pages.github.com/) で公開されています。

## 目次

1. [はじめに：このリポジトリの仕組み](#はじめにこのリポジトリの仕組み)
2. [必要なもの](#必要なもの)
3. [Git のインストール](#git-のインストール)
4. [Node.js のインストール](#nodejs-のインストール)
5. [リポジトリをローカルに取得する](#リポジトリをローカルに取得する)
6. [ディレクトリ構成](#ディレクトリ構成)
7. [コンテンツの追加・編集](#コンテンツの追加編集)
   - [お知らせ / ブログを追加する](#お知らせ--ブログを追加する)
   - [プロダクトを追加する](#プロダクトを追加する)
   - [メンバーを編集する](#メンバーを編集する)
   - [トップページの説明文を編集する](#トップページの説明文を編集する)
   - [サイト全体のデザインを編集する](#サイト全体のデザインを編集する)
8. [ローカルでビルドして確認する](#ローカルでビルドして確認する)
9. [変更を公開する（push する）](#変更を公開するpush-する)
10. [プルリクエストを使った運用](#プルリクエストを使った運用)
11. [自動ビルド・デプロイの仕組み](#自動ビルドデプロイの仕組み)
12. [よくある質問・トラブルシューティング](#よくある質問トラブルシューティング)

## はじめに：このリポジトリの仕組み

このサイトは **静的サイトジェネレーター** です。

- 記事やメンバー情報は `data/` フォルダ内の **Markdown（`*.md`）** と **JSON** で管理します。
- `npm run build` を実行すると、それらのデータから自動的に `index.html` や各ページの HTML が生成されます。
- 生成された HTML を GitHub Pages で公開しています。
- **GitHub Actions** により、`main` ブランチにプッシュすると自動でビルド → デプロイまで行われます。

つまり、新しい記事を追加したい場合は `data/` 以下にファイルを作成し、Git でプッシュするだけでサイトが更新されます。

## 必要なもの

以下のソフトウェアが必要です。まだインストールしていない場合は次のセクションを参照してください。

| ソフトウェア | バージョン | 用途 |
|---|---|---|
| [Git](https://git-scm.com/) | 最新安定版 | バージョン管理、GitHub へのプッシュ |
| [Node.js](https://nodejs.org/) | 20.x 以上 | ビルドスクリプトの実行 |
| npm | Node.js に同梱 | パッケージ管理 |
| テキストエディタ | 任意 | ファイルの編集（Visual Studio Code 推奨） |

## Git のインストール

### Windows

1. [Git公式サイト](https://git-scm.com/download/win) からインストーラーをダウンロード
2. インストーラーを実行し、デフォルト設定のままインストール
3. インストール後、**Git Bash** または **コマンドプロンプト** を開いて以下のコマンドで確認:
   ```bash
   git --version
   ```
   → `git version 2.xx.x` と表示されれば成功

### macOS

**方法1: Homebrew を使う（推奨）**
```bash
brew install git
```

**方法2: Xcode Command Line Tools**
```bash
xcode-select --install
```

確認:
```bash
git --version
```

### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install git
```

確認:
```bash
git --version
```

### Git の初期設定

インストール後、初めて使う前に名前とメールアドレスを設定してください（GitHub に登録したものと同じものが望ましいです）。

```bash
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"
```

## Node.js のインストール

### Windows / macOS

[Node.js公式サイト](https://nodejs.org/) から **20.x LTS** をダウンロードしてインストール。

確認:
```bash
node --version
npm --version
```

### Linux (Ubuntu / Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

確認:
```bash
node --version
npm --version
```

## リポジトリをローカルに取得する

### GitHub アカウントの作成

1. [GitHub](https://github.com/) にアクセス
2. **Sign up** からアカウントを作成
3. メールアドレスの確認を行う

### リポジトリへのアクセス権限

リポジトリに変更をプッシュするには、リポジトリの管理者に GitHub アカウント名を伝えてコラボレーターとして追加してもらう必要があります。

または、リポジトリをフォークしてプルリクエストを送る方法もあります（後述）。

### クローン（ローカルにダウンロード）

リポジトリのURLをコピーして、以下のコマンドを実行します。

```bash
git clone https://github.com/himazin-technical-department/HTD-Official.git
cd HTD-Official
```

### 依存パッケージのインストール

```bash
npm install
```

これで `node_modules/` が作成され、ビルドに必要な `markdown-it` がインストールされます。

以降、新しい記事を追加するたびに `npm install` を再実行する必要はありません（初回のみです）。

## ディレクトリ構成

```
HTD-Official/
├── index.html             # トップページ（自動生成）
├── 404.html               # カスタム404ページ
├── HTD.svg                # サイトアイコン
├── logo.svg               # ロゴ
├── robots.txt             # クローラ設定
├── sitemap.xml            # サイトマップ（自動生成）
├── package.json           # プロジェクト設定・ビルドスクリプト
│
├── scripts/               # ビルドスクリプト（原則編集不要）
│   ├── generate-registry.js
│   ├── build.js
│   └── frontmatter.js
│
├── css/
│   └── style.css          # スタイルシート
│
├── js/
│   └── script.js          # 検索・メニュー制御
│
├── data/                  # ★ コンテンツのソース（ここを編集する）
│   ├── about.json         #   トップページの「〜とは？」説明文
│   ├── members/
│   │   └── members.json   #   メンバー一覧
│   ├── updates/           #   お知らせ
│   │   └── {slug}/
│   │       ├── meta.json  #     タイトル・日付・抜粋など
│   │       └── index.md   #     本文（Markdown）
│   ├── products/          #   プロダクト
│   │   └── {slug}/
│   │       ├── meta.json
│   │       ├── index.md
│   │       └── icon.svg   #     プロダクトアイコン
│   └── blog/              #   ブログ
│       └── {slug}/
│           ├── meta.json
│           └── index.md
│
├── updates/               # お知らせページ（自動生成。手動編集しない）
│   ├── index.html
│   └── {slug}/index.html
├── products/              # プロダクトページ（自動生成。手動編集しない）
│   ├── index.html
│   └── {slug}/index.html
├── blog/                  # ブログページ（自動生成。手動編集しない）
│   ├── index.html
│   └── {slug}/index.html
├── members/               # メンバーページ（自動生成。手動編集しない）
│   └── index.html
│
├── .github/workflows/     # GitHub Actions の設定
│   └── deploy.yml
├── .gitignore
├── LICENSE
└── README.md
```

### 重要なルール

- `data/` 以下が **ソース** です。ここだけを編集してください。
- `index.html`, `updates/`, `products/`, `blog/`, `members/`, `sitemap.xml` は **自動生成** されます。直接編集しても次回ビルドで上書きされるので意味がありません。
- 生成ファイルも Git で管理していますが、`npm run build` を実行すれば自動的に最新化されます。

## コンテンツの追加・編集

### お知らせ / ブログを追加する

新しいお知らせやブログ記事を追加する手順です。

#### 手順

1. `data/updates/` または `data/blog/` の中に、**スラグ（URLの一部になる英数字）** を名前としたフォルダを作成します。

   例: 「新メンバー募集」というお知らせの場合
   ```bash
   mkdir -p data/updates/new-member-recruitment
   ```

2. 作成したフォルダの中に `meta.json` を作成します。

   ```json
   {
     "title": "新メンバー募集中！",
     "date": "2026-06-08",
     "author": "川上",
     "excerpt": "暇人技術部では新しいメンバーを募集しています。",
     "tags": ["お知らせ", "募集"]
   }
   ```

3. 同じフォルダに `index.md` を作成し、本文を Markdown で記述します。

   ```markdown
   暇人技術部では、新しいメンバーを募集しています！
   
   興味のある方は以下の連絡先まで。
   
   ## 募集要項
   
   - 対象: 技術に興味がある人
   - 活動: プロダクト開発・研究
   - 連絡先: Twitter DM まで
   ```

4. **meta.json の各フィールド:**

   | フィールド | 必須 | 内容 |
   |---|---|---|
   | `title` | ✅ | 記事のタイトル |
   | `date` | ✅ | 日付（`YYYY-MM-DD` 形式） |
   | `author` | | 著者名（省略可） |
   | `excerpt` | | 一覧ページに表示される短い説明（省略可） |
   | `tags` | | タグの配列（省略可） |

   **ブログ記事の場合も同じ形式です。**

#### 画像を記事内に配置する

`index.md` と同じフォルダに画像ファイルを配置し、Markdown 内から相対パスで参照します。

```markdown
![説明文](image.png)
```

ビルド後に `blog/{slug}/image.png` としてアクセスできるようになります。

### プロダクトを追加する

プロダクトページもお知らせと同様の手順ですが、`meta.json` のフィールドが異なります。

1. `data/products/` の中にスラグフォルダを作成します。

   ```bash
   mkdir -p data/products/my-app
   ```

2. `meta.json` を作成します。

   ```json
   {
     "title": "マイアプリ",
     "date": "2026-06-01",
     "excerpt": "便利なアプリケーションです。",
     "icon": "data/products/my-app/icon.svg",
     "url": "https://example.com",
     "urlLabel": "サイトへ",
     "detailLabel": "詳しく見る"
   }
   ```

3. `index.md` を作成します（詳細ページの本文）。

4. 必要に応じて `icon.svg` を配置します（プロダクトカードに表示されるアイコン）。

**meta.json の各フィールド:**

| フィールド | 必須 | 内容 |
|---|---|---|
| `title` | ✅ | プロダクト名 |
| `date` | ✅ | 日付 |
| `excerpt` | | 説明文 |
| `icon` | | アイコンファイルのパス（例: `data/products/my-app/icon.svg`） |
| `url` | | 外部リンク（GitHub や Web サイト） |
| `urlLabel` | | 外部リンクのボタンに表示するテキスト（デフォルト: 「サイトへ」） |
| `detailLabel` | | 詳細ボタンのテキスト（デフォルト: 「詳細」） |

### メンバーを編集する

`data/members/members.json` を編集します。JSON の配列になっていて、各メンバーをオブジェクトで表します。

```json
[
  {
    "name": "川上",
    "type": "developer",
    "role": "代表",
    "description": "普段はWeb系エンジニア。",
    "icon": "https://github.com/username.png",
    "links": [
      { "label": "GitHub", "url": "https://github.com/username" },
      { "label": "Twitter", "url": "https://twitter.com/username" }
    ]
  },
  {
    "name": "山田",
    "type": "creator",
    "role": "デザイナー",
    "description": "UI/UXデザイン担当。",
    "links": [
      { "label": "Portfolio", "url": "https://example.com" }
    ]
  }
]
```

**各フィールド:**

| フィールド | 必須 | 内容 |
|---|---|---|
| `name` | ✅ | 名前 |
| `type` | | タイプ（`developer` / `creator` / `supporter`）。カードの色が変わります。 |
| `role` | ✅ | 役割（代表、エンジニア etc.） |
| `description` | | 一言説明 |
| `icon` | | アイコン画像URL（省略時は頭文字が表示されます） |
| `links` | | リンクの配列。各リンクは `label` + `url` |

### トップページの説明文を編集する

`data/about.json` を編集します。Markdown 形式で記述します。

```json
{
  "about": "暇人技術部（Himazin Technical Department）は、技術好きが集まって...\\n\\n## 活動内容\\n\\n- プロダクト開発\\n- 勉強会\\n- ..."
}
```

**注意:** JSON 内で改行を入れるには `\\n` とエスケープします。

### サイト全体のデザインを編集する

- スタイル: `css/style.css`
- 検索・メニューの動作: `js/script.js`
- HTML のテンプレート: `scripts/build.js`（`shell` 関数内）

**scripts/ 以下のファイルを編集する場合は、ビルドが壊れていないことを必ずローカルで確認してください。**

## ローカルでビルドして確認する

編集した内容が正しく反映されるか、必ずローカルで確認してからプッシュしましょう。

### ビルド

```bash
npm run build
```

以下の処理が実行されます:
1. `data/` 以下の Markdown ファイルから `registry.json` と `meta.json` を生成
2. 全ページの HTML（`index.html`, `updates/`, `products/`, `blog/`, `members/`, `sitemap.xml`）を生成

### プレビュー

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。

Python が使えない場合は Node.js の `serve` パッケージでも構いません:

```bash
npx serve .
```

### 確認すべきポイント

- 新しく追加した記事が一覧ページに正しく表示されているか
- 記事の詳細ページが正しく表示されているか
- リンクが切れていないか
- 画像が表示されるか
- トップページの表示が崩れていないか

## 変更を公開する（push する）

ローカルで確認できたら、変更を GitHub にプッシュして公開します。

### 基本的な流れ

```bash
# 1. 変更したファイルを確認
git status

# 2. 変更内容を diff で確認（必要に応じて）
git diff

# 3. 変更をステージングに追加
git add data/updates/new-member-recruitment/

# または変更全体を追加
git add -A

# 4. コミット
git commit -m "お知らせ「新メンバー募集」を追加"

# 5. GitHub にプッシュ
git push origin main
```

プッシュ後、**GitHub Actions が自動的にビルドとデプロイを実行**します。
反映まで通常 1〜2 分程度です。

### コミットメッセージの書き方

コミットメッセージは、何を変更したかが一目でわかるように簡潔に書きましょう。

良い例:
- `お知らせ「新メンバー募集」を追加`
- `ブログ記事「HTD始めました」を公開`
- `メンバー一覧に山田を追加`
- `スタイルシートのカラーを調整`
- `READMEに編集手順を追加`

### プッシュ前にビルドを必ず確認する

```bash
npm run build
```

エラーが出る場合は修正してからプッシュしてください。
エラーが出たままプッシュしても、GitHub Actions のビルドが失敗し、サイトは更新されません。

## プルリクエストを使った運用

複数人で開発する場合、直接 `main` ブランチにプッシュするのではなく、**プルリクエスト（PR）** を使った運用が推奨されます。

### 手順

1. 新しいブランチを作成

   ```bash
   # main ブランチにいることを確認
   git branch

   # 新しいブランチを作成して切り替え
   git checkout -b add-new-recruitment
   ```

2. 変更を加えてコミット

   ```bash
   # ファイルを編集...
   git add -A
   git commit -m "お知らせ「新メンバー募集」を追加"
   ```

3. GitHub にプッシュ

   ```bash
   git push origin add-new-recruitment
   ```

4. GitHub のリポジトリページにアクセスすると、**「Compare & pull request」** というボタンが表示されるのでクリック

5. PR のタイトルと説明を入力して作成

6. PR が作成されると自動的に **GitHub Actions がビルドを実行**し、ビルドが通るかどうかが表示されます

7. レビュー後、問題なければ **Merge pull request** ボタンで `main` ブランチにマージ

8. マージされると自動で本番デプロイが実行されます

### PR のメリット

- ビルドが通るか自動でチェックされる
- 複数人で変更内容を確認できる
- 問題があればマージ前に修正できる
- 変更履歴がわかりやすくなる

## 自動ビルド・デプロイの仕組み

`.github/workflows/deploy.yml` に定義された GitHub Actions が自動的に処理を行います。

### 処理の流れ

```
Push / PR (全ブランチ)
  ↓
Build job
  ├── npm ci          # 依存パッケージをインストール
  ├── npm run build   # HTML を生成
  ├── touch .nojekyll # Jekyll を無効化
  └── artifact にアップロード
  ↓
Deploy job（main ブランチへの push のみ）
  └── GitHub Pages にデプロイ
```

### 動作の詳細

| トリガー | ビルド | デプロイ |
|---|---|---|
| `main` ブランチに push | ✅ 実行 | ✅ 実行 |
| その他のブランチに push | ✅ 実行 | ❌ しない |
| PR を作成・更新 | ✅ 実行 | ❌ しない |
| `workflow_dispatch`（手動） | ✅ 実行 | ✅ 実行（main の場合） |

つまり:

- **どんなブランチにプッシュしてもビルドが走る**ので、ビルドが壊れていないかすぐに確認できます。
- **デプロイは `main` ブランチへのプッシュ時のみ**なので、本番環境が不安定になる心配はありません。
- PR のページでもビルド結果が確認でき、✅ がついてからマージするのが安心です。

### ビルドが失敗した場合

GitHub のリポジトリページで **Actions** タブを開くと、ワークフローの実行結果が確認できます。

赤い ✗ がついているジョブをクリックすると、どのステップでエラーが発生したか詳細が表示されます。

よくある原因:
- `meta.json` の JSON 形式が壊れている（カンマ漏れなど）
- `npm run build` でエラーが出ている
- `package-lock.json` がコミットされていない

## よくある質問・トラブルシューティング

### Q: `git push` したのにサイトが更新されない

1. GitHub Actions の実行状況を確認してください。
   - リポジトリの **Actions** タブを開く
   - 最新のワークフロー実行が ✅（成功）か ✗（失敗）かを確認
2. 失敗している場合、詳細ログを確認してエラーを修正してください。
3. 成功している場合、デプロイには1〜2分かかることがあります。しばらく待ってから `Ctrl+F5`（ハードリロード）でページを再読み込みしてみてください。

### Q: `npm run build` でエラーが出る

- `meta.json` の JSON 形式が正しいか確認してください（末尾のカンマなど）。
- `index.md` が存在するか確認してください。
- `node_modules/` が正しくインストールされているか確認:
  ```bash
  npm ci
  ```

### Q: 画像が表示されない

- `meta.json` の `icon` パスが正しいか確認してください（`data/products/{slug}/icon.svg` のように `data/` からの相対パス）。
- 画像ファイルが実際に存在するか確認してください。
- ファイル名の大文字小文字が一致しているか確認（特に Linux 環境では要注意）。

### Q: GitHub の使い方がわからない

- [GitHub 公式ドキュメント](https://docs.github.com/ja)
- [GitHub スキル](https://skills.github.com/)（実際に操作しながら学べます）

### Q: `git` コマンドがわからない

最低限覚えるコマンド:

| コマンド | 用途 |
|---|---|
| `git status` | 変更状態を確認 |
| `git add <ファイル>` | ファイルをコミット対象に追加 |
| `git commit -m "メッセージ"` | 変更をコミット |
| `git push` | GitHub にアップロード |
| `git pull` | GitHub から最新を取得 |
| `git branch` | ブランチ一覧・現在のブランチを確認 |
| `git checkout -b <名前>` | 新しいブランチを作成して移動 |

### Q: Visual Studio Code のおすすめ設定

1. [VS Code](https://code.visualstudio.com/) をインストール
2. リポジトリのフォルダを開く: `File > Open Folder` → `HTD-Official` を選択
3. 推奨拡張機能:
   - **Markdown Preview Mermaid Support** — Markdown のプレビュー
   - **GitLens** — Git の履歴を視覚的に確認
   - **YAML** — YAML/JSON のバリデーション

## ライセンス

[MIT](LICENSE)
