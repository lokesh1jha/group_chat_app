const User = require("../models/user")
const Conversation = require('../models/conversation')
const Groups = require('../models/groups')

exports.createGroup = (req,res,next)=>{
    const {name} = req.body
    if (name == undefined || name.length === 0) {
        return res.status(400).json({ err: "Parameters Missing" });
      } else {
        let user = req.user;
        Groups.create({name:name})
        .then(group=>{
          Conversation.create({isadmin:true,userId:user.id,groupId:group.id})
          .then(response=>{
              res.status(201).json({response, success:true, message:'Group Created'})
          })
           })
      .catch(err=>{
          res.status(500).json({message:'Something went wrong',err})
      })
      }
}

exports.fetchGroup = (req,res,next)=>{
  Conversation.findAll({where:{userId:req.user.id,}, include: [
    {
      model: Groups,
      required: false,
    },
  ],})
  .then(response=>{
    res.status(200).json({data:response,success:true})
  })
  .catch(err=>{
    res.status(500).json({message:'something went wrong',err})
  })
}

exports.getGroupUser = (req,res,next)=>{
  const groupid = req.params.id
  Conversation.findAll({where:{groupId:groupid}, include: [
    {
      model: User,
      required: false,
    },
  ]})
  .then(response=>{
    res.status(200).json({data:response,success:true,myuser:req.user})
  })
  .catch(err=>res.status(500).json({message:'Something went wrong'}))
}