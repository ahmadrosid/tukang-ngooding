import { type Plugin } from "svelte-exmarkdown";
import rehypeHighlight from 'rehype-highlight';
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import go from "highlight.js/lib/languages/go";
import css from "highlight.js/lib/languages/css";
import php from "highlight.js/lib/languages/php";
import bash from "highlight.js/lib/languages/bash";

export const highlightPlugin: Plugin = {
  rehypePlugin: [rehypeHighlight, { languages: { typescript, javascript, xml, go, css, php, bash } }],
};
