const Module = require('./Module');

class RoomsManager extends Module {
    constructor(options) {
        super(options);
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.CREATE_ROOM, data => this.createRoom(data, socket));
            // socket.on(this.MESSAGES.JOIN_ROOM, data => this.joinRoom(data, socket));
            // socket.on(this.MESSAGES.LEAVE_ROOM, data => this.leaveRoom(data, socket));
            // socket.on(this.MESSAGES.GET_ROOMS, () => this.getRooms(socket));
        });

        this.io.of("/").adapter.on('delete-room', room => {
            if (room in this.rooms) {
                delete this.rooms[room];
                this.io.emit(this.MESSAGES.GET_ROOMS, this.rooms);
            }
        });

        this.rooms = {};
        this.users = this.mediator.get(this.TRIGGERS.GET_ALL_USERS);
        this.mediator.set(this.TRIGGERS.GET_ALL_ROOMS, () => this.rooms);
        }

    createRoom(data, socket) {
        let result = { result: false };
        if (!(data.roomName in this.rooms)) {

            this.rooms[data.roomName] = data.roomName;
            socket.join(data.roomName);
            result = { result: true, room: data.roomName };

            this.io.emit(this.MESSAGES.GET_ROOMS, this.rooms);

            this.mediator.call(this.EVENTS.USER_ENTER_ROOM, data)
        }
        socket.emit(this.MESSAGES.CREATE_ROOM, result);
    }

    joinRoom(data, socket) {
        let result = { result: false };
        if (data.roomName in this.rooms) {
            socket.join(data.roomName);
            result = { result: true, room: data.roomName };
            this.mediator.call(this.EVENTS.USER_ENTER_ROOM, data);
        }
        socket.emit(this.MESSAGES.JOIN_ROOM, result);
    }

    leaveRoom(data, socket) {
        let result = false;
        if (data.roomName in this.rooms) {
            socket.leave(data.roomName);
            result = true;
            this.mediator.call(this.EVENTS.USER_LEAVE_ROOM, data);
        }
        socket.emit(this.MESSAGES.LEAVE_ROOM, { result });
    }

    getRooms(socket) {
        socket.emit(this.MESSAGES.GET_ROOMS, this.rooms);
    }

}

module.exports = RoomsManager;