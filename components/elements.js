import React from "react";
import Link from "next/link";
import styles from "./elements.module.css";

function Anchor(props) {
  const parts = props.href.split("#");
  if ((parts[0] === "" && parts[1] !== "") || !props.href.includes("http")) {
    return (
      <Link href={props.href}>
        <a className={styles.anchor} href={props.href}>
          {props.children}
        </a>
      </Link>
    );
  }

  return (
    <a className={styles.anchor} href={props.href} target="_blank">
      {props.children}
    </a>
  );
}

function Blockquote(props) {
  return (
    <blockquote className={styles.blockquote}>{props.children}</blockquote>
  );
}

function H1(props) {
  return <h1 className={styles.heading}>{props.children}</h1>;
}

export function H2(props) {
  return <h2 className={styles.heading}>{props.children}</h2>;
}

function Image(props) {
  if (props.ignore) {
    const { ignore, ...restProps } = props;
    return <img {...restProps} />;
  }
  return (
    <img
      style={{
        maxHeight: props.headline ? "360px" : null,
        objectFit: props.headline ? "none" : null
      }}
      className={styles.img}
      src={props.src}
      alt={props.alt}
    />
  );
}

function Paragraph(props) {
  return <p className={styles.p}>{props.children}</p>;
}

function Pre(props) {
  return <pre className={styles.pre}>{props.children}</pre>;
}

function Edge(props) {
  return (
    <Link href={`/edges/${props.identifier}`}>
      <a id={props.identifier} className={styles.edge}>
        {props.label}
      </a>
    </Link>
  );
}

export default {
  a: Anchor,
  blockquote: Blockquote,
  h1: H1,
  h2: H2,
  img: Image,
  p: Paragraph,
  pre: Pre,
  Edge
};
