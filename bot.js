const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
        console.log('Replied to message');
    }

    if (msg.mentions.users.has('636190003306692608')) {
        console.log('Message to bot received.');
        let parsable = msg.content.slice(22).split('/');
        if (parsable.length !== 2) {
            msg.reply('Failed to parse message. Please try again using the format {Character}/{Realm}.' +
                'Please note that this bot only works for US characters.');
        } else {
            let name = parsable[0];
            let realm = parsable[1];

            const request = require('request');
            request('http://raider.io/api/v1/characters/profile?region=US&realm=' + realm + '&name=' + name + '&fields=mythic_plus_scores_by_season:current',
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        let json = JSON.parse(body);

                        let healScore = json.mythic_plus_scores_by_season[0].scores.healer;
                        let dpsScore = json.mythic_plus_scores_by_season[0].scores.dps;
                        let tankScore = json.mythic_plus_scores_by_season[0].scores.tank;

                        msg.reply('Scores for ' + name + ': \n Tank: ' + tankScore + '\n DPS: ' + dpsScore + '\n Heal: ' + healScore);
                    } else {
                        msg.reply('There was an error with the raider.io request, please try again.');
                    }
                });
        }
    }

});

client.login(auth.token);