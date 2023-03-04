const { SlashCommandBuilder } = require ('discord.js') ;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level-up')
        .setDescription('So you\'ve gained a level! Come see what stats you got!'),
    async execute(interaction) {
        
        const stats = ['Strength', 'Magic', 'Endurance', 'Agility', 'Luck'];
        const random1 = Math.floor(Math.random() * stats.length);
        const random2 = Math.floor(Math.random() * stats.length);
        const random3 = Math.floor(Math.random() * stats.length);
        interaction.reply(`Level Up! Your Persona gained ${stats[random1]}, ${stats[random2]}, and ${stats[random3]}! \n Make sure you distribute 10 points between HP and SP, and check your Persona's skill list!`);
    }
}