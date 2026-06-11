---
title: サイトを大幅にアップデートしました
date: 2026-06-08
author: Mikan_1
excerpt: SEO対策・リンクプレビュー・YouTube埋め込み・記事の自動生成など、様々な機能を追加しました。
tags:
  - お知らせ
  - サイト
  - 技術
---

## サイトアップデートのお知らせ

HTD公式サイトを大幅にアップデートしました！今回の更新で以下の機能が追加されています。

### SEO対策の強化

各ページのナビゲーションリンクを実URLに変更し、検索エンジンが正しくページを認識できるようになりました。これで「暇人技術部 プロダクト」などで検索したときにヒットしやすくなります。

### リンクプレビュー機能

記事内の外部リンクが Zenn や Qiita のようにリッチなカードで表示されるようになりました。例えば以下のようなリンクがカードになります：

https://github.com/Himazin-TD/himamarket

https://flaxia.app

https://zenn.dev/cloudflare/articles/cloudflare-workers-hono-intro

https://qiita.com/tomo_makes/items/d6aa3a4d9b9c8cbb1f19

https://developers.cloudflare.com/workers/

https://www.amazon.co.jp/dp/4814400857

https://note.com/ryosuke_mg/n/n1cf7e4004b26

https://ja.wikipedia.org/wiki/Cloudflare

### YouTube 埋め込み

記事内に YouTube のリンクを書くと自動的にプレーヤーが埋め込まれます。

https://www.youtube.com/watch?v=dQw4w9WgXcQ

### 記事の自動生成

新しいブログ記事を追加するときは `data/blog/<slug>/index.md` に YAML frontmatter を付けて配置するだけで、`npm run build` が HTML・meta.json・registry.json を自動生成します。

### その他の改善

- プロダクト一覧・お知らせ一覧・メンバー一覧が独立したページになりました
- 記事内のURLが自動的にリンクになります
- 外部リンクに ↗ アイコンが表示されるようになりました

これからも HTD をよろしくお願いします！
