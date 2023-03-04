const { SlashCommandBuilder } = require ('discord.js');
//get json files
var skills = require('./skillList.json');
var shadows = require('./activeShadows.json');
var personas = require('./persona-list.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hit-roll')
        .setDescription('Roll those bones and see if you hit something.')
        //basic stats needed to calculate if the attack will hit at all
        .addStringOption(option =>
            option
                .setName('attacker')
                .setDescription('Enter the attacker\'s name. Pay attention to caps and spaces.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('defender')
                .setDescription('Enter the defender\'s name. Again, please pay attention to caps and spaces.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('skill')
                .setDescription('Enter the skill\'s name, same grammar rules.')
                .setRequired(true))
        //extra options if the attack can crit.
        .addBooleanOption(option =>
            option
                .setName('rage')
                .setDescription('Are you enraged?'))
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
            var skill = getEntity(interaction.options.getString('skill'));
            var attacker = getEntity(interaction.options.getString('attacker'));
            var defender = getEntity(interaction.options.getString('defender'));
            var rageMod;
            if(interaction.options.getBoolean('rage'))
            {
                rageMod = 2;
            }
            else
            {
                rageMod = 1;
            }
            const hitThresh = agiMod(skill.baseacc,attacker.stats[4], defender.stats[4]) * getMods(interaction.options.getString('sukumod')) * rageMod;
            var critThresh = critMod(skill.crit, attacker.stats[5], defender.stats[5]) * getMods(interaction.options.getString('sukumod')) * rageMod;
            if (skill.element != "phys")
            {
                critThresh = 100;
            }
            const hitRoll = Math.floor(Math.random() * 100);
            if (skill.hitmax == null)
            {
                skill.hitmax = 1;
                skill.hitmin = 1;
            }
            var numHits = Math.floor(Math.random()  * skill.hitmax);
            if (numHits < skill.hitmin)
            {
                numHits = skill.hitmin;
            }
            switch(true) {
                case hitRoll >= critThresh:
                    if(attacker.entitytype == "persona")
                    {
                        await interaction.reply(`You rolled a ${hitRoll}--critical hit! \n Hit ${numHits} time(s)!`);
                    }
                    else
                    {
                        await interaction.reply(`Oh, no! The shadow got a critical hit! \n Hit ${numHits} time(s)!`) 
                    }
                    break;
                case hitRoll >= hitThresh:
                    if(attacker.entitytype == 'persona')
                    {
                        await interaction.reply(`You rolled a ${hitRoll}, and that's a hit! \n Hit ${numHits} time(s)!`);
                    }
                    else
                    {
                        await interaction.reply(`A hit--that looks like it hurt... \n Hit ${numHits} time(s)!`);
                    }
                    break;
                default:
                    if(attacker.entitytype == 'persona')
                    {
                        await interaction.reply(`Oof...you missed. A ${hitRoll} isn't gonna cut it for this one...`);
                    }
                    else
                    {
                        await interaction.reply(`Nice, they missed!`);
                    }
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

function getEntity(entity)
{
    var obj;
         //retrieve the skills, persona and shadow from the json lists
        for (let i = 0; i < skills.length; i++)
        {
            if (entity == skills[i].name)
            {
                obj = skills[i];
                break;
            }
        }
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