const Gdax = require('gdax');

class Exchange {
  constructor(product) {
    this.product = product;

    this.websocket = new Gdax.WebsocketClient(
      [this.product],
      'wss://ws-feed.pro.coinbase.com',
      null,
      { channels: ['matches', 'heartbeat'] }
    );
    this._initSocket();
  }

  _initSocket() {
    this.websocket.on('close', (data) => {
      console.log('ERROR', 'Websocket Error', `websocket closed unexpectedly with data: ${data}. Attempting to re-connect.`);

      // attempt to re-connect every 5 seconds.
      const interval = setInterval(() => {
        if (!this.websocket.socket) {
            this.websocket.connect();
        }
        else {
            clearInterval(interval);
        }
      }, 5000);
    });
  }
}

module.exports = Exchange;
