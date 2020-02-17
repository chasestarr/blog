import React from "react";
import Link from "next/link";
import Layout from "../components/layout.js";
import blogposts from "../__posts.js";
import styles from "./index.module.css";

function Item(props) {
  return (
    <li className={styles.item}>
      <Link href={props.path}>
        <a className={styles.label}>
          <span>{props.title}</span>
          {props.date && <span>{props.date}</span>}
        </a>
      </Link>
    </li>
  );
}

export default function Index() {
  return (
    <Layout>
      <ol className={styles.list}>
        <Item path="/about" title="About" />
        {blogposts.map(post => (
          <Item path={post.path} title={post.title} date={post.date} />
        ))}
      </ol>
    </Layout>
  );
}
