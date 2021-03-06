---
title: "直近のゴーストをリスト表示するプラグインを作った"
date: "20220724"
tags: ["ukagaka"]
summery: "伺かプラグイン「直近のゴースト」の話"
---

## 要旨
いっぱいゴーストがいるのでより便利な方法で管理したいと思いました。  
思いつく方法は
1. お気に入りのゴーストとその他のゴーストを別管理
2. 起動したいゴーストを検索する
3. 最近起動したゴーストをリスト表示

3.のみ既存の機能になかったので**プラグインを作りました**。

## きっかけ

私の環境にはゴーストが700名ほどインストールされています。  
どのゴーストさんも満遍なく起動したいとはいえ、このままではあまりにも無秩序です。  
ある程度優先順位をつけ、探しやすくする必要があると考えました。  

## アプローチ

### 1. お気に入りのゴーストとその他のゴーストを分ける
最初に思いつく方法でした。お気に入りは特別な枠で管理したいものです。  
SSPでは、ゴーストのインストールディレクトリを複数設定することが可能です。(バルーンなども同様)  
この機能を使うことで、お気に入り/それ以外のみならず、イベント別・ジャンル別など様々な分類が可能になります。

### 2. 起動したいゴーストを検索する
ユーザの需要をより即時的かつ直感的に叶える方法です。  
これもSSPに該当する機能が搭載されています。  
Ctrl+Eで開くエクスプローラーでCtrl+Fを押すと開く検索窓に単語を入力することで、ゴースト名はもちろん作者名、キャラクター名までもを対象にゴーストの検索が可能です。  
とてもべんり

### 3. 最近起動したゴーストのリストを作る
[時間的局所性](https://ja.wikipedia.org/wiki/%E5%8F%82%E7%85%A7%E3%81%AE%E5%B1%80%E6%89%80%E6%80%A7)という概念があります。  
ある時点で参照されたデータは近い未来に再度参照されることが多いというコンピュータ科学での考え方ですが、これは一般にも同じことが言えると思います。実際、よくテキストエディタに搭載されている「最近使ったファイル」には類似の思考が見えます。  
ぜひこれをSSPでも使いたいと思ったのですが、SSPに最近起動したゴーストを表示する機能はありませんでした。（私が気付いてないだけであれば教えていただけると幸いです）  
ということで**最近起動したゴーストをリスト表示するプラグインを作りました。**  
[card:直近のゴースト - Github](https://github.com/apxxxxxxe/recentghosts)  

## 「直近のゴースト」の簡単な説明
![center:preview](https://raw.githubusercontent.com/apxxxxxxe/recentghosts/images/image.png)
- 本プラグインを有効にしておくと、起動したゴーストが自動的に20件まで記録されます。  
- メニューから本プラグインを実行するとリストが表示されます。
- リストには各ゴーストの切り替え・呼び出し機能があります。

ぜひおためしください。


