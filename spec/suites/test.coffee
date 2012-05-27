# -*- coding: utf-8; -*-

console.log jasmine.getFixtures().fixturesPath = "/test/spec/fixtures"

html = jasmine.getFixtures().read "test.html"

loadFixtures "test.html"

describe "html is", ->
  it "hoge", ->
    expect(document.body).toHaveText "${test}"
    

describe "Subak.Template is", ->
  it "possible to insert text to text node.", ->
    dom = $("<div><span>${var}</span></div>").get(0)
    tpl = new Subak.Template dom
    tpl.load
      var: "hoge"
    tpl.close()
    expect(dom).toHaveHtml "<span>hoge</span>"

  it "possible to insert text to attribute node", ->
    dom = $("<div id='${var}'></div>").get(0)
    tpl = new Subak.Template dom
    tpl.load
      var: "hoge"
    tpl.close()
    expect(dom).toHaveAttr "id", "hoge"

  

