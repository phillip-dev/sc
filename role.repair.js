var RoleConstruction = require("role.construction");

module.exports = {
    rolename: 'repair',
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
        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
        });
        if (structure != undefined) {
            if (!creep.pos.isNearTo(structure)) {
                creep.moveTo(structure);
            } else {
                creep.repair(structure);
            }
        } else {

            // find all walls in the room
            var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
            });

            var target = undefined;

            for (let percentage = 0.00001; percentage <= 1; percentage = percentage + 0.00001) {
                target = creep.pos.findClosestByPath(walls, {
                    filter: (s) => s.structureType == STRUCTURE_WALL &&
                    s.hits / s.hitsMax < percentage
                });

                if (target != undefined) {
                    break;
                }
            }

            if (target != undefined) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                console.log(creep.name + " Fallback => Construction");
                RoleConstruction.work(creep);
            }
        }
    }
};