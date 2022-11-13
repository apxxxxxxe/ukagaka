---
title: "surfaces.txtのTIPSまとめ"
date: "20221113"
tags: ["ukagaka", "shell"]
summery: "やりたいこと別にサーフェス定義の書き方をまとめた記事"
---

## この記事について
シェルのサーフェス作業中に詰まったところとその解決法をまとめています。  
随時更新。

### ある着せ替えパーツの表示順をサーフェスによって変えたい

![sode_sample.png](sode_sample.png)
こういうサーフェスがある。
![sode_nashi.png](sode_nashi.png)
袖を着せ替えパーツとしている。
![sode_nashi_ushiro.png](sode_nashi_ushiro.png)
腕を後ろで組むサーフェス(表示の優先度が胴>腕)を作りたいけれど、
![sode_ushiro_failure.png](sode_ushiro_failure.png)
同一のanimation番号では胴<腕のままなので、後ろに表示されない。  
だからといって単純に後ろ手のみanimation番号を変えると、別の着せ替えパーツとして認識されてしまう。

#### 解決法
**addid**([解説](http://ssp.shillest.net/ukadoc/manual/descript_shell.html#sakura.bindgroup*.addid,ID))を使うと複数のanimationをまとめて1つの着せ替えパーツとして定義できる。  
shellのdescript.txtに以下のように記述する。
```
sakura.bindoption.group,袖
sakura.bindgroup505318.name,袖,長白
sakura.bindgroup505318.addid,500168

// 注
// animation505318: 前手用の袖アニメーション
// animation500168: 後手用の袖アニメーション
```
![sode_ushiro_success.png](sode_ushiro_success.png)
やりたい動作が実現できた。