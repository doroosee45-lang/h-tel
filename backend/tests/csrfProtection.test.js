const test = require("node:test");
const assert = require("node:assert/strict");

process.env.NODE_ENV = "production";
process.env.CLIENT_URL = "https://hotel.example";
const csrfProtection = require("../src/middleware/csrfProtection");

const request = (origin, cookies = { refreshToken: "refresh" }) => ({
  method: "POST",
  cookies,
  get: () => origin,
});

test("accepts refresh-cookie writes from the configured web origin", () => {
  let continued = false;
  csrfProtection(request("https://hotel.example"), {}, () => { continued = true; });
  assert.equal(continued, true);
});

test("rejects refresh-cookie writes from untrusted and missing origins", () => {
  for (const origin of ["https://attacker.example", undefined]) {
    let statusCode;
    const response = {
      status(code) {
        statusCode = code;
        return this;
      },
      json() {},
    };
    csrfProtection(request(origin), response, () => {});
    assert.equal(statusCode, 403);
  }
});

test("does not impose cookie CSRF checks on bearer-only requests", () => {
  let continued = false;
  csrfProtection(request("https://attacker.example", {}), {}, () => { continued = true; });
  assert.equal(continued, true);
});
