import { Product } from "../../models";
import CustomErrorHandler from "../../services/CustomErrirHandler";
import ProductSchema from "../../validators/ProductValidator";
import multer from 'multer';
import path from 'path';
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null,'uploads/'),
    filename: (req, file, cb) => {
       const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
});
const handleMultipartdata = multer({storage, limits:{fileSize: 100000 * 5 }}).single('image') // 5mb
const ProductController = {
 
async index(req,res,next){
  let document;
  // pagination. mongoose-pagination
  try {
      document = await Product.find().select('-updatedAt -__v').sort({_id:-1});
      
  } catch (err) {
      return next(CustomErrorHandler.serverError());
  }
  //  return res.json(document);
  req.flash('message')
    res.render('admin/products/index',{message:"products success",'products':document });
},

async create(req,res,next){       
  req.flash('message')
  res.render('admin/products/create',{message:"products create" });
},

async store(req,res,next){
    // multipart form data
    try {
    handleMultipartdata(req,res, async (err) => {   
        let document;         
        if(err){
            return next(CustomErrorHandler.serverError(err.message))
        }                      
        const filePath = req.file.path;
        //validatoin                          
        const { error } = ProductSchema.validate(req.body);
        if(error){
    if(req.file){
            fs.unlink(`${appRoot}/${filePath}`, (err) => {      
                if(err){
            return next(CustomErrorHandler.serverError(err.message));
                }
            });
        }
            return next(error);
        }
        const {title} = req.body;
const ProductData = new Product({
title,
...(req.file && {image:filePath})
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

async edit(req,res,next){
  let document;  
  try {
      document = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v');     
       
  } catch (err) {
      return next(CustomErrorHandler.serverError());
  }
  req.flash('message')
    return res.render('admin/products/edit',{message:"products success",'product':document });
  return res.json(document);
},
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
        const {title} = req.body;
           let document;
        try {
            document = await Product.findOneAndUpdate({_id: req.params.id},{
                title,
                ...(req.file && {image:filePath.path.toString()})
            },{new: true });
        } catch (err) {
            return next(err);
        }            
        return res.redirect('/admin/products/index');
        res.status(201).json(document);
    });
},

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
