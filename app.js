const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', function(req, res){
   res.send('Hello world');
})

app.listen(PORT, () =>{
    console.log("Server is ruuning on port " + PORT);
})