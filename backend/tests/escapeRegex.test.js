const test = require("node:test");
const assert = require("node:assert/strict");
const escapeRegex = require("../src/utils/escapeRegex");

test("treats search input as bounded literal text", () => {
  const literal = escapeRegex("(a+)+$");
  assert.equal(new RegExp(literal).test("(a+)+$"), true);
  assert.equal(new RegExp(literal).test("aaaaaaaa"), false);
  assert.equal(escapeRegex("x".repeat(150)).length, 100);
});
