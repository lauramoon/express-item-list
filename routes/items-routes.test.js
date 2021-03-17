process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let firstItem = { name: "pickles", price: 2.45 };

beforeEach(function() {
  // for some reason, the values of firstItem are changed
  // during the patch tests
  firstItem = { name: "pickles", price: 2.45 };
  items.push(firstItem);
});

afterEach(function() {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});
// end afterEach

/** GET /items - returns `{items: [{name, price}, ...]}` */

describe("GET /items", function() {
  test("Gets list of items", async function() {
    const resp = await request(app).get(`/items`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toEqual(1);
    expect(resp.body).toEqual([firstItem]);
  });
});
// end

/** GET /items/[name] - return data about one item: `{item: {name, price}}` */

describe("GET /items/:name", function() {
  test("Gets a single item", async function() {
    const resp = await request(app).get(`/items/${firstItem.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({item: firstItem});
  });

  test("Responds with 404 if can't find item", async function() {
    const resp = await request(app).get(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/** POST /items - create item from data; return `{item: {name, price}}` */

describe("POST /items", function() {
  test("Creates a new item", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "cheese",
        price: 3.47
      });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      added: { name: "cheese", price: 3.47 }
    });
    expect(items.length).toEqual(2);
  });
});
// end

/** PATCH /items/[name] - update item; return `{item: {name, price}}` */

describe("PATCH /items/:name", function() {

  test("Updates a single item name", async function() {
    const resp = await request(app)
      .patch(`/items/${firstItem.name}`)
      .send({
        name: "dill pickles"
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: "dill pickles", price: 2.45 }
    });
  });

  test("Updates a single item price", async function() {
    const resp = await request(app)
      .patch(`/items/${firstItem.name}`)
      .send({
        price: 2.65
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: "pickles", price: 2.65 }
    });
  });

  test("Updates a single item both name and price", async function() {
    const resp = await request(app)
      .patch(`/items/${firstItem.name}`)
      .send({
        name: "radishes",
        price: 0.99
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: "radishes", price: 0.99 }
    });
  });

  test("Responds with 404 if item name invalid", async function() {
    const resp = await request(app).patch(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/** DELETE /items/[name] - delete item,
 *  return `{message: "Item deleted"}` */

describe("DELETE /items/:name", function() {
  test("Deletes a single item", async function() {
    const resp = await request(app).delete(`/items/${firstItem.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
// end
