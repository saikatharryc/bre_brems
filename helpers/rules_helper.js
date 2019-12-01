const Rules = require('../models/rulesMap');

const createRule = (data)=>{
    const base64Data =  Buffer.from(JSON.stringify(data)).toString('base64');
    const savableObj = new Rules({
        rule_set:base64Data
    })
    return savableObj.save();
}

const getAllRules = async()=>{
   const allRules=await Rules.find().lean().exec();
   return allRules.map(i=>{
       return {
           _id:i._id,
           rule_set: JSON.parse(Buffer.from(i.rule_set,'base64').toString())
       }
   })
}

const getRuleById = async(id)=>{
    const ruleSet =  await Rules.findOne({_id:id}).lean();
   return JSON.parse( Buffer.from(ruleSet['rule_set'],'base64').toString())

}

module.exports={
    createRule,
    getAllRules,
    getRuleById
}