import { type Plugin } from "svelte-exmarkdown";
import rehypeHighlight from 'rehype-highlight';
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import go from "highlight.js/lib/languages/go";
import css from "highlight.js/lib/languages/css";
import php from "highlight.js/lib/languages/php";
import bash from "highlight.js/lib/languages/bash";
import java from "highlight.js/lib/languages/java";
import rust from "highlight.js/lib/languages/rust";

function svelte(hljs: any) {
  return {
    subLanguage: "xml",
    contains: [
      hljs.COMMENT("<!--", "-->", {
        relevance: 10,
      }),
      {
        begin: /^(\s*)(<script(\s*context="module")?>)/gm,
        end: /^(\s*)(<\/script>)/gm,
        subLanguage: "javascript",
        excludeBegin: true,
        excludeEnd: true,
        contains:[
          { 
            begin: /^(\s*)(\$:)/gm,
            end: /(\s*)/gm,
            className: 'keyword'
          }
        ]
      },
      {
        begin: /^(\s*)(<style.*>)/gm,
        end: /^(\s*)(<\/style>)/gm,
        subLanguage: "css",
        excludeBegin: true,
        excludeEnd: true,
      },
      {
        begin: /\{/gm,
        end: /\}/gm,
        subLanguage: "javascript",
        contains:[
          {
            begin: /[\{]/, 
            end: /[\}]/, 
            skip: true
          },
          {
            begin: /([#:\/@])(if|else|each|await|then|catch|debug|html)/gm,
            className:'keyword',
            relevance: 10,
          }
        ],
      }
    ]
  }
}

export const highlightPlugin: Plugin = {
  rehypePlugin: [rehypeHighlight, { languages: { typescript, javascript, xml, go, css, php, bash, java, rust, svelte } }],
};
