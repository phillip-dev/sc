var EnergyHandler = require("main.energy");
var RoleConstruction = require("role.construction");
var RoleRepair = require("role.repair");
var RoleHarvest = require("role.harvest");
var RoleUpgrade = require("role.upgrade");
var ControllTower = require("controll.tower");

module.exports.loop = function () {
    var workers_jobs = {
        [RoleHarvest.rolename]: 6,
        [RoleUpgrade.rolename]: 3,
        [RoleRepair.rolename]: 1,
        [RoleConstruction.rolename]: 3,
    };

    var handle_rooms = ["W93N23", "sim"];

    var towers = [];

    handle_rooms.forEach(function (room, index) {
        if (Game.rooms[room] != undefined) {
            var t = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_TOWER
            });
            towers = towers.concat(t);        }
    });


    for (let tower of towers) {
        ControllTower.work(tower);
    }

    console.log("Active Workers:");
    console.log(RoleHarvest.rolename + ": " + RoleHarvest.workercount());
    console.log(RoleUpgrade.rolename + ": " + RoleUpgrade.workercount());
    console.log(RoleConstruction.rolename + ": " + RoleConstruction.workercount());
    console.log(RoleRepair.rolename + ": " + RoleRepair.workercount());

    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    if (Game.spawns.main.room.energyAvailable == Game.spawns.main.room.energyCapacityAvailable) {
        if (RoleHarvest.spawn(workers_jobs[RoleHarvest.rolename])) {
        }
        else if (RoleUpgrade.spawn(workers_jobs[RoleUpgrade.rolename])) {
        }
        else if (RoleRepair.spawn(workers_jobs[RoleRepair.rolename])) {
        }
        else if (RoleConstruction.spawn(workers_jobs[RoleConstruction.rolename])) {
        } else {
            RoleConstruction.spawn(workers_jobs[RoleConstruction.rolename], true);
        }
    }


    for (let name in Game.creeps) {
        var creep = Game.creeps[name];
        EnergyHandler.check(creep);
        if (!EnergyHandler.getEnergy(creep)) {
            if (creep.memory.working == true) {
                if (creep.memory.role == RoleUpgrade.rolename) {
                    RoleUpgrade.work(creep)
                } else if (creep.memory.role == RoleHarvest.rolename) {
                    RoleHarvest.work(creep);
                } else if (creep.memory.role == RoleConstruction.rolename) {
                    RoleConstruction.work(creep);
                } else if (creep.memory.role == RoleRepair.rolename) {
                    RoleRepair.work(creep);
                } else {
                    RoleHarvest.work(creep);
                }
            }
        }
    }
};