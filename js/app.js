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


function Ship(size, direction, coordinates) {
   this.size = size;
   this.direction = direction !== undefined ? direction : Math.floor(Math.random() * 2);
   this.coordinates = coordinates;
}

function randomCord(size, direction, grid) {
  var xy = {
    x: 0,
    y: 0,
  };
  var cordX, cordY;
  if(direction){
    cordY = Math.floor(Math.random() * 10);
    if(cordY + size > 9) return randomCord(size, direction, grid);
    cordX = Math.floor(Math.random() * 10);

  } else {
    cordX = Math.floor(Math.random() * 10);
    if(cordX + size > 9) return randomCord(size, direction, grid);
    cordY = Math.floor(Math.random() * 10);
  }
  xy.x = cordX;
  xy.y = cordY;
  return checkIsFree(size, direction, xy, grid) ? xy : randomCord(size, direction, grid);
}

function checkIsFree(size, direction, cords, grid){
  if(direction == 1) {
    for(var y = cords.y; y < cords.y + size+1; y++)
      if(grid[y][cords.x] !== 0) return false;

  } else if(direction === 0){
    for(var x = cords.x; x < cords.x + size+1; x++)
      if(grid[cords.y][x] !== 0) return false;
  }
  return true;
}

Ship.prototype.draw = function(grid) {
  var xy;
  if(this.coordinates) xy = this.coordinates;
  else xy = randomCord(this.size, this.direction, grid);
  if(this.direction == 1) {
    for(var y = xy.y; y < xy.y + this.size; y++)
      grid[y][xy.x] = this.size;
  } else {
    for(var x = xy.x; x < xy.x + this.size; x++)
      grid[xy.y][x] = this.size;
  }
};

Fleet.prototype.shot = function(cords, grid){
  if(this._detectHit(cords, grid)){
    console.log("hit!");
    grid[cords.y][cords.x] = "x";
  } else console.log("miss!");
};

Fleet.prototype._detectHit = function(cords, grid){
   return grid[cords.y][cords.x] !== 0;
};

Fleet.prototype.loss = function(){
  var test = this.grid.slice(0);
  return _.filter(_.flatten(test), function(elem){
    if(elem == "x") return elem;
  }).length == 18;


};
