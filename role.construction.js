var RoleUpgrade = require("role.upgrade");

module.exports = {
    rolename: 'construction',
    workercount: function () {
        var _self = this;
        return _.filter(Game.creeps, (c) => c.memory.role == _self.rolename).length
    },
    spawn: function (creep_count, override = false) {
        var _self = this;
        if (override ||_self.workercount() < creep_count) {
            console.log("Spwan: " + _self.rolename);
            
            let y;
            let skills = [];
            let work = Math.floor(Game.spawns.main.room.energyAvailable / 300);
            let i = Math.floor((Game.spawns.main.room.energyAvailable - (100*work)) / 100);
            
            if(work < 0) work = 1;
            
            for(y = work; y > 0; y--) {
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
        var construction_site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (construction_site != undefined) {
            if (!creep.pos.isNearTo(construction_site)) {
                creep.moveTo(construction_site);
            } else {
                creep.build(construction_site);
            }
        } else {
            console.log(creep.name + " Fallback => Upgrade");
            RoleUpgrade.work(creep);
        }
    }
};