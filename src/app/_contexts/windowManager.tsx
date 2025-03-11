import { createContext } from "react";
import CustomWindow from "../_apps/window";

export enum DragType {
  Window = 0,
  Top = 1,
  Right = 2,
  Bottom = 4,
  Left = 8,
}

export type MousePosition = {
  x: Number;
  y: Number;
}

export type WindowProps = {
  focused: boolean;
  maximized: boolean;
  setMaximized: (maximized: boolean) => void;
  close: () => void;
  reduce: () => void;
  setDragging: () => void;
  setDragType: (dragType: DragType) => void;
  setDragStart: (coordinates: MousePosition) => void;
}

type WindowManager = {
  windows: CustomWindow[];
  reducedWindows: CustomWindow[];
  focusedWindow: CustomWindow | null;
  closeWindow: (win: CustomWindow) => void;
  openWindow: (win: CustomWindow) => void;
  toggleFocus: (win: CustomWindow) => void;
}

export const WindowContext = createContext<WindowProps>(
  {
    focused: false,
    maximized: false,
    setMaximized: (maximized) => { },
    close: () => { },
    reduce: () => { },
    setDragging: () => { },
    setDragType: (dragType) => {},
    setDragStart: (coordinates) => {},
  }
);
export const WindowManagerContext = createContext<WindowManager>(
  {
    windows: [],
    reducedWindows: [],
    focusedWindow: null,
    closeWindow: (win) => {},
    openWindow: (win) => {},
    toggleFocus: (win) => {},
  }
);
export default 0;
