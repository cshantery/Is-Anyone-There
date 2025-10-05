class WorldManager {
    constructor() {
        this.rooms = [];   // array of ViewManager instances
        this.current = 0;  // index of active room
    }

    keyPressed() {
        if (window.activeInterface) return true; // block when a modal is open
        const room = this.activeRoom;
        if (room && typeof room.keyPressed === 'function') {
            room.keyPressed();
            return true; // consume
        }
    }

    addRoom(vm) {
        if (this.rooms.length === 0) {
            this.rooms.push(vm);
            R.add(vm);
            if (typeof vm.onEnter === 'function') vm.onEnter();
        } else {
            this.rooms.push(vm);
        }
        return vm;
    }

    get activeRoom() {
        return this.rooms[this.current];
    }

    gotoRoom(indexOrVm, viewIndex = 0) {
        const nextIndex = (typeof indexOrVm === 'number')
            ? indexOrVm
            : this.rooms.indexOf(indexOrVm);

        if (nextIndex < 0 || nextIndex >= this.rooms.length) return;

        const currentVm = this.rooms[this.current];
        R.remove(currentVm);
        if (typeof currentVm.onExit === 'function') currentVm.onExit();

        this.current = nextIndex;

        const nextVm = this.rooms[this.current];
        R.add(nextVm);
        if (typeof nextVm.onEnter === 'function') nextVm.onEnter();

        // land on a specific view within that room
        if (typeof viewIndex === 'number' && typeof nextVm.gotoIndex === 'function') {
            nextVm.gotoIndex(viewIndex);
        }
    }
}
