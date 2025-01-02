import { HASH_STRING } from "../../core/constants";

export const randomHash = (length?: number) => {
  var result = '';
  let defaullength = 30;

  for (let i = length ?? defaullength; i > 0; --i) result += HASH_STRING[Math.floor(Math.random() * HASH_STRING.length)];
  return result;
}

export const convertToMB = (space: number): number => Math.round(space / 1024 / 1024);