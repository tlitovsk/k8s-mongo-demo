const request = require('supertest');
const GreetingsServer = require('./../src/app.js');
const DbFactory = require('./../src/dbInterface.js');

async function createGreeter() {
  const db = new DbFactory({ user: process.env.MONGO_USER, password: process.env.MONGO_PASS });
  await db.connect('localhost');
  const { greater } = db;
  return greater;
}

async function getExpressServer() {
  const server = new GreetingsServer(await createGreeter());
  return server.express;
}


describe('Test the root path', () => {
  test('It should response the GET method', async (done) => {
    request(await getExpressServer()).get('/').then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Hello\n');
      done();
    });
  });
});

describe('Test the russian path', () => {
  test('It should response the GET method', async (done) => {
    request(await getExpressServer()).get('/russian').then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('dobrii den');
      done();
    });
  });
});
