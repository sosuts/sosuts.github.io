---
title: "NAND2Tetris #1"
meta_title: "NAND2Tetris #1"
description: "Project 1 of NAND2Tetris"
---

## 1.1 ブール代数

- ブール関数は入力と出力を全て列挙できる（真理値表, truth table）
- ブール代数では交換法則(Commutative law)、結合法則(Associative law)、分配法則(Distributive law)が成り立つ
  - 分配法則はANDとORどちらでも成り立つことが特徴
- 代数的な操作と入力とtruth tableを使えば、一見複雑な関数の代替表現が見つかるかもね

## 1.2 ブール関数の合成

- 実際の回路設計ではブール代数の場合とは異なり、truth tableから関数を見つけることが必要
  - Truth tableで出力が1になる入力の組み合わせをORで繋げる
- 最も短いboolean expressionを見つけることは一般的に困難
- 全てのブール関数はAND, OR, NOTの組み合わせで表現できる
  - 実際には、全てのブール関数はAND, NOTの組み合わせで表現できる
    - (x OR y) = NOT(NOT(x) AND NOT(y))
  - さらに全てのブール関数はNANDの組み合わせで表現できる
    - NOT(x) = (x NAND x)
    - (x AND y) = NOT(x NAND y)

## 1.3 論理ゲート

NAND2Tetrisのプロジェクトでは、NANDゲートを基本として、他の論理ゲートを作成する。論理ゲートの中身は気にせず、入力と出力だけ考える。

## 1.4 ハードウェア記述言語 (Hardware Description Language)

hdlには色々な種類がある。VerilogとVHDLが有名。NAND2Tetrisでは独自のhdlを使う。
NAND2Tetrisで使うhdlのNotゲートの記述例。

```text
/**
 * Not gate:
 * if (in) out = 0, else out = 1
 */
CHIP Not {
    IN a;
    OUT out;

    PARTS:
      Nand(a=a, b=a, out=out);
}
```

## 1.5 ハードウェアシミュレーション

ソフトの使い方だったからスキップ。

## 1.6 マルチビットパス

大量のビットを扱う方法。複数のビットを1つのエンティティとして考えるとよい。

意味をもつビットの集まりをバス(bus)と呼ぶ。ラテン語で「多くのもの」を意味するとのこと。
一般的にHDLsはバスを扱うために便利な記法をもつ。

```text
/*
 * 2つの16ビットバスを足す
 */
CHIP Add16 {
  IN a[16], b[16];
  OUT out[16];

  PARTS:
    ...
}
```

上で定義したAdd16チップを使い、別のチップを作る例。

```text
/*
 * 3つの16ビットバスを足す
 */
CHIP Add3Way16 {
  IN a[16], b[16], c[16];
  OUT out[16];

  PARTS:
    Add16(a=a, b=b, out=temp);
    Add16(a=temp, b=c, out=out);
}
```
