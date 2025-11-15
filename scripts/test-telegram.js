const https = require('https');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const message = '✅ Тестовое сообщение от бота!\nБот успешно настроен и готов к работе!';

const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
const data = JSON.stringify({
  chat_id: chatId,
  text: message,
  parse_mode: 'Markdown'
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = https.request(url, options, (res) => {
  let response = '';
  res.on('data', (chunk) => response += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Тестовое сообщение успешно отправлено!');
    } else {
      console.log('❌ Ошибка отправки:', response);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Ошибка:', error.message);
});

req.write(data);
req.end();