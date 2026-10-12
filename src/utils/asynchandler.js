const asynchandler = (requestHandler) => (req,res,next) => {
    Promise.resolve(requestHandler(req,res,next)).
    catch(err => next(err))

}
 
export  { asynchandler}  




    














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