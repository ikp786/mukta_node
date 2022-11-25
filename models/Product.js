import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { APP_URL } from '../config';
const SliderSchema = new Schema(
    {
        title: { type: String, required: true },  
        
        image:{type:String, required:true,
            get: (image) =>{        
                return `${APP_URL}/${image}`;
            }            
    },
},
    { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model('Slider', SliderSchema);
