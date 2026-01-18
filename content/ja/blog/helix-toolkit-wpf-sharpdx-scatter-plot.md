---
title: "HelixToolkit.Wpf.SharpDXで3次元散布図を作成する"
meta_title: "Creating 3D scatter plots with HelixToolkit.Wpf.SharpDX"
image: "/images/image-placeholder.png"
categories: ["Tech", "WPF", "CSharp"]
draft: false
published: "2026-01-19"
author: "Sosuke Utsunomiya"
summary: "WPFとHelixToolkit.Wpf.SharpDXを使い、インタラクティブな3D散布図を作成する方法を解説します。多次元データを可視化するサンプルアプリを例に、大量の点を高速に描画するテクニックを紹介します。"
# lastmod is fetched from git and configured in hugo.toml
---

{{< toc >}}

## はじめに

この記事では、WPFと[Helix Toolkit](https://github.com/helix-toolkit/helix-toolkit)のSharpDX版である`HelixToolkit.Wpf.SharpDX`ライブラリを使用して、インタラクティブな3次元散布図を作成する方法を解説します。

例として、私が作成したOSS [MultiDimensionwScatter](https://github.com/sosuts/MultiDimensionwScatter) を取り上げます。このアプリケーションは、多次元の混合正規分布（GMM）のパラメータを指定し、そこから生成されるサンプル点を3D散布図として可視化するものです。

`HelixToolkit.Wpf.SharpDX`は、DirectXを利用してWPFアプリケーション上で高速な3Dグラフィックスを実現します。特に、数万〜数十万点の大量のデータをリアルタイムに描画する性能に優れており、科学技術計算やデータ分析の可視化ツールとして非常に強力です。

## MultiDimensionwScatterの概要

`MultiDimensionwScatter`は、以下の特徴を持つWPFアプリケーションです。

-   **GMMパラメータの編集**: GUI上で混合正規分布の各コンポーネントの重み、平均ベクトル、共分散行列を直感的に編集できます。
-   **3D散布図のリアルタイム描画**: パラメータに基づいて生成されたサンプル点を、`HelixToolkit.Wpf.SharpDX`を使って3D空間に高速に描画します。ユーザーはマウス操作で自由に視点を変えられます（回転、ズーム、パン）。
-   **2D射影の表示**: 3D散布図と同時に、XY、XZ、YZ平面への2D射影を画像として表示し、データの分布を多角的に確認できます。
-   **補助的な表示**: 座標軸や、データの中央を示す半透明の平面などを表示し、空間認識を助けます。

## HelixToolkit.Wpf.SharpDXを使った3次元散布図の実装

ここからは、`MultiDimensionwScatter`の実装を例に、`HelixToolkit.Wpf.SharpDX`で3D散布図を作成する具体的な手順を解説します。

### 1. プロジェクトのセットアップ

まず、WPFプロジェクトを作成し、NuGetパッケージマネージャから`HelixToolkit.Wpf.SharpDX`をインストールします。

```powershell
Install-Package HelixToolkit.Wpf.SharpDX
```

### 2. 3Dビューポートの準備 (XAML)

次に、メインウィンドウのXAMLに3Dシーンを表示するための`Viewport3DX`コントロールを配置します。

`MainWindow.xaml`では、以下のように`Viewport3DX`を定義しています。

```xml
<Window x:Class="MultiDimensionwScatter.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:sdx="http://helix-toolkit.org/wpf/SharpDX"
        Title="3D Gaussian Mixture Scatter"
        Height="700" Width="1300">
    <Grid>
        <!-- ... ColumnDefinitions ... -->

        <sdx:Viewport3DX x:Name="Viewport"
                         Grid.Column="0"
                         ShowCoordinateSystem="True"
                         ShowViewCube="True"
                         ZoomExtentsWhenLoaded="True"
                         EffectsManager="{Binding EffectsManager}">
            
            <!-- カメラの設定 -->
            <sdx:Viewport3DX.Camera>
                <sdx:PerspectiveCamera Position="10,10,10" LookDirection="-10,-10,-10" UpDirection="0,1,0" />
            </sdx:Viewport3DX.Camera>

            <!-- 光源の設定 -->
            <sdx:DirectionalLight3D Direction="-1,-1,-1" Color="White" />

            <!-- 散布図の点を表示するモデル -->
            <sdx:PointGeometryModel3D x:Name="ScatterModel"
                                      Size="1.5 1.5"
                                      Figure="Ellipse"
                                      Color="White" />
            
            <!-- 軸や壁などの補助的なモデル -->
            <sdx:LineGeometryModel3D x:Name="AxisXModel" Color="Red" Thickness="1.0" />
            <sdx:LineGeometryModel3D x:Name="AxisYModel" Color="LimeGreen" Thickness="1.0" />
            <sdx:LineGeometryModel3D x:Name="AxisZModel" Color="DodgerBlue" Thickness="1.0" />
            <sdx:MeshGeometryModel3D x:Name="WallXModel" IsTransparent="True" CullMode="None" />
            <!-- ... WallY, WallZ ... -->

        </sdx:Viewport3DX>

        <!-- ... 右側の操作パネル ... -->
    </Grid>
</Window>
```

-   `sdx:Viewport3DX`: 3Dシーンのレンダリング領域です。`ShowCoordinateSystem`や`ShowViewCube`で補助的なUIを表示できます。
-   `sdx:PerspectiveCamera`: 視点を定義します。`Position`、`LookDirection`、`UpDirection`でカメラの位置と向きを決めます。
-   `sdx:DirectionalLight3D`: シーンを照らす光源です。これがないとモデルは真っ黒に表示されます。
-   `sdx:PointGeometryModel3D`: 散布図の点を描画するためのモデルです。`Size`で点の大きさ、`Figure`で点の形状（円、四角など）を指定します。

### 3. 点群データの生成と表示 (C#)

XAMLでビューの骨格を作ったら、次はC#のコードビハインド（またはViewModel）で実際に描画するデータを準備します。

`MultiDimensionwScatter`では、`BtnGenerate_Click`イベントハンドラ内でサンプル点を生成し、`ScatterModel`に渡しています。

```csharp
// MainWindow.xaml.cs

private void BtnGenerate_Click(object sender, RoutedEventArgs e)
{
    // ... パラメータの取得と検証 ...

    var points = new Vector3Collection();
    var colors = new Color4Collection();
    
    var geometry = new PointGeometry3D
    {
        Positions = points,
        Colors = colors
    };

    // ScatterModelのGeometryに設定
    ScatterModel.Geometry = geometry;

    // 各コンポーネントのパラメータに基づいてサンプルを生成
    foreach (var p in ComponentParams)
    {
        // ... (Cholesky分解などを用いて)多変量正規分布に従うサンプル点を生成 ...
        // var samples = GenerateSamples(p.Mean, p.Covariance, p.SampleCount);

        foreach (var sample in samples)
        {
            points.Add(new Vector3((float)sample[0], (float)sample[1], (float)sample[2]));
            colors.Add(p.Color.ToColor4()); // コンポーネントごとに色分け
        }
    }
    
    // UIスレッドでGeometryの更新を通知
    ScatterModel.Geometry.UpdateVertices();
}
```

重要なポイントは以下の通りです。

1.  **`PointGeometry3D`オブジェクト**: 点群の位置(`Vector3Collection`)と色(`Color4Collection`)を保持します。
2.  **データをコレクションに追加**: `foreach`ループの中で、生成したサンプル点の座標を`points`コレクションに、対応する色を`colors`コレクションに追加していきます。
3.  **モデルへの設定**: 作成した`PointGeometry3D`オブジェクトを、XAMLで定義した`ScatterModel.Geometry`プロパティに設定します。
4.  **更新通知**: データを追加し終わったら、`ScatterModel.Geometry.UpdateVertices()`を呼び出すことで、GPUにデータが転送され、画面が更新されます。大量のデータを扱う場合、最後に一度だけ更新するのがパフォーマンスの鍵です。

### 4. 軸や補助平面の表示

散布図だけではスケール感が分かりにくいため、座標軸や基準となる平面を表示すると親切です。

#### 座標軸 (LineGeometryModel3D)

`LineGeometryModel3D`を使うと、簡単に線分を描画できます。

```csharp
// MainWindow.xaml.cs

private void UpdateAxes(float max, float min)
{
    var axisLines = new LineGeometry3D();
    var builder = new LineBuilder();

    // X軸
    builder.AddLine(new Vector3(min, 0, 0), new Vector3(max, 0, 0));
    // Y軸
    builder.AddLine(new Vector3(0, min, 0), new Vector3(0, max, 0));
    // Z軸
    builder.AddLine(new Vector3(0, 0, min), new Vector3(0, 0, max));
    
    axisLines.Lines = builder.ToLineGeometry3D().Lines;

    AxisXModel.Geometry = axisLines;
    // ... AxisYModel, AxisZModelも同様に設定 ...
}
```

`LineBuilder`ヘルパークラスを使うと、複数の線分を簡単に追加できます。

#### 補助平面 (MeshGeometryModel3D)

`MeshGeometryModel3D`を使うと、三角形のメッシュで構成される3Dモデルを表示できます。平面は2つの三角形で表現できます。

```csharp
// MainWindow.xaml.cs

private void UpdatePlanes(float max, float min)
{
    var builder = new MeshBuilder();
    // XY平面 (Z=0)
    builder.AddQuad(new Vector3(min, min, 0), new Vector3(max, min, 0), new Vector3(max, max, 0), new Vector3(min, max, 0));
    
    var planeGeometry = builder.ToMeshGeometry3D();
    
    WallZModel.Geometry = planeGeometry;
    
    // マテリアルで色と透明度を設定
    WallZModel.Material = new PhongMaterial
    {
        DiffuseColor = new Color4(0.8f, 0.8f, 0.8f, 0.3f) // RGBA, Aは透明度
    };
}
```
`MeshBuilder`の`AddQuad`メソッドで四角形を追加し、それを`MeshGeometry3D`に変換しています。`PhongMaterial`で色や透明度などの質感を設定できます。

## まとめ

`HelixToolkit.Wpf.SharpDX`は、少し学習コストがかかるものの、WPFで高パフォーマンスな3D可視化を実現するための非常に強力なライブラリです。特に、`PointGeometryModel3D`や`MeshGeometryModel3D`と`...Builder`クラスを組み合わせることで、大量のデータを効率的に描画できます。

データ分析やシミュレーション結果の可視化など、インタラクティブな3D表現が求められる場面で、ぜひ活用してみてください。

今回例に挙げた`MultiDimensionwScatter`の全ソースコードは、以下のGitHubリポジトリで公開しています。

-   [https://github.com/sosuts/MultiDimensionwScatter](https://github.com/sosuts/MultiDimensionwScatter)
