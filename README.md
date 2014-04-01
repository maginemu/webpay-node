# WebPay-node [![Build Status](https://travis-ci.org/webpay/webpay-node.png)](https://travis-ci.org/webpay/webpay-node)

WebPay node.js bindings https://webpay.jp

```js
var webpay = require('webpay');
webpay.apiKey = 'YOUR_TEST_SECRET_KEY';
webpay.client.charge.create({
  amount: 330,
  currency: "jpy",
  card: {
    number: "4242-4242-4242-4242",
    exp_month: "11",
    exp_year: "2014",
    cvc: "123",
    name: "KEI KUBO"
  },
  description: "Buy an item"
}, function(err, res) {
  console.log(res);
});
```

## Installation

    $ npm install webpay

## Quick Start

Set your api key to `webpay` object from `webpay` module.

```js
var webpay = require('webpay');
webpay.apiKey = 'YOUR_TEST_SECRET_KEY';
```

Call an interested method.

```js
webpay.client.charge.create({
  amount: 330,
  currency: "jpy",
  card: {
    number: "4242-4242-4242-4242",
    exp_month: "11",
    exp_year: "2014",
    cvc: "123",
    name: "KEI KUBO"
  },
  description: "Buy an item"
}, function(err, res) {
  console.log(res);
});
```

## More Information

  * node.js API document in WebPay official site [node.js APIドキュメント](https://webpay.jp/docs/api/node)

## Running Tests

To run the test suite, first invoke the following command within the repo, installing the development dependencies:

    $ npm install

Then run the tests and jshint:

    $ make

## Acknowledge

Webpay-node was originally created by @maginemu, and extended by WebPay team.
We thank @maginemu for starting such a great work and willingly giving us the ownership.

Former owner of ["webpay" on npm repository](https://www.npmjs.org/package/webpay) is @e-jigsaw. He transfered this name-space to us.
We also thank @e-jigsaw.

## License

MIT
