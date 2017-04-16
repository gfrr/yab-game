$(document).ready(function(){
 $("#game-play").toggle();
 start();
});


function start(){
  $("#start").click(function(){
    $("#intro").toggle();
    $("#game-play").toggle();
    $("#enemy-ships").toggle();
  });
}
