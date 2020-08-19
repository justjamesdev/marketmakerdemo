const mm = require('./marketMaker');
const ORDER_LOOP = 5; //seconds
const BALANCE_LOOP = 30; //seconds

const mainLoop = setInterval(mm.orderSetup, 1000 * ORDER_LOOP);
const balanceLoop = setInterval(mm.showBalances, 1000 * BALANCE_LOOP);
mm.orderSetup();


