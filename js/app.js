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

Fleet.prototype.aiShoot = function (grid, previousHit){
  var alreadyHit = shotsMap(grid);

  if(this.aiLevel == 1){
    var randomCord = {x: Math.floor(Math.random()*10), y: Math.floor(Math.random()*10)};
    if(_.some(alreadyHit, randomCord)){
        console.log("recursion");
        return this.aiShoot(grid);
    }
    console.log(randomCord);
    return(this.shot(randomCord, grid));
  } else{
      return this._cheatingAi(grid, previousHit);
  }
};


function shotsMap(grid){
  var alreadyHit = [];
  for(var y = 0; y < grid.length; y++){
     for(x = 0; x < grid[y].length; x++){
       if(grid[y][x] == "x" || grid[y][x] == "m") alreadyHit.push({x: x, y: y, hm: grid[y][x]});
     }
  }
  return alreadyHit;
}

function PreviousHit(x,y) {
 this.x = x;
 this.y = y;
 this.size = 0;
 this.direction = [1,2,3,4];
 this.hits = 0;
 this.tries = 0;
}

//placeholder "hard" difficulty
Fleet.prototype._cheatingAi = function(grid, previousHit){
  var voids = [];
  var positions = [];
  var target;
  for (var y = 0; y < grid.length; y++){
     for(var x = 0; x < grid[y].length; x++){
        if(grid[y][x] != "x" && grid[y][x] != "m" && grid[y][x]!== 0){
          positions.push({x: x, y: y});
        } else if(grid[y][x]=== 0) voids.push({x: x, y:y});
     }
  }

  if(Math.floor(Math.random()*2)){
    console.log("missing");
    target = voids[Math.floor(Math.random()*voids.length)];
  }
  else  target = positions[Math.floor(Math.random()*positions.length)];
  return this.shot(target, grid);
};

//
// function checkBoundaries(direction, cords, grid){
//   //1 nord 2 est 3 sud 4 ovest
//   var alreadyHit = shotsMap(grid);
//   var testCord = cords;
//   switch(direction){
//     case 1:
//       if(cords.y-1 > 0) {
//         testCord.y--;
//        return  !_.some(alreadyHit, testCord);
//       }
//        return false;
//     case 2:
//       if(cords.x + 1 < 10){
//         testCord.x++;
//         return !_.some(alreadyHit, testCord);
//       }
//       return false;
//     case 3:
//       if(cords.y + 1 < 10){
//         testCord.y++;
//         return !_.some(alreadyHit, testCord);
//       }
//       return false;
//     case 4:
//       if(cords.x - 1 > 0){
//         testCord.x++;
//         return !_.some(alreadyHit, testCord);
//       }
//       return false;
//     default:
//        return false;
//      }
// }
//
// function generateCordsByDirection(direction, cords, grid){
//     switch(direction){
//       case 1:
//         if(checkBoundaries(direction, cords, grid)) return {x:cords.x, y:cords.y - 1};
//         return undefined;
//       case 2:
//         if(checkBoundaries(direction, cords, grid)) return {x:cords.x+1, y:cords.y};
//         return undefined;
//       case 3:
//         if(checkBoundaries(direction, cords, grid)) return {x:cords.x, y:cords.y +1};
//         return undefined;
//       case 4:
//         if(checkBoundaries(direction, cords, grid)) return {x:cords.x-1, y:cords.y};
//         return undefined;
//       default:
//         return undefined;
//     }
// }

/*
function shotsMap(grid){
  var alreadyHit = [];
  for(var y = 0; y < grid.length; y++){
     for(x = 0; x < grid[y].length; x++){
       if(grid[y][x] == "x" || grid[y][x] == "m") alreadyHit.push({x: x, y: y, hm: grid[y][x]});
     }
  }
  return alreadyHit;
}
*/


// Fleet.prototype._aiLevel2 = function(grid, previousHit){
//   var alreadyHit = shotsMap(grid);
//   var randomCord = {x: Math.floor(Math.random()*10), y: Math.floor(Math.random()*10)};
//   var dir;
//   if(previousHit.x === undefined){
//       console.log("case1: no previous hits");
//       if(_.some(alreadyHit, randomCord)) return this._aiLevel2(grid, previousHit);
//     } else {
//            if(previousHit.direction.length < 2){
//              var cord = generateCordsByDirection(previousHit.direction[0], previousHit, grid);
//              if(cord === undefined){
//                 previousHit = new PreviousHit();
//              } else {
//
//              }
//
//            }
//  }
//
// };


