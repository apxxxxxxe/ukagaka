---
title: "vimの正規表現とVSCodeの正規表現(鬼車)の対応"
date: "20220705"
tags: ["vim", "vscode"]
summery: "VSCodeのシンタックス拡張機能をVimプラグインに移植する話"
---

## 要旨
VSCodeのシンタックス拡張機能をVimプラグインに移植したい場合、

- [Vimのドキュメント](https://vim-jp.org/vimdoc-ja/pattern.html)
- [VSCodeの正規表現ライブラリ(鬼車)のリファレンス](https://macromates.com/manual/ja/regular_expressions)

を見比べて該当部分を書き換えようというだけの話…

### 2023/03/12追記
VSCodeのシンタックス拡張機能をそのままVimで利用可能にするプラグイン「[scorpeon](https://github.com/uga-rosa/scorpeon.vim)」があるのでこちらを使いましょう。  
以下の文は読まなくてよいです。

## モチベーション
### ayayaについて
先日、こんな拡張機能が開発・公開されました。  
[card:ayaya-vs-code-extension](https://github.com/Taromati2/ayaya-vs-code-extension)
エディタのデファクトスタンダードであるVSCodeでaya/yayaのシンタックスハイライトほか便利な機能を提供するものです。  
ありがたい…

### Vimに移植する
ところで、筆者は開発の際に[Vim](https://vim-jp.org/)を使っています。「慣れればどんなエディタよりも快適に開発できる」という某ユーザーの声に惹かれて２年ほど使っていますが、文章編集が実際とても楽になりました。  
なんとかして今回の拡張機能の恩恵を受けたかったのですが、Vimの編集能力を捨ててVSCodeに乗り換えるのはまだ厳しいものがありました。
[VSCodeでVimのキーバインドを実現する拡張機能](https://github.com/VSCodeVim/Vim)や[裏で動くNeovimとVSCodeを同期させる拡張機能](https://github.com/vscode-neovim/vscode-neovim)はありますが、Vimに慣れた身体には違和感が強く、解決には至りません。  
ayayaのライセンスはWTFPL(パブリックドメインと同等)ということで、Vimプラグインへの移植を目指します。

## 正規表現の対応関係
VSCodeの正規表現ライブラリは「鬼車」です。[日本語リファレンス](https://macromates.com/manual/ja/regular_expressions)があるのでありがたく参考にします。  
Vimは[ドキュメント](https://vim-jp.org/vimdoc-ja/pattern.html)に正規表現についての記載があります。  
以上を参考に、正規表現の記法の対応関係を表にまとめます。
|種類    |VSCode|Vim       |
|--------|------|----------|
|先読み  |hoge  |fuga      |
|単語境界|\\\\b |\\< と \\>|


- (作業中、随時追記)
