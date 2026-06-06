## 開発環境の整備

暇人技術部では、部員間で統一された開発環境を整備するため、Docker を用いた開発環境を構築しました。

### 主な構成

- **Node.js / TypeScript** - メインの開発言語
- **GitHub Actions** - CI/CD パイプライン
- **ESLint + Prettier** - コード品質管理
- **Docker** - 環境の統一

### Docker セットアップ例

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]
```

### メリット

1. 新メンバーがすぐに開発を始められる
2. 環境差異によるバグを防止
3. 本番環境との一貫性を確保

これにより、誰でも同じ環境で開発を始められるようになりました。
