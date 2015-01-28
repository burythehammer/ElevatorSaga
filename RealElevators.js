    {
        init: function(elevators, floors) {

            // ********** VARIABLES ***********

            goingUp[];
            goingDown[];

            // ********** LISTENERS ***********

            // floor listeners
            floors.forEach(function(floor, f){

                var floor = floors[f];

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

                var elevator = elevators[e];
                elevatorGoingUp(elevator);

                elevator.on("passing_floor", function(floorNum, direction) { 
                    console.log('elevator' + e + ' at floor ' + floorNum + ', direction: ' + direction);
                }); 

                elevator.on("stopped_at_floor", function(floorNum){
                    nextFloor = calculateNextFloor();
                    console.log('elevator' + e +' stopped at floor ' + floorNum);
                });

                elevator.on("idle", function() {                
                });

                elevator.on("floor_button_pressed", function(floorNum){ // someone pressed a floor so add it to the queue

                    console.log('elevator' + e + ' floor request: ' + floorNum);
                });
            });

              // ************* FUNCTIONS ****************

            function findNextDestination(elevator){

                var elevatorDirection = calculateDirection(elevator);
                var nextDestination = calculateNextFloor(elevatorDirection);

                return nextDestination;                
            }

            function calculateNextFloor(elevator){

                var direction = calculateDirection(elevator);
                var nextFloor = elevator.getCurrentFloor();

                if (direction == 'up'){
                    elevatorGoingUp();
                    nextFloor = getNextFloorUp();
                }
                else if (direction == 'down'){
                    elevatorGoingDown();
                    nextFloor = getNextFloorDown();
                }

                return nextFloor;
            }

            // given an elevator and a direction, decides whether it should go up or down
            function calculateDirection(elevator){

                // if going up, try to keep going up
                if (elevator.goingUpDirection()) {
                    var upperBound = 0;
                    upperBound = getHighestFloorToVisit(elevator);

                    if (upperBound > elevator.currentFloor()){
                        return 'up';
                    }
                    else return 'down';

                }

                // if going down, try to keep going down
                else if (elevator.goingDownDirection()) {
                    var lowerBound = floors.length-1;
                    lowerBound = getLowestFloorToVisit(elevator);
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
                };
                return currentFloor; // if none, returns current floor
            }

            function nextFloorUpGoingUp(currentFloor){
                for (var f = currentFloor; f < elevators.length; f++) {
                    if(goingUp[f]) return f;
                };
                return currentFloor; // if none, returns current floor
            }

            function nextElevatorPressedDown(pressedFloors, currentFloor){
                
            }

            function getNextFloorDown(){  // wants to get the floor closest to the elevator
                return max(nextFloorDownGoingDown();, nextFloorDownGoingUp();, nextElevatorPressedDown(elevator));
            };

            function nextFloorDownGoingDown(currentFloor){

            }

            function nextFloorDownGoingUp(currentFloor){

            }

            function nextElevatorPressedDown(pressedFloors, currentFloor){

            }


            function getHighestFloorToVisit(elevator) {
                return max(highestFloorGoingUp();, highestFloorGoingDown();, highestElevatorPressed(elevator));
            };

            function highestFloorGoingUp(){ // starts at the top and goes down
                for (var f = floors.length-1; f >= 0; f--) {
                    if(goingUp[f]) return f;
                };

                return 0; // if none, returns bottom floor
            }

            function highestFloorGoingDown(){
                for (var f = floors.length-1; f >= 0; f--) {
                    if(goingDown[f]) return f;
                };
                return 0; // if none, returns bottom floor
            }

            function highestElevatorPressed(elevator){
                return Math.max.apply(Math, elevator.getButtonsPressed());
            }

            function calculateLowestFloor() {
                return min(lowestGoingUp();, lowestGoingDown();, lowestElevatorPressed(elevator));
            };

            function lowestGoingUp(){
                for (var f = 0; f < floors.length; f++) {
                    if(goingUp[f]) return f;
                };
                return floors.length-1; // if none, returns top floor
            }

            function lowestGoingDown(){
                for (var f = 0; f < floors.length; f++) {
                    if(goingDown[f]) return f;
                };
                return floors.length-1; // if none, returns top floor
            }

            function lowestElevatorPressed(elevator){
                return Math.min.apply(Math, elevator.getButtonsPressed());
            }




        },     

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }
