// import { Category } from "../../../models";
// import CustomErrorHandler from "../../../services/CustomErrirHandler";
import { Category } from "../../models";
//import productSchema from '../validators/productValidator';
// import categorytSchema from '/validators/categoryValidator'

const CategoryController = {  
  async index(req,res,next){       
    req.flash('message')
    res.render('admin/categories/index',{message:"categories success" });
},

async create(req,res,next){       
  req.flash('message')
  res.render('admin/categories/create',{message:"categories create" });
},

async store(req,res,next){   
                             
      // const { error } = categorytSchema.validate(req.body);
      // if(error){  
      //     return next(error);
      // }
      const {name} = req.body;
const categoryData = new Category({
name,
});
      try {
          document = await categoryData.save();
          console.log(document);
      } catch (err) {
          return next(err);
      }            
      res.status(201).json(document);
  
},

};

export default CategoryController;
