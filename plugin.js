var format = require('util').format;
var correctionDb = require('./lib/correction-db');

const requiresCorrection = (process.env.NODE_ENV === 'development' ? 'tennu-correction/plugin.js' : 'correction');

var TennuCorrectionDb = {
    requires: [requiresCorrection],
    requiresRoles: ['dbcore'],
    init: function(client, imports) {
        
        const dbACorrectionPromise = imports.dbcore.then(function(knex) {
            return correctionDb(knex);
        });
        
        const correctionHandler = function(lookBackLimit, target, channel, replacement) {
            return dbACorrectionPromise.then(function(correctionDb) {
                return correctionDb.find(lookBackLimit, target, channel).then(function(locatedDBTarget) {
                    console.log(locatedDBTarget);
                    if (!locatedDBTarget) {
                        return {
                            intent: "notice",
                            query: true,
                            message: format('I searched the last 30 messages to the channel but couldnt find anything with "%s" in it', target)
                        };
                    }
                    return imports[requiresCorrection].correct(locatedDBTarget, target, replacement);
                });
            });
        };
        
        imports[requiresCorrection].addMiddleware(correctionHandler);

        return {};
    }
};

module.exports = TennuCorrectionDb;