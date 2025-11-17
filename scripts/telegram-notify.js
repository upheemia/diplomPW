// const https = require('https');
// const fs = require('fs');
// const path = require('path');
import https from 'https';
import fs from 'fs';
import path from 'path';

class TelegramNotifier {
    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
    }

    // Поиск Allure отчета в разных возможных местах
    findAllureSummary() {
        const possiblePaths = [
            'allure-report/widgets/summary.json',
            'allure-results/widgets/summary.json', 
            'target/allure-results/widgets/smary.json',
            'build/allure-results/widgets/summary.json',
            'allure-results/summary.json'
        ];

        for (const summaryPath of possiblePaths) {
            const fullPath = path.join(process.cwd(), summaryPath);
            console.log(`🔍 Проверяем путь: ${fullPath}`);
            if (fs.existsSync(fullPath)) {
                console.log(`✅ Найден отчет: ${summaryPath}`);
                return fullPath;
            }
        }
        
        console.log('❌ Allure отчет не найден ни в одном из возможных мест');
        return null;
    }

    // Чтение результатов из Allure отчета
    parseAllureResults() {
        try {
            const summaryPath = this.findAllureSummary();
            
            if (summaryPath) {
                const summaryContent = fs.readFileSync(summaryPath, 'utf8');
                console.log('📄 Содержимое summary.json:', summaryContent);
                
                const summary = JSON.parse(summaryContent);
                return {
                    passed: summary.statistic?.passed || 0,
                    failed: summary.statistic?.failed || 0,
                    skipped: summary.statistic?.skipped || 0,
                    total: summary.statistic?.total || 0,
                    duration: summary.time?.duration || 0
                };
            }
        } catch (error) {
            console.log('❌ Ошибка чтения Allure отчета:', error.message);
        }

        // Если отчет не найден, попробуем получить данные из других источников
        return this.getFallbackResults();
    }

    // Резервный метод если Allure недоступен
    getFallbackResults() {
        console.log('🔄 Используем резервный метод получения результатов');
        
        // Попробуем прочитать из результатов Playwright
        try {
            // Ищем результаты тестов в других форматах
            const playwrightReport = path.join(process.cwd(), 'playwright-report');
            if (fs.existsSync(playwrightReport)) {
                console.log('📁 Найден playwright-report');
            }
        } catch (error) {
            console.log('❌ Резервный метод также не сработал');
        }

        return {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0,
            duration: 0
        };
    }

    // Форматирование времени
    formatDuration(ms) {
        if (!ms) return '0s';
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

        // Добавим информацию о проблеме с отчетом если все нули
        const reportIssue = testResults.total === 0 ? 
            '\n⚠️ *Примечание:* Allure отчет не сгенерирован или не найден' : '';

        return `
${statusIcon} *${statusText}* | Автотесты

📊 *Статистика:*
✅ Пройдено: ${testResults.passed}
❌ Упало: ${testResults.failed}
⏩ Пропущено: ${testResults.skipped}
📈 Успешность: ${successRate}%

⏱ *Длительность:* ${this.formatDuration(testResults.duration)}
${reportIssue}
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
            console.log('🚀 Запуск отправки уведомления...');
            
            if (!this.botToken || !this.chatId) {
                throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
            }

            console.log('📡 Получение результатов тестов...');
            const testResults = this.parseAllureResults();
            
            console.log('📊 Результаты:', JSON.stringify(testResults, null, 2));
            
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