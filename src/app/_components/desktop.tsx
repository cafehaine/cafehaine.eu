import { useEffect, useState } from "react";
import styles from "./desktop.module.css"
import Clock from "./gadgets/clock"; 
import Gadget from "./gadgets/gadget";
import PostIt from "./gadgets/postIt";
import RSS from "./gadgets/rss"; 

export default function Desktop() {
  const gadgets: Gadget[] = [new Clock(), new RSS(), new PostIt()]
  return (
    <div className={styles.sidebar}>
      {
        gadgets.map((gadget, index) => <div key={index}>{gadget.render()}</div>)
      }
    </div>
  );
}
