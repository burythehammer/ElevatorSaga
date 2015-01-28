{
    init: function(elevators, floors) {

        var floorWaitingQueue = [];

       function removeFloorFromWaitingQueue(anyArray){
            for(var i = 0; i <anyArray.length; i++){
                var v = anyArray[i];
            
                for(var j = 1; j <arguments.length; j++){
                    if(v == arguments[j]){
                        anyArray.splice(i,1);
                        i--;
                    }
                }
            }
        return anyArray;
        };

        // FLOOR LISTENERS
        floors.forEach(function(floor, f){

            var floor = floors[f];

            floor.on("up_button_pressed", function(){
                floorWaitingQueue.push(floor.floorNum());
                console.log('floor ' + floor.floorNum() + ' up button pressed, adding to wait queue - ' + floorWaitingQueue.toString());
            });

        
            floor.on("down_button_pressed", function() {
                floorWaitingQueue.push(floor.floorNum());
                console.log('floor ' + floor.floorNum() + ' down button pressed, adding to wait queue - ' + floorWaitingQueue.toString());

            });

        });


        // ELEVATOR LISTENERS
        elevators.forEach(function(elevator, e){

            var elevator = elevators[e];
                
            elevator.on("passing_floor", function(floorNum, direction) { 

                console.log('elevator' + e + ' is passing ' + floorNum);

                var waitQueueIndex = floorWaitingQueue.indexOf(floorNum);

                // If passing a floor with someone waiting
                if (waitQueueIndex > -1 && elevator.loadFactor() < 0.8) {
                    elevator.goToFloor(floorNum, true); // if passing a floor with someone waiting, will stop there
                    console.log('elevator' + e + ' passing ' + floorNum + ' and it is in the wait queue, so it will stop there');
                }
                else if (elevator.loadFactor() == 1){ 
                    console.log('elevator' + e + ' passing ' + floorNum + ' and it is in the wait queue, but it is full!');
                }

                var destinationQueueIndex = elevator.destinationQueue.indexOf(floorNum);

                // If passing a floor on the destination queue
                if (destinationQueueIndex > -1) {
                    elevator.goToFloor(floorNum, true); // if passing a floor with someone waiting, will stop there
                    console.log('elevator' + e + ' passing ' + floorNum + ' and it is in the destination queue, so it will stop there');
                }



            }); 

            elevator.on("stopped_at_floor", function(floorNum){
                
                floorWaitingQueue = removeFloorFromWaitingQueue(floorWaitingQueue, floorNum);

                console.log('elevator' + e +' stopped at ' + floorNum + ', removed it from the wait queue');
                console.log('waitQueue: ' + floorWaitingQueue.toString());

                                

                elevator.destinationQueue()



            });

            elevator.on("idle", function() { // finds a floor that is waiting
                var destinationFloor = 0;

                destinationFloor = floorWaitingQueue.shift(); // grabs from the queue

                console.log('elevator' + e + ' idle, got floor ' + destinationFloor + ' from the wait queue');

                if (typeof destinationFloor === 'undefined'){
                    destinationFloor = e;
                }

                elevator.goToFloor(destinationFloor);
                floorWaitingQueue = removeFloorFromWaitingQueue(floorWaitingQueue, destinationFloor);                

                console.log('idle elevator ' + e + ' sent to floor ' + destinationFloor);
            });

            elevator.on("floor_button_pressed", function(floorNum){ // someone pressed a floor so add it to the queue

                elevator.goToFloor(floorNum);
                console.log('elevator' + e + ' floor request: ' + floorNum);

                floorWaitingQueue = removeFloorFromWaitingQueue(floorWaitingQueue, floorNum); // removing it from waiting queue

            });
        });
    },     

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}