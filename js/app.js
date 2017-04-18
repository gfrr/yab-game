function Fleet(){
   var grid = [];
  _.times(10, function(){
     grid.push(_.fill(new Array(10), 0));
  });
  this.grid = grid;
  this.aiLevel = 0; //0 human player 1 easy 2 normal 3 hard
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
  var value = 0;
  if(this._detectHit(cords, grid)){
    value = grid[cords.y][cords.x];
    grid[cords.y][cords.x] = "x";
    return value;
  } else{
    grid[cords.y][cords.x] = "m";
    return value;
  }
};

Fleet.prototype._detectHit = function(cords, grid){
   return grid[cords.y][cords.x] !== 0 && grid[cords.y][cords.x] != "m";
};

Fleet.prototype.loss = function(){
  var test = this.grid.slice(0);
  return _.filter(_.flatten(test), function(elem){
    if(elem == "x") return elem;
  }).length == 18;
};

Fleet.prototype.aiShoot = function (grid){
  var alreadyHit = shotsMap(grid);
  if(this.aiLevel == 1){
    var randomCord = {x: Math.floor(Math.random()*10), y: Math.floor(Math.random()*10)};
    if(_.some(alreadyHit, randomCord)){
        console.log("recursion");
        return this.aiShoot(grid);
    }
    console.log(randomCord);
    return(this.shot(randomCord, grid));
  }
};


function shotsMap(grid){
  var alreadyHit = [];
  for(var y = 0; y < grid.length; y++){
     for(x = 0; x < grid[y].length; x++){
       if(grid[y][x] == "x" || grid[y][x] == "m") alreadyHit.push({x: x, y: y});
     }
  }
  return alreadyHit;
}

Fleet.prototype._aiLevel2 = function(grid, previousHit) {
   var pHit = previousHit;
   var alreadyHit = shotsMap(grid);
   var randomCord = {x: Math.floor(Math.random()*10), y: Math.floor(Math.random()*10)};
   var value = 0;
   if(!previousHit) if(_.some(alreadyHit, randomCord)) return this._aiLevel2(grid);
   else if(!previousHit.direction){
       var flatOrStanding = Math.floor(Math.random() * 2), plusOrMinus = Math.floor(Math.random() * 2);
       if(flatOrStanding){
         if(plusOrMinus) {
            if(previousHit.y + 1 > grid.length || grid[previousHit.y + 1][previousHit.x] == "x" || grid[previousHit.y + 1][previousHit.x] == "m") this._aiLevel2(grid, previousHit);
            randomCord = {x: previousHit.x, y: previousHit.y + 1};
            value = this.shot(randomCord, grid);
            if(value > 0) pHit.direction = 3;
            

         }
       }
     }




};
