var i = 0;
var txt = '       THE SEA IS HISTORY';
var speed = 80;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("text").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
  $(".slider").fadeIn();
  
}

