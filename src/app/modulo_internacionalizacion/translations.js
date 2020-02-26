"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// import translations
var lang_en_1 = require("./lang-en");
var lang_es_1 = require("./lang-es");
var lang_cat_1 = require("./lang-cat");
// translation token
exports.TRANSLATIONS = new core_1.OpaqueToken('translations');
// all traslations
exports.dictionary = (_a = {},
    _a[lang_en_1.LANG_EN_NAME] = lang_en_1.LANG_EN_TRANS,
    _a[lang_es_1.LANG_ES_NAME] = lang_es_1.LANG_ES_TRANS,
    _a[lang_cat_1.LANG_CAT_NAME] = lang_cat_1.LANG_CAT_TRANS,
    _a);
// providers
exports.TRANSLATION_PROVIDERS = [
    { provide: exports.TRANSLATIONS, useValue: exports.dictionary },
];
var _a;
