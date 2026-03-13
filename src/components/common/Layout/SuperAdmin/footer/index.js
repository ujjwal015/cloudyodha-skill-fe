import React from "react";
import styles from "./Footer.module.css";
import moment from "moment";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <p className={styles.copy}>
          Copyright © 2021 — {moment().format("YYYY")} Testa, All Rights
          Reserved | Powered by Radiant Infonet Pvt. Ltd.
        </p>
      </div>
    </footer>
  );
}
