const { SlashCommandBuilder } = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hit-roll')
        .setDescription('Roll those bones and see if you hit something.')
        //basic stats needed to calculate if the attack will hit at all
        .addIntegerOption(option =>
            option
                .setName('agility')
                .setDescription('Your Agility stat.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('enemyagility')
                .setDescription('Your opponent\'s Agility stat.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('baseaccuracy')
                .setDescription('Base accuracy. Please just the number, no percent sign.')
                .setRequired(true))
        //extra options if the attack can crit.
        .addIntegerOption(option =>
            option
                .setName('basecrit')
                .setDescription('Base crit chance. Please enter just the number without the percent sign.'))
        .addIntegerOption(option =>
            option
                .setName('luck')
                .setDescription('If your attack can crit, please input your luck stat.'))
        .addIntegerOption(option =>
            option
                .setName('enemyluck')
                .setDescription('If your attack can crit, please input your opponent\'s Luck stat.'))
        .addStringOption(option =>
            option
                .setName('sukumod')
                .setDescription('Sukunda or Sukukaja?')
                .addChoices(
                    { name:'None', value: 'none'},
                    { name:'Sukukaja', value: 'sukukaja'},
                    { name:'Sukunda', value: 'sukunda'},
                )),
        async execute(interaction){
            const hitThresh = agiMod(interaction.options.getInteger('baseaccuracy'),interaction.options.getInteger('agility'), interaction.options.getInteger('enemyagility')) * getMods(interaction.options.getString('sukumod'));
            const critThresh = critMod(interaction.options.getInteger('basecrit'), interaction.options.getInteger('luck'), interaction.options.getInteger('enemyluck')) * getMods(interaction.options.getString('sukumod'));
            var hitRoll = Math.floor(Math.random() * 100);
            switch(true) {
                case hitRoll >= critThresh:
                    await interaction.reply(`You rolled a ${hitRoll}--critical hit!`);
                    break;
                case hitRoll >= hitThresh:
                    await interaction.reply(`You rolled a ${hitRoll}, and that's a hit!`);
                    break;
                default:
                    await interaction.reply(`Oof...you missed. A ${hitRoll} isn't gonna cut it for this one...`);
            }
        }

}

function agiMod(basehit, agi1, agi2)
{
    const agiDiff = agi1 - agi2;
    var agiMod;
    var hitChance;
    switch (true) {
        case agiDiff >= 40:
            agiMod = 20;
            break;
        case agiDiff >= 30:
            agiMod = 15;
            break;
        case agiDiff >= 20:
            agiMod = 10;
            break;
        case agiDiff >= 10:
            agiMod = 5;
            break;
        case agiDiff >= 0:
            agiMod = 0;
            break;
        case agiDiff >= -20:
            agiMod = -5;
            break;
        case agiDiff >= -40:
            agiMod = -10;
            break;
        case agiDiff >= -60:
            agiMod = -15;
            break;
        default:
            agiMod = -20;
    }
    hitChance = 100 - (basehit+agiMod);
    return hitChance;
}

function critMod(basecrit, luck1, luck2)
{
    const luckDiff = luck1 - luck2;
    var luckMod;
    var critChance;
    switch (true) {
            case luckDiff >= 30:
                luckMod = 20;
                break;
            case luckDiff >= 20:
                luckMod = 15;
                break;
            case luckDiff >= 10:
                luckMod = 10;
                break;
            case luckDiff >= 0:
                luckMod = 0;
                break;
            default:
                luckMod = -10;
    }
    critChance = 100 - (basecrit + luckMod);
    return critChance;
}

function getMods(buffValue)
{
    var buffMod;
    switch(true) {
        case buffValue == 'none':
            buffMod = 1.0;
            console.log('no mod');
            break;
        case buffValue == 'sukukaja':
            buffMod = 1.2;
            console.log('kaja');
            break;
        case buffValue == 'sukunda':
            buffMod = 0.8;
            console.log('kunda');
            break;
        default:
            buffMod = 1.0;
            console.log('default');
    }
    return buffMod;
}