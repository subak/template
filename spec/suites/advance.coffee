# -*- coding: utf-8; -*-

jasmine.getFixtures().fixturesPath = "/test/spec/fixtures"

xdescribe "Subak.Template Advance", ->
  describe "root element", ->
    it "can be block", ->
      $dom = $ "<div data-tpl-block='block'></div>"
      new Subak.Template($dom[0])
      .load
        block:
          var: "hoge"
      .close()
      expect($dom).toBe "div:contains('hoge')"
