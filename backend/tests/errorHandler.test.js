const test = require("node:test");
const assert = require("node:assert/strict");
const { errorHandler } = require("../src/middleware/errorHandler");

test("does not expose internal error messages or stack traces", () => {
  const originalError = console.error;
  let response;
  console.error = () => {};
  try {
    errorHandler(
      new Error("database credentials should remain private"),
      {},
      {
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(body) {
          response = body;
        },
        statusCode: 200,
      },
      () => {}
    );
  } finally {
    console.error = originalError;
  }

  assert.equal(response.success, false);
  assert.equal(response.message, "Une erreur interne est survenue");
  assert.equal("stack" in response, false);
  assert.equal(JSON.stringify(response).includes("credentials"), false);
});
