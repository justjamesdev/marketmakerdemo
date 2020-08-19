const test = require('ava');
const testData = require('./testData');
var rewire = require('rewire');
var mm = rewire('./marketMaker.js');



reconcileOrders = mm.__get__('reconcileOrders');
getBestPrices = mm.__get__('getBestPrices');

test('sell orders that are below the best ask should be considered filled', async t => {
    let theseTestOrders = testData.testOrders.slice(0);
    var newOrders = reconcileOrders(theseTestOrders, 51687692343, 49416130378);
    t.is(newOrders.filter(order => order.type=='OFFER').length, 1)

});

test('bid orders that are above the best bid should be considered filled', async t => {
    let theseTestOrders = testData.testOrders.slice(0);
    var newOrders = reconcileOrders(theseTestOrders, 49416140203, 47734958850);
    t.is(newOrders.filter(order => order.type=='BID').length, 2)
});

test('best offer is determined correctly from order book', async t => {
    let { bestOffer, bestBid } = getBestPrices(testData.orderBook);
    t.is(bestOffer, 397.5386277736);
});

test('best bid is determined correctly from order book', async t => {
    let { bestOffer, bestBid } = getBestPrices(testData.orderBook);
    t.is(bestBid, 397.99);
});


/// Tests if more time..
//________________________

// ActiveBids & ActiveOffers remains at 5

// Balances are correct after TXs
