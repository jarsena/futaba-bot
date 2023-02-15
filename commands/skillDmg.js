const { SlashCommandBuilder } = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skill-attack-damage')
        .setDescription('Calculates the damage from a Skill.')
        .addIntegerOption(option =>
            option
                .setName('skillpower')
                .setDescription('Input your skill\'s power stat.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('stat')
                .setDescription('Input your Strength stat if this is a physical attack, or your Magic stat if this is elemental.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('endurance')
                .setDescription('Input enemy Endurance stat.')
                .setRequired(true))                
        .addStringOption(option =>
            option
                .setName('modifier')
                .setDescription('Did you crit, hit a weakness or get technical damage?')
                .setRequired(true)
                .addChoices(
                    { name: 'none', value: 'null'},
                    { name: 'crit', value: 'critical'},
                    { name: 'technical', value: 'tech'},
                    { name: 'weakness', value:'weak'},
                    { name: 'resist', value:'res'}
                ))
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
        const specialModifier = interaction.options.getString('modifier');
        const atkMod = getMods(interaction.options.getString('attackmod'));
        const defense = getMods(interaction.options.getString('defmod')) * Math.sqrt(interaction.options.getInteger('endurance'));
        const initialDmg = Math.round((Math.sqrt(interaction.options.getInteger('skillpower')) * Math.sqrt(interaction.options.getInteger('stat'))));
        if(specialModifier == 'critical')
        {
            const critDmg = ((atkMod * initialDmg) * 2) / defense;
            await interaction.reply(`Scatter them! \n\n Your skill did ${critDmg} damage!`);
        } else if(specialModifier == 'tech'){
            const techDmg = ((atkMod * initialDmg) * 1.8) / defense;
            await interaction.reply(`Floor 'em! \n \n Your skill did ${techDmg} damage!`);
        } else if(specialModifier == 'weak'){
            const weakDmg = ((atkMod * initialDmg) * 1.4) / defense;
            await interaction.reply(`Hit 'em where it hurts! \n \n Your skill did ${weakDmg} damage!`);
        } else if(specialModifier == 'res')
        {
            const resDmg = ((atkMod * initialDmg) * 0.5) / defense;
            await interaction.reply(`Oof.... \n\n Your skill did ${resDmg} damage.`);
        } else{
        await interaction.reply(`Let's get crackin'! \n\n Your skill did ${(atkMod * initialDmg)/defense} damage!`);
        }
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