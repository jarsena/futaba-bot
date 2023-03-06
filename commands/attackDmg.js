const { SlashCommandBuilder } = require ('discord.js');
var shadows = require('./activeShadows.json');
var personas = require('./persona-list.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('basic-attack')
        .setDescription('Calculates the damage from a basic weapon attack.')
        .addStringOption(option =>
            option
                .setName('attacker')
                .setDescription('Who\'s attacking? Mind your caps and spaces!')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('defender')
                .setDescription('Who\'s defending? Again, proper caps and spaces!')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('attackmod')
                .setDescription('Tarunda or Tarukaja?')
                .addChoices(
                    { name:'None', value: 'none'},
                    { name:'Tarukaja', value: 'tarukaja'},
                    { name:'Tarunda', value: 'tarunda'},
                ))
        .addStringOption(option=>
            option
                .setName('defmod')
                .setDescription('Rakunda or Rakukaja?')
                .addChoices(
                    { name:'None', value:'none'},
                    { name:'Rakukaja', value: 'rakukaja'},
                    { name:'Rakunda', value: 'rakunda'},
                ))
        .addBooleanOption(option =>
            option
                .setName('rage')
                .setDescription('Is the attacker enraged?')),
    async execute(interaction) {
        var attacker = getEntity(interaction.options.getString('attacker'));
        var defender = getEntity(interaction.options.getString('defender'));
        const basePower = getMods(interaction.options.getString('attackmod')) * Math.sqrt(attacker.stats[0]);
        const def = getMods(interaction.options.getString('defmod')) * Math.sqrt(defender.stats[2]);
        var rage;
        if(interaction.options.getBoolean('rage'))
        {
            rage = 2;
        }
        else
        {
            rage = 1;
        }
        const totalDmg = Math.round((basePower/def) * rage);
        await interaction.reply(`Your attack did ${totalDmg} damage!`);
    }
}

function getMods(buffValue)
{
    var buffMod;
    switch(true) {
        case buffValue == 'none':
            buffMod = 1.0;
            console.log('no mod');
            break;
        case buffValue == 'tarukaja': case buffValue == 'rakukaja':
            buffMod = 1.2;
            console.log('kaja');
            break;
        case buffValue == 'tarunda': case buffValue == 'rakunda':
            buffMod = 0.8;
            console.log('kunda');
            break;
        default:
            buffMod = 1.0;
            console.log('default');
    }
    return buffMod;
}

function getEntity(entity)
{
    var obj;
         //retrieve the skills, persona and shadow from the json lists
        /*for (let i = 0; i < skills.length; i++)
        {
            if (entity == skills[i].name)
            {
                obj = skills[i];
                break;
            }
        }*/
        for (let i = 0; i < shadows.length; i++)
        {
            if (entity == shadows[i].name)
            {
                obj = shadows[i];
                break;
            }
        }
        for (let i = 0; i < personas.length; i++)
        {
            if (entity == personas[i].name)
            {
                obj = personas[i];
                break;
            }
            }
        return obj;    
}