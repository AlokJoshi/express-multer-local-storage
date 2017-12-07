# express-multer-local-storage
Uses Nodejs, express, multer, ejs and materialize to upload files and display last 5 uploaded

This is based on a you-tube video from Traversy Media. I wanted to understand how to upload images to the public/uploads (or any other) 
folder on the server

The renaming of the files includes the string returned by Date.now() and a simple hash of the original name of the file. I did this just 
in case two users upload the file at the same exact time (though this is very unlikely).

