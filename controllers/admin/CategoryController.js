// import { Category } from "../../../models";

import { Category } from "../../models";
import CustomErrorHandler from "../../services/CustomErrirHandler";
//import CategorySchema from '../validators/CategoryValidator';
// import categorytSchema from '/validators/categoryValidator/'
import categorySchema from "../../validators/categoryValidator";

const CategoryController = {
     
async index(req,res,next){
  let document;
  // pagination. mongoose-pagination
  try {
      document = await Category.find().select('-updatedAt -__v').sort({_id:-1});
      
  } catch (err) {
      return next(CustomErrorHandler.serverError());
  }
  //  return res.json(document);
  req.flash('message')
    res.render('admin/categories/index',{message:"categories success",'categories':document });
},

async create(req,res,next){       
  req.flash('message')
  res.render('admin/categories/create',{message:"categories create" });
},

async store(req,res,next){   
               
  let document;
      const { error } = categorySchema.validate(req.body);
      if(error){  
          return next(error);
      }
      const {title} = req.body;
const categoryData = new Category({
title,
});
      try {
          document = await categoryData.save();
          console.log(document);
      } catch (err) {
          return next(err);
      }            
      return res.redirect('/admin/categories/index');
      res.status(201).json(document);
  
},

async edit(req,res,next){
  let document;  
  try {
      document = await Category.findOne({_id: req.params.id}).select('-updatedAt -__v');      
  } catch (err) {
      return next(CustomErrorHandler.serverError());
  }
  req.flash('message')
    return res.render('admin/categories/edit',{message:"categories success",'category':document });
  return res.json(document);
},

async update(req,res,next){
  
      const { error } = categorySchema.validate(req.body);            
      if(error){
          
              if(error){
                  console.log(err.message);
          return next(CustomErrorHandler.serverError(err.message));
              }     
          return next(error);
      }
      const {title} = req.body;
         let document;
      try {
          document = await Category.findOneAndUpdate({_id: req.params.id},{
              title,
          },{new: true });
      } catch (err) {
          return next(err);
      }            
      return res.redirect('/admin/categories/index');
      res.status(201).json(document);  
},
async destroy(req,res,next){
  const document = await Category.findByIdAndRemove({_id: req.params.id});
  if(!document){
      return next(new Error('Nothing to delete'));
  } 
  return res.redirect('/admin/categories/index');
  return res.json(document);
},
};
export default CategoryController;
