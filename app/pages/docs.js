import { render } from "react-dom"
import { useEffect, useRef } from "react"
import Head from "next/head"
import Link from "next/link"
import fs from "fs"
import unified from "unified"
import markdown from "remark-parse"
import remarkToRehype from "remark-rehype"
import html from "rehype-stringify"
import prism from "@mapbox/rehype-prism"
import slug from "rehype-slug"
import ClipboardCopy from "components/ClipboardCopy"

export default function Home({ html, toc }) {
  const docsNode = useRef(null)

  useEffect(() => {
    let codeBlocks = []

    docsNode.current.querySelectorAll("pre > code").forEach((node) => {
      const container = document.createElement("div")
      node.parentNode.appendChild(container)
      codeBlocks.push(() => node.parentNode.removeChild(container))
      render(<ClipboardCopy text={node.innerText} />, container)
    })

    return () => {
      codeBlocks.forEach((cleanup) => cleanup())
    }
  }, [html])

  return (
    <div className="container">
      <Head>
        <title>CharityBase Docs</title>
        <meta property="og:title" content="CharityBase Docs" key="title" />
        <meta
          name="Description"
          content="CharityBase GraphQL API Documentation"
        />
      </Head>

      <aside>
        <h1>Documentation</h1>
        <ul className="list-disc list-outside space-y-2">
          {toc.map(({ id, name, children }) => (
            <li key={`contents-${id}`} className="text-lg">
              <Link href={`#${id}`}>
                <a>{name}</a>
              </Link>
              {children ? (
                <ul className="list-disc list-inside space-y-1 pt-1">
                  {children.map(({ id, name }) => (
                    <li key={`contents-${id}`} className="text-base">
                      <Link href={`#${id}`}>
                        <a>{name}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </aside>

      <main>
        <div
          ref={docsNode}
          className="docs"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>

      <style jsx global>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          flex-wrap: nowrap;
        }

        .container > aside {
          position: sticky;
          top: calc(2rem + 81px);
          margin-right: 1rem;
          height: calc(100vh - 2rem - 81px - 50px);
          padding-bottom: 0;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-flex-direction: column;
          -ms-flex-direction: column;
          flex-direction: column;
          z-index: 1;
          flex-shrink: 0;
        }

        .container > main {
          min-width: 0px;
        }

        pre > code {
        }

        code {
          color: rgb(212, 0, 255);
          font-size: 0.9em;
          white-space: pre-wrap;
          transition: color 0.2s ease;
        }

        pre {
          position: relative;
        }

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        html {
          line-height: 1.15;
          -webkit-text-size-adjust: 100%;
          height: 100%;
          box-sizing: border-box;
          touch-action: manipulation;
          font-feature-settings: "case" 1, "rlig" 1, "calt" 0;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }
        body {
          position: relative;
          min-height: 100%;
          margin: 0;
          line-height: 1.65;
          font-size: 16px;
          font-weight: 400;
          min-width: 320px;
          direction: ltr;
          font-feature-settings: "kern";
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          scroll-behavior: smooth;
        }
        html,
        body {
          background-color: #fff;
          color: #111;
        }
        ::selection {
          background-color: #0070f3;
          color: #fff;
        }
        [role="grid"]:focus {
          outline: none;
        }
        svg {
          text-rendering: optimizeLegibility;
        }
        h1,
        h2,
        h3 {
          margin: 0;
        }
        a {
          color: #0074de;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        a:hover {
          color: #68b5fb;
        }
        code {
          font-size: 0.9em;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace,
            serif;
        }
        code:before,
        code:after {
          content: "\`";
        }
        pre code:before,
        pre code:after {
          content: none;
        }
        .demo-footer .note code {
          background: rgba(0, 0, 0, 0.2);
          padding: 0.2rem;
          margin: 0 0.1rem;
          border-radius: 2px;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .f-reset {
          font-size: 1rem;
        }
        .f0 {
          font-size: 1.802032470703125em;
        }
        .f1 {
          font-size: 1.601806640625em;
        }
        .f2 {
          font-size: 1.423828125em;
        }
        .f3 {
          font-size: 1.265625em;
        }
        .f4 {
          font-size: 1.125em;
        }
        .f5 {
          font-size: 0.8888888888888888em;
        }
        .f6 {
          font-size: 0.7901234567901234em;
        }
        .fw1 {
          font-weight: 100;
        }
        .fw2 {
          font-weight: 200;
        }
        .fw3 {
          font-weight: 300;
        }
        .fw4 {
          font-weight: 400;
        }
        .fw5 {
          font-weight: 500;
        }
        .fw6 {
          font-weight: 600;
        }
        .fw7 {
          font-weight: 700;
        }
        .fw8 {
          font-weight: 800;
        }
        .fw9 {
          font-weight: 900;
        }
        .subtitle {
          color: #696969;
        }
        .mute {
          color: #696969;
        }
        .tc {
          text-align: center;
        }
        .row {
          display: flex;
          align-items: center;
          margin: 0 -1.5rem;
        }
        .column {
          flex: 1;
          padding: 0 1.5rem;
        }
        .display-none {
          display: none;
        }
        .display-mobile {
          display: none;
        }
        .display-tablet {
          display: none;
        }
        @media screen and (max-width: 640px) {
          .display-mobile {
            display: unset;
          }
          .hide-mobile {
            display: none;
          }
        }
        @media screen and (max-width: 960px) {
          .display-tablet {
            display: unset;
          }
          .hide-tablet {
            display: none;
          }
        }
        a[role="button"] {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -khtml-user-select: none;
          user-select: none;
        }
        .no-tap-highlight,
        a {
          -webkit-touch-callout: none;
          -ms-touch-action: pan-y;
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
        }
        .no-tap-callout {
          -webkit-touch-callout: none;
        }
        .no-drag {
          user-drag: none;
          user-select: none;
          -moz-user-select: none;
          -webkit-user-drag: none;
          -webkit-user-select: none;
          -ms-user-select: none;
        }
        .visually-hidden {
          clip: rect(0 0 0 0);
          height: 1px;
          width: 1px;
          margin: -1px;
          padding: 0;
          border: 0;
          overflow: hidden;
          position: absolute;
        }

        code[class*="language-"],
        pre[class*="language-"] {
          color: #f8f8f2;
          text-shadow: 0 1px rgba(0, 0, 0, 0.3);
          direction: ltr;
          text-align: left;
          white-space: pre;
          word-spacing: normal;
          word-break: normal;
          line-height: 1.5;
          tab-size: 4;
          hyphens: none;
        }

        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #999;
        }

        .token.punctuation {
          color: #c5c8c6;
        }

        .namespace {
          opacity: 0.7;
        }

        .token.property,
        .token.keyword,
        .token.tag {
          color: #96cbfe;
        }

        .token.class-name {
          color: #ffffb6;
        }

        .token.boolean,
        .token.constant {
          color: #99cc99;
        }

        .token.symbol,
        .token.deleted {
          color: #f92672;
        }

        .token.number {
          color: #ff73fd;
        }

        .token.selector,
        .token.attr-name,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
          color: #a8ff60;
        }

        .token.variable {
          color: #c6c5fe;
        }

        .token.operator {
          color: #ededed;
        }

        .token.entity {
          color: #ffffb6;
          cursor: help;
        }

        .token.url {
          color: #96cbfe;
        }

        .language-css .token.string,
        .style .token.string {
          color: #87c38a;
        }

        .token.atrule,
        .token.attr-value {
          color: #f9ee98;
        }

        .token.function {
          color: #dad085;
        }

        .token.regex {
          color: #e9c062;
        }

        .token.important {
          color: #fd971f;
        }

        .token.important,
        .token.bold {
          font-weight: bold;
        }

        .token.italic {
          font-style: italic;
        }

        svg {
          shape-rendering: crispEdges;
        }

        svg path,
        svg circle {
          shape-rendering: geometricprecision;
        }
        [data-reach-skip-link] {
          border: 0;
          clip: rect(0 0 0 0);
          height: 1px;
          width: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          position: absolute;
        }
        [data-reach-skip-link]:focus {
          padding: 1rem;
          position: fixed;
          top: 10px;
          left: 10px;
          background: white;
          z-index: 1;
          width: auto;
          height: auto;
          clip: auto;
        }

        kbd {
          box-sizing: border-box;
          color: #666;
          background: #fafafa;
          border: 1px solid #eaeaea;
          display: inline-block;
          font-family: -apple-system, system-ui, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
          line-height: 2em;
          text-align: center;
          padding: 0 4px;
          font-size: 0.9em;
          border-radius: 5px;
        }

        .docs h1 {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 0.75rem;
        }
        .docs h2 {
          font-size: 2rem;
          line-height: 1.5;
        }
        .docs h3 {
          font-size: 1.5rem;
          line-height: 1.6;
        }
        .docs h4 {
          font-size: 1.2rem;
        }
        .docs h5 {
          font-size: 1rem;
        }
        .docs .heading {
          margin: 3.5rem 0 2rem 0;
          font-weight: 600;
        }
        .docs .heading > span[id] {
          display: block;
          position: absolute;
          visibility: hidden;
          margin-top: -128px;
          padding-top: 128px;
        }
        .docs .heading > a {
          color: inherit;
        }
        .docs .heading > a:hover {
          color: inherit;
          border-bottom: 1px dotted;
        }
        .docs .heading > a:hover ~ .permalink {
          visibility: visible;
        }
        .docs .heading > .permalink {
          visibility: hidden;
          display: none;
        }

        @media (min-width: 992px) {
          .docs .heading > a {
            margin-right: 0.5rem;
          }
          .docs .heading > .permalink {
            display: inline-block;
          }
        }

        .docs p {
          margin: 1.25rem 0;
        }

        /* Inline code */
        .docs code.inline {
          color: rgb(212, 0, 255);
          font-size: 0.9em;
          white-space: pre-wrap;
          transition: color 0.2s ease;
        }

        /* Code */
        .docs pre {
          overflow: hidden;
          background: #1d1f21;
          color: #f8f8f2;
          white-space: pre;
          margin: 1.5rem 0;
          border-radius: 3px;
        }
        .docs pre > code {
          padding: 1.5rem;
          display: block;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          font-size: 14px;
          line-height: 20px;
        }

        /* Links */
        .docs a.absolute > code.inline {
          color: #0074de;
        }
        .docs a.absolute:hover > code.inline {
          color: #68b5fb;
        }
        .docs a.relative {
          color: inherit;
          font-size: inherit;
          border-bottom: 1px dotted;
        }
        .docs a.relative:hover {
          color: gray;
          text-decoration: none;
        }
        .docs a.relative:hover > code.inline {
          color: gray;
        }

        /* details */
        .docs details {
          margin: 1.5rem 0;
          padding: 0.5rem 1rem;
          background: #fafafa;
          border: 1px solid #eaeaea;
          border-radius: 3px;
        }
        .docs details[open] {
          overflow: hidden;
        }
        .docs details > summary {
          font-weight: 500;
          outline: none;
          cursor: pointer;
        }

        /* Quotes */
        .docs blockquote {
          color: #666666;
          background: #fafafa;
          border: 1px solid #eaeaea;
          border-radius: 3px;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
        }
        .docs blockquote p {
          margin: 0;
        }

        /* Card */
        .docs .card {
          margin: 1.5rem 0;
          border-radius: 5px;
          border: 1px solid #eaeaea;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          transition: box-shadow 0.2s ease;
        }
        .docs .card:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        .docs .card > a {
          display: flex;
          flex-direction: column;
          width: 100%;
          color: #666666;
          padding: 1.5rem;
          border: none;
          transition: color 0.2s ease;
        }
        .docs .card > a:hover {
          color: #111;
        }
        .docs .card > a > h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #111;
          margin-top: 0;
          margin-bottom: 0.25rem;
        }
        .docs .card > a > small {
          font-size: 0.875rem;
          color: inherit;
        }

        /* Misc */
        .docs hr {
          border: 0;
          border-top: 1px solid #eaeaea;
          margin: 1.25rem 0;
        }
        .docs ul,
        .docs ol {
          padding-left: 1.5rem;
          margin: 1.25rem 0;
        }
        .docs ul {
          list-style-type: none;
        }
        .docs li {
          margin-bottom: 0.625rem;
        }
        .docs ul li:before {
          content: "-";
          color: #999999;
          position: absolute;
          margin-left: -1rem;
        }
      `}</style>
    </div>
  )
}

export async function getStaticProps() {
  const rawMarkdown = await fs.promises.readFile("docs/getting-started.md", {
    encoding: "utf8",
  })

  let toc = []
  const generateTableOfContents = (opts) => {
    return (tree, file) => {
      const headers = tree.children.filter((x) =>
        ["h2", "h3"].includes(x.tagName)
      )
      toc = headers.reduce((agg, h) => {
        if (h.tagName === "h2")
          return [
            ...agg,
            {
              id: h.properties.id,
              name: h.children[0].value,
              children: [],
            },
          ]
        return [
          ...agg.slice(0, agg.length - 1),
          {
            ...agg[agg.length - 1],
            children: [
              ...agg[agg.length - 1].children,
              {
                id: h.properties.id,
                name: h.children[0].value,
              },
            ],
          },
        ]
      }, toc)
    }
  }

  const { contents } = await unified()
    .use(markdown)
    .use(remarkToRehype)
    .use(slug)
    .use(prism)
    .use(generateTableOfContents)
    .use(html)
    .process(rawMarkdown)

  return {
    props: {
      html: contents,
      toc,
    },
  }
}
