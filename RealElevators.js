   // Matt's 'REAL ELEVATOR GENERATOR'

   // The general purpose of this algorithm is to emulate a real elevator's behaviour.
   
   // - Every time the elevator stops, recalculate which floors need to be visited.
   // - Conserve direction. If you're going up, keep going up until it is no longer required.
   // - Only stop at floors you need to.
   // - Find the closest floor as your next destination.
   // - The idle state of elevators is the index of that elevator


    {
        init: function(elevators, floors) {

            // ********** VARIABLES ***********

            goingUp = new Array(floors.length);         // these arrays track which floors have requests to go up or down
            goingDown = new Array[floors.length];       // TODO: contain a boolean within each floor object using prototypes

            for(var f = 0; i<floors.length;i++){        // at the start nobody wants to travel anywhere
                goingup[f] = false;
                goingDown[f] = false;
            }

            // ********** LISTENERS ***********

            // floor listeners
            floors.forEach(function(floor, f){

                floor = floors[f];

                floor.on("up_button_pressed", function(){
                    goingUp[floor.floorNum()] = true;
                    console.log('Floor ' + floor.floorNum() + ' up button pressed');
                });

                floor.on("down_button_pressed", function(){
                    goingDown[floor.floorNum()] = true;
                    console.log('Floor ' + floor.floorNum() + ' down button pressed');
                });

            });

            // elevator listeners
            elevators.forEach(function(elevator, e){

                elevator = elevators[e];
//              elevatorGoingUp(elevator);

                console.log('Initialised elevator' + e);

                elevator.on("passing_floor", function(floorNum, direction) { 
                    console.log('Elevator' + e + ' at floor ' + floorNum + ', direction: ' + direction);

                    // if someone in the elevator wants to go here, stop
                    if (isInArray(elevator.getPressedFloors(),floorNum)){ 
                        elevator.goToFloor(floorNum, true); 
                    }

                    // or, if someone's waiting here, going in the same direction.. pick them up? .. but only if you have space
                    else if (direction == 'up' && goingUp[floorNum] && elevator.loadFactor() < 0.9){
                        elevator.goToFloor(floorNum, true);
                    }
                    else if (direction == 'down' && goingDown[floorNum] && elevator.loadFactor() < 0.9){
                        elevator.goToFloor(floorNum, true);
                    }
                }); 

                // when it stops at a floor, clear destination queue and recalculate where to go
                elevator.on("stopped_at_floor", function(floorNum){
                    console.log('Elevator' + e +' stopped at floor ' + floorNum);
                    clearElevatorDestinationQueue(elevator);
                    var direction = getElevatorNextDirection(elevator);

                    nextFloor = getElevatorDestination(elevator);
                    elevator.goToFloor(nextFloor);

                    console.log('Elevator' + e +' sent to floor ' + nextFloor);

                });

                elevator.on("idle", function() {     
                    console.log('Elevator' + e + ' is idle! Sending to floor ' + e%floors.length);
                    elevator.goToFloor(e%floors.length);
                });

                elevator.on("floor_button_pressed", function(floorNum){ // someone pressed a floor, but doesn't matter because we will pick up the pressed floors elsewhere
                    console.log('Elevator' + e + ' floor request: ' + floorNum);
                });
            });

              // ************* FUNCTIONS ****************

            function clearElevatorDestinationQueue(elevator){
                elevator.destinationQueue() = [];
                elevator.checkDestinationQueue();
            }

            function getElevatorNextDestination(elevator, direction){
                if (getElevatorDirection(elevator) == 'up'){
                    elevatorGoingUp(elevator);
                    return getNextFloorUp();
                }
                else if (getElevatorDirection(elevator) == 'down'){
                    elevatorGoingDown(elevator);
                    return getNextFloorDown();
                }
                else {
                    return elevator.getCurrentFloor(); // something weird is going on here. Maybe return an exception?
                }
            }

            // given an elevator, decides whether it should go up or down
            function getElevatorNextDirection(elevator){

                // if going up, try to keep going up
                if (getElevatorDirection(elevator) == 'up') {
                    if (getHighestFloorToVisit(elevator.getButtonsPressed()) > elevator.currentFloor()){
                        return 'up';
                    }
                    else return 'down';
                }  // if going down, try to keep going down
                else if (getElevatorDirection(elevator) == 'down') {
                    if (getLowestFloorToVisit(elevator.getButtonsPressed()) < elevator.currentFloor()){
                        return 'down';
                    }
                    else return 'up';
                }                
            }

            // returns an elevator's current direction
            function getElevatorDirection(elevator){
                if (elevator.goingDownDirection() && !elevator.goingUpDirection()) return 'down';
                else if (elevator.goingUpDirection() && !elevator.goingDownDirection()) return 'up';
                else {
                    console.log('Elevator has no clear direction?! Something went terribly wrong');
                    return 'none'
                }
            }

            // sets an elevator's current direction
            function setElevatorDirection(elevator, direction){
                if (direction == 'up'){
                    elevator.goingUpDirection() = true;
                    elevator.goingDownDirection() = false;
                }
                else if (direction == 'down'){
                    elevator.goingDownDirection() = true;
                    elevator.goingUpDirection() = false;
                }
            }

            // gets the next floor up that the elevator can travel to
            function getNextFloorUp(pressedFloors, currentFloor){
                return min(nextFloorUpGoingUp(currentFloor);, nextFloorUpGoingDown(currentFloor);, nextElevatorPressedUp(pressedFloors, currentFloor));
            }

            // gets the next floor above the current floor which has requested to go down. Returns current floor if none found.
            function nextFloorUpGoingDown(currentFloor){
                for (var f = currentFloor; f < elevators.length; f++) {
                    if(goingDown[f]) return f;
                }
                return currentFloor;
            }

            function nextFloorUpGoingUp(currentFloor){
                for (var f = currentFloor; f < elevators.length; f++) {
                    if(goingUp[f]) return f;
                }
                return currentFloor; // if none, returns current floor
            }

            function nextElevatorPressedUp(pressedFloors, currentFloor){
                for (var f = currentFloor; f => 0; f--) {
                    if (isInArray(pressedFloors, f)) return f;
                }
                return currentFloor; // if none, returns current floor
            }

            function getNextFloorDown(pressedFloors, currentFloor){  // wants to get the floor closest to the elevator
                return max(nextFloorDownGoingDown(currentFloor);, nextFloorDownGoingUp(currentFloor);, nextElevatorPressedDown(pressedFloors, currentFloor));
            }

            function nextFloorDownGoingDown(currentFloor){
                for (var f = currentFloor; f => 0; f--) {
                    if(goingDown[f]) return f;
                }
                return currentFloor; // if none, returns current floor
            }

            function nextFloorDownGoingUp(currentFloor){
                for (var f = currentFloor; f => 0; f--) {
                    if(goingUp[f]) return f;
                }
                return currentFloor; // if none, returns current floor
            }

            function nextElevatorPressedDown(pressedFloors, currentFloor){

                for (var f = currentFloor; f => 0; f--) {
                    if (isInArray(pressedFloors, f)) return f;
                }
                return currentFloor; // if none, returns current floor
            }            

            // UP functions
            function getHighestFloorToVisit(pressedFloors) {
                return max(highestFloorGoingUp();, highestFloorGoingDown();, maxInArray(pressedFloors));
            }

            function highestFloorGoingUp(){ // starts at the top and goes down
                for (var f = floors.length-1; f >= 0; f--) {
                    if(goingUp[f]) return f;
                }

                return 0; // if none, returns bottom floor
            }

            function highestFloorGoingDown(){
                for (var f = floors.length-1; f >= 0; f--) {
                    if(goingDown[f]) return f;
                }
                return 0; // if none, returns bottom floor
            }


            // DOWN functions
            function getLowestFloorToVisit(pressedFloors) {
                return min(lowestGoingUp();, lowestGoingDown();, minInArray(pressedFloors));
            };

            function lowestGoingUp(){
                for (var f = 0; f < floors.length; f++) {
                    if(goingUp[f]) return f;
                }
                return floors.length-1; // if none, returns top floor
            }

            function lowestGoingDown(){
                for (var f = 0; f < floors.length; f++) {
                    if(goingDown[f]) return f;
                }
                return floors.length-1; // if none, returns top floor
            }

            function maxInArray(array){
                return Math.max.apply(Math, array);
            }

            function minInArray(array){
                return Math.min.apply(Math, array);
            }

            function isInArray(array, object) {
              return (array.indexOf(object) != -1);
            }




        },     

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }
