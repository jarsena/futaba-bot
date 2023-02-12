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
                )),
    async execute(interaction) {
        const specialModifier = interaction.options.getString('modifier');
        const initialDmg = Math.round((Math.sqrt(interaction.options.getInteger('skillpower')) * Math.sqrt(interaction.options.getInteger('stat'))));
        if(specialModifier == 'critical')
        {
            const critDmg = initialDmg *2 ;
            await interaction.reply(`Scatter them! \n\n Your skill did ${critDmg} damage!`);
        } else if(specialModifer == 'tech'){
            const techDmg = initialDmg * 1.8;
            await interaction.reply(`Floor 'em! \n \n Your skill did ${techDmg} damage!`);
        } else if(specialModifier == 'weak'){
            const weakDmg = initialDmg * 1.4;
            await interaction.reply(`Hit 'em where it hurts! \n \n Your skill did ${weakDmg} damage!`);
        } else{
        await interaction.reply(`Let's get crackin'! \n\n Your skill did ${initialDmg} damage!`);
        }
    }
}