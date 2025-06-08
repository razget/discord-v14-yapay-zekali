const axios = require('axios');

class CortexAPI {
    constructor(apiKey, baseURL = 'https://api.claude.gg/v1', settings = {}) {
        this.apiKey = apiKey;
        this.baseURL = baseURL;
        this.settings = {
            maxTokens: 2000,
            temperature: 0.7,
            timeout: 30000,
            ...settings
        };
        
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: this.settings.timeout
        });
    }

    /**
     * AI ile sohbet et
     * @param {string} message - Kullanıcı mesajı
     * @param {string} model - Kullanılacak model (varsayılan: gpt-4o-mini)
     * @returns {Promise<string>} - AI yanıtı
     */
    async chat(message, model = 'gpt-4o-mini') {
        try {
            const response = await this.client.post('/chat/completions', {
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: this.settings.maxTokens,
                temperature: this.settings.temperature
            });

            if (response.data && response.data.choices && response.data.choices[0]) {
                return response.data.choices[0].message.content;
            } else {
                throw new Error('API yanıtında beklenmeyen format');
            }
        } catch (error) {
            console.error('CortexAPI Chat Hatası:', error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                throw new Error('API anahtarı geçersiz. Lütfen API anahtarınızı kontrol edin.');
            } else if (error.response?.status === 429) {
                throw new Error('Rate limit aşıldı. Lütfen daha sonra tekrar deneyin.');
            } else if (error.response?.status >= 500) {
                throw new Error('CortexAPI sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            } else {
                throw new Error('AI ile iletişimde hata oluştu.');
            }
        }
    }

    /**
     * Kullanılabilir modelleri al
     * @returns {Promise<Array<string>>} - Model listesi
     */
    async getModels() {
        try {
            const response = await this.client.get('/models');
            
            if (response.data && response.data.data) {
                return response.data.data.map(model => model.id);
            } else {
                // Eğer models endpoint çalışmıyorsa, varsayılan model listesi döndür
                return [
                    'gpt-4o-mini',
                    'gpt-4o',
                    'gemini',
                    'grok-3-mini-beta'
                ];
            }
        } catch (error) {
            console.error('Model listesi alınırken hata:', error.response?.data || error.message);
            
            // Hata durumunda varsayılan model listesi döndür
            return [
                    'gpt-4o-mini',
                    'gpt-4o',
                    'gemini',
                    'grok-3-mini-beta'
            ];
        }
    }

    /**
     * API bağlantısını test et
     * @returns {Promise<boolean>} - Bağlantı durumu
     */
    async testConnection() {
        try {
            const response = await this.chat('Test mesajı', 'gpt-4o-mini');
            return response && response.length > 0;
        } catch (error) {
            console.error('API bağlantı testi başarısız:', error.message);
            return false;
        }
    }

    /**
     * Detaylı sohbet (sistem mesajı ile)
     * @param {string} userMessage - Kullanıcı mesajı
     * @param {string} systemMessage - Sistem mesajı
     * @param {string} model - Kullanılacak model
     * @returns {Promise<string>} - AI yanıtı
     */
    async chatWithSystem(userMessage, systemMessage, model = 'gpt-4o-mini') {
        try {
            const response = await this.client.post('/chat/completions', {
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: systemMessage
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                max_tokens: this.settings.maxTokens,
                temperature: this.settings.temperature
            });

            if (response.data && response.data.choices && response.data.choices[0]) {
                return response.data.choices[0].message.content;
            } else {
                throw new Error('API yanıtında beklenmeyen format');
            }
        } catch (error) {
            console.error('CortexAPI Chat (System) Hatası:', error.response?.data || error.message);
            throw new Error('AI ile iletişimde hata oluştu.');
        }
    }
}

module.exports = CortexAPI;