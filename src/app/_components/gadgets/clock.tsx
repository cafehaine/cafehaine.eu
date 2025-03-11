import React, {useEffect, useState} from "react"
import Gadget from "./gadget"
import styles from "./clock.module.css"

function ClockComponent(): React.ReactNode {
  // Date of windows vista release :)
  const [time, setTime] = useState<Date>(new Date("January 30, 2007 10:09:30"));

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => {
      clearInterval(interval);
    }
  }, [])

  return (
    <section className={styles.clock} id="clock" style={{ "--hours": time.getHours(), "--minutes": time.getMinutes(), "--seconds": time.getSeconds() } as React.CSSProperties}>
      <ul className={styles.dial}>
        {[...Array(12)].map((_, index) => <li key={index} style={{ "--num": index + 1 } as React.CSSProperties}>{index + 1}</li>)}
      </ul>
      <div className={`${styles.hand} ${styles.hours}`}></div>
      <div className={`${styles.hand} ${styles.minutes}`}></div>
      <div className={`${styles.hand} ${styles.seconds}`}></div>
    </section>
  );
}

export default class Clock extends Gadget {
  content(): React.ReactNode {
    return <ClockComponent />
  }
}
