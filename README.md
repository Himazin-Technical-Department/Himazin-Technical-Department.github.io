# 暇人技術部 公式ホームページ

Himazin Technical Department の公式ホームページです。[GitHub Pages](https://pages.github.com/) で公開されています。

## 構成

```
├── index.html             # メインページ (SPA)
├── HTD.svg                # サイトアイコン
├── logo.svg               # ロゴ
├── about.json             # 団体説明 (Markdown形式)
├── css/style.css          # スタイルシート
├── js/script.js           # アプリケーションロジック
├── updates/               # お知らせ
│   ├── registry.json      # 一覧データ
│   └── {slug}/
│       ├── meta.json      # メタデータ
│       └── index.md       # Markdown本文
├── products/              # プロダクト
│   ├── registry.json
│   └── {slug}/
│       ├── meta.json
│       ├── index.md
│       └── icon.svg       # プロダクトアイコン
├── blog/                  # ブログ
│   ├── registry.json
│   └── {slug}/
│       ├── meta.json
│       ├── index.md
│       └── (画像ファイル)
├── data/members.json      # メンバー情報
├── LICENSE                # MIT License
└── README.md
```

## コンテンツの追加方法

### お知らせ / プロダクト / ブログ

1. `{section}/{slug}/` フォルダを作成
2. `meta.json` と `index.md` を配置
3. `{section}/registry.json` にエントリを追加

`index.md` は通常の Markdown で記述します。画像も配置可能です。Markdown のレンダリングには [marked.js](https://marked.js.org/) を使用しています。

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
    "icon": "products/{slug}/icon.svg",
    "url": "https://...",
    "urlLabel": "GitHub",
    "detailLabel": "詳しく見る"
  }
  ```

### メンバー

`data/members.json` を編集します。

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

- **SPA ルーティング** — ハッシュベース (`#home`, `#updates`, `#products`, `#blog`, `#members`)
- **Markdown レンダリング** — marked.js による変換
- **検索** — Ctrl+K / ⌘K または検索ボタンから全コンテンツを横断検索

## ローカルでの確認

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。`fetch()` を使用しているため `file://` では動作しません。

## ライセンス

[MIT](LICENSE)
