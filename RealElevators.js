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
                    console.log('floor ' + floor.floorNum() + ' up button pressed');
                });

                floor.on("down_button_pressed", function(){
                    goingDown[floor.floorNum()] = true;
                    console.log('floor ' + floor.floorNum() + ' down button pressed');
                });

            });

            // elevator listeners
            elevators.forEach(function(elevator, e){

                elevator = elevators[e];
//              elevatorGoingUp(elevator);

                console.log('initialised elevator' + e);

                elevator.on("passing_floor", function(floorNum, direction) { 
                    console.log('elevator' + e + ' at floor ' + floorNum + ', direction: ' + direction);

                    if elevator.getPressedFloors().indexOf()

                    // TODO
                    // stop if someone's pressed the button for this floor
                    // or, if someone's waiting here, going in the same direction.. pick them up? .. but only if you have space

                }); 

                // when it stops at a floor, clear destination queue and recalculate where to go
                elevator.on("stopped_at_floor", function(floorNum){
                    console.log('elevator' + e +' stopped at floor ' + floorNum);
                    clearElevatorDestinationQueue(elevator);
                    nextFloor = getElevatorDestination(elevator);
                    elevator.goToFloor(nextFloor);

                    console.log('elevator' + e +' sent to floor ' + nextFloor);

                });

                elevator.on("idle", function() {     
                    console.log('elevator' + e + ' is idle! Sending to floor ' + e%floors.length;
                    elevator.goToFloor(e%floors.length);
                });

                elevator.on("floor_button_pressed", function(floorNum){ // someone pressed a floor, but doesn't matter because we will pick up the pressed floors elsewhere
                    console.log('elevator' + e + ' floor request: ' + floorNum);
                });
            });

              // ************* FUNCTIONS ****************

            function clearElevatorDestinationQueue(elevator){
                elevator.destinationQueue() = [];
                elevator.checkDestinationQueue();
            }

            function getElevatorDestination(elevator){

                var direction = getNewDirection(elevator);
                var destination = elevator.getCurrentFloor(); // will stay on current floor if nothing returned

                if (direction == 'up'){
                    elevatorGoingUp(elevator);
                    destination = getNextFloorUp();
                }
                else if (direction == 'down'){
                    elevatorGoingDown(elevator);
                    destination = getNextFloorDown();
                }

                return destination;
            }

            // given an elevator and a direction, decides whether it should go up or down
            function getNewDirection(elevator){

                // if going up, try to keep going up
                if (elevator.goingUpDirection()) {
                    var upperBound = 0;
                    upperBound = getHighestFloorToVisit(elevator.getButtonsPressed());

                    if (upperBound > elevator.currentFloor()){
                        return 'up';
                    }
                    else return 'down';
                }  // if going down, try to keep going down
                else if (elevator.goingDownDirection()) {
                    var lowerBound = floors.length-1;
                    lowerBound = getLowestFloorToVisit(elevator.getButtonsPressed());
                    if (lowerBound < elevator.currentFloor()){
                        return 'down';
                    }
                    else return 'up';
                }                

            }

            function elevatorGoingDown(elevator){
                elevator.goingDownDirection() = true;
                elevator.goingUpDirection() = false;
            }

            function elevatorGoingUp(elevator){
                elevator.goingUpDirection() = true;
                elevator.goingDownDirection() = false;
            }

            function getNextFloorUp(currentFloor){ // wants to get the floor closest to the elevator
                var currentFloor = elevator.currentFloor();
                return min(nextFloorUpGoingUp(currentFloor);, nextFloorUpGoingDown(currentFloor);, nextElevatorPressedUp(elevator));
            }

            function nextFloorUpGoingDown(currentFloor){
                for (var f = currentFloor; f < elevators.length; f++) {
                    if(goingDown[f]) return f;
                }
                return currentFloor; // if none, returns current floor
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

            function getNextFloorDown(buttonsPressed){  // wants to get the floor closest to the elevator
                return max(nextFloorDownGoingDown();, nextFloorDownGoingUp();, nextElevatorPressedDown(buttonsPressed));
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
            function getHighestFloorToVisit(elevatorButtonsPressed) {
                return max(highestFloorGoingUp();, highestFloorGoingDown();, maxInArray(elevatorButtonsPressed));
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
            function getLowestFloorToVisit(buttonsPressed) {
                return min(lowestGoingUp();, lowestGoingDown();, minInArray(buttonsPressed));
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
