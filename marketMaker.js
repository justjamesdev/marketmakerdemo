const fetch = require('node-fetch');
const API_ORDERBOOK = `https://api.deversifi.com/bfx/v2/book/tETHUST/R0`;
const ORDER_LIMIT_PCT = 0.05;


// TODO: Seperate offers and bid orders for better management
var activeOrders = [];
var activeBids = 0;
var activeOffers = 0;

var usd = 2000.00;
var eth = 10.00000000;

module.exports = {
  orderSetup,
  showBalances
}

function orderSetup() {
  getOrderBook().then((orders) => {

    let { bestOffer, bestBid } = getBestPrices(orders);

    console.log(`${new Date()} - Best Offer: ${bestOffer} Best Bid: ${bestBid}`);
    let bidLimit = Math.round((bestBid - bestBid * ORDER_LIMIT_PCT), 0);
    let offerLimit = Math.round((bestOffer + bestOffer * ORDER_LIMIT_PCT), 0);

    activeOrders = reconcileOrders(activeOrders, bestOffer, bestBid, offerLimit, bidLimit);

    // Create 5 bid and 5 offers
    for (co = 0; co <= 5; co++) {
      if (activeBids < 5)
        createOrder('BID', bestBid, bidLimit)
      if (activeOffers < 5)
        createOrder('OFFER', bestOffer, offerLimit)
    }
  });
}

function showBalances() {
  console.log(`BALANCES ================`);
  console.log(`USD Balance: ${usd}`);
  console.log(`ETH Balance: ${eth}`);
  return {
    usd, eth
  }

}

function reconcileOrders(orders, bestOffer, bestBid, offerLimit, bidLimit) {

  for (var i = orders.length - 1; i >= 0; i--) {
    var thisOrder = orders[i];

    // Settle Order Fills
    // TODO: Deal with quantities & concentrate more on precisions
    if ((thisOrder.type == 'BID' && thisOrder.orderPrice > bestBid) || ((thisOrder.type == 'OFFER' && thisOrder.orderPrice < bestOffer))) {
      orders.splice(i, 1);
      console.log(`FILLED ${thisOrder.type} @ ${thisOrder.orderPrice} ${thisOrder.orderAmount}`);

      // Reduce active order count and maintain balance
      if (thisOrder.type == 'BID') {
        activeBids--;
        eth = eth + thisOrder.orderAmount;
        usd = usd - thisOrder.orderPrice;
      }
      else if (thisOrder.type == 'OFFER') {
        activeOffers--;
        eth = eth - thisOrder.orderAmount;
        usd = usd + thisOrder.orderPrice;
      }
    }

    // Cancel orders that are no longer within ORDER_LIMIT_PCT
    else if(thisOrder.type == 'BID' && thisOrder.orderPrice < bidLimit) {
      orders.splice(i, 1);
      activeBids--;
    }
    else if(thisOrder.type == 'OFFER' && thisOrder.orderPrice > offerLimit) {
      orders.splice(i, 1);
      activeOffers--;
    }


  }
  console.log(`Reconciled. ${activeBids} active bids and ${activeOffers} active offers`);
  return orders;


}


function createOrder(type, best, limit) {
  console.log(`${type} limit ${limit} for ${best}`);
  let orderPrice = Math.floor(Math.random() * (best - limit + 1)) + limit;
  let orderAmount = Math.floor(Math.random() * (0.01 - 0.05 + 1)) + 0.05;
  activeOrders.push({ type, orderPrice, orderAmount });
  type == 'BID' ? activeBids++ : activeOffers++;

  console.log(`PLACE ${type} @ ${orderPrice} ${orderAmount}`)
}



function getBestPrices(orders) {
  let bestOffer = 0, bestBid = 0;
  for (i = 0; i < orders.length; i += 1) {
    if (orders[i][2] < 0) {
      bestBid = orders[i][1];
      bestOffer = orders[i - 1][1];
      break;
    }
  }
  return { bestOffer, bestBid };
}


//TODO: Handle errors in calling
async function getOrderBook() {

  const response = await fetch(API_ORDERBOOK, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
