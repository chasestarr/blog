import * as React from "react";
import Link from "next/link";
import Layout from "../../components/layout.js";
import __edges from "../../__edges.js";
import __pages from "../../__pages.js";
import styles from "../index.module.css";

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

function Edges(props) {
  return (
    <Layout>
      {props.edges.map(edge => (
        <Item
          key={edge.path}
          path={edge.path}
          title={edge.post.title}
          date={edge.post.date}
        />
      ))}
    </Layout>
  );
}

Edges.getInitialProps = function({ query }) {
  return {
    edges: __edges[query.identifier].paths.map(path => {
      const post = __pages.find(p => p.path === path);
      return { post, path };
    }),
    identifier: query.identifier,
    label: __edges[query.identifier].label
  };
};

export default Edges;
