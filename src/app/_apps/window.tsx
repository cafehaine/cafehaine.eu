import React from "react";
import Image from "next/image";

import reduceIcon from "./reduce.svg"
import maximizeIcon from "./maximize.svg"
import closeIcon from "./close.svg"
import { DragType, WindowProps, WindowContext } from "../_contexts/windowManager";
import styles from "./window.module.css"

export default abstract class CustomWindow {
  title: string;
  abstract icon(): React.ReactNode
  abstract content(): React.ReactNode

  constructor(title: string) {
    this.title = title;
  }

  onDragStart(window: WindowProps, event: React.MouseEvent | React.TouchEvent, dragType: DragType) {
    window.setDragging();
    window.setDragType(dragType);
    console.log(event)
    if (event.nativeEvent instanceof MouseEvent)
      window.setDragStart({x: event.nativeEvent.clientX, y: event.nativeEvent.clientY})
    else
      window.setDragStart({x: event.nativeEvent.touches[0].clientX, y: event.nativeEvent.touches[0].clientY})
  }

  render(): React.ReactNode {
    return (
      <WindowContext.Consumer>
        {
          window => <div className={`${styles.window} ${window.maximized ? styles.maximized : ""}`}>
            <div className={`${styles.border} ${styles.tl}`} onMouseDown={(e) => {this.onDragStart(window, e, DragType.Top | DragType.Left)}}></div>
            <div className={`${styles.border} ${styles.t}`} onMouseDown={(e) => {this.onDragStart(window, e, DragType.Top)}}></div>
            <div className={`${styles.border} ${styles.tr}`} onMouseDown={(e) => {this.onDragStart(window, e, DragType.Top | DragType.Right)}}></div>
            <div className={`${styles.border} ${styles.l}`} onMouseDown={(e) => {this.onDragStart(window, e, DragType.Left)}}></div>
            <header onDoubleClick={() => window.setMaximized(!window.maximized)} onMouseDown={(e) => {this.onDragStart(window, e, DragType.Window)}}>
              <div onDoubleClick={window.close}>{this.icon()}</div>
              <h1>{this.title}</h1>
              <aside>
                <button className={styles.reduce} aria-label="reduce" onClick={window.reduce}><Image src={reduceIcon} alt="Reduce window icon" /></button>
                <button className={styles.toggle} aria-label="maximize/minimize" onClick={() => window.setMaximized(!window.maximized)}><Image src={maximizeIcon} alt="Toggle maximize icon" /></button>
                <button className={styles.close} aria-label="close" onClick={window.close}><Image src={closeIcon} alt="Close window icon" /></button>
              </aside>
            </header>
            <main>
              {this.content()}
            </main>
            <div className={`${styles.border} ${styles.r}`} onMouseDown={(e) => {this.onDragStart(window, e, DragType.Right)}}></div>
            <div className={`${styles.border} ${styles.b}`} onMouseDown={(e) => {this.onDragStart(window, e, DragType.Bottom)}}></div>
            <div className={`${styles.border} ${styles.bl}`} onMouseDown={(e) => {this.onDragStart(window, e, DragType.Bottom | DragType.Left)}}></div>
            <div className={`${styles.border} ${styles.br}`} onMouseDown={(e) => {this.onDragStart(window, e, DragType.Bottom | DragType.Right)}}></div>
          </div>
        }
      </WindowContext.Consumer>
    );
  }
}
