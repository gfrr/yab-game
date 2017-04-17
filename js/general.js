$(document).ready(function(){
 $("#game-play").toggle();
 start();
 selectShip();
 rotateShip();
});

//helper function that avoids the manual writing of the game grids
function appendGrid(target, size) {
  _.times(size, function(){
     var row = $("<div class='row'></div>");
     _.times(size, function(){
       $(row).append("<div class='col water' ></div>");
     });
     $(target).append(row);
  });
}

function start(){
  $("#start").click(function(){
    $("#intro").toggle();
    $("#game-play").toggle();
    appendGrid("#player-ships", 10);
    $("#enemy-ships").toggle();
  });
}

function selectShip(check){
  $(".s").click(function(){
     addShipOnGrid(returnShipType($(this)), this);
  });
}

function returnShipType(elem){
  if(elem.hasClass("aircraft-carrier")) return 5;
  if(elem.hasClass("battleship")) return 4;
  if(elem.hasClass("cruiser")) return 3;
  if(elem.hasClass("destroyer")) return 2;
  if(elem.hasClass("submarine")) return 1;
}

function addShipOnGrid(size, caller){
     console.log("called");
     $(".col").hover(function(){
       var check = generateShip(this, size);
       console.log($(".test").hasClass("water"));

       $(this).click(function(){
          if(check){
              $(".test").addClass("final");
              $(".test").removeClass("water");
              $(".test").removeClass("test");
              $(caller).remove();
              size = 0;
          }

       });
     },function(){
       $(".col").removeClass("test");
     });

}

function rotateShip() {
  $("#rotate").click(function(){
    $(this).toggleClass("vertical");
  });
}

function generateShip(target, size){
    var currentTarget = target;
    if($("#rotate").hasClass("vertical")){
      for(var i = 0, index = $(currentTarget).index(); i < size; i++){
        if(i > 0){
          currentTarget = $(currentTarget).parent().next();
          currentTarget = $(currentTarget).children(".col");
          currentTarget = $(currentTarget[index]);
        }
        if(!$(currentTarget).hasClass("water")) break;
        $(currentTarget).addClass("test");
      }
    }
     else {
        for(var j = 0; j < size; j++){
          if(j > 0){
            currentTarget = $(currentTarget).next();
          }
          if(!$(currentTarget).hasClass("water")) break;
          $(currentTarget).addClass("test");
        }
      }

   if($(".test").length != size){
     console.log("puff!");
     $(".test").removeClass("test");
     return false;
   }
   return true;
}
