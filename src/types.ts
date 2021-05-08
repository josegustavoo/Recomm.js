type NonEmptyArray<T> = [T, ...T[]];

enum SupportedLanguage {
  ARABIC = "ar",
  DANISH = "da",
  DUTCH = "nl",
  ENGLISH = "en",
  FINNISH = "fi",
  FRENCH = "fr",
  GERMAN = "de",
  GREEK = "el",
  HUNGARIAN = "hu",
  ITALIAN = "it",
  PORTUGUESE = "ptbr",
  ROMANIAN = "ro",
  RUSSIAN = "ru",
  SPANISH = "es",
  SWEDISH = "sv",
  TURKISH = "tr",
}

interface PostInfo {
  [propName: string]: any;
}

interface Options {
  items: PostInfo[];
  fields: NonEmptyArray<string>;
  language: SupportedLanguage;
  limit?: number;
  orderBy?: "DESC" | "ASC";
  returnFields?: string[];
}

export { SupportedLanguage, PostInfo, Options, NonEmptyArray };
