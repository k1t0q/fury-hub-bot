import 'dotenv/config';
import {Client,GatewayIntentBits,ActionRowBuilder,StringSelectMenuBuilder,EmbedBuilder,ButtonBuilder,ButtonStyle} from 'discord.js';
import {createClient} from '@supabase/supabase-js';
const client=new Client({intents:[GatewayIntentBits.Guilds]});
const db=process.env.SUPABASE_URL&&process.env.SUPABASE_KEY?createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY):null;
const SITE='https://k1t0q.github.io/scum-squad-hub/';
const menu=()=>new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('fury_menu').setPlaceholder('Выбрать раздел FURY HUB').addOptions(
{label:'Главная',value:'home',description:'Сводка FURY HUB'},{label:'План на рейд',value:'raids',description:'Текущие планы'},{label:'Задачи',value:'tasks',description:'Активные задачи'},{label:'Взрыв',value:'boom',description:'Запасы взрывчатки'},{label:'Протект',value:'protect',description:'Последний протект'},{label:'Состав',value:'members',description:'Участники FURY'},{label:'Открыть FURY HUB',value:'site',description:'Перейти на сайт'}));
const em=(t,d)=>new EmbedBuilder().setTitle(t).setDescription(d).setColor(0xd71920).setFooter({text:'FURY HUB'}).setTimestamp();
async function rows(table){if(!db)return null;const {data,error}=await db.from(table).select('*').limit(15);return error?null:data;}
async function view(s){
if(s==='home'){const [m,t,r]=await Promise.all([rows('members'),rows('tasks'),rows('raids')]);return em('FURY HUB',db?'Состав: **'+(m?.length??'—')+'**\nЗадачи: **'+(t?.length??'—')+'**\nПланы на рейд: **'+(r?.length??'—')+'**':'Панель готова. Supabase подключится после добавления секрета.');}
if(s==='members'){const d=await rows('members');return em('Состав FURY',d?.length?d.map(x=>'**'+(x.nickname||x.nick||'Участник')+'**'+(x.role?' — '+x.role:'')).join('\n'):'Данных пока нет.');}
if(s==='tasks'){const d=await rows('tasks');return em('Задачи',d?.length?d.map(x=>'• '+(x.title||x.name||'Задача')).join('\n'):'Активных задач нет.');}
if(s==='raids'){const d=await rows('raids');return em('План на рейд',d?.length?d.map(x=>'• '+(x.title||x.name||'Рейд')).join('\n'):'Планов пока нет.');}
if(s==='boom')return em('Взрыв','Подключим к складу взрывчатки после проверки структуры базы.');
if(s==='protect')return em('Протект','Подключим к истории протекта после проверки структуры базы.');
return em('FURY HUB','Выбери раздел ниже.');
}
client.on('interactionCreate',async i=>{try{
if(i.isChatInputCommand()&&i.commandName==='fury'){await i.reply({embeds:[await view('home')],components:[menu()]});return;}
if(i.isStringSelectMenu()&&i.customId==='fury_menu'){const s=i.values[0];if(s==='site'){const b=new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Открыть FURY HUB').setURL(SITE).setStyle(ButtonStyle.Link));await i.update({embeds:[em('FURY HUB','Переход на сайт')],components:[menu(),b]});return;}await i.update({embeds:[await view(s)],components:[menu()]});}
}catch(e){console.error(e);if(i.isRepliable()){const p={content:'Ошибка FURY HUB. Проверь настройки бота.',ephemeral:true};i.replied||i.deferred?await i.followUp(p):await i.reply(p);}}});
client.once('ready',()=>console.log('FURY HUB Bot v0.1: '+client.user.tag));
if(!process.env.DISCORD_TOKEN)throw new Error('DISCORD_TOKEN не задан');
client.login(process.env.DISCORD_TOKEN);