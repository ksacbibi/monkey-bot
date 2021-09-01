const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"], partials: ['MESSAGE', 'REACTION', 'CHANNEL'], });

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('Bot is ready');
});

const greetings = [
    'whats gwanning my g',
    'wagwan',
    'hi',
];

const talkedRecently = new Set();

client.on('messageCreate', (msg) => {
    if (msg.author == client.user) {
        return;
    }
    if (msg.content.toLowerCase().startsWith('hi')) {
        msg.channel.send(greetings[Math.floor(Math.random() * greetings.length)]);
    }
    if (msg.content.toLowerCase().startsWith('man')) {
        msg.channel.send({
            files: [
                "images/manbear.jpeg"
            ]
        })
    }
});

//commands
client.on('messageCreate', (message) => {
    var prefix = '!'
    var msg = message.content;

    if (msg === prefix + 'brianscar') {
        message.channel.send({
            files: [
                "images/brianscar.jpg"
            ]
        });
    }
    if (msg === prefix + 'michaelscar') {
        message.channel.send({
            files: [
                "images/michaelscar.jpg"
            ]
        })
    }
});


//gamble
client.on('messageCreate', (message) => {
    var prefix = '!'
    var msg = message.content.toLowerCase();
    const money = require('./money.json');
    const fs = require('fs');
    const ID = message.author.id;
    console.log(money[ID]);

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    message.guild.members.cache.forEach(money => {
        money[ID] = 25.00;
    })
    fs.writeFileSync('./money.json', JSON.stringify(money));
    
    if (msg === prefix + 'gimme') {
        if(talkedRecently.has(message.author.id)) {
            message.channel.send('You must wait 4 hours since the last time you used this command.') ;
        } else {
            giving = getRandomIntInclusive(1, 100);
            money[ID] += giving;
            fs.writeFileSync('./money.json', JSON.stringify(money));
            message.reply('Your new balance is $' + money[ID]);

            talkedRecently.add(message.author.id);
            setTimeout(() => {
                talkedRecently.delete(message.author.id);
            }, 14400000)
        }
    }

    if (msg === prefix + 'gamble') {
        async function asyncCall() {
        const amount = await message.reply('How much money would you like to gamble? (Min. amount of money to gamble: $25.00)');
        const filter = (m) => m.author.id === message.author.id;

        const collector = amount.channel.createMessageCollector({filter,
            max: 1,
            time: 30000,
        });

        collector.on('collect', async (m) => {
            message = m;
            console.log('worked');
            gambleAmount = parseInt(message.content);
            currentBal = parseInt(money[ID]);
            if (gambleAmount <= parseInt(money[ID])) {
                if (message >= 25.00) {
                    var option = getRandomIntInclusive(1,3);
                    if (option == 1) {
                            currentBal = currentBal - gambleAmount;
                            money[ID] = currentBal;
                            fs.writeFileSync('./money.json', JSON.stringify(money));
                            message.reply('You lost! Your new balance is now $' + currentBal);
                    } else if (option == 2) {
                            currentBal = currentBal - gambleAmount;
                            money[ID] = currentBal;
                            fs.writeFileSync('./money.json', JSON.stringify(money));
                            message.reply('You lost! Your new balance is now $' + currentBal);
                    } else if (option == 3) {
                            var winnings = getRandomIntInclusive(125,150);
                            winnings = winnings * 0.01;  
                            currentBal = currentBal + (gambleAmount * winnings);
                            money[ID] = currentBal;
                            fs.writeFileSync('./money.json', JSON.stringify(money));
                            message.reply('You won! Your new balance is now $' + currentBal);
                    }
                } else {
                    message.channel.send('You must enter at least $25.00 to gamble.');
                }
            } else {
                message.reply('You do not have this much money in your balance.');
            }
        })

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                message.channel.send('You took too long.')
            }
        })
    }
    asyncCall();
    }   

    if (msg === prefix + 'bal') {
        message.reply('Your balance is $' + money[ID]);
    }
});



