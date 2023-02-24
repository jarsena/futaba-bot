const { SlashCommandBuilder } = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('healing')
        .setDescription('Slurp up that heal juice.')
        .addIntegerOption( option => 
            option
                .setName('magic')
                .setDescription('The healer\'s Magic stat.')
                .setRequired(true))
        .addStringOption( option =>
            option
                .setName('rank')
                .setDescription('Rank of Dia skill.')
                .addChoices(
                    {name:'Dia', value: 'dia'},
                    {name:'Diarama', value: 'diarama'},
                    {name:'Diarahan', value: 'diarahan'}
                )
                .setRequired(true)),
    async execute(interaction) {
            var healAmt = getSkillPower(interaction.options.getInteger('magic'), interaction.options.getString('rank'));
            if (interaction.options.getString('rank') == 'diarahan')
            {
                await interaction.reply('Your target(s) regained full HP!');
            }
            else
            {
                await interaction.reply(`Your target(s) regained ${healAmt} HP!`);
            }
    }

}

function getSkillPower(magic, diaRank)
{
    var skillPower;
    switch(true) {
        case diaRank == 'dia':
            skillPower = magic * 3;
            break;
        case diaRank == 'diarama':
            skillPower = magic * 5;
            break;
        case diaRank == 'diarahan':
            //diarahan will just be a text prompt saying you or everyone healed to full, so just pick a value for skillPower
            skillPower = 1;
            break;
        default:
            skillPower = 50;
    }
    return skillPower;
}