# 暇人技術部 公式ホームページ

Himazin Technical Department の公式ホームページです。[GitHub Pages](https://pages.github.com/) で公開されています。

[![Build Status](https://img.shields.io/github/actions/workflow/status/Himazin-Technical-Department/Himazin-Technical-Department.github.io/deploy.yml?branch=main&label=Build)](https://github.com/Himazin-Technical-Department/Himazin-Technical-Department.github.io/actions/workflows/deploy.yml)

## 目次

1. [はじめに：このリポジトリの仕組み](#はじめにこのリポジトリの仕組み)
2. [はじめての方へ：全体の流れ](#はじめての方へ全体の流れ)
3. [完全初心者向けガイド：はじめての記事公開まで](#完全初心者向けガイドはじめての記事公開まで)
4. [必要なもの](#必要なもの)
5. [Git のインストール](#git-のインストール)
6. [Node.js のインストール](#nodejs-のインストール)
7. [リポジトリをローカルに取得する](#リポジトリをローカルに取得する)
8. [ディレクトリ構成](#ディレクトリ構成)
9. [コンテンツの追加・編集](#コンテンツの追加編集)
   - [お知らせ / ブログを追加する](#お知らせ--ブログを追加する)
   - [プロダクトを追加する](#プロダクトを追加する)
   - [メンバーを編集する](#メンバーを編集する)
   - [トップページの説明文を編集する](#トップページの説明文を編集する)
   - [サイト全体のデザインを編集する](#サイト全体のデザインを編集する)
10. [ローカルでビルドして確認する](#ローカルでビルドして確認する)
11. [変更を公開する（push する）](#変更を公開するpush-する)
12. [プルリクエストを使った運用](#プルリクエストを使った運用)
13. [自動ビルド・デプロイの仕組み](#自動ビルドデプロイの仕組み)
14. [よくある質問・トラブルシューティング](#よくある質問トラブルシューティング)

## はじめに：このリポジトリの仕組み

このサイトは **静的サイトジェネレーター** です。

- 記事は `data/` フォルダ内の **Markdown ファイル（`index.md`）** の YAML frontmatter にタイトル・日付などを、本文に内容を書いて管理します。
- `npm run build` を実行すると、それらのデータから自動的に `index.html` や各ページの HTML が生成されます。
- 生成された HTML を GitHub Pages で公開しています。
- **GitHub Actions** により、`main` ブランチにプッシュすると自動でビルド → デプロイまで行われます。

つまり、新しい記事を追加したい場合は `data/` 以下にファイルを作成し、Git でプッシュするだけでサイトが更新されます。

## はじめての方へ：全体の流れ

このサイトの編集は、以下の5ステップで行えます。難しいことはありません。

```
1.  Git と Node.js をインストール  ← 最初に1回だけ
2.  リポジトリをダウンロード（クローン）  ← 最初に1回だけ
3.  記事やプロダクトを追加・編集  ← 更新のたびに
4.  ローカルでプレビュー確認  ← 必要に応じて
5.  GitHub にアップロード（プッシュ）  ← 公開したいとき
```

各ステップの詳しい手順は以下の目次から該当するセクションに飛んでください。
「パソコン操作に自信がない…」という方でも、このドキュメントの手順通りに進めれば大丈夫です。
わからない用語が出てきても飛ばして構いません。実際に手を動かしながら覚えていきましょう。

## 完全初心者向けガイド：はじめての記事公開まで

このセクションでは、**「ターミナルって何？」という方でも迷わないよう**、1つずつ手順を説明します。

> すでに Git や Node.js をインストール済みの方は、このセクションは飛ばして「リポジトリをローカルに取得する」から読んでください。

### Step 0: 用意するもの

| 必要なもの | 説明 |
|---|---|
| **パソコン** | Windows / Mac / Linux どれでも |
| **インターネット接続** | ソフトウェアのダウンロードと GitHub へのアップロードに使います |
| **30分程度の時間** | 初回セットアップにかかる目安です。2回目からは1記事5分で追加できます |

わからない単語が出てきても、気にせず先に進んでください。手順通りに打ち込めば動きます。

テキストエディタ（文章を書くソフト）はまだ入れていなければ後で大丈夫です。→ 詳しくは「[推奨ソフトウェア](#推奨ソフトウェア)」セクションを参照

### Step 1: Git をインストールする

Git は「ファイルの変更履歴を管理する道具」です。以下の手順で入れましょう。

<details>
<summary><b>Windows の場合（クリックして開く）</b></summary>

1. [Git公式サイト](https://git-scm.com/download/win) にアクセス
2. 「Click here to download」と書かれたリンクをクリック（自動的にダウンロードが始まります）
3. ダウンロードした `.exe` ファイルをダブルクリック
4. 表示された画面はすべて「Next」をクリック（デフォルト設定のままで OK）
5. 最後に「Install」をクリック
6. インストールが終わったら、スタートメニューを開いて **PowerShell** と入力
7. 表示された PowerShell を開き、以下を打ち込んで Enter:
   ```
   git --version
   ```
   → `git version 2.xx.x` と表示されれば成功です！
</details>

<details>
<summary><b>Mac の場合（クリックして開く）</b></summary>

1. 画面左上のメニューバーから **⌘ → ターミナル**（または **スポットライト検索** で「ターミナル」と検索）を開く
2. 以下のどちらかを打ち込んで Enter:
   ```
   brew install git
   ```
   または
   ```
   xcode-select --install
   ```
3. 確認:
   ```
   git --version
   ```
</details>

<details>
<summary><b>Linux (Ubuntu) の場合（クリックして開く）</b></summary>

1. ターミナルを開く
2. 以下を1行ずつ打ち込んで Enter:
   ```
   sudo apt update
   sudo apt install git
   ```
3. 確認:
   ```
   git --version
   ```
</details>

**Git の初期設定**（インストールが終わったら）：

ターミナル（PowerShell）で以下の2行を実行します。`" "` の中は自分の名前に変えてください。

```
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"
```

例:
```
git config --global user.name "川上"
git config --global user.email "kawakami@example.com"
```

> この設定は最初の1回だけやれば OK です。GitHub に登録した名前・メールアドレスと同じにしておくと後からわかりやすいです。

→ 詳しくは「[Git のインストール](#git-のインストール)」セクションを参照（各 OS の詳細手順あり）

### Step 2: Node.js をインストールする

Node.js は「ビルド（HTML を自動生成する処理）を実行するための道具」です。

1. [Node.js公式サイト](https://nodejs.org/) にアクセス
2. 左側に表示されている **「20.x LTS」** と書かれたボタンをクリック（LTS = 安定版という意味です）
3. ダウンロードしたインストーラーを実行し、画面の指示に従って「Next」を押していく
4. 最後に「Install」をクリック
5. 確認: ターミナル（PowerShell）で以下を打ち込んで Enter:
   ```
   node --version
   ```
   → `v20.x.x` と表示されれば成功です！

#### Windows の方はここをチェック！

Windows で `npm run build` を実行したときに、以下のようなエラーが出ることがあります。

```
npm ERR! ... このシステムではスクリプトの実行が無効になっているため...
```

これは **PowerShell の実行ポリシー** が原因です。以下の手順で直せます。

1. スタートメニューで **PowerShell** と検索
2. 右クリック → **「管理者として実行」** を選択
3. 以下のコマンドを1行打ち込んで Enter:
   ```
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   ```
4. `Y` と打ち込んで Enter（「はい」の意味です）
5. 確認:
   ```
   Get-ExecutionPolicy
   ```
   → `RemoteSigned` と表示されれば OK

これでエラーは出なくなります。

→ 詳しくは「[Node.js のインストール](#nodejs-のインストール)」セクションを参照

### Step 3: リポジトリをダウンロードする（クローン）

リポジトリ（このサイトのデータが置いてある場所）を自分のパソコンにダウンロードします。

1. **GitHub アカウントを作る**（まだの場合）
   - [GitHub](https://github.com/) にアクセス
   - 「Sign up」からアカウント作成（メールアドレス認証が必要です）
   - 作成後、部の管理者にアカウント名を伝えてメンバー追加してもらう

2. **ターミナル（PowerShell）を開く**
   - どこでもいいので、画面上で右クリック → 「ターミナルを開く」、または PowerShell を起動

3. **以下のコマンドを1行ずつ打ち込む**（コピー＆ペーストで OK）:
   ```
   git clone https://github.com/Himazin-Technical-Department/Himazin-Technical-Department.github.io.git
   cd Himazin-Technical-Department.github.io
   npm install
   ```
   - `git clone ...` : リポジトリをダウンロード（10〜30秒かかります）
   - `cd ...` : ダウンロードしたフォルダに移動
   - `npm install` : 必要なパーツ（`markdown-it`）をダウンロード

4. **うまくいったか確認**:
   ```
   dir
   ```
   または（Mac / Linux の場合）:
   ```
   ls
   ```
   ファイルの一覧が表示されれば OK です。

> **以降、新しい記事を追加するときはこの手順（Step 3）は不要です。** 最初の1回だけやれば、次からは Step 4 に進んでください。

→ 詳しくは「[リポジトリをローカルに取得する](#リポジトリをローカルに取得する)」セクションを参照

### Step 4: お知らせを書いてみる

まずは簡単な「お知らせ」を1つ追加してみましょう。

**テンプレートコマンドを使うのがおすすめです。** タイトルや日付などの下書きが自動で作られるので、書き間違いが減ります。

1. ターミナルで以下を実行（`" "` の中は好きなタイトルに変えて OK）:
   ```
   npm run template:updates "はじめての投稿" my-first-post
   ```
   - `template:updates` = お知らせの雛型を作るコマンド
   - `"はじめての投稿"` = 記事のタイトル（`" "` で囲む）
   - `my-first-post` = URL に使う英数字の名前（スラグ）

2. エラーが出なければ、`data/updates/my-first-post/index.md` というファイルが作られています。

   > **ブログの場合は** `template:updates` の代わりに `template:blog` を使います。
   > **プロダクトの場合は** `template:products` を使います。
   > 詳しくは「[テンプレートからの記事作成](#テンプレートからの記事作成npm-run-template)」を参照

3. このファイルを **メモ帳** または **VS Code** で開いてみましょう。
   - VS Code をおすすめします（見た目がわかりやすいので）
   - ファイルをダブルクリックするか、以下のコマンドで開けます:
     ```
     code data/updates/my-first-post/index.md
     ```

   中身はこんな感じです:
   ```markdown
   ---
   title: はじめての投稿
   date: 2026-06-11
   author: 
   excerpt: 
   thumbnail: 
   tags:
   ---

   ここに本文を書きます。
   ```

4. 以下のように書き換えて保存（`Ctrl+S`）してみましょう:
   ```markdown
   ---
   title: はじめての投稿
   date: 2026-06-11
   author: あなたの名前
   excerpt: 初心者でも簡単に投稿できました！
   thumbnail: 
   tags:
     - お知らせ
   ---

   こんにちは！これはテスト投稿です。
   こんなに簡単に記事が書けます。
   ```

> **書き方のルール:** `---` で囲まれた部分がタイトルや日付の設定、その下が本文です。本文は **Markdown** という書き方で、`##` で見出し、`-` でリスト、`**太字**` で太字になります。
>
> 各フィールドの詳しい説明は「[Frontmatter の各フィールド](#frontmatter-の各フィールド)」を参照

### Step 5: プレビューで確認する

書いた内容が正しく表示されるか、自分のパソコンで確認しましょう。

1. **ビルド（HTML を生成）する**:
   ```
   npm run build
   ```
   エラーが出なければ成功です。「Error」と赤い文字が出た場合 → 入力ミスがないか確認（特に `:` の後のスペースなど）

2. **プレビューサーバーを起動する**:
   ```
   python3 -m http.server 8080
   ```
   （Python が入っていない場合は `npx serve .` でも OK）

3. ブラウザを開いてアドレスバーに以下を入力:
   ```
   http://localhost:8080
   ```

4. サイトが表示されたら、画面上部のメニューから「お知らせ」をクリック。「はじめての投稿」が追加されているはずです。

5. 確認が終わったら、ターミナルで `Ctrl+C` を押してサーバーを止めてください。

→ 詳しくは「[ローカルでビルドして確認する](#ローカルでビルドして確認する)」セクションを参照（確認ポイントなど）

### Step 6: 公開する（プッシュ）

確認できたら、インターネット上に公開しましょう。

1. **変更したファイルを確認**:
   ```
   git status
   ```
   変更されたファイルの一覧が表示されます。

2. **すべての変更を「コミット」する**（スナップショットを撮るようなイメージ）:
   ```
   git add -A
   git commit -m "はじめての投稿を追加"
   ```

3. **GitHub にアップロードする**（プッシュ）:
   ```
   git push origin main
   ```
   GitHub のログイン画面が出たら、ユーザー名とパスワード（またはトークン）を入力。

4. **完了！** ブラウザで実際のサイトを開いてみてください。1〜2分で反映されます。

> プルリクエストを使った運用や VS Code での Git 操作は「[変更を公開する（push する）](#変更を公開するpush-する)」「[プルリクエストを使った運用](#プルリクエストを使った運用)」セクションを参照

### Step 7: よくある質問（Q&A）

**Q: 「git」、「node」、「npm」って何？**
コマンドの名前です。細かい意味は気にしなくて大丈夫です。書いてある通りに打ち込めば動きます。

**Q: ターミナル（PowerShell）ってどこにあるの？**
- **Windows**: スタートメニューで `PowerShell` と検索
- **Mac**: アプリケーション → ユーティリティ → ターミナル
- **VS Code の中**: `Ctrl+@` または `Ctrl+`` で VS Code の内蔵ターミナルが開けます（エディタから離れずにコマンドが打てて便利）

**Q: コマンドを打っても「見つかりません」と言われる**
- コマンド名が間違っていないか確認（大文字小文字も含めて）
- Git または Node.js が正しくインストールされているか確認 → Step 1・Step 2 に戻る
- ターミナルを**一度閉じて開き直す**と直ることがあります

**Q: `npm run build` で真っ赤なエラーが出た**
ほとんどの原因は **`index.md` の書き間違い**です。以下のポイントをチェック:
- `title:` の後にスペースがあるか（`title:記事` ✗ → `title: 記事` ✓）
- `---` で正しく囲まれているか
- 日付の形式は `2026-06-11` になっているか
- ファイルを保存したか（`Ctrl+S`）

**Q: 赤いエラーが読めない / 英語で書いてある**
エラー文をそのままコピーして部の Slack/Discord に貼り付けてください。「このエラーが出ました」と聞いてもらえれば誰かが教えてくれます。

**Q: `git push` したら「ユーザー名とパスワード」を聞かれた**
GitHub にログインするための情報です。GitHub のユーザー名とパスワードを入力してください。
パスワードの代わりに **トークン（個人アクセストークン）** が必要な場合もあります。その場合は GitHub の設定画面でトークンを作成して、パスワード欄に貼り付けてください。

**Q: `git push` が「rejected」と表示されて拒否された**
他の誰かが先にプッシュした変更と衝突しています。以下のコマンドで解決できます。
```
git pull
git push origin main
```
それでもダメなら部のメンバーに相談してください。

**Q: 公開したのにサイトに反映されない**
プッシュから実際に公開されるまで **1〜2分** かかります。しばらく待ってからブラウザをリロード（`Ctrl+F5`）してみてください。
それでも反映されない場合は、GitHub のリポジトリページ → **Actions** タブでビルドが成功（✅）しているか確認してください。

**Q: 記事を間違えて公開してしまった！**
慌てる必要はありません。該当の記事を修正して、もう一度 `git add -A → git commit -m "修正" → git push` すれば上書きされます。

**Q: 操作中に「権限がない」と出た**
- Windows: PowerShell を**右クリック → 「管理者として実行」** で開き直してください
- Mac / Linux: コマンドの前に `sudo` を付けてみてください（例: `sudo npm install`）

**Q: どうしてもわからない / 怖くなった**
**遠慮なく部のメンバーに聞いてください！** 画面を共有してもらうのが一番早いです。
ここに書いてあることはすべて、最初は誰でも初心者です。失敗しても何も壊れません。落ち着いてやり直せば大丈夫です。

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

#### Windows での注意点：PowerShell の実行ポリシー

Windows で `npm run` コマンドを実行する際、PowerShell の**実行ポリシー**が `Restricted`（制限付き）になっていると、以下のようなエラーが発生してスクリプトが実行できません。

```
npm ERR! ... このシステムではスクリプトの実行が無効になっているため...
```

このエラーを解決するには、**PowerShell を右クリック →「管理者として実行」** で開き、以下のコマンドを実行してください。

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

表示された確認メッセージには `Y`（はい）と入力します。

**実行ポリシーの確認方法:**
```powershell
Get-ExecutionPolicy
```
→ `RemoteSigned` と表示されれば成功です。これで `npm run build` などのコマンドが正常に動作するようになります。

> 補足: この設定は**現在のユーザーにのみ**適用され、セキュリティ上のリスクはほとんどありません。`RemoteSigned` は「インターネットからダウンロードしたスクリプトには署名が必要」という意味で、自分が書いたスクリプトはそのまま実行できます。
>
> ⚠ 管理者として実行できるアカウントでない場合は、所属する組織の IT 担当者にお問い合わせください。

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

## 自動生成のルール

### テンプレートからの記事作成（`npm run template:*`）

新しいブログ・お知らせ・プロダクトを追加する際、`npm run template:*` コマンドで frontmatter 付きの `index.md` を自動生成できます。

```bash
# ブログ記事
npm run template:blog "記事のタイトル"

# お知らせ
npm run template:updates "お知らせのタイトル"

# プロダクト
npm run template:products "プロダクト名"
```

実行すると `data/{section}/{slug}/index.md` が作成されます。

**slug の自動生成ルール:**
- タイトルを小文字化、英数字とハイフンのみに変換、スペースはハイフンに置換、記号類は除去
- ⚠ **日本語タイトルの場合、自動生成では slug が空になるため、第3引数で明示指定が必須です**

**slug を明示的に指定する場合** は第3引数に渡します:

```bash
npm run template:blog "新機能追加のお知らせ" new-feature-announcement
```

指定しない場合、スクリプトがエラー終了し、第3引数を求めるメッセージが表示されます。

**生成される frontmatter:**
- `title`, `date`（本日）, `author`, `excerpt`, `thumbnail`, `tags` が設定される
- プロダクトの場合は `icon`, `detailLabel` が設定される（`thumbnail` は含まれない）

### サムネイル自動生成

ブログ・お知らせ記事の frontmatter で `thumbnail:` を空欄（値なし）にすると、ビルド時に `thumb-auto.svg` が自動生成されます。

- 生成パス: `data/{section}/{slug}/thumb-auto.svg`
- デザイン: グリッド背景 + 記事タイトルを中央配置
- 条件: `thumbnail` が未設定または空の場合に生成。プロダクトにはサムネイルは付きません。
- frontmatter で `[]` ではなく空文字列になるようパースされるため、`if (!data.thumbnail)` で正しく判定されます。

```yaml
---
title: サンプル記事
thumbnail:      # ← 空欄で thumb-auto.svg が生成される
---
```

### プロダクトアイコン自動生成

プロダクトの frontmatter で `icon:` を空欄にすると、ビルド時に `icon-auto.svg` が自動生成されます。

- 生成パス: `data/products/{slug}/icon-auto.svg`
- デザイン: 単色の幾何学図形（プロダクトごとに異なる形状）
- 画像としての整合性を保つため、プロダクトはサムネイル自動生成の対象外です。

### フロントマターのパース規則

`scripts/frontmatter.js` が Markdown の YAML frontmatter をパースします。

| 状態 | パース結果 | 備考 |
|---|---|---|
| `thumbnail:`（空） | `''`（空文字列） | `if (!data.thumbnail)` が `true` になる |
| `tags:`（空） | `''` → 後続のリスト項目があれば `[]` | 遅延変換される |
| `tags:` なし | `undefined` | 省略時と同じ挙動 |

### スタイル生成規則

`scripts/generate-registry.js`:
- 各セクション（blog / updates / products）の `registry.json` を生成
- サムネイル・アイコンの自動生成を実行
- `sitemap.xml` を生成（`/about/` を含む）

`scripts/build.js`:
- `registry.json` を読み込み HTML を生成
- トップページのカルーセル（featured 順 → updates優先 → 日付順 の上位5件）
- 各詳細ページに `.detail-content` クラスを付与（共通のフォントサイズ・見出しマージンが適用される）
- リンク切れになった古い生成フォルダを自動削除（stale cleanup）

### リンクプレビュー機能

記事内の外部リンクはクライアントサイド JS で OG メタデータを取得し、リッチカードに変換されます。

- **対象:** `http(s)://` で始まる外部リンク（同一サイト内・YouTube は除外）
- **取得:** CORS プロキシ（corsproxy.io / allorigins.win）経由で OG 情報を取得
- **表示:** サムネイル画像（`background-size: cover` 中央配置）＋ タイトル ＋ 説明 ＋ ドメイン
- **フォールバック:** OG 情報が取得できない場合は 🔗 アイコン＋ドメインのみ表示
- **カード挿入位置:** `<p>` タグの外側（ブロック要素によるパース崩れ防止）
- **空の `<p>` 削除:** リンクを非表示にした後、テキストのない `<p>` は自動除去

### CSS 設計規則

- クラスセレクタ主体（タグセレクタは最小限）
- `!important` はリンクプレビューの一部プロパティに限定
- ブレースバランスは常に `depth: 0` に保つ（`@media` クエリの閉じ忘れに注意）
- 汎用クラス: `.section`, `.detail-content`, `.link-preview`
- 各セクション固有: `.section-about`, `.section-detail`

## コンテンツの追加・編集

### お知らせ / ブログを追加する

新しいお知らせやブログ記事を追加する手順です。

#### 手順

1. `data/updates/` または `data/blog/` の中に、**スラグ（URLの一部になる英数字）** を名前としたフォルダを作成します。

   例: 「新メンバー募集」というお知らせの場合
   ```bash
   mkdir -p data/updates/new-member-recruitment
   ```

   **テンプレートコマンドを使うと frontmatter 付きのファイルが自動生成されます（推奨）:**
   ```bash
   npm run template:updates "新メンバー募集"
   # → data/updates/new-member-recruitment/index.md が作成される
   ```

   ブログの場合:
   ```bash
   npm run template:blog "記事タイトル"
   ```

   プロダクトの場合:
   ```bash
   npm run template:products "プロダクト名"
   ```

   **slug の自動生成:** タイトルを小文字化し、英数字とハイフンのみに変換します。
   ⚠ **日本語タイトルは slug が空になるため、第3引数で明示指定してください:**
   ```bash
   npm run template:updates "新メンバー募集" new-member-recruitment
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
   | `thumbnail` | | サムネイル画像のパス。一覧・詳細ページに表示されます（例: `data/blog/my-post/thumb.png`）。空欄（`thumbnail:`）にすると SVG が自動生成されます |
   | `featured` | | トップページのカルーセル表示優先度（数値）。小さいほど優先。設定しない場合はお知らせ > ブログ > 日付順 |

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

**自動生成:** `thumbnail:` のように空欄にすると、`build` 時にグリッド柄の SVG（`thumb-auto.svg`）が自動生成され、サムネイルとして使用されます。手動で画像を用意する手間が省けます。
サムネイルは省略可能で、設定しない場合は今まで通りの表示になります。

トップページのカルーセルには、サムネイルが設定された記事のうち最新5件が表示されます。
表示順は以下の優先度で決まります:

1. `featured` フィールドの数値が小さい順
2. お知らせ（updates）がブログより優先
3. 日付が新しい順

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

3. 必要に応じて `icon.svg` を同じフォルダに配置します（プロダクトカードに表示されるアイコン）。`icon:` を空欄にすると、菱形の SVG アイコンが自動生成されます。

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
  "content": "暇人技術部（Himazin Technical Department）は、技術好きが集まって...\\n\\n## 活動内容\\n\\n- プロダクト開発\\n- 勉強会\\n- ..."
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
2. `thumbnail:` や `icon:` が空の記事に SVG を自動生成
3. `sitemap.xml` を生成
4. 全ページの HTML（`index.html`, `updates/`, `products/`, `blog/`, `members/`, `about/`, `sitemap.xml`）を生成
5. 古い生成フォルダを自動削除（stale cleanup）

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

### ビルドエラーの読み方

#### ローカルでのビルドエラー

`npm run build` を実行したときに発生するエラーの例と対処法です。

**Frontmatter のパースエラー:**
```
Error: Invalid frontmatter in data/blog/example-post/index.md
```

→ `index.md` の冒頭の `---` で囲まれた部分（frontmatter）の構文が間違っています。よくある原因:
- `:` の後ろにスペースがない（`title:記事` → `title: 記事`）
- インデントにタブを使っている（スペースのみ使用）
- 日付の形式が違う（`2024-01-01` が正しい）

**ファイル未存在エラー:**
```
Error: ENOENT: no such file or directory, open 'data/blog/example-post/index.md'
```

→ 参照しているファイルが存在しません。パス名のタイポやファイルの移動・削除が原因です。

**構文エラー（JavaScript/JSON のミス）:**
```
SyntaxError: Unexpected token ...
```

→ `build.js` や `.json` ファイルに文法ミスがあります。エラーが示す行番号を確認してください。

#### GitHub Actions でのビルドエラー

GitHub にプッシュした後のビルドが失敗した場合の確認手順です。

1. リポジトリの **Actions** タブを開く
2. 最新のワークフロー実行（赤い ✗ がついているもの）をクリック
3. 左側のジョブ一覧から失敗したジョブをクリック
4. 表示されたログをスクロールして、赤い背景で「Error」や「FAILED」と書かれている行を探す

**よくある原因と対処:**
| 症状 | 原因 | 対処 |
|------|------|------|
| ビルドステップでエラー | `index.md` の書式ミス、参照ファイル不足 | ローカルで `npm run build` を試す |
| `npm ci` でエラー | `package-lock.json` 未コミット | `package-lock.json` をコミットして再プッシュ |
| デプロイステップでエラー | アーティファクトのパスが間違っている | 設定は `.github/workflows/deploy.yml` を確認 |

> **ヒント:** PR 作成時もビルドが実行されます。✅ がつくまでマージしないことで、本番環境の壊れるリスクを減らせます。

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

### Q: Windows で `npm run build` を実行すると「スクリプトの実行が無効」と怒られる

PowerShell の**実行ポリシー**が原因です。以下の手順で修正できます。

1. **PowerShell を管理者として実行**（スタートメニューで PowerShell と検索 → 右クリック → 「管理者として実行」）
2. 以下のコマンドを実行:
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   ```
3. `Y`（はい）を入力
4. `Get-ExecutionPolicy` で `RemoteSigned` と表示されれば OK

詳しくは「Node.js のインストール」→「Windows での注意点」のセクションを参照してください。

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

#### VS Code 内蔵の Git 操作（詳細）

VS Code の **ソース管理** を使うと、ターミナルを開かずに Git 操作の大半が行えます。

**ソース管理ビューを開く:** 左側アクティビティバーの 「ソース管理」 アイコン（分岐した枝のようなマーク）をクリックするか、`Ctrl+Shift+G` を押します。

##### 変更を確認する

ファイルを編集すると、ソース管理ビューの **「変更」** の下に変更されたファイルが一覧表示されます。

- ファイル名をクリックすると、編集前後の差分（diff）が右側に表示されます
- ファイル名の上にカーソルを置くと表示される `○` アイコンで **変更を破棄**（元に戻す）こともできます

##### ステージングしてコミットする

1. ソース管理ビューの **「変更」** の下に表示されたファイルのうち、コミットしたいファイルの横の `+` をクリック → ステージングされます
2. すべての変更をまとめてステージングするには、**「変更」** の横の `+` をクリック
3. 上部のメッセージ欄にコミットメッセージを入力（例: `お知らせを追加`）
4. `✓` ボタンをクリック → コミット完了

**ヒント:** コミットメッセージは何を変更したか一目でわかる書き方にしましょう。「何を・なぜ」変更したかを簡潔に書くと後で見返したときに助かります。

##### GitHub にプッシュする

コミット後、ソース管理ビューの下部にある `...`（その他の操作）→ **プッシュ** をクリックします。
または、VS Code の左下に表示される「ブランチ名」の横の `↓↑` アイコンをクリックしてもプッシュできます。

プッシュが成功すると、数分後に GitHub Actions が自動でビルドとデプロイを実行します。

##### GitHub から最新を取得する（プル）

他のメンバーが変更をプッシュした場合、ローカルに取り込む必要があります。

- ソース管理ビューの下部 `...` → **プル** をクリック
- または左下の `↓↑` アイコンをクリック

**注意:** プルする前に自分の変更をコミットしておくことを推奨します。コミットしていない変更があるとコンフリクト（衝突）の原因になります。

##### ブランチを作成・切り替える

新しい機能や記事を追加する際は、`main` ブランチから分岐した作業用ブランチを作成するのが安全です。

1. VS Code の左下にある現在のブランチ名（例: `main`）をクリック
2. 上部に表示されるコマンドパレットで **「新しいブランチを作成...」** を選択
3. ブランチ名を入力（例: `add-blog-post`）
4. Enter で作成と同時にそのブランチに切り替わります

**他のブランチに切り替える場合:** 同じく左下のブランチ名をクリックし、切り替え先のブランチ名を選択します。

##### プルリクエストを作成する（VS Code 拡張機能利用）

VS Code に **GitHub Pull Requests** 拡張機能をインストールすると、VS Code 内で PR の作成・レビューが行えます。

1. 左側アクティビティバーに追加される **GitHub** アイコンをクリック
2. **Pull Requests** セクションの `+` をクリック
3. 現在のブランチと PR の情報を入力して作成

拡張機能のインストール: 左側の拡張機能アイコン → `GitHub Pull Requests` で検索 → インストール

##### コンフリクト（競合）を解決する

複数人で同じファイルを編集した場合、プルやマージの際にコンフリクトが発生することがあります。

VS Code はコンフリクトを視覚的に解決するエディタを提供します:

1. コンフリクトが発生したファイルを開く
2. 編集エリアに「現在の変更」「入力側の変更」「結果」の3つの領域が表示されます
3. 採用する変更をクリックして選択（`Accept Current` / `Accept Incoming` / `Accept Both`）
4. 解決後、ファイルを保存してコミット

**コンフリクトを防ぐには:** 作業を始める前に必ずプルして最新の状態にしておきましょう。

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
