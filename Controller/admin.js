const User = require('../Model/user');
const Group = require('../Model/group');
const Common = require('../utils/response');

exports.getAllUser = (req,res) => {
  User.find()
      .select('-password')
      .then(resp => {
          return res.json(Common.generateResponse(0, resp));
      })
      .catch(err => {
          return res.json(Common.generateResponse(100,err));
      })
};

exports.createGroup = (req,res) => {
    const group = new Group({
        name: req.body.name,
        members: [req.body.moderator],
        moderator: req.body.moderator
    });
    group.save()
        .then(result => {
            console.log(result);
            return  User.findByIdAndUpdate(req.body.moderator, {moderator : true, group: result._id});
        })
        .then(resp => {
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err => {
            return res.json(Common.generateResponse(100,err));
        })
};

exports.getGroupDataById = (req,res) => {
  Group.findOne({_id: req.params.id}).populate({path: 'members', select: '-password'}).populate({path: 'moderator', select: '-password'})
      .then(resp => {
          return res.json(Common.generateResponse(0, resp));
      })
      .catch(err => {
          return res.json(Common.generateResponse(100, err));
      })
};

exports.getAllGroupName = (req,res) => {
  Group.find()
      .select('name')
      .then(resp => {
          return res.json(Common.generateResponse(0, resp));
      })
      .catch(err => {
          return res.json(Common.generateResponse(100, err));
      })
};

exports.AddMember  = (req,res) => {
  Group.findOneAndUpdate({_id: req.body.groupId}, {$push: {members: req.body.userId}})
      .then(resp => {
          return User.findByIdAndUpdate(req.body.userId, {group: req.body.groupId});
      })
      .then(resp => {
          return res.json(Common.generateResponse(0,resp));
      })
      .catch(err =>{
          return res.json(Common.generateResponse(100,err));
      });
};
