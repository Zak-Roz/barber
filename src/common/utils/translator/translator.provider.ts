import { DynamicModule } from '@nestjs/common';
import { TranslatorModule } from 'nestjs-translator';

export const translatorInstance: DynamicModule = TranslatorModule.forRoot({
  global: true,
  defaultLang: 'en',
  translationSource: '/locales',
});
