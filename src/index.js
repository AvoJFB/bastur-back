const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-morgan');
const bodyParser = require('koa-body');
const { Order, Customer } = require('./db');

const server = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'TooEz4You';
});

router.get('/order', async (ctx) => {
  const orders = await Order.findAll({
    include: Customer,
  });
  ctx.body = {
    orders,
  };
});

router.get('/customer', async (ctx) => {
  const customers = await Customer.findAll({
    include: [Order],
  });
  ctx.body = {
    customers,
  };
});

router.get('/customer/:id', async (ctx) => {
  const customer = await Customer.findById(ctx.params.id, {
    include: [Order],
  });
  ctx.body = {
    customer,
  };
});

server
  .use(bodyParser())
  .use(logger('tiny'))
  .use(router.routes())
  .listen(5000, () => console.log('Listening on port 5000...'));
