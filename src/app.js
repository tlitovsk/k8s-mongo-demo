const express = require('express');

class GreetingsServer {
  constructor(greeter) {
    this.app = express();
    this.greeter = greeter;
    this.app = express();

    this.app.get('/', (req, res) => {
      res.send('Hello\n');
    });

    this.app.get('/russian', async (req, res) => {
      const result = await this.greeter.greet('russian');
      res.send(result);
    });
  }

  get express() {
    return this.app;
  }
}

module.exports = GreetingsServer;
