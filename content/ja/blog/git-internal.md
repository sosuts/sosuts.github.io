---
title: "Gitの内部構造"
meta_title: "Internal structure of Git"
image: "/images/git.jpg"
categories: ["Git", "Tech"]
draft: false
published: "2024-08-01"
author: "Sosuke Utsunomiya"
summary: "過去の自分に向けたGitの説明"
# lastmod is fetched from git and configured in hugo.toml
---
{{< notice "info" >}}
このブログ記事は、[Creative Commons Attribution Non Commercial Share Alike 3.0 license](https://creativecommons.org/licenses/by-nc-sa/3.0/)の下でライセンスされた[Git internals](https://git-scm.com/book/ja/v2)を参考に書いています。
{{< /notice >}}

{{< toc >}}

## 記事の内容

Gitよくわからん、という時期は誰しもあるはず。自分はGitの内部について調べたら、より理解が進んだ気がする。当時の自分が知りたかったことをここにまとめる。

Gitのコマンドは使えるけどよくわからんなーってとき、以下の動画を見てからPro Gitを読んだら理解が深まった。
言葉で説明するよりも、実際にコマンドを打ってみる方が理解が早くなる。もっと早くそうすればよかった。

{{< youtube lG90LZotrpo >}}

## 今の理解

- Gitはキーバリュー型のデータ構造。コミット、ファイルの内容、そしてディレクトリ構成に一意なID(SHA-1)を割り当ててblobとして管理している。
- ステージングとは、なんらかの変更をインデックスに追加すること。インデックスは、ユーザーが見ているものとblobの中間状態のイメージ。

---

### Gitの内側 - 配管(Plumbing)と磁器(Porcelain)

Gitのコマンドには、配管(Plumbing)と磁器（Porcelain）という2つの種類がある。Plumbingは、Gitの内部構造を直接操作する。Porcelainはユーザーが使いやすいようにラップされたコマンドだと思えばいい。

普通にLow-level commandとHigh-level commandと読んでくれたらわかりやすいんだけど、なんでこん名前にしてるんだろ。

### .gitの実体

まずローカルリポジトリを作成。
```fish
mkdir git-internal && cd git-internal
git init
```

.gitの中身をみてみると、以下のようになっている。Gitの構造を理解するために必要なのは、`HEAD`、`index`、`objects`、`refs`だけ。

```fish
ll .git

-rw-r--r-- 1 sosuts sosuts   21 Aug  9 02:47 HEAD
drwxr-xr-x 2 sosuts sosuts 4.0K Aug  9 02:47 branches/
-rw-r--r-- 1 sosuts sosuts   92 Aug  9 02:47 config
-rw-r--r-- 1 sosuts sosuts   73 Aug  9 02:47 description
drwxr-xr-x 2 sosuts sosuts 4.0K Aug  9 02:47 hooks/
drwxr-xr-x 2 sosuts sosuts 4.0K Aug  9 02:47 info/
drwxr-xr-x 4 sosuts sosuts 4.0K Aug  9 02:47 objects/
drwxr-xr-x 4 sosuts sosuts 4.0K Aug  9 02:47 refs/
```

`HEAD`は現在gitがいる場所を示す。もしmainブランチにいる場合、`HEAD`は`ref: refs/heads/main`という内容になっている。コミットに移動(checkout)すると、`HEAD`はコミットIDに変わる。

`index`にはgitが管理しているファイルの情報が入っている。`objects`には、blobやtree、commitなどのオブジェクトが保存されている。`refs`には、ブランチやタグの情報が保存されている。
