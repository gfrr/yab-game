function Fleet(){
   var grid = [];
  _.times(10, function(){
     grid.push(_.fill(new Array(10), 0));
  });
  this.grid = grid;
}

Fleet.prototype.generateEnemyFleet = function(){
  var fleet = [];
  fleet.push(new Ship(5)); //aircarrier
  fleet.push(new Ship(4)); //battleship
  fleet.push(new Ship(3)); //cruiser
  fleet.push(new Ship(2)); //destroyer
  fleet.push(new Ship(2)); //destroyer
  fleet.push(new Ship(1)); //submarine
  fleet.push(new Ship(1)); //submarine
};


function Ship(size, grid, direction, coordinates ) {
   this.size = size;
   this.direction = direction !== undefined ? direction : Math.floor(Math.random() * 2);
}

function randomCord(size, direction) {
  var xy = {
    x: 0,
    y: 0,
  };
  var cordX, cordY;
  if(direction){
    cordY = Math.floor(Math.random() * 10);
    if(cordY + size > 10) return randomCord();
    cordX = Math.floor(Math.random() * 10);

  } else {
    cordX = Math.floor(Math.random() * 10);
    if(cordX + size > 10) return randomCord();
    cordY = Math.floor(Math.random() * 10);

  }
  xy.x = cordX;
  xy.y = cordY;
  return xy;
}

Ship.prototype.draw = function(grid) {
  console.log(this.size);
  var xy = randomCord(this.size, this.direction);
  if(this.direction == 1) {
    console.log("vertical");
    for(var y = xy.y; y < xy.y + this.size; y++){
      grid[y][xy.x] = 1;
    }

  } else {
    console.log("horizontal");
    for(var x = xy.x; x < xy.x + this.size; x++){
      grid[xy.y][x] = 1;
    }

  }
  console.log(grid);
};
