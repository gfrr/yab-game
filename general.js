$(document).ready(function(){
  var fifteen = new Fifteen();
  appendNumbers(fifteen);
});


function appendNumbers(game){
  var target = $(".tile");
  console.log(target);
  _.each(game.numbers, function(elem, index){
      if(elem === 0) {
        $(target[index]).html("");
        $(target[index]).attr("value", elem);
        $(target[index]).toggleClass("tile-white");
      } else {
        $(target[index]).html(elem);
        $(target[index]).attr("value", elem);
        $(target[index]).toggleClass("tile-number");
      }

  });
}
