const models = require('../config/database');
const logger = require('../utils/logger');
const mailer = require('../utils/mail');

function order_view_get_core(req, res, view, customuser,viewobj) {
  models.Order.findAll({

    where: {
      userId:  customuser ? customuser : (req.user.account_type == 'seller' ? {[models.Op.gte]:0} :req.user.id)
    },
    include: [
      {
        model: models.Item, include: [{
          model: models.Inventory
        }]
      },
      { model: models.User }
    ], order: [
      ['createdAt', 'DESC']
    ]
  })
    .then((orders) => {
      orders.forEach((o) => {
        let sum = 0;
        o.items.forEach((itm) => { sum += parseFloat(itm.inventory.price); });
        o.amount = sum;
      });
      let temp = {};
      temp.orders = orders;
      if (viewobj) {temp[viewobj[0]] = viewobj[1][viewobj[0]];}
      res.render(view, temp);
    })
    .catch(err => logger.error(err));
};

exports.order_view_get = (req, res) => {
  order_view_get_core(req, res, 'order');
};

exports.order_view_get_core_wrapper = (req,res,view,customuser,viewobj) => order_view_get_core(req,res,view,customuser,viewobj);

exports.order_view_get_client = (req, res) => {

  models.Order.findAll({
    where: { userid: req.userid },
    include: [
      { model: models.Item },
      { model: models.User }
    ]
  })
    .then((orders) => {

      res.render('NO_EXIST', {
        orders: orders
      });
    })
    .catch(err => logger.error(err));
};

exports.order_get = (req, res) => {
  models.Order.findAll({

    where: { id: req.params.id },
    include: [
      {
        model: models.Item, include: [{
          model: models.Inventory
        }]
      },
      { model: models.User },
      { model: models.Payment },
      {
        model: models.Note, include: [{
          model: models.User
        }]
      }
    ], order: [
      [models.Note, 'createdAt', 'DESC'],
      [models.Item, 'createdAt', 'ASC']
    ],
    limit: 1
  })
    .then((order) => res.render('order-ru', {
      order: order[0],
    }))
    .catch(err => logger.error(err));
};

exports.order_inquire_get = (req, res) => {
  models.Inventory.findAll(
    {
      where: {
        price: {
          [models.Op.gte]: 0
        }
      }
    }
  ).then((inventory) => res.render('inquire', {
    inventory: inventory
  }));
};

exports.order_create_post = (req, res) => {
  let bodyvars = undefined;
  var comments = req.body.comments;
  //AUTHORIZE ACTION
  bodyvars = {
    userId: req.body.user,
    state: 'new',
    inquiry_type: req.body.inquiry_type ? req.body.inquiry_type : 1,
    time_estimate: req.body.time_estimate ? req.body.time_estimate : 1,
    intended_use: req.body.intended_use ? req.body.intended_use : 1,
    comments: req.body.comments ? req.body.comments : '',
    payment: req.body.payment ? req.body.payment : 2,
    po_num: req.body.po_num,
  };

  models.Order.create(bodyvars).then((order) => {
    var itemVars = {
      orderId: order.id,
      inventoryId: req.body.service
    };
    models.Item.create(itemVars).then(() => {
      if (comments != '') {
        models.Note.create({
          userId: req.body.user,
          orderId: order.id,
          message: req.body.comments
        });
      }
      order_confirmation(req, res, bodyvars, itemVars);
    });
  });
};

exports.order_remove = (req, res) => {
  //AUTHORIZE ACTION
  models.Order.destroy({
    where: {
      id: req.body.id
    }
  }).then(res.redirect('NO_EXIST')).catch(err => logger.err(err));
};

exports.order_modify = (req, res) => {
  //AUTHORIZE ACTION
  if (req.body.id) {
    models.Order.findOne({
      where: {
        id: req.body.id
      },
      include: [{ model: models.User }, { model: models.Item }]

    }).then((entry) => {
      entry.update({
        amount: req.body.amount,
        state: req.body.state,
        type: req.body.type,
        user: req.body.user,
      }).then(() => { res.sendStatus(200).end(); }); // CALL item modify if needed.
    }).catch(err => logger.error(err));
    return;
  }

  if (!req.params.id) {
    res.redirect('NO_EXIST');
    return;
  }

  models.Order.findOne({
    where: {
      id: req.params.id
    }
  }).then((entry) => {
    res.render('NO_EXIST', {
      entry: entry
    });
  }).catch(err => logger.error(err));
};

//INTERNAL USE ONLY
exports.inventoryUpdate = (id, count) => {
  models.Item.findOne(
    {
      where: {
        id: id
      },
      include: [{ model: models.Inventory }]
    }
  ).then((entry) => { entry.inventory.stock = count; });
};

exports.order_create = (req, res) => {
  if (!req.body.item_name) {
    res.render('NO_EXIST');
    return;
  }

  let bodyvars = undefined;

  //AUTHORIZE ACTION
  bodyvars = {
    amount: req.body.amount,
    state: req.body.state,
    type: req.body.type,
    user: req.body.user,
    item: req.body.items
  };

  models.Inventory.create(bodyvars).then(() => { res.redirect('NO_EXIST'); }); //CALL relvant Item creates if needed
};

// Send order confirmation email to client
const order_confirmation = (req, res, order, itemVars) => {
  models.User.findOne({
    where: {
      id: order.userId
    }
  }).then(user => {
    models.Order.findOne({
      where: {
        id: itemVars.orderId
      }
    }).then(order => {
      var err = mailer.sendOrderConfrim(user.email, order, itemVars);
      if (err) {
        req.flash('danger', 'There was an error. Please try again.');
        // NOT SURE WHERE TO SEND USER IF EMAIL FAILS
        res.redirect('back');
      } else {
        req.flash('success', 'Thank you for you order. An order confirmation has been sent to ' + user.email);
        res.redirect('/users/dashboard');
      }
    });
  }).catch(err => logger.error(err));
};

