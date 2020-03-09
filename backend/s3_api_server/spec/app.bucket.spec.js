process.env.NODE_ENV = "testBadBucket";
const app = require("../server");
const request = require("supertest")(app);

describe("/api/upload", () => {
  describe("POST", () => {
    test("status: 404 returns object with error when passed the wrong bucket", () => {
      return request
        .post("/api/upload")
        .field("usr", "crookydan")
        .attach("image.jpeg", "spec/spec-images/IMG_1028.jpg")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("The specified bucket does not exist");
        });
    }, 10000);
  });
});
