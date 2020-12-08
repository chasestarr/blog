import React from "react";
import Link from "next/link";
import { MDXProvider } from "@mdx-js/react";
import elements from "./elements.js";
import styles from "./layout.module.css";

export default function Layout(props) {
  return (
    <div>
      <header className={styles.header}>
        <Link href="/">
          <a className={styles.avatar}>CS</a>
        </Link>
      </header>
      <main className={styles.center}>
        <div className={styles.content}>
          <MDXProvider components={elements}>{props.children}</MDXProvider>
        </div>
      </main>
      <footer className={styles.center}>
        <ul className={styles.socials}>
          <li>
            <a href="https://github.com/chasestarr">github.com/chasestarr</a>
          </li>
          <li>
            <a href="https://twitter.com/captivechains">
              twitter.com/captivechains
            </a>
          </li>
          <li>
            <a href="https://instagram.com/captivechains">
              instagram.com/captivechains
            </a>
          </li>
          <li>
            <a href="https://instagram.com/ssecondbookss">
              instagram.com/ssecondbookss
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
