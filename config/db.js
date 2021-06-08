const mongoose = require('mongoose');
// const URI = 'mongodb://localhost:27017/blog_app';

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify: false,
        })

        console.log(`MongoDB Connected: ${conn.connection.host} `)
    } catch(err){
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB;

// module.exports = {
//     init: function (){
    
//         // Connect to db
//         mongoose.connect( uri,{
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//          });
    
//         const db = mongoose.connection;
//         db.on('error', console.error.bind(console, 'connection error:'));
        
//         db.once('open', function() {
//           console.log('We are connected to db');
          
//         })
//         db.on('error', err => {
//             console.error('connection error:', err)
//           })
//     }
// }
