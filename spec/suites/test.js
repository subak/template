var html;

console.log(jasmine.getFixtures().fixturesPath = "/test/spec/fixtures");

html = jasmine.getFixtures().read("test.html");

loadFixtures("test.html");

describe("html is", function() {
  return it("hoge", function() {
    return expect(document.body).toHaveText("${test}");
  });
});

describe("Subak.Template is", function() {
  it("possible to insert text to text node.", function() {
    var dom, tpl;
    dom = $("<div><span>${var}</span></div>").get(0);
    tpl = new Subak.Template(dom);
    tpl.load({
      "var": "hoge"
    });
    tpl.close();
    return expect(dom).toHaveHtml("<span>hoge</span>");
  });
  return it("possible to insert text to attribute node", function() {
    var dom, tpl;
    dom = $("<div id='${var}'></div>").get(0);
    tpl = new Subak.Template(dom);
    tpl.load({
      "var": "hoge"
    });
    tpl.close();
    return expect(dom).toHaveAttr("id", "hoge");
  });
});
