{
    init: function(elevators, floors) {

        var elevator1 = elevators[0];
        var elevator2 = elevators[1];
        var elevator3 = elevators[2];
        var elevator4 = elevators[3];

        elevator1.on("idle", function() { 
            // The elevator is idle, so let's go to ground floor
            elevator1.goToFloor(0);
        });

        elevator2.on("idle", function() { 
            // The elevator is idle, so let's go to ground floor
            elevator2.goToFloor(0);
        });


        elevator1.on("floor_button_pressed", function(floorNum) {
            // Tell the elevator to go to that floor
            elevator1.goToFloor(floorNum)
        });

        elevator2.on("floor_button_pressed", function(floorNum) {
            // Tell the elevator to go to that floor
            elevator2.goToFloor(floorNum)
        });


        floor.on

    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}