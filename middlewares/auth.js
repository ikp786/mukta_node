import CustomErrorHandler from "../services/CustomErrirHandler";
import JwtService from "../services/JwtService";

const auth = async (req,res,next) => {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    //let authHeader = req.headers.authorization;    
    const {cookie} = req.headers;
    if(!cookie){
        return next(CustomErrorHandler.unAuthorized())
    }
    const token = cookie.split("admin_auth_token=")[1];
    console.log(token)
    res.json({token: authToken})
    try {
        const {_id,role} = await JwtService.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();
    } catch (err) {        
        return next(CustomErrorHandler.unAuthorized())        
    }
}
export default auth; 