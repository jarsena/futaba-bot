const { SlashCommandBuilder } = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('basic-attack-damage')
        .setDescription('Calculates the damage from a basic weapon attack.')
        .addIntegerOption(option =>
            option
                .setName('weaponpower')
                .setDescription('Input your weapon\'s power stat.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('strength')
                .setDescription('Input your Strength stat.')
                .setRequired(true)),
    async execute(interaction) {
        const totalDmg = Math.round((Math.sqrt(0.5*interaction.options.getInteger('weaponpower')) * Math.sqrt(interaction.options.getInteger('strength'))));
        await interaction.reply(`Lemme get that for you! \n\n Your attack did ${totalDmg} damage!`);
    }
}