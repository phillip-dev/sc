/**
 * Created by pg on 04.05.17.
 */
module.exports = {
    work: function (tower) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        } else {
            if (tower.energy > tower.energyCapacity / 2) {
                var structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL  && s.structureType != STRUCTURE_RAMPART
                });
                if (structure != undefined) {
                    tower.repair(structure);
                } else {
                    var walls = tower.room.find(FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_RAMPART
                    });
                    if(walls.length > 0) {
        
                    var target = undefined;
        
        
                    for (let percentage = 0.001; percentage <= 1; percentage = percentage + 0.001) {
                        target = tower.pos.findClosestByPath(walls, {
                            filter: (s) => s.structureType == STRUCTURE_RAMPART && s.hits / s.hitsMax < percentage
                        });
        
                        if (target != undefined) {
                            break;
                        }
                    }
        
                    if (target != undefined) {
                        if (tower.repair(target) == ERR_NOT_IN_RANGE) {
                            tower.moveTo(target);
                        }
                    }
                    }
                }
            }
        }
    }
};