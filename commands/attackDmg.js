const { SlashCommandBuilder } = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('basic-attack-damage')
        .setDescription('Calculates the damage from a basic weapon attack.')
        .addIntegerOption(option =>
            option
                .setName('strength')
                .setDescription('Input your Strength stat.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('endurance')
                .setDescription('Input the enemy\'s Endurance stat.')
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
                )),
    async execute(interaction) {
        const basePower = getMods(interaction.options.getString('attackmod')) * Math.sqrt(interaction.options.getInteger('strength'));
        const def = getMods(interaction.options.getString('defmod')) * Math.sqrt((interaction.options.getInteger('endurance')))
        const totalDmg = Math.round(basePower/def);
        await interaction.reply(`Lemme get that for you! \n\n Your attack did ${totalDmg} damage!`);
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