var express = require('express');
var multer  = require('multer');
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Set Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,Date.now() + "-" + file.originalname.hashCode() + path.extname(file.originalname))
  }
})

//Init Upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize:10000000
  },
  fileFilter: function(req,file,cb) {
    checkFileType(file,cb)
  }
}).single('avatar')

function checkFileType(file,cb){
  //allowed extensions
  const filetypes =/jpeg|jpg|png|gif/;
  //check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mimetype
  const mimetype = filetypes.test(file.mimetype);
  if(extname && mimetype){
    return cb(null,true)
  } else{
    cb('Images only')
  }
}

var app = express();

app.use(express.static(__dirname+'public'));

app.set('view engine','ejs');
app.set('views','./views/');

// Public Folder
app.use(express.static('./public'))


app.post('/upload', function (req, res) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  upload(req,res,(err)=>{
    if(err){
      res.render('index',{
        msg: err
      })
    } else {
      if (req.file==undefined){
        res.render('index',{
          msg: 'No file selected'
        })  
      } else {
        console.log(`uploads/${req.file.filename}`)
        res.render('index',{
          msg: 'File Uploaded',
          image: `uploads/${req.file.filename}`,
          imagesArray: GetImagesArray(1,6)  
        })
      }
    }
  });
  //res.status(200).send('file received');
});
function GetImagesArray(start,end){
  let images = fs.readdirSync(path.join(__dirname,'public','uploads'));
  images.sort((a,b)=> b>a ? 1 : -1);
  return images.slice(start,end)
}

app.get('/', function(req, res){
  res.render('index',{
    imagesArray:GetImagesArray(0,5)
  });
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});