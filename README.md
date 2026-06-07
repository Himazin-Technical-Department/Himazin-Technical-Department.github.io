# 暇人技術部 公式ホームページ

Himazin Technical Department の公式ホームページです。[GitHub Pages](https://pages.github.com/) で公開されています。

## 構成

```
├── index.html             # トップページ (自動生成)
├── HTD.svg                # サイトアイコン
├── logo.svg               # ロゴ
├── 404.html               # カスタム404ページ
├── robots.txt             # クローラ設定
├── sitemap.xml            # サイトマップ (自動生成)
├── package.json           # ビルドスクリプト
├── scripts/
│   ├── generate-registry.js  # registry.json / sitemap.xml 生成
│   └── build.js              # HTMLページ生成 (マルチページ化)
├── css/style.css          # スタイルシート
├── js/script.js           # 検索・メニュー制御
├── data/                  # コンテンツデータ (ソース)
│   ├── about.json         # 団体説明 (Markdown形式)
│   ├── about.json
│   ├── members/
│   │   └── members.json   # メンバー情報
│   ├── updates/           # お知らせ
│   │   └── {slug}/
│   │       ├── meta.json
│   │       └── index.md
│   ├── products/          # プロダクト
│   │   └── {slug}/
│   │       ├── meta.json
│   │       ├── index.md
│   │       └── icon.svg   # プロダクトアイコン
│   └── blog/              # ブログ
│       └── {slug}/
│           ├── meta.json
│           ├── index.md
│           └── (画像ファイル)
├── updates/               # お知らせページ (自動生成)
│   ├── index.html
│   └── {slug}/index.html
├── products/              # プロダクトページ (自動生成)
│   ├── index.html
│   └── {slug}/index.html
├── blog/                  # ブログページ (自動生成)
│   ├── index.html
│   └── {slug}/index.html
├── members/               # メンバーページ (自動生成)
│   └── index.html
├── LICENSE                # MIT License
└── README.md
```

## コンテンツの追加方法

### お知らせ / プロダクト / ブログ

1. `data/{section}/{slug}/` フォルダを作成
2. `meta.json` と `index.md` を配置
3. 以下のコマンドで全ページを自動生成:
   ```bash
   npm run build
   ```

`index.md` は通常の Markdown で記述します。画像も配置可能です。Markdown のレンダリングには [markdown-it](https://github.com/markdown-it/markdown-it) を使用しています。

**meta.json の形式:**

- **お知らせ / ブログ:**

  ```json
  {
    "title": "記事タイトル",
    "date": "2026-06-05",
    "author": "著者名",
    "excerpt": "一覧に表示される短い説明",
    "tags": ["タグ1", "タグ2"]
  }
  ```

- **プロダクト:**

  ```json
  {
    "title": "プロダクト名",
    "date": "2026-06-05",
    "excerpt": "説明",
    "icon": "data/products/{slug}/icon.svg",
    "url": "https://...",
    "urlLabel": "GitHub",
    "detailLabel": "詳しく見る"
  }
  ```

### メンバー

`data/members/members.json` を編集します。

```json
{
  "name": "名前",
  "type": "developer",
  "role": "役割",
  "description": "説明",
  "icon": "アイコン画像URL",
  "links": [
    { "label": "GitHub", "url": "https://github.com/..." }
  ]
}
```

`type` は `developer`（開発者・青）、`creator`（クリエイター・橙）、`supporter`（サポーター・緑）の3種類です。

## 機能

- **静的マルチページ** — 全ページが個別のHTMLファイル、SEOフレンドリー
- **Markdown レンダリング** — ビルド時に markdown-it で変換、コンテンツが直接HTMLに含まれる
- **検索** — Ctrl+K / ⌘K または検索ボタンから全コンテンツを横断検索

## ローカルでの確認

```bash
npm run build
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。

## ライセンス

[MIT](LICENSE)
