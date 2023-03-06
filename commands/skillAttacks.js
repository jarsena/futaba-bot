const {SlashCommandBuilder} = require('discord.js');
//get json files
var skills = require('./skillList.json');
var shadows = require('./activeShadows.json');
var personas = require('./persona-list.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skills')
        .setDescription('Calculates damage when a skill is used.')
        .addStringOption(option =>
            option
                .setName('skill')
                .setDescription('Use proper caps and spaces if applicable, please!')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('attacker')
                .setDescription('Who\'s attacking? Mind your caps and spaces!')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('defender')
                .setDescription('Who\'s defending? Again, proper caps and spaces!')
                .setRequired(true))
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
                ))
        .addBooleanOption(option =>
            option
                .setName('charged')
                .setDescription('Charged/Concentrated?'))
        .addStringOption(option =>
            option
                .setName('modifier')
                .setDescription('Did you crit or get technical damage?')
                .addChoices(
                    { name: 'none', value: 'null'},
                    { name: 'crit', value: 'critical'},
                    { name: 'technical', value: 'tech'})),
        async execute(interaction) {
            const modVal = interaction.options.getString('modifier');
            var skill = getEntity(interaction.options.getString('skill'));
            var attacker = getEntity(interaction.options.getString('attacker'));
            var defender = getEntity(interaction.options.getString('defender'));
            if (skill == null)
            {
                await interaction.reply('Oops! Skill\'s not translating! Check your spelling and/or capitalization (if two words, both are capitalized).');
            }
            else
            {
                //damage formula: ((((sqrt(SKILLPWR) * sqrt(STAT)) / sqrt(END)) * TRU * CRG) / RKU) * AFF
                // TRU = taru mod, CRG = charge if applicable, RKU = raku mod, AFF = affinity mods or crit
                var stat;
                if (skill.element == "phys")
                {
                    stat = attacker.stats[0];
                    //console.log(`The stat is strength, and its value is ${stat}.`);
                }
                else
                {
                    stat = attacker.stats[1];
                    //console.log(`The stat is magic, and its value is ${stat}.`);
                }
                const initialDmg = (Math.sqrt(skill.basepower) * Math.sqrt(stat)) / Math.sqrt(defender.stats[2]);
                const taruMod = getMods(interaction.options.getString('attackmod'));
                const rakuMod = getMods(interaction.options.getString('defmod'));
                var chargeMult;
                var dmgMod;
                if (interaction.options.getBoolean('charged'))
                {
                    chargeMult = 2.5;
                    //console.log('charged');
                }
                else
                {
                    chargeMult = 1;
                    //console.log('uncharged');
                }
                const semifinalDmg = (initialDmg * taruMod) / rakuMod;
                var totalDmg;
                switch (true) {
                    case modVal == 'critical':
                        dmgMod = 2;
                        totalDmg = Math.floor(semifinalDmg * dmgMod * chargeMult);
                        await interaction.reply(`Critical hit; ${skill.name} did ${totalDmg} damage to ${defender.name}.`);
                        break;
                    case defender.weakness.includes(skill.element):
                        dmgMod = 1.4;
                        totalDmg = Math.floor(semifinalDmg * dmgMod * chargeMult);
                        await interaction.reply(`Weakness hit; ${skill.name} did ${totalDmg} damage to ${defender.name}.`);
                        break;
                    case defender.resists.includes(skill.element):
                        dmgMod = 0.5;
                        totalDmg = Math.floor(semifinalDmg * dmgMod * chargeMult);
                        await interaction.reply(`Resisted; ${skill.name} did ${totalDmg} damage to ${defender.name}.`);
                        break;
                    case defender.repel.includes(skill.element):
                        //communicate to player that their skill was repelled
                        totalDmg = Math.floor(semifinalDmg * chargeMult);
                        await interaction.reply(`Repelled; ${skill.name} did ${totalDmg} damage to you, instead.`);
                        break;
                    case defender.block.includes(skill.element):
                        await interaction.reply(`Blocked; ${skill.name} did 0 damage to ${defender.name}.`);
                        break;
                    case defender.drain.includes(skill.element):
                        //communicate to player their skill was drained
                        totalDmg = Math.floor(semifinalDmg * chargeMult);
                        await interaction.reply(`Drained; ${skill.name} healed ${defender.name} for ${totalDmg} damage.`);
                        break;
                    case modVal == 'tech':
                        dmgMod = 1.8;
                        totalDmg = Math.floor(semifinalDmg * dmgMod * chargeMult);
                        await interaction.reply(`Technical hit; ${skill.name} did ${totalDmg} damage to ${defender.name}.`);
                        break;
                    default:
                        //just output neutral damage
                        totalDmg = Math.floor(semifinalDmg * chargeMult);
                        await interaction.reply(`${skill.name} did ${totalDmg} damage to ${defender.name}.`);
                }
            }
        }
}

function getMods(buffValue)
{
    var buffMod;
    switch(true) {
        case buffValue == 'none':
            buffMod = 1.0;
            //console.log('no mod');
            break;
        case buffValue == 'tarukaja': case buffValue == 'rakukaja':
            buffMod = 1.2;
            //console.log('kaja');
            break;
        case buffValue == 'tarunda': case buffValue == 'rakunda':
            buffMod = 0.8;
            //console.log('kunda');
            break;
        default:
            buffMod = 1.0;
            //console.log('default');
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