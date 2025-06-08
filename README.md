# 🤖 V14 Discord Bot Altyapısı Yapay Zeka Entegrasyonlu

[![Node.js](https://img.shields.io/badge/Node.js-16.9.0+-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)](https://discord.js.org/)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

Cortex üyeliği olup buradaki [modelleri](https://api.claude.gg/v1/models) kullanarak proje geliştirmek isteyenler için uygundur

Claude 4 Opus Kullanılarak Hazırlandı.

## 🌟 Özellikler

- ✅ **Discord v14 Slash Komutları** - Modern Discord bot API desteği
- 🧠 **Çoklu AI Model Desteği** - GPT-4o, GPT-3.5, Gemini, Grok 3 ve daha fazlası
- ⚡ **Hızlı Yanıt Süreleri** - Optimize edilmiş API entegrasyonu
- 🔒 **Güvenli** - JSON konfigürasyonu ile API anahtarı koruması
- 📊 **Detaylı Hata Yönetimi** - Kapsamlı error handling
- 🎯 **Kolay Kurulum** - Basit setup ve deployment

## 🚀 Desteklenen AI Modelleri

- **OpenAI GPT-4o Mini** - Hızlı ve ekonomik
- **OpenAI GPT-4o** - En gelişmiş GPT modeli
- **Google Gemini** - Klasik ve güvenilir
- **Grok 3 Mini Beta** - Yeni ve Güvenilir


## 📋 Komutlar

| Komut | Açıklama | Parametreler |
|-------|----------|--------------|
| `/ai` | AI ile sohbet et | `mesaj` (gerekli), `model` (isteğe bağlı) |
| `/models` | Kullanılabilir AI modellerini göster | Yok |
| `/info` | Bot hakkında bilgi al | Yok |

## 🛠️ Kurulum

### Gereksinimler

- Node.js 16.9.0 veya üstü
- Discord Bot
- CortexAPI anahtarı

### 1. Projeyi İndir

```bash
git clone https://github.com/razget/discord-v14-yapay-zekali.git
cd cortex-ai-discord-bot
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. Konfigürasyon

`config.example.json` dosyasını `config.json` olarak kopyalayın ve gerekli bilgileri doldurun:

```bash
cp config.example.json config.json
```

`config.json` dosyasını düzenleyin:

```json
{
  "bot": {
    "token": "your_discord_bot_token_here",
    "clientId": "your_discord_application_id_here",
    "guildId": "your_guild_id_here"
  },
  "api": {
    "cortexApiKey": "your_cortex_api_key_here",
    "baseUrl": "https://api.claude.gg/v1"
  },
  "settings": {
    "defaultModel": "gpt-4o-mini",
    "maxTokens": 2000,
    "temperature": 0.7,
    "timeout": 30000
  }
}
```


### 4. Discord Bot Oluşturma

1. [Discord Developer Portal](https://discord.com/developers/applications) adresine gidin
2. "New Application" butonuna tıklayın
3. Bot için bir isim girin
4. "Bot" sekmesine geçin
5. "Add Bot" butonuna tıklayın
6. Token'ı kopyalayın ve `config.json` dosyasına ekleyin
7. "OAuth2" > "URL Generator" sekmesine gidin
8. Scopes: `bot`, `applications.commands` seçin
9. Bot Permissions: `Send Messages`, `Use Slash Commands` seçin
10. Oluşturulan URL ile botu sunucunuza ekleyin

### 5. CortexAPI Anahtarı

1. [CortexAI](https://cortexai.io/) adresine kayıt olun
2. Enterprise Plan Satın Alın
3. API anahtarınızı alın
4. `config.json` dosyasına ekleyin

### 6. Botu Çalıştır

```bash
# Geliştirme modu (otomatik yeniden başlatma)
npm run dev

# Üretim modu
npm start
```

## 📖 Kullanım Örnekleri

### Temel AI Sohbeti

```
/ai mesaj:Merhaba, nasılsın?
```

### Belirli Model ile Sohbet

```
/ai mesaj:Bir kod örneği yaz model:gpt-4o
```

### Model Listesi

```
/models
```

### Bot Bilgileri

```
/info
```

## 🏗️ Proje Yapısı

```
cortex-ai-discord-bot/
├── services/
│   └── cortexAPI.js          # CortexAPI service class
├── config.example.json       # Konfigürasyon şablonu
├── .gitignore               # Git ignore file
├── index.js                 # Ana bot dosyası
├── package.json             # Dependencies ve scripts
└── README.md               # Bu dosya
```

## 🔧 API Dokümantasyonu

### CortexAPI Entegrasyonu

Bot, CortexAPI'nin resmi endpoint'lerini kullanır:

**Base URL:** `https://api.claude.gg/v1`

**Chat Completions:**
```javascript
POST /chat/completions
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
    "model": "gpt-4o-mini",
    "messages": [
        {
            "role": "user",
            "content": "Hello!"
        }
    ]
}
```

**Response:**
```javascript
{
    "id": "chatcmpl-xxx",
    "object": "chat.completion",
    "created": 1234567890,
    "model": "gpt-4o-mini",
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "Hello! How can I assist you today?"
            },
            "index": 0,
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 10,
        "completion_tokens": 15,
        "total_tokens": 25
    }
}
```

## 🚀 Deployment

### Railway

1. [Railway](https://railway.app/) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. `config.json` dosyasını manuel olarak oluşturun veya environment variables kullanın
4. Deploy edin

### Heroku

1. [Heroku](https://heroku.com/) hesabı oluşturun
2. Heroku CLI yükleyin
3. `config.json` dosyasını manuel olarak oluşturun
4. Deploy komutları:

```bash
heroku create your-bot-name
git push heroku main
```

**Not:** Production ortamında `config.json` dosyasını güvenli şekilde yönetmeyi unutmayın.

### VPS/Server

```bash
# PM2 ile çalıştırma
npm install -g pm2
pm2 start index.js --name "cortex-bot"
pm2 startup
pm2 save
```

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🆘 Destek

Sorunlarınız için:

- GitHub Issues kullanın
- [Discord](https://discord.gg/rtx) sunucumuza katılın
- [E-posta](mailto:razget@contents.report) gönderin

## 🙏 Teşekkürler

- [Discord.js](https://discord.js.org/) - Discord bot framework
- [CortexAPI](https://cortex.fun/) - AI API provider
- [Node.js](https://nodejs.org/) - Runtime environment

---

⭐ Bu projeyi beğendiyseniz star vermeyi unutmayın!
