
console.log('Main.js loaded.');
let myBtn  = document.getElementById("myBtn");

myBtn.addEventListener('click', myFunction);
let flag = true;

function myFunction(){
    console.log('Hello');
    let dotTxt = document.getElementById("dot");
    let moreTxt = document.getElementById("more");
    let bodyImg = document.getElementById('body-img');
    if(flag){
        moreTxt.style.display = "block";
        dotTxt.style.display = "none";
        bodyImg.className = 'body-img-lg';
        flag = false;
    }
}


