const Gdax = require('gdax');

class Exchange {
  constructor(product) {
    this.product = product;

    this.websocket = new Gdax.WebsocketClient(
      [this.product],
      'wss://ws-feed.pro.coinbase.com',
      null,
      { channels: ['matches'] }
    );
    this._initSocket();
  }

  _initSocket() {
    this.websocket.on('error', (err) => {
      console.log(err);
    });

    // if it closes reconnect
    this.websocket.on('close', (data) => {
      console.error();('ERROR', 'Websocket Error', `websocket closed unexpectedly with data: ${data}. Attempting to re-connect.`);

      // try to re-connect the first time...
      this.websocket.connect();

      // attempt to re-connect every 30 seconds.
      const interval = setInterval(() => {
        if (!this.websocket.socket) {
            this.websocket.connect();
        }
        else {
            clearInterval(interval);
        }
      }, 10000);
    });
  }
}

module.exports = Exchange;