function opposite(direction){
  if(direction == 1) return 3;
  if(direction == 2) return 4;
  if(direction == 3) return 1;
  if(direction == 4) return 2;

}
// Fleet.prototype._aiLevel2 = function(grid, previousHit){
//   var alreadyHit = shotsMap(grid);
//   var randomCord = {x: Math.floor(Math.random()*10), y: Math.floor(Math.random()*10)};
//   var dir;
//   if(previousHit.x === undefined){
//     console.log("case1, no hits");
//     if(_.some(alreadyHit, randomCord)) return this._aiLevel2(grid, previousHit);
//   } else {
//       if(previousHit.tries < 5){
//             console.log("case2, previous hit");
//             switch(previousHit.direction[Math.floor(Math.random() * previousHit.direction.length)]){
//               case 1:
//                 randomCord = {x: previousHit.x, y: previousHit.y-1};
//                 if(previousHit.y - 1 > 0 || _.some(alreadyHit,  randomCord)) {
//                   previousHit.tries++;
//                   _.remove(previousHit.directions, function(n){
//                     return n == 1;
//                   });
//                   return this._aiLevel2(grid, previousHit);
//                 }
//                 dir = 1;
//                 break;
//               case 2:
//                 randomCord = {x:previousHit.x+1, y:previousHit.y};
//                 if(previousHit.x + 1 > 10 || _.some(alreadyHit, randomCord)) {
//                   previousHit.tries++;
//                   _.remove(previousHit.directions, function(n){
//                     return n == 2;
//                   });
//                   return this._aiLevel2(grid, previousHit);
//                 }
//                 dir = 2;
//                 break;
//               case 3:
//                 randomCord = {x:previousHit.x , y: previousHit.y + 1};
//                 if(previousHit.y + 1 > 10 || _.some(alreadyHit, randomCord)){
//                   previousHit.tries++;
//                   _.remove(previousHit.directions, function(n){
//                     return n == 3;
//                   });
//                   return this._aiLevel2(grid, previousHit);
//                 }
//
//                 dir = 3;
//                 break;
//               case 4:
//                 randomCord = {x: previousHit.x - 1, y:previousHit.y};
//                 if(previousHit.x - 1 < 0 || _.some(alreadyHit, randomCord)){
//                   previousHit.tries++;
//                   _.remove(previousHit.directions, function(n){
//                     return n == 4;
//                   });
//                   return this._aiLevel2(grid, previousHit);
//                 }
//
//                 dir = 4;
//                 break;
//
//           }
//           }
//       }
//    console.log("shooting..");
//    var value = this.shot(randomCord, grid);
//    if(value > 1){
//      console.log("hit a big ship");
//      previousHit.hits++;
//      if(previousHit.hits < value){
//        console.log("updating the previousHit coordinates");
//        previousHit.dir = [dir];
//        previousHit.x = randomCord.x;
//        previousHit.y = randomCord.y;
//        previousHit.size = value;
//        console.log(previousHit);
//
//      } else previousHit = new PreviousHit();
//
//    } else if(value == 1) {
//      console.log("ship sunk");
//      previousHit = new PreviousHit();
//    } else {
//      if(previousHit.x !== undefined){
//        _.remove(previousHit.directions, function(n){
//           return n == dir;
//        });
//        console.log("miss, trying another direction");
//      } else {
//        previousHit = new PreviousHit();
//      }
//    }
//    return value;
// };

