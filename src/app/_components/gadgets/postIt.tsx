import React from "react"
import Gadget from "./gadget"
import styles from "./postIt.module.css"

export default class PostIt extends Gadget {
  content(): React.ReactNode {
    return (
      <section className={styles.postIt}>
        <p contentEditable={true} suppressContentEditableWarning={true}>Frutiger aero 4 lyf</p>
      </section>
    );
  }
}
