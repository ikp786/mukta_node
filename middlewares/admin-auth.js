import CustomErrorHandler from "../services/CustomErrirHandler";
import JwtService from "../services/JwtService";

const adminAuth = async (req,res,next) => {
  
    const {cookies} = req;
    const authHeader = cookies.admin_auth_token;

    if(!authHeader){
        return res.redirect('/admin/login');
        // return next(CustomErrorHandler.unAuthorized())
    }    
    const token = authHeader;
    try {
        const {_id,role} = await JwtService.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();
    } catch (err) {        
        // return next(CustomErrorHandler.unAuthorized())        
        return res.redirect('/admin/login');

    }
}
export default adminAuth; 