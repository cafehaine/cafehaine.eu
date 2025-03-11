import React from "react";
import Image from "next/image";

import closeIcon from "./close.svg"
import styles from "./gadget.module.css"

export default abstract class Gadget {
  abstract content(): React.ReactNode

  render(): React.ReactNode {
    return (
      <>
        {this.content()}
        {/* close button, drag handle, …*/}
      </>
    );
  }
}
