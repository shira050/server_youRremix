// const express= require("express");
// const path = require("path");
// const router = express.Router();

// router.get("/" , (req,res)=> {
//   res.json({msg:"Upload work!"})
// })

// router.post("/", async(req,res) => {
//   debugger
//   let myFile = req.files["myFile"];

//   if(!myFile){
//     return res.status(400).json({msg:"You need to send file"});
//   }
//   if(myFile.size > 1024 * 1024 * 2){
//     return res.status(400).json({msg:"File too big (max 2mb)"});
//   }
//   // סיומות שמותר למשתמש לעלות
//   let exts_ar = [".png",".jpg","jpeg",".gif"];
//   // יכיל את הסיומת של הקובץ ששלחתי לשרת
//   let extFileName = path.extname(myFile.name);
//   if(!exts_ar.includes(extFileName)){
//     return res.json({msg:"File ext not allowed , just img file for web !"})
//   }

//   myFile.mv("https://res.cloudinary.com/diallwuuh/image/upload/v1688383227/images/"+myFile.name,(err) => {
//     if(err){
//       console.log(err)
//       return res.status(400).json({msg:"There problem"});
//     }
//     res.json({msg:"File uploaded"})
//   })
// })

// module.exports = router;