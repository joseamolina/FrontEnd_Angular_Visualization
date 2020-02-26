import { OpaqueToken } from '@angular/core';

// import translations
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_ES_NAME, LANG_ES_TRANS } from './lang-es';
import { LANG_CAT_NAME, LANG_CAT_TRANS } from './lang-cat';

// translation token
export const TRANSLATIONS = new OpaqueToken('translations');

// all traslations
export const dictionary = {
  [LANG_EN_NAME]: LANG_EN_TRANS,
  [LANG_ES_NAME]: LANG_ES_TRANS,
  [LANG_CAT_NAME]: LANG_CAT_TRANS,
};

// providers
export const TRANSLATION_PROVIDERS = [
  { provide: TRANSLATIONS, useValue: dictionary },
];
