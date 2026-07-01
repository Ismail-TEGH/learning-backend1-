import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const vedioSchema = new Schema({
    vedioFile:{
        type : string,
        required : true,
    },
    thumbnail:{
        type : string,
        required : true,
    },
    title:{
        type : string,
        required : true,
    },
     description:{
        type : string,
        required : true,
    },
    duration:{
        type : Number ,
        required : true,
    },
    views:{
        type : Number,
        defult : 0,
    },
    isPublished:{
        type : boolean,
        defult : true,
    },
    owner:{
        type : Schema.Types.ObjectId,
        ref : "User",
     },

    
},{
    timrestamp : true,
})
vedioSchema.plugin(mongooseAggregatePaginate);
export const Vedio = mongoose.model("Vedio", vedioSchema);
