const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = server => {
  // get all customers
  server.get('/customers', async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err.message));
    }
  });
  // get one customer
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(`No customer with ${req.params.id}`)
      );
    }
  });
  // add customer
  server.post('/customers', async (req, res, next) => {
    // check content type is JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json"));
    }
    const { name, email, balance } = req.body;
    const customer = new Customer({
      name,
      email,
      balance
    });
    try {
      const newCustomer = await customer.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });
  // update customer
  server.put('/customers/:id', async (req, res, next) => {
    // check content type is JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json"));
    }
    try {
      const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.send(200);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(`No customer with id ${req.params.id}`)
      );
    }
  });
  // delete customer
  server.del('/customers/:id', async (req, res, next) => {
    // check content type is JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json"));
    }
    try {
      const customer = await Customer.findByIdAndRemove(req.params.id);
      res.send(204);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(`No customer with id ${req.params.id}`)
      );
    }
  });
};
