---
title: "このホームページについて"
meta_title: "このホームページについて"
description: ""
draft: false
published: "2024-10-10"
author: "Sosuke Utsunomiya"
---

### ホームページを作ったきっかけ

このブログを作ったきっかけは、個人として情報発信をする場所があった方がいいなと思ったからです。これまで名もなきブログ記事やtweetに助けられたことが多々ありますので、自分も誰かを助けられたら嬉しいです。もちろん、自分の学びの記録としても残しておきたい気持ちもあります。のんびりやっていこう～！

### ブログの内容

このブログでは、主に以下の内容を書いていきます。
- ソフトウェア
- データ分析
- 遭遇したトラブルと解決法
- 日常の出来事

### 使用技術

#### SSG

静的サイトジェネレーター[Hugo](https://gohugo.io/)で作成しました。作ってみたら簡単すぎてびっくりしました。

#### デザイン

デザインは[Hugoplate](https://github.com/zeon-studio/hugoplate)をベースに、自分の好みに合わせてカスタマイズしています
[Home画面]({{< relref "../_index.md" >}})は[Academic](https://github.com/HugoBlox/theme-academic-cv)という有名なテーマを参考に、tailwindcssを使ってデザインを変更しています。ダークモード時の色は、[One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)を参考にしています。

#### コード管理とホスティング

ソースコードは[sosuts/sosuts.github.io](https://github.com/sosuts/sosuts.github.io)にあります。ホスティングサービスは[Netlify](https://www.netlify.com/)です。mainブランチにpushすると、自動でビルドして公開されます。
リポジトリがsosuts.github.ioという名前なのは、元々GitHub Pagesでホスティングしていたからです。変えないといけないんですけど、なんとなくそのままにしています。GitHub Pagesでも全然よかったんですが、Netlify functionsを使ったWeb APIを作ろうと思っているので、使用サービスを統一するためにNetlifyにしています。

