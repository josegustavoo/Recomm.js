import { Stemmer } from "multilingual-stemmer";
import { removeStopwords } from "stopword";
import { compareTwoStrings } from "string-similarity";
import { NonEmptyArray, Options, PostInfo, SupportedLanguage } from "./types";
import {
  getStemmerLanguage,
  getStopwordsList,
  isStringEmpty,
  resolveArrayField,
} from "./utils";

let stemmer: Stemmer;
let stopwordsList: string[];

function getSimilarPosts(
  targetPost: PostInfo,
  { items, fields, limit, language, orderBy, returnFields }: Options
): any[] {
  if (fields.every(isStringEmpty)) {
    throw new Error("Some field is empty");
  }
  limit = !limit ? 10 : limit;
  orderBy = !orderBy ? "DESC" : orderBy;
  returnFields = !returnFields ? [] : returnFields;

  init(language);

  const targetText = prepareTarget(targetPost, fields);
  let posts = similarPosts(targetText, items, fields);

  if (orderBy == "DESC") {
    posts = posts.sort((a: any, b: any) => b.score - a.score);
  } else {
    posts = posts.sort((a: any, b: any) => a.score - b.score);
  }

  posts = posts.slice(0, limit);
  posts = posts.map((item: any) => {
    let arr: PostInfo = {};

    if (returnFields && returnFields?.length > 0) {
      returnFields?.forEach((field: string) => {
        arr[field] = item[field];
      });
    } else {
      arr = item;
    }

    return arr;
  });

  return posts;
}

function init(language: SupportedLanguage) {
  stemmer = new Stemmer(getStemmerLanguage(language));
  stopwordsList = getStopwordsList(language);
}

function prepareTarget(
  target: PostInfo,
  fields: NonEmptyArray<string>
): string {
  let targetText: string[] = [];

  fields.forEach((field: string) => {
    const value = resolveArrayField(target, field);
    if (!value) {
      throw new Error("Field not found in target post.");
    }

    let newValue: string = removeStopwords(
      value.split(" "),
      stopwordsList
    ).join(" ");
    newValue = stemmer.stem(newValue);

    targetText.push(newValue);
  });

  return targetText.join(" ");
}

function similarPosts(
  target: string,
  items: PostInfo[],
  fields: NonEmptyArray<string>
): PostInfo[] {
  items.forEach((item: any) => {
    let itemText: string[] = [];

    fields.forEach((field: string) => {
      const value = resolveArrayField(item, field);

      if (!value) {
        throw new Error("Field not found in any post.");
      }

      let newValue: string = removeStopwords(
        value.split(" "),
        stopwordsList
      ).join(" ");
      newValue = stemmer.stem(newValue);

      itemText.push(newValue);
    });

    const text = itemText.join(" ");

    item.score = compareTwoStrings(target, text);
  });

  return items;
}

export { getSimilarPosts };
