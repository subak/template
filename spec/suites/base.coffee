# -*- coding: utf-8; -*-

jasmine.getFixtures().fixturesPath = "/test/spec/fixtures"

describe "Subak.Template", ->
  xdescribe "root element", ->
    it "can be block", ->
      $dom = $ "<div data-tpl-block='block'></div>"
      new Subak.Template($dom[0])
      .load
        block:
          var: "hoge"
      .close()
      expect($dom).toBe "div:contains('hoge')"

  beforeEach ->
    loadFixtures "base.html"

  # pumT: テキストノードに変数をいれる
  it "is possible to insert text to text node.", ->
    $dom = $("#id-pumT")
    new Subak.Template($dom[0])
    .load
      var: "hoge"
    .close()
    expect($dom).toContain "span:contains('hoge')"

  # UhPp: 属性に変数
  it "is possible to insert text to attribute node", ->
    $dom = $("#id-UhPp")
    new Subak.Template($dom[0])
    .load
      var: "hoge"
    .close()
    expect($dom).toContain "span#hoge"

  # 1OCq: ブロックを使える
  it "can use block", ->
    $dom = $ "#id-1OCq"
    new Subak.Template($dom[0])
    .load
      block:
        var: "hoge"
    .close()
    expect($dom).toBe "div:contains('hoge')"

  # MA9a: ブロックをループできる
  it "can loop block", ->
    $dom = $ "#id-MA9a"
    new Subak.Template($dom[0])
    .load
      block: [{var: 1}, {var: 2}, {var: 3}]
    .close()
    expect($dom.find("li").size()).toBe 3
    expect($dom).toContain "li:contains('1')"
    expect($dom).toContain "li:contains('2')"
    expect($dom).toContain "li:contains('3')"

  # 5t4T: 異なるブロックで同じ名前の変数を使う
  it "can use same varname in different block", ->
    $dom = $ "#id-5t4T"
    new Subak.Template($dom[0])
    .load
      block_a:
        var: "a"
      block_b:
        var: "b"
    .close()
    expect($dom).toContain "div:contains('a')"
    expect($dom).toContain "div:contains('b')"

  # xQ7c: 同じ構造をもつ全てのブロックにデータが適用される
  it "can apply data to block that has same structure", ->
    $dom = $("#id-xQ7c")
    new Subak.Template($dom[0])
    .load
      block:
        var: "hoge"
    .close()
    expect($dom).toContain "li:contains('hoge')"
    expect($dom).toContain "p:contains('hoge')"

  # ORct: 同じ構造のデータを入れ子に出来る
  it "can nest data that has same structure", ->
    $dom = $("#id-ORct")
    new Subak.Template($dom[0])
    .load
      var: "level0"
      block:
        var: "level1"
        block:
          var: "level2"
    .close()
    expect($dom).toContain "div#level0:contains('level0')"
    expect($dom).not.toContain "div#level1:contains('level0')"
    expect($dom).toContain "div#level1:contains('level1')"
    expect($dom).not.toContain "div#level2:contains('level1')"
    expect($dom).toContain "div#level2:contains('level2')"

  # データが適用されないブロックは消える
  # 空のデータが適用されたブロックは表示される
  # namespaceを使うことが出来る
