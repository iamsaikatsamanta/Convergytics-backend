const ExpensesName = require('../Model/expensesname');
const Common = require('../utils/response');
const Expenses = require('../Model/expenses');
const User = require('../Model/user');
const Group = require('../Model/group');
const Payment = require('../Model/mayment');
const ip = require('ip');
exports.getAllExpanceName =(req,res) => {
    ExpensesName.find()
        .then(resp => {
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=> {
            return res.json(Common.generateResponse(100,err));
        })
};

exports.saveExpances = (req,res) => {
    User.findOne({_id: req.user.userId})
        .then(result => {
                console.log(result);
              if (req.body.usertype==='Single') {
                const expen = new Expenses({
                    type: req.body.expenseName,
                    amount: req.body.amount,
                    date: req.body.date,
                    img_url: req.body.img_url,
                    uploadedBy: req.user.userId,
                    group: result.group
                });
                expen.save()
                    .then(resp => {
                        return  res.json(Common.generateResponse(0,resp))
                    })
                    .catch(err=> {
                        return res.json(Common.generateResponse(100,err));
                    })
            } else if (req.body.usertype==='Bulk') {
                Expenses.insertMany(req.body.bulkData)
                    .then(result => {
                        return res.json(Common.generateResponse(0,result))
                    })
                    .catch(err=> {
                        console.log(err);
                        return res.json(Common.generateResponse(100,err));
                    })
            }
        })

};
exports.getAllExpance = (req,res) => {
  Expenses.find({group: req.params.groupId}).populate('group').populate({path: 'uploadedBy', select: '-password'})
      .then(resp => {
          return res.json(Common.generateResponse(0,resp));
      })
      .catch(err=> {
          return res.json(Common.generateResponse(100,err));
      })
};

exports.fileUpload = (req,res) => {
    const url = req.protocol + '://' + ip.address() + ':'+ req.get('host').split(':')[1];
    const path = url+'/images/'+req.file.filename;
    res.status(200).json(Common.generateResponse(0,path));
};

exports.approve = (req,res) => {
    let uploadedBy;
    let amount;
    Expenses.findOneAndUpdate({_id: req.body.expId} ,{approved: true})
        .then(result => {
            console.log(result);
            uploadedBy = result.uploadedBy;
            amount = result.amount;
            return  Group.findOne({_id: result.group});
        })
        .then(resp => {
            const amountperhead = amount/resp.members.length;
            console.log(amountperhead);
            const data = [];
            resp.members.forEach(ele => {
               const single = {
                    user: ele,
                    expense: req.body.expId,
                    amount: amountperhead
                };
               data.push(single);
            });
            return  Payment.insertMany(data);
        })
        .then(resp => {
           return Payment.findOne({expense: req.body.expId,user: uploadedBy});
        })
        .then( resp=> {
            console.log(resp);
            resp.amountfromothers = amount -resp.amount;
            resp.status = true;
            return  resp.save();
        })
        .then(resp => {
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=> {
            console.log(err);
            return res.json(Common.generateResponse(100, err));
        })
};
exports.paid = (req,res) => {
    console.log(req.body);
    let amount;
    Payment.findOneAndUpdate({_id: req.body.pid}, {status: true})
        .then(resp=> {
            console.log(resp);
            amount= resp.amount;
            return Payment.findOne({expense: req.body.eid, amountfromothers: {$gt: 0}})
        })
        .then(resp => {
            resp.amountfromothers = resp.amountfromothers-amount;
            return resp.save();
        })
        .then(resp=> {
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=> {
            console.log(err);
            return res.json(Common.generateResponse(100, err));
        })
};

exports.getAllPayment  = (req,res) => {
  Payment.find({user: req.user.userId})
      .populate('user').populate('expense')
      .then(resp=> {
      return res.json(Common.generateResponse(0, resp));
  })
      .catch(err=> {
          console.log(err);
          return res.json(Common.generateResponse(100, err));
      })
};


