$(document).ready(function(){
 $("#game-play").toggle();
 start();
 selectShip();

});


function start(){
  $("#start").click(function(){
    $("#intro").toggle();
    $("#game-play").toggle();
    $("#enemy-ships").toggle();
  });
}

function selectShip(check){
  $(".s").click(function(){
     console.log(returnShipType($(this)));
     addShipOnGrid();
  });
}

function returnShipType(elem){
  if(elem.hasClass("aircraft-carrier")) return "aircraft-carrier";
  if(elem.hasClass("battleship")) return "battleship";
  if(elem.hasClass("destroyer")) return "destroyer";
  if(elem.hasClass("cruiser")) return "cruiser";
  if(elem.hasClass("submarine")) return "submarine";
}


function addShipOnGrid(){
     console.log("called");
     $(".col").hover(function(){
       $(this).addClass("test");
     },function(){
       $(this).removeClass("test");
     });
}
