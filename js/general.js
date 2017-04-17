$(document).ready(function(){
 var playerFleet = new Fleet();
 var enemyFleet = new Fleet();
 enemyFleet.generateEnemyFleet();
 $("#game-play").toggle();
 start();
 selectShip(playerFleet);
 rotateShip();

 var gameReady = setInterval(function(){

   if($("#ships").children().length === 0){
     $("#setup").toggle();
     $("#player-ships").css("width", "30%");
     $("#player-ships").css("border-bottom", "10px solid #DAF7A6");
     appendGrid("#enemy-ships", 10);
     $("#enemy-ships").css("border-bottom", "10px solid rgb(255, 100, 100)");
     $("#enemy-ships").toggle();
     fire(playerFleet, enemyFleet);
     clearInterval(gameReady);

   }
 }, 400);

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

function selectShip(fleet){
  $(".s").click(function(){
     addShipOnGrid(returnShipType($(this)), this, fleet);
  });
}

function returnShipType(elem){
  if(elem.hasClass("aircraft-carrier")) return 5;
  if(elem.hasClass("battleship")) return 4;
  if(elem.hasClass("cruiser")) return 3;
  if(elem.hasClass("destroyer")) return 2;
  if(elem.hasClass("submarine")) return 1;
}

function addShipOnGrid(size, caller, fleet){
     $(".col").hover(function(){
       var check = generateShip(this, size);
       $(this).click(function(){
          if(check){
              $(".test").addClass("final");
              $(".test").removeClass("water");
              $(".test").removeClass("test");
              $(caller).remove();
              var dir = $("#rotate").hasClass("vertical") ? 1 : 0;
              var cord = {
                y: $(this).parent().index(),
                x: $(this).index()
              };
              var ship = new Ship(size, dir, cord);
              ship.draw(fleet.grid);
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
     $(".test").removeClass("test");
     return false;
   }
   return true;
}


function fire(fleetAttacker, fleetTarget){
  $(".col").hover(function(){
        if($(this).parent().parent().is("#enemy-ships")){
            $(this).click(function(){
              var cord = {
                y: $(this).parent().index(),
                x: $(this).index()
              };
               fleetAttacker.shot(cord, fleetTarget.grid);
            });
        }

      });
}
