const fs = require('fs');

try {
  const results = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
  
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let duration = 0;

  results.suites.forEach(suite => {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {
        duration += test.results.reduce((sum, result) => sum + (result.duration || 0), 0);
        if (test.status === 'expected') passed++;
        else if (test.status === 'skipped') skipped++;
        else failed++;
      });
    });
  });

  const total = passed + failed + skipped;
  
  console.log('📊 Результаты из JSON:');
  console.log(`✅ Пройдено: ${passed}`);
  console.log(`❌ Упало: ${failed}`);
  console.log(`⏩ Пропущено: ${skipped}`);
  console.log(`📈 Всего: ${total}`);
  console.log(`⏱ Длительность: ${Math.round(duration)}ms`);

  // Сохраняем в файл для использования в Telegram скрипте
  const summary = {
    statistic: { passed, failed, skipped, broken: 0, total },
    time: { duration }
  };
  
  fs.writeFileSync('allure-report/widgets/summary.json', JSON.stringify(summary));
  console.log('✅ summary.json создан');
  
} catch (error) {
  console.log('❌ Ошибка парсинга JSON результатов:', error.message);
}