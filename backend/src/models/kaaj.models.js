/*Defines the structure of a
Karigor work item in database*/
const mongoose = require("mongoose");;

const kaajSchema = new mongoodse.Schema(
  {
    karigorName: {
      type:String,
      required:[true,"Karigor name is required"],
      trim:true,
    },
    karigorPhone:{
      type:String,
      trim:true,
      default:null,
    },
    kaajName:{
      type:String,
      required:[true,"Kaaj name is required"],
      trim:true,
    },
    properties:{
      type:String,
      required:[true,"Kaaj properties are required"],
      trim:true,
    },
    notes:{
      type:String,
      trim:true,
      maxlength:[200,"Notes cannot exceed 200 characters"],
      default:null,
    },
    issuedDate:{
      type:Date,
      required:[true,"Issued date is required"],
    },
    issueOjon:{
      type:Number,
      requitred:[true,"Issue weight is required"],
    },
    receivedDate:{
      type:Date,
      default:null,
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
},
{timestamps:true}
);

// Virtual field - status (not stored in DB)
kaajSchema.virtual("status").get(function () {
  if (this.receiveDate) return "done";
  const today = new Date();
  const issued = new Date(this.issueDate);
  const daysPassed = Math.floor(
    (today - issued) / (1000 * 60 * 60 * 24)
  );
  if (daysPassed >= 4) return "red";
  if (daysPassed >= 2) return "yellow";
  return "green";
});

// Virtual field - extraOjon (not stored in DB)
kaajSchema.virtual("extraOjon").get(function () {
  if (this.issueOjon && this.receiveOjon) {
    return (this.issueOjon - this.receiveOjon).toFixed(3);
  }
  return null;
});

// Include virtuals when converting to JSON
kaajSchema.set("toJSON", { virtuals: true });
kaajSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Kaaj", kaajSchema);