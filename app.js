function Fleet(){
   var grid = [];
  _.times(10, function(){
     grid.push(_.fill(new Array(10), 0));
  });
  this.grid = grid;


}

Fleet.prototype.generateEnemyFleet = function(){
  var fleet = [];
  var context = this;
  fleet.push(new Ship(5)); //aircarrier
  fleet.push(new Ship(4)); //battleship
  fleet.push(new Ship(3)); //cruiser
  fleet.push(new Ship(2)); //destroyer
  fleet.push(new Ship(2)); //destroyer
  fleet.push(new Ship(1)); //submarine
  fleet.push(new Ship(1)); //submarine
  _.each(fleet, function(ship){
    ship.draw(context.grid);
  });

};


function Ship(size, grid, direction, coordinates ) {
   this.size = size;
   this.direction = direction !== undefined ? direction : Math.floor(Math.random() * 2);
}

function randomCord(size, direction, grid) {
  var xy = {
    x: 0,
    y: 0,
  };
  var cordX, cordY;
  if(direction){
    cordY = Math.floor(Math.random() * 10);
    if(cordY + size > 10) return randomCord(size, direction, grid);
    cordX = Math.floor(Math.random() * 10);

  } else {
    cordX = Math.floor(Math.random() * 10);
    if(cordX + size > 10) return randomCord(size, direction, grid);
    cordY = Math.floor(Math.random() * 10);

  }
  xy.x = cordX;
  xy.y = cordY;
  return checkIsFree(xy, size, direction, grid) ? xy : randomCord(size, direction, grid);
}

function checkIsFree(cords, size, direction, grid){
  if(this.direction == 1) {
    for(var y = cords.y; y < cords.y + size; y++)
      if(grid[y][cords.x] == 1) return false;
  } else {
    for(var x = cords.x; x < cords.x + size; x++)
      if(grid[cords.y][x] == 1) return false;
  }
  return true;
}

Ship.prototype.draw = function(grid) {
  var xy = randomCord(this.size, this.direction, grid);
  if(this.direction == 1) {
    for(var y = xy.y; y < xy.y + this.size; y++)
      grid[y][xy.x] = 1;


  } else {
    for(var x = xy.x; x < xy.x + this.size; x++)
      grid[xy.y][x] = 1;

  }

};


var test = new Fleet();
console.log(test);
var ship = new Ship(4);
console.log(ship);
test.generateEnemyFleet();
console.log(test.grid);
