# 暇人技術部 公式ホームページ

Himazin Technical Department の公式ホームページです。[GitHub Pages](https://pages.github.com/) で公開されています。

[![Build Status](https://img.shields.io/github/actions/workflow/status/Himazin-Technical-Department/Himazin-Technical-Department.github.io/deploy.yml?branch=main&label=Build)](https://github.com/Himazin-Technical-Department/Himazin-Technical-Department.github.io/actions/workflows/deploy.yml)

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

- 記事は `data/` フォルダ内の **Markdown ファイル（`index.md`）** の YAML frontmatter にタイトル・日付などを、本文に内容を書いて管理します。
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
| [Python](https://www.python.org/) | 3.x | ローカルプレビュー用の簡易HTTPサーバー（後述） |
| テキストエディタ | 任意 | ファイルの編集（後述の推奨ソフト一覧を参照） |

## 推奨ソフトウェア

編集作業をスムーズに行うための推奨ソフトウェアです。すべて無料で使えます。

### テキストエディタ（Markdown / JSON 編集）

| ソフトウェア | おすすめ度 | 用途・特徴 |
|---|---|---|
| [Visual Studio Code](https://code.visualstudio.com/) | ★★★ | 汎用エディタ。拡張機能で YAML バリデーション・Markdown プレビュー・Git 操作が全部入る。このプロジェクトのメイン推奨。 |
| [Obsidian](https://obsidian.md/) | ★★★ | Markdown 特化。YAML frontmatter の表示やファイルツリーの管理に優れる。`data/` フォルダを vault として開くと直感的に編集できる。 |
| [Cursor](https://cursor.sh/) | ★★ | VS Code 互換 + AI アシスト搭載。Markdown の文章作成を AI に手伝わせたい場合に。 |
| [Zed](https://zed.dev/) | ★★ | 軽量・高速なエディタ。Markdown と JSON の編集に十分。 |

### Git GUI クライアント

| ソフトウェア | おすすめ度 | 用途・特徴 |
|---|---|---|
| [GitHub Desktop](https://desktop.github.com/) | ★★★ | GitHub 公式。コミット・プッシュ・PR 作成まで GUI で完結。ターミナル不要で最も簡単。 |
| [SourceTree](https://www.sourcetreeapp.com/) | ★★ | 視覚的なブランチ図が見やすい。複数人運用での変更追跡に便利。 |

### 画像編集（プロダクトアイコン用）

| ソフトウェア | おすすめ度 | 用途・特徴 |
|---|---|---|
| [Inkscape](https://inkscape.org/) | ★★★ | SVG 編集の定番。プロダクトの `icon.svg` 作成・編集に。 |
| [Affinity](https://affinity.serif.com/ja-jp/v2/) | ★★★ | プロ級のベクター・ラスター編集。無料。SVG 書き出し対応。 |
| [GIMP](https://www.gimp.org/) | ★★ | ラスター画像編集。スクリーンショットの加工などに。 |
| [Figma](https://www.figma.com/) | ★★ | ブラウザベースのデザインツール。SVG 書き出しに対応。 |

### JSON 編集・検証

| ソフトウェア | おすすめ度 | 用途・特徴 |
|---|---|---|
| [JSON Viewer](https://jsonviewer.stack.hu/) | ★★ | Web ブラウザ上で JSON を整形・検証。 |
| VS Code（拡張機能: YAML by Red Hat） | ★★★ | JSON / YAML のシンタックスエラーをリアルタイムに指摘。 |

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

## Python のインストール

Python は **ローカルでプレビュー確認するため** に使います。ビルド自体には不要ですが、編集内容をブラウザで確認するために必要です。

すでにインストール済みかどうか確認:
```bash
python3 --version
```

### Windows

[Python公式サイト](https://www.python.org/downloads/) から最新の **Python 3** をダウンロードしてインストール。
インストーラーで **「Add Python to PATH」** にチェックを入れてください。

確認:
```bash
python --version
```

### macOS

```bash
brew install python
```

### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install python3
```

確認:
```bash
python3 --version
```

### Python なしでプレビューする場合

Python をインストールしなくても、Node.js の `serve` パッケージで代用できます（後述のプレビュー欄を参照）。

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
git clone https://github.com/Himazin-Technical-Department/Himazin-Technical-Department.github.io.git
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
│   │   ├── registry.json  #     一覧データ（index.md から自動生成）
│   │   └── {slug}/
│   │       ├── meta.json  #     タイトル・日付など（index.md から自動生成）
│   │       └── index.md   #     ★ 本文＋YAML frontmatter（ここを書く）
│   ├── products/          #   プロダクト
│   │   ├── registry.json  #     一覧データ（自動生成）
│   │   └── {slug}/
│   │       ├── meta.json  #     自動生成
│   │       ├── index.md   #     ★ YAML frontmatter + 本文
│   │       └── icon.svg   #     プロダクトアイコン
│   └── blog/              #   ブログ
│       ├── registry.json  #     一覧データ（自動生成）
│       └── {slug}/
│           ├── meta.json  #     自動生成
│           └── index.md   #     ★ YAML frontmatter + 本文
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

2. そのフォルダに `index.md` を作成し、`---` で囲まれた **YAML frontmatter** と本文を Markdown で記述します。

   ```markdown
   ---
   title: 新メンバー募集中！
   date: 2026-06-08
   author: 川上
   excerpt: 暇人技術部では新しいメンバーを募集しています。
   tags:
     - お知らせ
     - 募集
   ---

   暇人技術部では、新しいメンバーを募集しています！

   興味のある方は以下の連絡先まで。

   ## 募集要項

   - 対象: 技術に興味がある人
   - 活動: プロダクト開発・研究
   - 連絡先: Twitter DM まで
   ```

   **frontmatter の各フィールド:**

   | フィールド | 必須 | 内容 |
   |---|---|---|
   | `title` | ✅ | 記事のタイトル |
   | `date` | ✅ | 日付（`YYYY-MM-DD` 形式） |
   | `author` | | 著者名（省略可） |
   | `excerpt` | | 一覧ページに表示される短い説明（省略可） |
   | `tags` | | タグのリスト（省略可） |
   | `thumbnail` | | サムネイル画像のパス。一覧・詳細ページに表示されます（例: `data/blog/my-post/thumb.png`） |

   **ブログ記事も同じ形式です。**

3. `npm run build` を実行すると、`index.md` の frontmatter から自動的に `meta.json` と `registry.json` が生成され、全ページの HTML も更新されます。

   ```bash
   npm run build
   ```

#### 画像を記事内に配置する

`index.md` と同じフォルダに画像ファイルを配置し、Markdown 内から相対パスで参照します。

```markdown
![説明文](image.png)
```

ビルド後に `blog/{slug}/image.png` としてアクセスできるようになります。

#### サムネイル画像を設定する

記事一覧や詳細ページの上部に表示するサムネイル画像を設定できます。frontmatter に `thumbnail` フィールドを追加してください。

```yaml
---
title: 記事タイトル
date: 2026-06-08
thumbnail: data/blog/my-post/thumb.png
---
```

パスは `data/` からの相対パスで指定します。画像ファイルは `index.md` と同じフォルダに配置するのが管理しやすいです。
サムネイルは省略可能で、設定しない場合は今まで通りの表示になります。

### プロダクトを追加する

お知らせと同様に `index.md` に YAML frontmatter を書きますが、フィールドが一部異なります。

1. `data/products/` の中にスラグフォルダを作成します。

   ```bash
   mkdir -p data/products/my-app
   ```

2. `index.md` を作成し、frontmatter と本文を記述します。

   ```markdown
   ---
   title: マイアプリ
   date: 2026-06-01
   excerpt: 便利なアプリケーションです。
   icon: data/products/my-app/icon.svg
   url: https://example.com
   urlLabel: サイトへ
   detailLabel: 詳しく見る
   ---

   マイアプリの詳細説明をここに書きます。
   ```

3. 必要に応じて `icon.svg` を同じフォルダに配置します（プロダクトカードに表示されるアイコン）。

4. `npm run build` で反映します。

**frontmatter の各フィールド:**

| フィールド | 必須 | 内容 |
|---|---|---|
| `title` | ✅ | プロダクト名 |
| `date` | ✅ | 日付 |
| `excerpt` | | 説明文 |
| `icon` | | アイコンファイルのパス（例: `data/products/my-app/icon.svg`） |
| `url` | | 外部リンク（GitHub や Web サイト） |
| `urlLabel` | | 外部リンクのボタンに表示するテキスト（デフォルト: 「サイトへ」） |
| `detailLabel` | | 詳細ボタンのテキスト（デフォルト: 「詳細」） |
| `downloadUrl` | | ダウンロード用のURL（GitHub Releases のリンクなど）。設定するとダウンロードボタンが表示されます |
| `downloadLabel` | | ダウンロードボタンのテキスト（デフォルト: 「ダウンロード」） |

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

### Obsidian を使って編集する（推奨）

[Obsidian](https://obsidian.md/) は Markdown エディタです。YAML frontmatter の表示やプレビュー、ファイル管理に優れており、このプロジェクトの編集に最適です。

#### Obsidian のインストール

1. [Obsidian 公式サイト](https://obsidian.md/) にアクセス
2. お使いの OS に合ったインストーラーをダウンロード
3. インストールして起動

#### データフォルダを開く

1. Obsidian を起動し、左下の **「フォルダを開く」** をクリック（既存の vault が開いている場合は `Ctrl/Cmd + Shift + O`）
2. `HTD-Official/data` フォルダを選択
3. **「信頼します」** をクリック

Obsidian で `data/` 以下が以下のように表示されます:

```
data/
├── about.json
├── members/members.json
├── updates/
│   └── {slug}/
│       ├── index.md
├── products/
│   └── {slug}/
│       ├── index.md
│       └── icon.svg
└── blog/
    └── {slug}/
        ├── index.md
```

左側のエクスプローラから目的の `index.md` をクリックして編集できます。  
編集後は忘れずに `npm run build` でプレビュー確認してください。

### サイト全体のデザインを編集する

- スタイル: `css/style.css`
- 検索・メニューの動作: `js/script.js`
- HTML のテンプレート: `scripts/build.js`（`shell` 関数内）

**scripts/ 以下のファイルを編集する場合は、ビルドが壊れていないことを必ずローカルで確認してください。**

### GitHub Releases を使ったファイル配布

プロダクトのバイナリやアーカイブを配布するには **GitHub Releases** が便利です。

#### リリースの作成手順

1. GitHub のリポジトリページで **Releases** → **Create a new release** をクリック
2. タグを入力（例: `v1.0.0`）
3. リリースタイトルと説明を記入
4. 配布するファイルをドラッグ＆ドロップで添付
5. **Publish release** をクリック

#### 記事からリンクする

発行されたダウンロードURLは以下の形式です:

```
https://github.com/Himazin-Technical-Department/Himazin-Technical-Department.github.io/releases/download/v1.0.0/ファイル名
```

プロダクトの `index.md` の frontmatter に `downloadUrl` と `downloadLabel` を追加すると、一覧・詳細ページにダウンロードボタンが表示されます。

```yaml
---
title: マイアプリ
date: 2026-06-01
downloadUrl: https://github.com/Himazin-Technical-Department/Himazin-Technical-Department.github.io/releases/download/v1.0.0/my-app.zip
downloadLabel: v1.0.0 をダウンロード
---
```

## ローカルでビルドして確認する

編集した内容が正しく反映されるか、必ずローカルで確認してからプッシュしましょう。

### ビルド

```bash
npm run build
```

以下の処理が実行されます:
1. `data/` 以下の `index.md` の YAML frontmatter を読み取り、`meta.json` と `registry.json` を自動生成
2. 全ページの HTML（`index.html`, `updates/`, `products/`, `blog/`, `members/`, `sitemap.xml`）を生成

### プレビュー（編集内容の確認）

ビルドで生成されたサイトをローカルで確認するには、簡易 HTTP サーバーを起動します。

**方法1: Python を使う**
```bash
python3 -m http.server 8080
```

**方法2: Python が入っていない場合（Node.js の serve を使う）**
```bash
npx serve .
```

どちらも `http://localhost:8080` をブラウザで開けば確認できます。

> `python3 -m http.server` は Python に標準で付属している機能なので、Python をインストールすれば追加のパッケージは不要です。
> 逆に、`npx serve` は初回実行時に自動でダウンロードが入りますが、Python のインストールが不要という利点があります。

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
- `index.md` の YAML frontmatter の形式が間違っている（インデントがタブになっている、`:` の後ろにスペースがない など）
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

- `index.md` の YAML frontmatter の形式を確認してください（`---` で正しく囲まれているか、インデントにタブではなくスペースを使っているか）。
- `index.md` が存在するか確認してください。
- `node_modules/` が正しくインストールされているか確認:
  ```bash
  npm ci
  ```

### Q: 画像が表示されない

- `index.md` の frontmatter 内の `icon` パスが正しいか確認してください（`data/products/{slug}/icon.svg` のように `data/` からの相対パス）。
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

### Q: Visual Studio Code での編集手順

#### インストール

1. [VS Code 公式サイト](https://code.visualstudio.com/) からインストーラーをダウンロード
2. インストーラーを実行（デフォルト設定で OK）
3. 起動確認

#### リポジトリのフォルダを開く

**方法1: コマンドラインから開く**
```bash
cd HTD-Official
code .
```

**方法2: VS Code のメニューから開く**
1. VS Code を起動
2. `File > Open Folder...`（または `Ctrl+K Ctrl+O`）
3. `HTD-Official` フォルダを選択
4. **「信頼します」** をクリック

#### 画面の見方

VS Code で開くと左側に **エクスプローラー** が表示され、リポジトリ全体のファイル構成がツリーで見えます。

```
HTD-Official
├── data/            ← ここが編集対象
│   ├── updates/
│   ├── products/
│   ├── blog/
│   ├── members/
│   └── about.json
├── scripts/         ← ビルドスクリプト（基本触らない）
├── css/
├── js/
├── index.html       ← 自動生成（直接編集しない）
├── package.json
└── README.md
```

#### Markdown ファイルの編集

1. エクスプローラーで `data/` → `updates/`（または `products/` / `blog/`）→ 目的のスラグフォルダを展開
2. `index.md` をクリックして開く
3. 編集が完了したら `Ctrl+S` で保存

**入力のヒント:**
- `---` で囲まれた部分が YAML frontmatter（タイトル・日付などの設定）
- 本文は通常の Markdown 形式で記述
- 編集中は `Ctrl+Shift+V` でプレビュー表示

#### VS Code 内蔵ターミナルでビルドする

VS Code のターミナル機能を使うと、エディタから離れずにビルドできます。

1. `Ctrl+」（バッククォート）` または `Terminal > New Terminal`
2. ターミナルが開いたら以下のコマンドを実行:

```bash
npm run build
```

3. エラーが出た場合はターミナルに表示されるので、該当ファイルを修正して再度ビルド

#### VS Code 内蔵の Git 操作

左側の **ソース管理** アイコン（`Ctrl+Shift+G`）をクリックすると、変更したファイルの一覧が表示されます。

1. 変更したファイルの横の `+` をクリック → ステージング
2. 上部のメッセージ欄にコミットメッセージを入力
3. `✓` ボタンをクリック → コミット
4. 下部の `...` から `プッシュ` を選択 → GitHub に反映

ターミナルが苦手な場合でも、VS Code の UI だけで基本的な Git 操作が完結します。

#### 推奨拡張機能

| 拡張機能 | 用途 | 入れ方 |
|---|---|---|
| **YAML** (Red Hat) | YAML frontmatter のバリデーション・シンタックスハイライト | 左側の拡張機能アイコン → `YAML` で検索 |
| **Markdown Preview GitHub Styling** | プレビューを見やすく | 同様に検索 |
| **GitLens** | ファイルの変更履歴をエディタ上で確認 | 同様に検索 |
| **Japanese Language Pack** | VS Code のメニューを日本語化 | 同様に検索して `Ctrl+Shift+P` → `Configure Display Language` で切替 |

拡張機能のインストールは左側のアクティビティバー（縦のアイコン列）の **拡張機能**（四角が4つのアイコン、`Ctrl+Shift+X`）をクリックし、検索ボックスに名前を入力して **インストール** をクリックします。

## ライセンス

[MIT](LICENSE)
