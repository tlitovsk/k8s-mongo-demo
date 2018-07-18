const GreetingsServer = require('./app.js');
const DbFactory = require('./dbInterface.js');

const PORT = 8080;

async function main() {
  const dbFactory = new DbFactory({
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
  });
  await dbFactory.connect('localhost');
  const { greater } = dbFactory;
  const server = new GreetingsServer(greater);
  server.express.listen(PORT, '0.0.0.0', () => {
    console.log(`Running on http://0.0.0.0:${PORT}`); // eslint-disable-line no-console
  });
}

main();
