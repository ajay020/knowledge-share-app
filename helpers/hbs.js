const moment = require('moment');
module.exports = {
  ifCond: function(v1, v2, options){
    let a = JSON.stringify(v1);
    let b = JSON.stringify(v2);

    if(b === a){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
 },
 getShortPost(body){
    if(body.length < 150){
        return body;
    }
    return body.substring(0,149)+ "..." + " <span id='myBtn'><b>Read more</b></span> ";
 },
 formatDate(date, format){
    return moment(date).format(format);
 }
} 