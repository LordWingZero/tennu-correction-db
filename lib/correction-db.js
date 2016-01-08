// Returns one row, or undefined.
function find(lookBackLimit, target, channel) {
    return this.knex.select('*')
        .from('message')
        .where('Channel', channel)
        .andWhere('Message', 'NOT LIKE', 's/%/%')
        .limit(lookBackLimit)
        .offset(0)
        .orderBy('Timestamp', 'desc')
        .then(function(rows) {
            if (rows) {
                var matches = rows.filter(function(message) {
                    return message.Message.indexOf(target) > -1;
                });
                // Grab the first match
                if(matches.length)
                {
                    return {
                        message: matches[0].Message,
                        nickname: matches[0].FromNick,
                        channel: matches[0].Channel
                    };
                }
            }
        });
}

module.exports = function(knex){
    return {
        knex: knex,
        find: find
    };
}