import marked from "marked";
import createDompurify from "dompurify";
import { JSDOM } from "jsdom";

const window = (new JSDOM("<!DOCTYPE html>").window as unknown) as Window;
const dompurify = createDompurify(window);

/**
 * @param {string} data
 * @returns {string} Sanitized body and converted to markdown
 */
export default function (data: string): string {
  return dompurify.sanitize(marked(data), {
    FORBID_ATTR: ["style", "onerror", "onload"],
    FORBID_TAGS: ["script", "audio", "video", "style", "iframe", "textarea", "frame", "frameset", "table", "td", "th"],
  });
}
