class Module {
    constructor({ io, MESSAGES, db, mediator }) {
        this.io = io;
        this.db = db || null;
        this.mediator = mediator;
        this.MESSAGES = MESSAGES;
        this.EVENTS = mediator.getEventTypes();
        this.TRIGGERS = mediator.getTriggerTypes();
    }
}

module.exports = Module;