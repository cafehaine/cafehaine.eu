import Image from 'next/image';

import CustomWindow from "./window";

import aboutIcon from "./about.svg"

export default class About extends CustomWindow {
  constructor() {
    super("CaféHaine");
  }

  icon() {
    return <Image src={aboutIcon} alt="A circle with a question mark inside it"/>
  }

  content() {
    return (
      <>
        <nav>
          <label aria-label="show/hide nav"><input type="checkbox" /></label>
          <ul>
            <li><a href="https://gitlab.com/cafehaine">Gitlab</a></li>
            <li><a href="https://github.com/cafehaine">GitHub</a></li>
            <li><a href="https://fosstodon.org/@cafehaine">@cafehaine@fosstodon.org</a></li>
            <li><a href="https://cafehaine.itch.io/">Itch.io</a></li>
            <li><a href="https://code.golf/golfers/cafehaine">Code.golf</a></li>
          </ul>
        </nav>
        <section>
          <h2>About me</h2>
          <p>Hi! I'm CaféHaine, a french guy that loves open source :)</p>
          <p>These days, I mostly write code in python, but I've had experience with many different languages.</p>
          <footer>
            <p>The source for this site is available here: <a href="https://github.com/cafehaine/cafehaine.eu">https://github.com/cafehaine/cafehaine.eu</a></p>
            <p>The background/wallpaper is <a href="https://www.pexels.com/fr-fr/photo/aurores-boreales-360912/">Visit Greenland's photo</a></p>
          </footer>
        </section>
      </>
    )
  }
}
