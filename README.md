# 暇人技術部 公式ホームページ

Himazin Technical Department の公式ホームページです。

## 構成

```
├── index.html             # メインページ
├── HTD.svg                # サイトアイコン
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
│       └── index.md
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

**meta.json の形式:**

```json
{
  "title": "記事タイトル",
  "date": "2026-06-05",
  "author": "著者名",
  "excerpt": "一覧に表示される短い説明",
  "tags": ["タグ1", "タグ2"],
  "url": "https://..."
}
```

`index.md` は通常の Markdown で記述します。画像も配置可能です。

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

## ローカルでの確認

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。`file://` では動作しません。

## ライセンス

[MIT](LICENSE)
