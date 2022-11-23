import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { APP_URL } from '../config';
const categorySchema = new Schema(
    {
        name: { type: String, required: true },               
    },
    { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model('Category', categorySchema, 'categories');
