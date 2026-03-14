import React from "react";
import styles from "./Footer.module.css";
import moment from "moment";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <p className={styles.copy}>
          Copyright © 2026 — {moment().format("YYYY")} SETU 100, All Rights
          Reserved | Powered by SETU 100.
        </p>
      </div>
    </footer>
  );
}
