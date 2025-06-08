const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const CortexAPI = require('./services/cortexAPI');

// Config dosyasını yükle
let config;
try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (error) {
    console.error('❌ config.json dosyası bulunamadı veya okunamadı!');
    console.error('📋 config.example.json dosyasını config.json olarak kopyalayın ve gerekli bilgileri doldurun.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Slash komutları için collection
client.commands = new Collection();

// CortexAPI servisini başlat
const cortexAPI = new CortexAPI(config.api.cortexApiKey, config.api.baseUrl, config.settings);

// Komutları yükle
const commands = [
    {
        name: 'ai',
        description: 'Yapay zeka ile sohbet et',
        options: [
            {
                name: 'mesaj',
                description: 'Yapay zekaya göndermek istediğin mesaj',
                type: 3, // STRING
                required: true,
            },
            {
                name: 'model',
                description: 'Kullanılacak AI modeli (varsayılan: gpt-4o-mini)',
                type: 3, // STRING
                required: false,
                choices: [
                    { name: 'GPT-4o Mini', value: 'gpt-4o-mini' },
                    { name: 'GPT-4o', value: 'gpt-4o' },
                    { name: 'Gemini', value: 'gemini' },
                    { name: 'Grok 3 Mini Beta', value: 'grok-3-mini-beta' },
                ]
            }
        ],
    },
    {
        name: 'models',
        description: 'Kullanılabilir AI modellerini göster',
    },
    {
        name: 'info',
        description: 'Bot hakkında bilgi al',
    }
];

// Bot hazır olduğunda
client.once('ready', async () => {
    console.log(`🤖 ${client.user.tag} aktif!`);
    console.log(`📊 ${client.guilds.cache.size} sunucuda hizmet veriyorum`);
    
    // Slash komutları kaydet
    const rest = new REST({ version: '10' }).setToken(config.bot.token);
    
    try {
        console.log('Slash komutları kaydediliyor...');
        
        if (config.bot.guildId && config.bot.guildId !== "YOUR_GUILD_ID_HERE") {
            // Test için belirli sunucuya kaydet (daha hızlı)
            await rest.put(
                Routes.applicationGuildCommands(config.bot.clientId, config.bot.guildId),
                { body: commands },
            );
            console.log('✅ Sunucu slash komutları başarıyla kaydedildi!');
        } else {
            // Global komutlar (1 saat sürebilir)
            await rest.put(
                Routes.applicationCommands(config.bot.clientId),
                { body: commands },
            );
            console.log('✅ Global slash komutları başarıyla kaydedildi!');
        }
    } catch (error) {
        console.error('❌ Slash komutları kaydedilirken hata:', error);
    }

    // Bot durumunu ayarla
    client.user.setActivity('AI ile sohbet | /ai', { type: 'PLAYING' });
});

// Slash komut etkileşimleri
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    try {
        if (commandName === 'ai') {
            await handleAICommand(interaction);
        } else if (commandName === 'models') {
            await handleModelsCommand(interaction);
        } else if (commandName === 'info') {
            await handleInfoCommand(interaction);
        }
    } catch (error) {
        console.error('Komut işlenirken hata:', error);
        
        const errorMessage = {
            content: '❌ Komut işlenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
            ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// AI komutunu işle
async function handleAICommand(interaction) {
    const message = interaction.options.getString('mesaj');
    const model = interaction.options.getString('model') || config.settings.defaultModel;

    await interaction.deferReply();

    try {
        const response = await cortexAPI.chat(message, model);
        
        // Yanıt çok uzunsa böl
        if (response.length > 2000) {
            const chunks = response.match(/.{1,1900}/g);
            await interaction.editReply(`🤖 **${model}** yanıtı:\n\n${chunks[0]}...`);
            
            for (let i = 1; i < chunks.length && i < 3; i++) {
                await interaction.followUp(`${chunks[i]}${i === chunks.length - 1 ? '' : '...'}`);
            }
        } else {
            await interaction.editReply(`🤖 **${model}** yanıtı:\n\n${response}`);
        }
    } catch (error) {
        console.error('AI API hatası:', error);
        await interaction.editReply('❌ AI API\'ye bağlanırken hata oluştu. API anahtarınızı kontrol edin.');
    }
}

// Modeller komutunu işle
async function handleModelsCommand(interaction) {
    await interaction.deferReply();

    try {
        const models = await cortexAPI.getModels();
        const modelList = models.map(model => `• ${model}`).join('\n');
        
        await interaction.editReply(`🎯 **Kullanılabilir AI Modelleri:**\n\n${modelList}`);
    } catch (error) {
        console.error('Modeller alınırken hata:', error);
        await interaction.editReply('❌ Model listesi alınırken hata oluştu.');
    }
}

// Info komutunu işle
async function handleInfoCommand(interaction) {
    const embed = {
        color: 0x00ff88,
        title: '🤖 CortexAI Discord Bot',
        description: 'CortexAPI entegrasyonu ile güçlendirilmiş yapay zeka botu',
        fields: [
            {
                name: '📋 Komutlar',
                value: '`/ai` - AI ile sohbet et\n`/models` - Kullanılabilir modelleri göster\n`/info` - Bu bilgi mesajı',
                inline: false
            },
            {
                name: '🔧 Özellikler',
                value: '• Çoklu AI model desteği\n• Slash komut entegrasyonu\n• Hızlı yanıt süresi\n• Güvenli API entegrasyonu',
                inline: false
            },
            {
                name: '📊 İstatistikler',
                value: `• Sunucu sayısı: ${interaction.client.guilds.cache.size}\n• Ping: ${interaction.client.ws.ping}ms`,
                inline: false
            }
        ],
        footer: {
            text: 'CortexAI ile güçlendirilmiştir',
            icon_url: interaction.client.user.displayAvatarURL()
        },
        timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
}

// Hata yakalama
process.on('unhandledRejection', error => {
    console.error('Yakalanmamış Promise reddi:', error);
});

process.on('uncaughtException', error => {
    console.error('Yakalanmamış exception:', error);
    process.exit(1);
});

// Botu başlat
client.login(config.bot.token);
