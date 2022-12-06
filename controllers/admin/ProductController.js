import { Category, Product } from "../../models";
import CustomErrorHandler from "../../services/CustomErrirHandler";
import ProductSchema from "../../validators/ProductValidator";
import multer from 'multer';
import path from 'path';
import fs from "fs";
import mongoose from "mongoose";
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null,'uploads/products/'),
    filename: (req, file, cb) => {
       const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
});
const handleMultipartdata = multer({storage, limits:{fileSize: 100000 * 5 }}).array('image',5) // 5mb
const ProductController = {
 // RETREVE DATA FROM DB
async index(req,res,next){
  let document;
  // pagination. mongoose-pagination
  try {      
       document = await Product.find().populate('category_id').select('-updatedAt -__v').sort({_id:-1});
      // return res.json({document})
  } catch (err) {
      return next(CustomErrorHandler.serverError());
  }

  req.flash('message')
    res.render('admin/products/index',{message:"products success",'products':document });
},
// CREAT VIEW
async create(req,res,next){   
    let document;   
    try {
        document = await Category.find().select('-updatedAt -__v').sort({_id:-1});        
    } catch (err) {
        console.log(err)
        return next(CustomErrorHandler.serverError());
    }     
  req.flash('message')
  res.render('admin/products/create',{message:"products create",'categories':document  });
},
// STORE DATA IN DB
async store(req,res,next){
    // multipart form data
    try {
    handleMultipartdata(req,res, async (err) => {   

        const filePath = req.files;
      
        let document;
        if(err){
            console.log(filePath);
            return next(CustomErrorHandler.serverError(err.message))
        }
       
        //return res.json({filePath})
        //validatoin
        const { error } = ProductSchema.validate(req.body);
        
        if(error){
    if(req.files){
            fs.unlink(`${appRoot}/${filePath}`, (err) => {
                if(err){
            return next(CustomErrorHandler.serverError(err.message));
                }
            });
        }
            return next(error);
        }
        const {name,category_id,description,price,discount_price} = req.body;
        //return res.json(category_id,description,price,discount_price);
const ProductData = new Product({
    name,    
    category_id:category_id.trim(),
    description,
    price,
    discount_price,
...(req.files && {image:filePath.map(v=>v.path)})
});
        try {
            document = await ProductData.save();
            console.log(document);
        } catch (err) {
            return next(err);
        }            
        return res.redirect('/admin/products/index');
        res.status(201).json(document);
    });
} catch (err) {
    return next(err);
}
},

// EDIT VIEW
async edit(req,res,next){
  let document;  
  let categories;
  try {
      categories = await Category.find().select('-updatedAt -__v').sort({_id:-1});
      document = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v');     
       
  } catch (err) {
      return next(CustomErrorHandler.serverError());
  }
  req.flash('message')
    return res.render('admin/products/edit',{message:"products success",'product':document,'categories':categories });
  return res.json(document);
},
// UPDATE IN DB
async update(req,res,next){
    // multipart form data
    handleMultipartdata(req,res, async (err) => {
        if(err){
            return next(CustomErrorHandler.serverError(err.message))
        }     
        let filePath;
        if(req.file){
            filePath = req.file;
        }
        const { error } = ProductSchema.validate(req.body);            
        if(error){
            fs.unlink(`${appRoot}/${filePath}`, (err) => {      
                if(err){
                    console.log(err.message);
            return next(CustomErrorHandler.serverError(err.message));
                }
            });
            return next(error);
        }
        const {name,description,price,discount_price} = req.body;
           let document;
        try {
            document = await Product.findOneAndUpdate({_id: req.params.id},{
                name,
                description,
                price,
                discount_price,
                ...(req.file && {image:filePath.path.toString()})
            },{new: true });
        } catch (err) {
            return next(err);
        }            
        return res.redirect('/admin/products/index');
        res.status(201).json(document);
    });
},

// DELETE IN DB
async destroy(req,res,next){
    try {
    const document = await Product.findByIdAndRemove({_id: req.params.id});
    //  console.log(document);
    if(!document){
        return next(new Error('Nothing to delete'));
    }
    // image delete
    const imagePath = document._doc.image;
    fs.unlink(`${appRoot}/${imagePath}`,(err) => {
        if(err){
            return next(CustomErrorHandler.serverError());
        }
    });
    return res.redirect('/admin/products/index');
    return res.json(document);
} catch (err) {
    return next(err);
}
},
};
export default ProductController;
