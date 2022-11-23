import Joi from "joi";
import { RefreshToken, User } from "../../../models";
import bcrypt  from 'bcrypt';
import CustomErrorHandler from "../../../services/CustomErrirHandler";
import JwtService from "../../../services/JwtService";
import { REFRESH_SECRET } from "../../../config";


const loginController = {

    async loginView(req,res,next){    
        res.render('admin/login')    
    },


    async dashboard(req,res,next){     
  
      req.flash('message')
      res.render('admin/dashboard',{message:"success login" });
  },


    async login(req,res,next){
        const loginSchema = Joi.object({
      email: Joi.string().email().required(),      
      password: Joi.string().required(),
        });
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(error);
      }

      try {
        const user = await User.findOne({email:req.body.email});
      
        if(!user){
            return next(CustomErrorHandler.wrongCredentials());
        }
        // return res.json({user})
        
        
        const match = await bcrypt.compare(req.body.password,user.password);
        // res.json({match,user})
        if(!match){
            return next(CustomErrorHandler.wrongCredentials());
        }
        // Token
       
      const access_token = JwtService.sign({ _id: user._id, role: user.role }, "1y");

      const refresh_token = JwtService.sign({ _id: user._id, role: user.role },'1y',REFRESH_SECRET);

      // database whitelist
      await RefreshToken.create({token: refresh_token});
      res.cookie('admin_auth_token',access_token);



      // req.flash('message', 'This is a flash message using the express-flash module.');

      return res.redirect('/admin/dashboard');

      res.json({access_token,refresh_token})

      } catch (err) {
        return next(err);
      }

    },

    async logout(req,res,next){

      // validation
 
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),  
    });
        
const { error } = refreshSchema.validate(req.body);
if (error) {
    return next(error);
  }


      try {
        await RefreshToken.deleteOne({ token: req.body.refresh_token });
      } catch (err) {
        return next( Error('Something went wrong in the database'));
      }
      return res.redirect('/admin/login');

      

    }

};

export default loginController;