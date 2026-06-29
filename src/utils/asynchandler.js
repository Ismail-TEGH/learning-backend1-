const asynchandler = (requestHandler) => (req,res,next) => {
    promise.resolve(requestHandler(req,res,next)).
    catch(err => next(err))

}
 
export default asynchandler



















// const asynchandler = (fn) => (req, res, next) => {
//     try{
//         await fn(req, res, next)

//     }catch(err){
//         res.status(err.statusCode || 500).json({
//             success: false,
//             message: err.message || "internal server error"
//         })
//     }   
// }