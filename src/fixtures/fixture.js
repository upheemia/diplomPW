import {test as base} from '@playwright/test'; //импортируем фикстуру функции теста плейрайта, импортируем с именем base
import { Api } from '../services/api.service'

//расширяем base/extend это встроенный метод тест
export const test = base.extend({
  api: async ({ request }, use) => {
    const api = new Api(request);
    await use(api);
  },
})
