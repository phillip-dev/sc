module.exports = {
    check: function (creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            if (creep.ticksToLive < 100) {
                creep.suicide();
                return;
            }
            creep.memory.working = false;
        } else if ((creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) || creep.ticksToLive < 100) {
            creep.memory.working = true;
        }
    },
    getEnergy: function (creep) {
        if (creep.memory.working == false) {
            let source = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
            if (source != undefined) {
                if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            } else {
                let source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            return true;
        } else {
            return false;
        }
    },
    moveToSource(creep) {

    }
};