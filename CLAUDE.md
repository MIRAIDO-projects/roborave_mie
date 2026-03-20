# RoboRave Mie エージェント統一ガイド

**プロジェクト:** RoboRave Mie -- 国際ロボット競技大会 公式Webサイト
**ホスト:** Cloudflare Pages (SSG)
**言語:** 日本語 (lang="ja")
**最終更新:** 2026-03-20
**Version:** 1.0

---

## プロジェクト概要

### RoboRave Mie とは

三重県で開催される国際ロボット競技大会。小学生 - 高校生を対象に、自律型ロボットによる3つの競技を実施する。

| 競技 | 概要 |
|------|------|
| a-MAZE-ing Challenge | 自律走行による迷路コース走破 |
| SumoBot Challenge | 自律ロボット相撲 (直径122cm土俵) |
| Line Following Challenge | ライントレース + ボール運搬 |

### 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Astro (SSG, Astroコンポーネントのみ) | 5.16.9 |
| スタイリング | Tailwind CSS (@astrojs/tailwind) | 6.0.2 |
| CMS | microCMS JS SDK | 3.2.0 |
| 3D/WebGL | Three.js | 0.182.0 |
| アニメーション | GSAP | 3.14.2 |
| スムーススクロール | Lenis | 1.3.17 |
| ホスティング | Cloudflare Pages | - |

**重要: React は使用していない。** 全てのページ・コンポーネントは `.astro` ファイルで実装されている。`src/app/` ディレクトリは存在しない。

### デザイン仕様

- ベースカラー: ホワイト
- アクセントカラー: スカイブルー (#0EA5E9) + オレンジ (#FF7700)
- フォント: Inter (sans), Orbitron (mono/display)
- スタイル: Neo-Brutalist (ハードシャドウ)
- スクロールアニメーション: IntersectionObserver + Lenis

---

## ファイル構成

```
roborave_mie/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── CLAUDE.md
├── public/
│   ├── favicon.svg, logo.png
│   ├── images/
│   ├── amazing-icon.jpg, amazing-red-icon.jpg, amazing-green-icon.jpg, amazing-detail-icon.png
│   ├── sumobot-icon.jpg, sumobot-red-icon.jpg, sumobot-detail-icon.jpg
│   ├── line-following-icon.jpg, line-following-red-icon.jpg, line-following-detail-icon.jpg
└── src/
    ├── env.d.ts
    ├── assets/                    -- SVG (background.svg, astro.svg)
    ├── lib/
    │   └── microcms.ts            -- CMS クライアント (Blog + Competition 型定義 + Mock)
    ├── utils/
    │   └── jsonLdGenerator.ts     -- JSON-LD 構造化データ生成
    ├── layouts/
    │   └── Layout.astro           -- 唯一のレイアウト (Navigation + Footer + CookieBanner + Lenis)
    ├── components/                -- 全て Astro コンポーネント
    │   ├── Navigation.astro       -- グローバルナビゲーション
    │   ├── Hero.astro             -- ヒーローセクション
    │   ├── Competitions.astro     -- 競技一覧セクション
    │   ├── BlogSection.astro      -- ブログ/ニュースセクション
    │   ├── AboutSection.astro     -- About セクション
    │   ├── WorkshopSection.astro  -- ワークショップセクション
    │   ├── ContactSection.astro   -- お問い合わせセクション
    │   ├── BannerSection.astro    -- バナーセクション
    │   ├── Footer.astro           -- フッター
    │   ├── Welcome.astro          -- ウェルカム表示
    │   ├── SEO.astro              -- SEO メタタグ
    │   ├── SEO/Head.astro         -- <head> 内 SEO 要素
    │   ├── CookieBanner.astro     -- Cookie 同意バナー
    │   ├── ThreeScene.astro       -- Three.js 3D シーン
    │   └── Three/AccessibleCanvas.astro -- アクセシブルな 3D Canvas
    ├── pages/
    │   ├── index.astro            -- ホーム (Hero, Competitions, Blog, About, Workshop, Contact, Banner)
    │   ├── workshop.astro         -- ワークショップ詳細
    │   ├── privacy-policy.astro   -- プライバシーポリシー
    │   ├── terms-of-use.astro     -- 利用規約
    │   ├── legal.astro            -- 特定商取引法表記
    │   ├── thanks.astro           -- フォーム送信完了
    │   ├── 404.astro              -- 404 エラー
    │   ├── news/index.astro       -- ニュース一覧
    │   ├── blog/[blogId].astro    -- ブログ記事詳細 (動的)
    │   └── competitions/[competitionId].astro -- 競技詳細 (動的)
    └── styles/
        └── global.css             -- グローバルスタイル
```

---

## microCMS 連携

### エンドポイント

| エンドポイント | 用途 | フィルター |
|---------------|------|-----------|
| `blogs` | ブログ記事 | `targetSites[contains]mie` で三重大会の記事のみ取得 |
| `competitions` | 競技情報 | なし |

### 環境変数

```
MICROCMS_SERVICE_DOMAIN  -- microCMS サービスドメイン
MICROCMS_API_KEY         -- microCMS API キー
```

### Mock フォールバック

API キーが未設定・API エラー時は自動的にモックデータを返す。ビルドが止まらない設計。

---

## 大原則

### Git ルール (必須・最優先)

- 実装開始前に必ず現在の状態をコミットする
  -> `git add -A && git commit -m "chore: before [作業内容]"`
- 実装完了後にコミットする
  -> `git add -A && git commit -m "feat/fix: [実装内容の要約]"`
- .env・シークレット系は絶対にコミットしない (.gitignore を必ず確認する)
- コミットなしの大規模変更は禁止

### ワークフロー

```
実装依頼 -> implementer -> reviewer -> (重大な指摘があれば) implementer に差し戻し -> 完了
```

- コードの新規作成・編集・修正は implementer エージェントに委譲する
- implementer が実装完了したら、必ず reviewer エージェントでレビューする
- 重大な指摘がある場合は implementer に差し戻す
- 軽微・提案のみの場合は完了とみなしてよい
- 軽微な修正は implementer -> reviewer で完結可

---

## Reviewer チェックリスト

```
- npm run build 成功 (エラー・警告なし)
- npm run preview で全ページ表示確認
- Lighthouse 90+ (Performance, SEO, Accessibility, Best Practices)
- LCP < 2.5s, CLS < 0.1, INP < 200ms
- microCMS API 応答確認 (Mock フォールバック動作も)
- ThreeScene: デスクトップ + モバイル Safari
- メタタグ: og:title, og:description, og:image 全ページ
- JSON-LD 構文チェック
- robots.txt, 404, Cookie バナー, フォーム -> /thanks 遷移
- Git コミット整合性
```

---

## 注意事項

- **React は使わない** -- 全て Astro コンポーネントで実装すること
- **`src/app/` は存在しない** -- コンポーネントは `src/components/` に配置
- **shadcn/ui, Radix, MUI は未導入** -- Tailwind CSS でスタイリング
- **Three.js はライブラリ直接使用** -- React Three Fiber / drei は未導入
- **フォントは Inter + Orbitron** -- 追加フォントが必要な場合は相談

---

## デプロイメント

```bash
npm run dev       # localhost:4321
npm run build     # dist/ 出力
npm run preview   # ビルド結果確認
```

Cloudflare Pages: GitHub main ブランチ push -> 自動デプロイ
