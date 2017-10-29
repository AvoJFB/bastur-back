const Sequelize = require('sequelize');
const data = require('./data');
require('dotenv').config();


const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME,
} = process.env;
const db = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

const Customer = db.define('customer', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
}, {
  underscored: true,
});

const Order = db.define('order', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  weight: Sequelize.FLOAT,
  price_per_kilo: Sequelize.INTEGER,
  sold_at: Sequelize.DATE,
}, {
  underscored: true,
});

Customer.hasMany(Order, { foreignKey: 'customer_id', sourceKey: 'id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', targetKey: 'id' });

db.sync({ force: true }).then(() => {
  data.customers.forEach(customer => Customer.create(customer));
  data.orders.forEach(order => Order.create(order));
});

module.exports = {
  db,
  Order,
  Customer,
};
