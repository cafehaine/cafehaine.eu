import Image from 'next/image';

import CustomWindow from "./window";

import minesweeperIcon from "./minesweeper.svg"

export default class Minesweeper extends CustomWindow {
  constructor() {
    super("Minesweeper");
  }

  icon() {
    return <Image src={minesweeperIcon} alt="A depiction of a mine" />
  }

  content() {
    return <>
      <section>
        <button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button>
        <button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button>
        <button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button>
        <button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button>
        <button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button>
        <button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button>
        <button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button>
        <button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button>
        <button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button><button></button>
      </section>
      <footer>
        <ul>
          <li title="Time spent">
            <Image src={null} alt="clock icon" />
            <span>0</span>
          </li>
          <li title="Mines found">
            <Image src={minesweeperIcon} alt="mine icon" />
            <span>0</span>
          </li>
        </ul>
      </footer>
    </>
  }
}
