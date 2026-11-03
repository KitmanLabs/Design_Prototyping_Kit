import { MAX_LIST_ITEM_CHARS } from './constants';

export function getTruncatedText(
  text,
  max = MAX_LIST_ITEM_CHARS,
) {
  if (text.length <= max) {
    return { display: text, isTruncated: false };
  }
  return { display: `${text.slice(0, max)}...`, isTruncated: true };
}