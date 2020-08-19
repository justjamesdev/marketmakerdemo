## Market Maker Demo

### Getting Started

- npm install
- npm start

### Testing

npm test

### Improvements

Overall improvements/next steps;

- Store data in something a bit more robust and a little more pesisitant
- Async processing / Promise.all
- Error handling
- More unit tests
- Further items are noted in the code comments as TODO

Tip: Lower ORDER_LIMIT_PCT to get things moving a bit!

Example Output
```
Wed Aug 19 2020 23:16:22 GMT+0200 (Central European Summer Time) - Best Offer: 403.34 Best Bid: 404.02
PLACE BID @ 404 0.05
PLACE OFFER @ 405 0.05
PLACE BID @ 404 0.05
...
PLACE OFFER @ 405 0.05
Wed Aug 19 2020 23:16:27 GMT+0200 (Central European Summer Time) - Best Offer: 403.31 Best Bid: 404.04
Reconciled. 5 active bids and 5 active offers
Wed Aug 19 2020 23:16:32 GMT+0200 (Central European Summer Time) - Best Offer: 403.34 Best Bid: 404.05
Reconciled. 5 active bids and 5 active
...
BALANCES ================
USD Balance: 2000
ETH Balance: 10
...
Wed Aug 19 2020 23:20:20 GMT+0200 (Central European Summer Time) - Best Offer: 402.56 Best Bid: 403.79
FILLED BID @ 404 0.05
Reconciled. 4 active bids and 5 active offers
BID limit 400 for 403.79
PLACE BID @ 403 0.05
```
