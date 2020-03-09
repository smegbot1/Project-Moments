process.env.NODE_ENV = "test";
const app = require("../server");
const request = require("supertest")(app);

describe("/api/upload", () => {
  describe("POST", () => {
    test("status: 200 returns object with correct keys when passed a .jpg file", () => {
      return request
        .post("/api/upload")
        .expect(200)
        .field("usr", "crookydan")
        .attach("image.jpeg", "spec/spec-images/IMG_1028.jpg")
        .then(({ body }) => {
          expect(body).toHaveProperty("image");
          expect(body).toHaveProperty("location");
          expect(body).toHaveProperty("status");
          expect(body).toHaveProperty("msg");
        });
    }, 100000);
    test("status: 200 returns object with correct keys when passed a .jpeg file", () => {
      return request
        .post("/api/upload")
        .field("usr", "crookydan")
        .attach("image.jpeg", "spec/spec-images/IMG_1028.jpeg")
        .expect(200);
    }, 100000);
    test("status: 200 returns object with correct keys when passed a .png file", () => {
      return request
        .post("/api/upload")
        .field("usr", "crookydan")
        .attach("image.jpeg", "spec/spec-images/IMG_1028.png")
        .expect(200);
    }, 100000);
    test("status: 400 returns object with error when passed a .gif file", () => {
      return request
        .post("/api/upload")
        .field("usr", "crookydan")
        .attach("image.jpeg", "spec/spec-images/shockedPug.gif")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg");
          expect(body.msg).toBe("File type must be jpeg|jpg|png");
        });
    }, 10000);
    test("status: 404 when passed an incorrect endpoint", () => {
      return request
        .post("/api/uploa")
        .field("usr", "crookydan")
        .attach("image.jpeg", "spec/spec-images/IMG_1028.jpg")
        .expect(404);
    }, 10000);
    test("status: 400 when passed the wrong field name", () => {
      return request
        .post("/api/upload")
        .field("usr", "crookydan")
        .attach("imag", "spec/spec-images/IMG_1028.jpg")
        .expect(400);
    }, 10000);
  });
});
