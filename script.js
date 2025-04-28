"use strict";

const startMenu = document.querySelector("#startMenu");
const taskbarWindows = document.querySelector("#windowList");
const windowTemplate = document.querySelector("#windowTemplate")

const windows = [];

let availableWindowId = 1;

var draggedWindow = null;
var dragType = null;
var dragStartX = null;
var dragStartY = null;
var dragStartRect = null;
// At first there's only one active window in the html

// TODO pointer events

document.body.onclick = (evt) => {
  if (evt.target != document.body)
    return;
  setActiveWindow(null);
  if (startMenu.open) {
    startMenu.close()
  }
}

document.body.onmouseup = () => { draggedWindow = null };
document.body.ontouchend = () => { draggedWindow = null };
document.body.ontouchcancel = () => { draggedWindow = null };

function onMove(clientX, clientY) {
  // TODO aero snap to desktop edges?
  if (draggedWindow.classList.contains("maximized")) {
    draggedWindow.classList.remove("maximized");
  }
  if (dragType == "window") {
    draggedWindow.style.setProperty("--left", `${dragStartRect.x - dragStartX + clientX}px`)
    draggedWindow.style.setProperty("--top", `${dragStartRect.y - dragStartY + clientY}px`)
  } else {
    if (dragType.includes("l")) {
      const left = dragStartRect.x - dragStartX + clientX;
      draggedWindow.style.setProperty("--left", `${left}px`);
      draggedWindow.style.setProperty("--width", `${dragStartRect.right - left}px`);
    }
    if (dragType.includes("r")) {
      draggedWindow.style.setProperty("--width", `${dragStartRect.width - dragStartX + clientX}px`);
    }
    if (dragType.includes("t")) {
      const top = dragStartRect.y - dragStartY + clientY;
      draggedWindow.style.setProperty("--top", `${top}px`);
      draggedWindow.style.setProperty("--height", `${dragStartRect.bottom - top}px`);
    }
    if (dragType.includes("b")) {
      draggedWindow.style.setProperty("--height", `${dragStartRect.height - dragStartY + clientY}px`);
    }
  }
}

document.body.onmousemove = (evt) => {
  if (!draggedWindow)
    return;

  window.getSelection().removeAllRanges();
  onMove(evt.clientX, evt.clientY)
  return false;
}

document.body.ontouchmove = (evt) => {
  if (!draggedWindow)
    return;

  onMove(evt.touches[0].clientX, evt.touches[0].clientY);
  return false;
}

function smartifyWindow(win) {
  windows.push(win);
  const header = win.querySelector("header");
  const icon = win.querySelector("header img");
  const toggleButton = win.querySelector(".toggle");
  const closeButton = win.querySelector(".close");

  win.onclick = (evt) => {
    startMenu.close()
    setActiveWindow(win);
  }

  if (header) {
    header.onmousedown = (evt) => { draggedWindow = win; dragType = "window"; dragStartX = evt.clientX; dragStartY = evt.clientY; dragStartRect = win.getBoundingClientRect(); };
    header.ontouchstart = (evt) => { draggedWindow = win; dragType = "window"; dragStartX = evt.touches[0].clientX; dragStartY = evt.touches[0].clientY; dragStartRect = win.getBoundingClientRect(); };
  }

  for (const borderName of ["tl", "t", "tr", "r", "br", "b", "bl", "l"]) {
    const border = win.querySelector(`.border.${borderName}`);
    if (border) {
      border.onmousedown = (evt) => { draggedWindow = win; dragType = borderName; dragStartX = evt.clientX; dragStartY = evt.clientY; dragStartRect = win.getBoundingClientRect(); };
      border.ontouchstart = (evt) => { draggedWindow = win; dragType = borderName; dragStartX = evt.touches[0].clientX; dragStartY = evt.touches[0].clientY; dragStartRect = win.getBoundingClientRect(); };
    }
  }
}

document.querySelectorAll("dialog.window").forEach(smartifyWindow);
