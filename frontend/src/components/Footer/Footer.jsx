import React from "react";
import Logo from "../Logo/Logo";
import Styles from "./Footer.module.css";

function Footer() {
  return (
    <div className={Styles.footer}>
      <div className={Styles.footerContent}>
        <Logo />

        <div className={Styles["footer-items"]}>
        
        </div>
      </div>
      <div className={Styles["footer-rights"]}>
        <p> Created by: <a href="https://ajazmiah.info/">Ajaz Miah</a></p>
        <p>&copy; 2024 Inkline.com . All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
