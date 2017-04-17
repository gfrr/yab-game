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
       $(row).append("<div class='col' value='0'></div>");
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
       generateShip(this, size);
      //  $(this).addClass("test");
      //  $(this).next().addClass("test"); //horizontal targeting
      //  var next = $(this).parent().next();
      //  var index = $(this).index();
      //  var t = $(next).children(".col"); //vertical targeting
      //  $(t[index]).addClass("test"); //vertical targeting
       //
      //  console.log($(".col")[index]);
      //  console.log($(this).parent().index(), $(this).index());
      //  console.log($(this).next()[0] !== undefined); //checking horizontal boundaries
       $(this).click(function(){
           if($(".test").length == size && $(".test").attr("value") == 0){
           $(".test").addClass("final");
           $(".final").attr("value", 1);
           size = 0;
           $(caller).toggle();
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
    } else {
        for(var i = 0; i < size; i++){
          if(i > 0){
            currentTarget = $(currentTarget).next();
          }
          $(currentTarget).addClass("test");
        }
      }
}
