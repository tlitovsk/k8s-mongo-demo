const GreetingDbFactory = require('./../src/dbInterface.js');

test('Connects to the DB and fetch russian text', async () => {
  const dbFactory = new GreetingDbFactory({
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
  });
  await dbFactory.connect(process.env.MONGO_HOST);
  const { greater } = dbFactory;
  const result = await greater.greet('russian');
  expect(result).toBe('dobrii den');
  dbFactory.close();
});
