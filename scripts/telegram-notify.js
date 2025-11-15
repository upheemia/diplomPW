const https = require('https');
const fs = require('fs');
const path = require('path');

class TelegramNotifier {
    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
    }

    // Чтение результатов из Allure отчета
    parseAllureResults() {
        try {
            const summaryPath = path.join(process.cwd(), 'allure-report', 'widgets', 'summary.json');
            
            if (fs.existsSync(summaryPath)) {
                const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
                return {
                    passed: summary.statistic.passed,
                    failed: summary.statistic.failed,
                    broken: summary.statistic.broken,
                    skipped: summary.statistic.skipped,
                    total: summary.statistic.total,
                    duration: summary.time.duration
                };
            }
        } catch (error) {
            console.log('Allure report not found, using default values');
        }

        // Значения по умолчанию если отчет не найден
        return {
            passed: 0,
            failed: 0,
            broken: 0,
            skipped: 0,
            total: 0,
            duration: 0
        };
    }

    // Форматирование времени
    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }

    // Создание сообщения
    createMessage(testResults) {
        const successRate = testResults.total > 0 
            ? ((testResults.passed / testResults.total) * 100).toFixed(1)
            : 0;

        const statusIcon = testResults.failed === 0 ? '✅' : '❌';
        const statusText = testResults.failed === 0 ? 'УСПЕХ' : 'НЕУДАЧА';

        return `
${statusIcon} *${statusText}* | Автотесты

📊 *Статистика:*
✅ Пройдено: ${testResults.passed}
❌ Упало: ${testResults.failed}
⚡ Сломано: ${testResults.broken}
⏩ Пропущено: ${testResults.skipped}
📈 Успешность: ${successRate}%

⏱ *Длительность:* ${this.formatDuration(testResults.duration)}

🔗 *Детали:*
Репозиторий: ${process.env.GITHUB_REPOSITORY}
Ветка: ${process.env.GITHUB_REF_NAME}
Запуск: #${process.env.GITHUB_RUN_NUMBER}

${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}
        `.trim();
    }

    // Отправка сообщения в Telegram
    async sendMessage(message) {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        const data = JSON.stringify({
            chat_id: this.chatId,
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: true
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(url, options, (res) => {
                let response = '';
                res.on('data', (chunk) => response += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(response));
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${response}`));
                    }
                });
            });

            req.on('error', reject);
            req.write(data);
            req.end();
        });
    }

    // Основная функция
    async notify() {
        try {
            if (!this.botToken || !this.chatId) {
                throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
            }

            console.log('📡 Получение результатов тестов...');
            const testResults = this.parseAllureResults();
            
            console.log('✍️  Формирование сообщения...');
            const message = this.createMessage(testResults);
            
            console.log('📤 Отправка в Telegram...');
            const result = await this.sendMessage(message);
            
            console.log('✅ Уведомление успешно отправлено!');
            return result;
        } catch (error) {
            console.error('❌ Ошибка отправки уведомления:', error.message);
            process.exit(1);
        }
    }
}

// Запуск если файл вызван напрямую
if (require.main === module) {
    const notifier = new TelegramNotifier();
    notifier.notify();
}

module.exports = TelegramNotifier;