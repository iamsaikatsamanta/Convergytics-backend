const User = require('../Model/user');
const Admin = require('../Model/admin');
const Common = require('../utils/response');
// const jwt = require('jsonwebtoken-=');
const bcrypt = require('bcryptjs');
const Config = require('../config/config');


exports.newUser = (req,res) => {
    bcrypt.hash(req.body.password ,12 ).then(hash => {
        const user= new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then(resp => {
                return res.json(Common.generateResponse(0, resp));
            })
            .catch(err => {
                return res.json(Common.generateResponse(100, err));
            })
    })
      .catch(err => {
          if (err.code === '11000') {
              return res.json(Common.generateResponse(5, err));
          }
        return res.json(Common.generateResponse(100, err));
    });

};

exports.loginUser = (req,res) => {
    let fetcheduser;
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.json(Common.generateResponse(4))
            }
            fetcheduser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.json(Common.generateResponse(4))
            }
            const token = jwt.sign({userId: fetcheduser._id, moderator: fetcheduser.moderator, name: fetcheduser.name, group: fetcheduser.group},
                Config.JWT_SECRET_USER.Secret,
                {expiresIn: '6h'});
            return  res.json(Common.generateResponse(0,token));
        })
        .catch(err => {
            return  res.json(Common.generateResponse(100,err));
        })
};

exports.adminLogin = (req,res) => {
    let fetcheduser;
    console.log(req.body);
    Admin.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.json(Common.generateResponse(4))
            }
            fetcheduser = user;
            console.log(user);
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            console.log(result);
            if (!result) {
                return res.json(Common.generateResponse(4))
            }
            const token = jwt.sign({userId: fetcheduser._id, moderator: fetcheduser.moderator, name: fetcheduser.name},
                Config.JWT_SECRET_ADMIN.Secret,
                {expiresIn: '6h'});
            return  res.json(Common.generateResponse(0,token));
        })
        .catch(err => {
            return  res.json(Common.generateResponse(100,err));
        })
};
