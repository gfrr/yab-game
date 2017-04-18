$(document).ready(function(){
 var playerFleet = new Fleet();
 var enemyFleet = new Fleet();
 enemyFleet.aiLevel = 1;
 enemyFleet.generateEnemyFleet();
 settings();
 $("#settings").toggle();
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

function settings(){
  $("#set").click(function(){
    $("#intro").toggle();
    $("#settings").toggle();
  });
}


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
              var dir = $(".rotate").hasClass("vertical") ? 1 : 0;
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
  $(".rotate").click(function(){
    $(this).toggleClass("vertical");
  });
}

function generateShip(target, size){
    var currentTarget = target;
    if($(".rotate").hasClass("vertical")){
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

            $(".col").on("click", function(event){
              if($(this).parent().parent().is("#enemy-ships")){
              if(!$(this).hasClass("hit") && (!$(this).hasClass("miss"))){
                var cord = {
                  y: $(this).parent().index(),
                  x: $(this).index()
                };

                var playerHit = fleetAttacker.shot(cord, fleetTarget.grid);

                 if(playerHit){
                    $(this).addClass("hit");
                 } else $(this).addClass("miss");

                var interval = setTimeout(function(){
                  fleetTarget.aiShoot(fleetAttacker.grid);
                updateGrid("#player-ships", fleetAttacker.grid);
                checkWinner(fleetAttacker, fleetTarget);
              }, 500);
                }
              }

          });
}

function updateGrid(target, grid){
  var hitAndMiss = [];
    for(var y = 0; y < grid.length; y++){
       for(x = 0; x < grid[y].length; x++){
         if(grid[y][x] == "x") hitAndMiss.push({x: x, y: y, hm: "x"});
         if(grid[y][x] == "m") hitAndMiss.push({x: x, y: y, hm: "m"});
       }
     }

    _.each(hitAndMiss, function(elem){
        var t = $(target).children()[elem.y];
        t = $(t).children()[elem.x];
        if(elem.hm == "x")
          $(t).addClass("hit");
          else
          $(t).addClass("miss");

        $(t).removeClass("final");
    });
}

function checkWinner(fleetA, fleetB){
  if(fleetB.loss()) {
    alert("YOU WON AYYY");
    location.reload();
  } if(fleetA.loss()){
    alert("GAME OVER");
    location.reload();
  }
}
