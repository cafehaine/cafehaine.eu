import React from "react";
import Image from "next/image";

import reduceIcon from "./reduce.svg"
import maximizeIcon from "./maximize.svg"
import closeIcon from "./close.svg"
import { DragType, Drag, WindowProps, WindowContext, Position } from "../_contexts/windowManager";
import styles from "./window.module.css"
import assert from "assert";

export type Rect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

export default abstract class CustomWindow {
  title: string;
  rect: Rect | null;
  abstract icon(): React.ReactNode
  abstract content(): React.ReactNode

  constructor(title: string) {
    this.title = title;
    this.rect = null;
  }

  onDragStart(window: WindowProps, event: React.MouseEvent | React.TouchEvent, dragType: DragType): void {
    if (this.rect === null) {
      const elm = event.target as HTMLElement;
      const dialog = elm.closest("dialog");
      assert(dialog)
      this.rect = { x: dialog.offsetLeft - dialog.clientWidth / 2, y: dialog.offsetTop - dialog.clientHeight / 2, width: dialog.clientWidth, height: dialog.clientHeight }
    }
    var position: Position;
    if (event.nativeEvent instanceof MouseEvent)
      position = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY }
    else
      position = { x: event.nativeEvent.touches[0].clientX, y: event.nativeEvent.touches[0].clientY }
    window.setDragging({ dragType: dragType, lastPosition: position })
  }

  onDrag(drag: Drag, current: Position): void {
    const deltaX = current.x - drag.lastPosition.x;
    const deltaY = current.y - drag.lastPosition.y;
    assert(this.rect)

    if (drag.dragType == DragType.Window) {
      this.rect.x += deltaX
      this.rect.y += deltaY
    } else {
      if (drag.dragType & DragType.Top) {
        this.rect.y += deltaY
        this.rect.height -= deltaY
      }
      if (drag.dragType & DragType.Right) {
        this.rect.width += deltaX
      }
      if (drag.dragType & DragType.Bottom) {
        this.rect.height += deltaY
      }
      if (drag.dragType & DragType.Left) {
        this.rect.x += deltaX
        this.rect.width -= deltaX
      }
    }
  }

  render(): React.ReactNode {
    return (
      <WindowContext.Consumer>
        {
          window => <dialog className={`${styles.window} ${window.maximized ? styles.maximized : ""}`} style={
            this.rect ? {
              "--left": `${this.rect.x}px`,
              "--top": `${this.rect.y}px`,
              "--width": `${this.rect.width}px`,
              "--height": `${this.rect.height}px`,
              "transform": "none",
            } as React.CSSProperties : {}
          }>
            <div className={`${styles.border} ${styles.tl}`} onMouseDown={(e) => { this.onDragStart(window, e, DragType.Top | DragType.Left) }}></div>
            <div className={`${styles.border} ${styles.t}`} onMouseDown={(e) => { this.onDragStart(window, e, DragType.Top) }}></div>
            <div className={`${styles.border} ${styles.tr}`} onMouseDown={(e) => { this.onDragStart(window, e, DragType.Top | DragType.Right) }}></div>
            <div className={`${styles.border} ${styles.l}`} onMouseDown={(e) => { this.onDragStart(window, e, DragType.Left) }}></div>
            <header onDoubleClick={() => window.setMaximized(!window.maximized)} onMouseDown={(e) => { this.onDragStart(window, e, DragType.Window) }}>
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
            <div className={`${styles.border} ${styles.r}`} onMouseDown={(e) => { this.onDragStart(window, e, DragType.Right) }}></div>
            <div className={`${styles.border} ${styles.b}`} onMouseDown={(e) => { this.onDragStart(window, e, DragType.Bottom) }}></div>
            <div className={`${styles.border} ${styles.bl}`} onMouseDown={(e) => { this.onDragStart(window, e, DragType.Bottom | DragType.Left) }}></div>
            <div className={`${styles.border} ${styles.br}`} onMouseDown={(e) => { this.onDragStart(window, e, DragType.Bottom | DragType.Right) }}></div>
          </dialog>
        }
      </WindowContext.Consumer>
    );
  }
}
