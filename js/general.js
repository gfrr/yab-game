$(document).ready(function(){
 $("#game-play").toggle();
 start();
 selectShip();
 rotateShip();
});


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
       $(this).next().addClass("test");
       var next = $(this).parent().next(); //horizontal targeting
       var index = $(this).index();
       var t = $(next).children(".col"); //vertical targeting
       $(t[index]).addClass("test"); //vertical targeting

       console.log($(".col")[index]);
       console.log($(this).parent().index(), $(this).index());
       console.log($(this).next()[0] !== undefined); //checking horizontal boundaries
       $(this).click(function(){
         $(this).addClass("final");
       });
     },function(){
       $(this).removeClass("test");
       $(this).next().removeClass("test");
     });
}


function rotateShip() {
  $("#rotate").click(function(){
    $(this).toggleClass("vertical");
  });
}

//helper function that avoids the manual writing of the game grids
function appendGrid(target, size) {
  _.times(size, function(){
     var row = $("<div class='row'></div>");
     _.times(size, function(){
       $(row).append("<div class='col'></div>");
     });
     $(target).append(row);
  });
}
