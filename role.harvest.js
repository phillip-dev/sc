module.exports = {
    rolename: 'harvest',
    workercount: function () {
        var _self = this;
        return _.filter(Game.creeps, (c) => c.memory.role == _self.rolename).length
    },
    spawn: function (creep_count, override = false) {
        var _self = this;
        if (override || _self.workercount() < creep_count) {
            console.log("Spwan: " + _self.rolename);

            let y;
            let skills = [];
            let work = Math.floor(Game.spawns.main.room.energyAvailable / 300);
            let i = Math.floor((Game.spawns.main.room.energyAvailable - (100 * work)) / 100);

            if (work < 0) work = 1;

            for (y = work; y > 0; y--) {
                skills.push(WORK);
            }

            for (y = i; y > 0; y--) {
                skills.push(CARRY);
            }

            for (y = i; y > 0; y--) {
                skills.push(MOVE);
            }

            Game.spawns.main.createCreep(skills, undefined, {
                working: false,
                role: _self.rolename
            });
            return true;
        } else {
            return false;
        }
    },
    work: function (creep) {
        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN
            || s.structureType == STRUCTURE_EXTENSION
            || (s.structureType == STRUCTURE_TOWER && s.energy <= 500))
            && s.energy < s.energyCapacity
        });

        if (structure != undefined) {
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
        }
    }
};