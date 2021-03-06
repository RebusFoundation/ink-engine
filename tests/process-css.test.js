const tap = require("tap");
const processCSS = require("../src/postcss");

tap.test("processCSS", async test => {
  const css = `html.js body.testClass span.someClass {background-color: red; position: fixed; text-align: justify; fake-property: bling; --custom-property: url('what-is-this/image.png'); background-image: url('https://dangerous.example.com/test.png')} div {position: fixed;}@font-face {
    font-family: "Stix";
    font-weight: normal;
    font-style: normal;
    src: url(../fonts/STIXGeneral.otf);
  }`;
  const result = await processCSS(css, "styles/test.css");
  test.matchSnapshot(result, "parseCSS basic");
});

tap.test("processCSS", async test => {
  const css = `@import url("http://dangerous.example.com/style.css")`;
  const result = await processCSS(css, "styles/test.css");
  test.matchSnapshot(result, "parseCSS @import");
});

tap.test("processCSS", async test => {
  const css = `html.js body.testClass span.someClass {background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2238%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010c0%20.546.414.983.932.983h33.887l-6.954%207.337a1.015%201.015%200%200%200%200%201.39.892.892%200%200%200%201.317%200l8.545-9.015a1.023%201.023%200%200%200%200-1.39L29.182.29a.892.892%200%200%200-1.317%200%201.015%201.015%200%200%200%200%201.39l6.954%207.337H.932C.414%209.017%200%209.454%200%2010z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E');}`;
  const result = await processCSS(css, "styles/test.css");
  test.matchSnapshot(result, "parseCSS data url");
});
