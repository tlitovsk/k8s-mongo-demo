const mongo = require('mongodb');

class Greetings {
  greet() { // eslint-disable-line class-methods-use-this
    /* istanbul ignore next line */
    throw new Error('not implemented');
  }
}

class GreetingsDB extends Greetings {
  constructor(dbo) {
    super();
    this.dbo = dbo;
  }

  greet(userLanguage) {
    const greetPromise = new Promise((resolve, reject) => {
      const query = { language: userLanguage };
      this.dbo.collection('greetings').findOne(query, (err, result) => {
        /* istanbul ignore if */
        if (err) {
          reject();
        }
        resolve(result.text);
      });
    });
    return greetPromise;
  }
}

class DataFactory {
  constructor(secret) {
    this.user = secret.user;
    this.password = secret.password;
  }

  connect() {
    const client = mongo.MongoClient;
    const url = `mongodb://${this.user}:${this.password}@localhost:27017/world`;
    const dbConnectionPromise = new Promise((resolve, reject) => {
      client.connect(url, (err, db) => {
        /* istanbul ignore if */
        if (err) {
          console.log('Database error!'); // eslint-disable-line no-console
          reject();
        }
        resolve({ database: db, dbo: db.db('world') });
      });
    });
    dbConnectionPromise.then((response) => {
      this.db = response.database;
      this.dbo = response.dbo;
    }).catch(() => {
      /* istanbul ignore next line */
      throw new Error('not connected');
    });

    return dbConnectionPromise;
  }

  close() {
    this.db.close();
  }

  get greater() {
    return new GreetingsDB(this.dbo);
  }
}

module.exports = DataFactory;
