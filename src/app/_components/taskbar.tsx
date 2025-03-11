import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

import { WindowManagerContext } from './../_contexts/windowManager';
import avatar from "./avatar.svg";
import About from '../_apps/about';
import Minesweeper from '../_apps/minesweeper';
import styles from "./taskbar.module.css"

export default function Taskbar({ hasMaximizedWindows }: { hasMaximizedWindows: boolean }) {
  const windowManager = useContext(WindowManagerContext);
  const [showStartMenu, setShowStartMenu] = useState(false);

  const [time, setTime] = useState<Date>(new Date(0))

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => {
      clearInterval(interval);
    }
  }, [])

  return (
    <div className={`${styles.taskbar} ${hasMaximizedWindows ? styles.hasMaximizedWindows : ""}`}>
      <button className={styles.orb} onClick={() => setShowStartMenu(!showStartMenu)}>
        <Image className={styles.orbLogo} src={avatar} alt="CaféHaine's avatar" />
      </button>
      {
        showStartMenu ?
          <dialog className={styles.startMenu} open={showStartMenu}>
            <nav>
              <ul>
                <li><button onClick={() => { windowManager.openWindow(new About()); setShowStartMenu(false) }}>About</button></li>
                <li><button onClick={() => { windowManager.openWindow(new Minesweeper()); setShowStartMenu(false) }}>Minesweeper</button></li>
              </ul>
              <input type="search" disabled />
            </nav>
            <aside>
              <ul>
                <li><a href="https://gitlab.com/cafehaine">Gitlab</a></li>
                <li><a href="https://github.com/cafehaine">GitHub</a></li>
                <li><a href="https://fosstodon.org/@cafehaine">@cafehaine@fosstodon.org</a></li>
                <li><a href="https://cafehaine.itch.io/">Itch.io</a></li>
                <li><a href="https://code.golf/golfers/cafehaine">Code.golf</a></li>
              </ul>
            </aside>
          </dialog>
          :
          ""
      }
      <ul className={styles.windowList}>
        {
          windowManager.windows.map(
            (window, index) => (
              <li key={index}>
                <button onClick={() => windowManager.toggleFocus(window)}>
                  {window.icon()}
                  <span>{window.title}</span>
                </button>
              </li>
            )
          )
        }
      </ul>
      <aside><time>{time.toLocaleTimeString()}</time></aside>
    </div>
  )
}
