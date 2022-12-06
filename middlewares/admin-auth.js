import CustomErrorHandler from "../services/CustomErrirHandler";
import JwtService from "../services/JwtService";

const adminAuth = async (req,res,next) => {
    
    //console.log("yyy",req.headers.cookie)
    // return false;
  
    const {cookie} = req.headers;
    console.log("dfsdfsddsfds",cookie)
    
    // console.log("token___token",cookie.split("admin_auth_token=")[1]);
    if(typeof cookie == 'undefined'){
        return res.redirect('/admin/login');        
    }

    let authToken = cookie.split("admin_auth_token=")[1];
    console.log("authToken", authToken);
    if(typeof authToken == 'undefined'){
        return res.redirect('/admin/login');        
    }
    authToken = authToken.split(" ")[0].replace(';', '');
    
    if(typeof authToken == 'undefined'){
        return res.redirect('/admin/login');        
    }
    //const authHeader = cookie.admin_auth_token;

    
    if(!authToken){
        return res.redirect('/admin/login');
        // return next(CustomErrorHandler.unAuthorized())
    }    
    
   
    
    try {
        console.log({t: authToken});
        const {_id, role} = await JwtService.verify(authToken);
        console.log({t: authToken});
        const user = {
            _id,
            role
        }
        req.user = user;
        
        
        next();
    } catch (err) {   
        console.log("err", err)     
        // return next(CustomErrorHandler.unAuthorized())        
        
        return res.redirect('/admin/login');

    }
}
export default adminAuth; 