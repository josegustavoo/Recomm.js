import { Languages } from "multilingual-stemmer";
import { get } from "nested-property";
import {
  ar,
  da,
  nl,
  en,
  fi,
  fr,
  de,
  el,
  hu,
  ptbr,
  ro,
  ru,
  es,
  sv,
  tr,
  it,
} from "stopword";
import { SupportedLanguage } from "./types";

function isStringEmpty(str: string) {
  return !str || str.length === 0;
}

function getStemmerLanguage(language: SupportedLanguage): Languages {
  switch (language) {
    case SupportedLanguage.ARABIC:
      return Languages.Arabic;
      break;
    case SupportedLanguage.DANISH:
      return Languages.Danish;
      break;
    case SupportedLanguage.DUTCH:
      return Languages.Dutch;
      break;
    case SupportedLanguage.ENGLISH:
      return Languages.English;
      break;
    case SupportedLanguage.FINNISH:
      return Languages.Finnish;
      break;
    case SupportedLanguage.FRENCH:
      return Languages.French;
      break;
    case SupportedLanguage.GERMAN:
      return Languages.German;
      break;
    case SupportedLanguage.GREEK:
      return Languages.Greek;
      break;
    case SupportedLanguage.HUNGARIAN:
      return Languages.Hungarian;
      break;
    case SupportedLanguage.ITALIAN:
      return Languages.Italian;
      break;
    case SupportedLanguage.PORTUGUESE:
      return Languages.Portuguese;
      break;
    case SupportedLanguage.ROMANIAN:
      return Languages.Romanian;
      break;
    case SupportedLanguage.RUSSIAN:
      return Languages.Russian;
      break;
    case SupportedLanguage.SPANISH:
      return Languages.Spanish;
      break;
    case SupportedLanguage.SWEDISH:
      return Languages.Swedish;
      break;
    case SupportedLanguage.TURKISH:
      return Languages.Turkish;
      break;
    default:
      return Languages.English;
  }
}

function getStopwordsList(language: SupportedLanguage): string[] {
  switch (language) {
    case SupportedLanguage.ARABIC:
      return ar;
      break;
    case SupportedLanguage.DANISH:
      return da;
      break;
    case SupportedLanguage.DUTCH:
      return nl;
      break;
    case SupportedLanguage.ENGLISH:
      return en;
      break;
    case SupportedLanguage.FINNISH:
      return fi;
      break;
    case SupportedLanguage.FRENCH:
      return fr;
      break;
    case SupportedLanguage.GERMAN:
      return de;
      break;
    case SupportedLanguage.GREEK:
      return el;
      break;
    case SupportedLanguage.HUNGARIAN:
      return hu;
      break;
    case SupportedLanguage.ITALIAN:
      return it;
      break;
    case SupportedLanguage.PORTUGUESE:
      return ptbr;
      break;
    case SupportedLanguage.ROMANIAN:
      return ro;
      break;
    case SupportedLanguage.RUSSIAN:
      return ru;
      break;
    case SupportedLanguage.SPANISH:
      return es;
      break;
    case SupportedLanguage.SWEDISH:
      return sv;
      break;
    case SupportedLanguage.TURKISH:
      return tr;
      break;
    default:
      return en;
  }
}

function resolveArrayField(
  item: { [propName: string]: any },
  field: string
): String {
  field = field.replace(/\[(\w+)\]/g, ".$1");
  let value = get(item, field);

  return Array.isArray(value) ? value.join(", ") : value;
}

export {
  isStringEmpty,
  getStemmerLanguage,
  getStopwordsList,
  resolveArrayField,
};
