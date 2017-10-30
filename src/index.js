const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-morgan');
const bodyParser = require('koa-body');
const cors = require('koa-cors');
const { Order, Customer } = require('./db');
const v4 = require('uuid/v4');
require('dotenv').config();

const server = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'TooEz4You';
});

router.get('/order', async (ctx) => {
  const orders = await Order.findAll({
    attributes: {
      exclude: ['created_at', 'updated_at'],
    },
    include: [{
      model: Customer,
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    }],
  });
  ctx.body = {
    orders,
  };
});

router.post('/order', async (ctx) => {
  const order = {
    id: v4(),
    weight: ctx.request.body.weight,
    price_per_kilo: ctx.request.body.price_per_kilo,
    sold_at: ctx.request.body.sold_at,
    customer_id: ctx.request.body.customer_id,
  };
  await Order.create(order);
  ctx.body = {
    order,
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

router.post('/customer', async (ctx) => {
  const customer = {
    id: v4(),
    name: ctx.request.body.name,
  };
  await Customer.create(customer);
  ctx.body = {
    customer,
  };
});

server
  .use(cors())
  .use(bodyParser())
  .use(logger('tiny'))
  .use(router.routes())
  .listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));
