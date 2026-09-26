import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
const command=new SlashCommandBuilder().setName('fury').setDescription('Открыть панель FURY HUB');
const rest=new REST({version:'10'}).setToken(process.env.DISCORD_TOKEN);
if(!process.env.DISCORD_CLIENT_ID||!process.env.DISCORD_GUILD_ID) throw new Error('Заполни DISCORD_CLIENT_ID и DISCORD_GUILD_ID');
await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID,process.env.DISCORD_GUILD_ID),{body:[command.toJSON()]});
console.log('Команда /fury зарегистрирована.');