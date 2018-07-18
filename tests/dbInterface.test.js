const Ifs = require('./../src/dbInterface.js');

test('Connects to the DB and fetch russian text', async () => {
  const db = new Ifs({ user: process.env.MONGO_USER, password: process.env.MONGO_PASS });
  await db.connect();
  const { greater } = db;
  const result = await greater.greet('russian');
  expect(result).toBe('dobrii den');
  db.close();
});