// Fleet.prototype._aiLevel2 = function(grid, previousHit){
//   var alreadyHit = shotsMap(grid);
//   var randomCord = {x: Math.floor(Math.random()*10), y: Math.floor(Math.random()*10)};
//   var direction = 0; //1 north 2 est 3 south 4 west
//   if(previousHit.x === undefined) {
//     if(_.some(alreadyHit, randomCord)) return this._aiLevel2(grid, previousHit);
//     console.log("case1");
//     console.log(previousHit);
//   }
//   else{
//     if(!previousHit.direction){
//       if(previousHit.tries < 4){
//       console.log("case2");
//       console.log(previousHit.y + 1, previousHit.x + 1);
//       var flatOrStanding = Math.floor(Math.random() * 2), plusOrMinus = Math.floor(Math.random() * 2);
//        if(flatOrStanding){
//          if(plusOrMinus) {
//             //south
//             if(previousHit.y + 1 > 10 || grid[previousHit.y + 1][previousHit.x] == "x" || grid[previousHit.y + 1][previousHit.x] == "m") return this._aiLevel2(grid, previousHit);
//             randomCord = {x: previousHit.x, y: previousHit.y + 1};
//             previousHit.direction = 3;
//             previousHit.tries++;
//          }
//          else{
//            //north
//            if(previousHit.y - 1 < 0 || grid[previousHit.y - 1][previousHit.x] == "x" || grid[previousHit.y - 1][previousHit.x] == "m"){
//              previousHit.tries++;
//              return this._aiLevel2(grid, previousHit);
//            }
//            randomCord = {x: previousHit.x, y: previousHit.y - 1};
//            previousHit.direction = 1;
//            previousHit.tries++;
//          }
//        } else {
//          if(plusOrMinus) {
//             //est
//             if(previousHit.x + 1 > 10 || grid[previousHit.y][previousHit.x+1] == "x" || grid[previousHit.y][previousHit.x+1] == "m") {
//               previousHit.tries++;
//               return this._aiLevel2(grid, previousHit);
//             }
//             randomCord = {x: previousHit.x +1, y: previousHit.y};
//             previousHit.direction = 2;
//             previousHit.tries++;
//          }
//          else{
//            //west
//            if(previousHit.x - 1 < 0 || grid[previousHit.y][previousHit.x - 1] == "x" || grid[previousHit.y][previousHit.x - 1] == "m") {
//              previousHit.tries++;
//              return this._aiLevel2(grid, previousHit);
//            }
//            randomCord = {x: previousHit.x -1, y: previousHit.y};
//            previousHit.direction = 4;
//            previousHit.tries++;
//          }
//        }
//     }
//     else{
//       console.log("case3");
//       switch(previousHit.direction){
//         case 1:
//           if(previousHit.y - 1 < 0 || grid[previousHit.y - 1][previousHit.x] == "x" || grid[previousHit.y - 1][previousHit.x] == "m"){
//             previousHit.direction = 0;
//             return this._aiLevel2(grid, previousHit);
//           }
//           randomCord = {x: previousHit.x, y: previousHit.y - 1};
//           break;
//         case 2:
//           if(previousHit.x + 1 > 10 || grid[previousHit.y][previousHit.x+1] == "x" || grid[previousHit.y][previousHit.x+1] == "m"){
//             previousHit.direction = 0;
//             return this._aiLevel2(grid, previousHit);
//           }
//           randomCord = {x: previousHit.x +1, y: previousHit.y};
//           break;
//         case 3:
//           if(previousHit.y + 1 > 10 || grid[previousHit.y + 1][previousHit.x] == "x" || grid[previousHit.y + 1][previousHit.x] == "m"){
//             previousHit.direction = 0;
//             return this._aiLevel2(grid, previousHit);
//           }
//           randomCord = {x: previousHit.x, y: previousHit.y + 1};
//           break;
//         case 4:
//           if(previousHit.x - 1 < 0 || grid[previousHit.y][previousHit.x - 1] == "x" || grid[previousHit.y][previousHit.x - 1] == "m"){
//             previousHit.direction = 0;
//             return this._aiLevel2(grid, previousHit);
//           }
//           randomCord = {x: previousHit.x -1, y: previousHit.y};
//       }
//     }
//   }
//   }
//   var value  = this.shot(randomCord, grid);
//   if(value > 1){
//     previousHit.hits++;
//     previousHit.size = value;
//     if(previousHit.hits < previousHit.size){
//       previousHit.x = randomCord.x;
//       previousHit.y = randomCord.y;
//     } else {
//       previousHit = new PreviousHit();
//     }
//   } else if(value === 0){
//     if(previousHit.size){
//       if(previousHit.hits > 1){
//         previousHit.direction = opposite(previousHit.direction);
//       } else
//       previousHit.direction = 0;
//     }
//   } else previousHit = new PreviousHit();
//   return value;
// };
