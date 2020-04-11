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
        <div
          style={{ width: props.contentWidth || "720px" }}
          className={styles.content}
        >
          <MDXProvider components={elements}>{props.children}</MDXProvider>
        </div>
      </main>
    </div>
  );
}
