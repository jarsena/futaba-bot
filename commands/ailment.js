const { SlashCommandBuilder } = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ailment-check')
        .setDescription('If your attack has a chance of inflicting an Ailment, this is where you see if it stuck.')
        .addIntegerOption(option =>
            option
                .setName('basehit')
                .setDescription('20 for Low, 40 for Medium, 50 for High. Consult skill description otherwise.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('luck')
                .setDescription('Your luck stat.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('enemyluck')
                .setDescription('Enemy\'s luck stat.')
                .setRequired(true)),

        async execute(interaction) {
            const hitChance = getHitChance(interaction.options.getInteger('basehit'), interaction.options.getInteger('luck'), interaction.options.getInteger('enemyluck'));
            var hitRoll = Math.floor(Math.random() * 100);
            if (hitRoll >= hitChance)
            {
                interaction.reply(`Mwehehe...ailment hit!`)
            }
            else
            {
                interaction.reply(`Not this time...`)
            }

        }
}

function getHitChance(basehit, luck1, luck2)
{
    const luckMod = Math.floor((luck1 - luck2) * 0.3);
    var ailmentChance = 100 -(basehit + luckMod);
    return ailmentChance;
}