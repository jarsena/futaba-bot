const { SlashCommandBuilder } = require ('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
            .setName('all-out-attack')
            .setDescription('Calculates the damage for an All-Out Attack.')
            .addIntegerOption(option =>
                option
                    .setName('statone')
                    .setDescription('Give the first attacker\'s Strength or Magic stat; whichever is higher.')
                    .setRequired(true))
            .addIntegerOption(option => 
                option
                    .setName('stattwo')
                    .setDescription('Give the second attacker\'s Strength or Magic stat; whichever is higher.')
                    .setRequired(true))
            .addIntegerOption(option => 
                option
                    .setName('statthree')
                    .setDescription('Give the third attacker\'s Strength or Magic stat; whichever is higher.'))
            .addIntegerOption(option => 
                option
                    .setName('statfour')
                    .setDescription('Give the fourth attacker\'s Strength or Magic stat; whichever is higher.')),
        async execute(interaction){
            const statTotal = interaction.options.getInteger('statone') + interaction.options.getInteger('stattwo') + interaction.options.getInteger('statthree') + interaction.options.getInteger('statfour');
            const dmgTotal = statTotal * 2;
            await interaction.reply(`Beat 'em up! \n \n The All-Out Attack did ${dmgTotal} damage!`);
        }
}