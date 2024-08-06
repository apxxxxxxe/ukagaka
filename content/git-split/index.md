---
title: "gitで過去のコミットを編集したり分割したりする方法"
date: "20230426"
tags: ["git"]
summery: "gitで過去のコミットを編集したり分割したりする方法"
---

## TL;DL
intaractive rebaseを使いましょう。

## はじめに
gitでコミット分割の方法を調べたのでメモしておきます。

## 手順
### git logして該当コミット(とその1つ前のコミット)のSHAを確認
```
git log --oneline

83f52e6 (HEAD -> main) hoge
f1cae65 fuga
b8929a2 piyo
0fd0f4e hoge
945b51e fuga
18f60e3 piyo
d6b8ce8 poyo
```

下から2番目の18f60e3のコミットを分割したいとします。  
このとき、18f60e3,d6b8ce8の2コミットをのちに入力できるように記憶しておきます。

### git rebaseで該当コミットを編集可能な状態にする
```
git rebase -i d6b8ce8
```
とするとエディタが開き、そこには
```
pick 18f60e3 piyo
pick 945b51e fuga
pick 0fd0f4e hoge
pick b8929a2 piyo
pick f1cae65 fuga
pick 83f52e6 hoge

# Rebase d6b8ce8..83f52e6 onto d6b8ce8 (6 commands)
(以下省略)
```

のような記述がなされています。  
今回いじりたいのは18f60e3なので、

```
edit 18f60e3 piyo
pick 945b51e fuga
pick 0fd0f4e hoge
pick b8929a2 piyo
pick f1cae65 fuga
pick 83f52e6 hoge

# Rebase d6b8ce8..83f52e6 onto d6b8ce8 (6 commands)
(以下省略)
```
と文頭のpickをeditに変え、保存して閉じます。

```
Stopped at 18f60e3...  piyo
You can amend the commit now, with

  git commit --amend

Once you are satisfied with your changes, run

  git rebase --continue
```

と出力されれば成功。18f60e3が編集可能となりました。

### git resetで変更をワーキングディレクトリに戻す
現在、18f60e3での変更はヒストリー上にあるので、コミットし直すためにワーキングディレクトリまで引き戻します。

```
git reset HEAD~
```


### 変更をコミット
git add, git commitで変更をコミットします。  
ここでコミットを小分けにすることで、当初の目的であるコミット18f60e3の分割が叶います。

### git rebase --continueでHEADにチェックアウトして終了
コミットが完了したら、rebaseで編集モードを終了し、HEADへチェックアウトします。

```
git rebase --continue

Successfully rebased and updated refs/heads/main.
```

過去のコミットを分割しなおすことができました。

## 参考
- [3.6 Git Branching - Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
- [Gitで数個前のcommitを遡って分割する](https://ken-c-lo.hatenadiary.org/entry/20130706/1373092204?utm_source=pocket_saves)
- [Git でブランチを上書きする](https://qiita.com/phanect/items/4353854cb0d962916acf?utm_source=pocket_saves)
