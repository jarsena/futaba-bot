const { SlashCommandBuilder } = require ('discord.js');
//get json files
var skills = require('./skillList.json');
var shadows = require('./activeShadows.json');
var personas = require('./persona-list.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ailment-check')
        .setDescription('If your attack has a chance of inflicting an Ailment, this is where you see if it stuck.')
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
                .setRequired(true)),
        async execute(interaction) {
            var skill = getEntity(interaction.options.getString('skill'));
            var attacker = getEntity(interaction.options.getString('attacker'));
            var defender = getEntity(interaction.options.getString('defender'));
            const hitChance = getHitChance(skill.ailchance, attacker.stats[4], defender.stats[4]);
            //console.log(`Attacker's Luck: ${attacker.stats[4]}`);
            //console.log(`Attacker's Name: ${attacker.name}`);
            //console.log(`Defender's Luck: ${defender.stats[4]}`);
            //console.log(`Ailment chance in command: ${hitChance}`);
            var hitRoll = Math.floor(Math.random() * 100);
            if (hitRoll >= hitChance)
            {
                if(attacker.entitytype == 'persona')
                {
                    interaction.reply(`Mwehehe...ailment hit!`)
                }
                else
                {
                    interaction.reply(`oh shit im gonna have to do switch statements for ailment skills but thats ok its fine`)
                }
            }
            else
            {
                interaction.reply(`Not this time... \n Your skill's base ailment chance was ${skill.ailchance}, your roll was ${hitRoll}, and to hit you needed a ${hitChance} or higher.`)
            }

        }
}

function getHitChance(basehit, luck1, luck2)
{
    const luckMod = Math.floor((luck1 - luck2) * 0.3);
    var ailmentChance = 100 -(basehit + luckMod);
    //console.log(`Ailment Chance within function: ${ailmentChance}`);
    return ailmentChance;
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