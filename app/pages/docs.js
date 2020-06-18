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
    <div className="max-w-5xl mx-auto flex">
      <Head>
        <title>CharityBase Docs</title>
        <meta property="og:title" content="CharityBase Docs" key="title" />
        <meta
          name="Description"
          content="CharityBase GraphQL API Documentation"
        />
      </Head>

      <aside className="flex-shrink-0 py-24 pr-8 xl:pr-16 sticky top-0 h-screen overflow-auto">
        <h1 className="text-2xl font-semibold my-2">Documentation</h1>
        <ul className="space-y-3">
          {toc.map(({ id, name, children }) => (
            <li key={`contents-${id}`} className="text-lg">
              <a className="text-gray-700 hover:text-black" href={`#${id}`}>
                {name}
              </a>
              {children ? (
                <ul className="space-y-2 pl-3 pt-2">
                  {children.map(({ id, name }) => (
                    <li key={`contents-${id}`} className="text-base">
                      <a
                        className="text-gray-700 hover:text-black"
                        href={`#${id}`}
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </aside>

      <main className="min-w-0 bg-white">
        <div
          ref={docsNode}
          className="docs py-24"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>

      <style jsx>{``}</style>

      <style jsx global>{`
        .docs > [id]::before {
          content: "";
          display: block;
          height: 100px;
          margin-top: -100px;
          visibility: hidden;
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

        .docs p {
          margin: 1.25rem 0;
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
