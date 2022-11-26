import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { APP_URL } from '../config';
const ProductSchema = new Schema(
    {
        name: { type: String, required: true },         

        category_id:{
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
            ref: 'Category',
        
        },
        
        price: { type: String, required: true },  
        discount_price: { type: String, required: true },  
        description: { type: String, required: true },  
        
        image:{type:String, required:true,
            get: (image) =>{        
                return `${APP_URL}/${image}`;
            }            
    },
},
    { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model('Product', ProductSchema);
