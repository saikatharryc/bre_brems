const mongoose = require("mongoose");

var RulesSchema = mongoose.Schema(
  {
    rule_set:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);
const Rules =mongoose.model("Rules", RulesSchema);

module.exports = Rules;
