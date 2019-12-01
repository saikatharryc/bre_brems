const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('./db_connect');
app.use(express.json());
const brie = require("brie");
const  {getAllRules,getRuleById,createRule} = require('./helpers/rules_helper')

app.post('/rules',async(req,res,next)=>{
    const createRules =  await createRule(req.body);
    return res.json(createRules)
})
app.get('/rules',async(req,res,next)=>{
    try{
   const result = req.query.id ? await getRuleById(req.query.id) : await getAllRules();
   return res.json(result)
    }catch(ex){
        return res.send(ex)
    }
})

app.post('/',async(req,res,next)=>{
    try{
    const ruleSet =req.body.rule_id ? await getRuleById(req.body.rule_id) : req.body.rule_set;
    const brieResult=brie.setup({
        data: req.body.data_input,
        features: ruleSet
      }).getAll()
    return res.json(brieResult)
    }catch(ex){
        return res.send(ex)
    }
});




app.listen(port);
console.info('[Server] txns server started on: ' + port);
