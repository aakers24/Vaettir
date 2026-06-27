# Future Ideas

* Cellular automata Logo

* Glitch effects

* Add a WebGL version (or something- not sure on the details) that loads and does more 3D stuff
    * Nebulae and/or planets - WebGL might be necessary for my desired effect

* Make the mouse have a shooting star tail or other animation when clicking/dragging?
    * Black hole mouse - Gravitational distortion around the mouse?

* Stars drift
    * After an idle timer, on/off button, etc

* Button to just play the game so it hides all the serious stuff and lets you try to collect all the stars
    * Could be time based and/or levels based on physics changing to make it harder.
    * Could make a leaderboard
    * Space warp travel animation into game?

* Make a few different small ambient tracks to play randomly if the user turns on the play button before choosing another song
    * Add them to the playlist of songs as options

* Screen saver mode!!!
    * No headers, just full screen star beautifulness, and maybe star drift.
    * Hide the popout menu arrow button if no input for a short time so it's really just the stars

## Core features to implement

* Pages for Bio, Certs/Education, Projects, Art, Music, etc.
    * Semi-opaque dropdown/modal/overlay that holds the content of the "pages" while still showing the background partially

* Music interacts with stars/background

* Vaettir as central, always decrypted header?
    * Added first. If header.name === vaettir draw middle, etc.

* Arrow button in the bottom left(?) that you click/press to open and see the other buttons (Play/Pause music, volume, stop animations(?) / star drift on/off, REFRESH!/reload/home, game mode, Screen saver mode!!!, etc.)
    * When pressed the button itself moves to the right to be on the other side of the bar that slides out and swaps directions from > to < so it cane hide it again

---

# Refactors and Improvements

* Optimize?
    * Continually check in on this
    * Further abstract the Dynamic HTML and/or headers (?)

* Shuffle the headers within the header structure so they're in a random order?

* Pages in progress!!!
    * Adjust header click collisions!
    * Import/add content to pages
    * Fix photos
        * Orientation on mobile

* Fix edge detection for headers - calcHeaderLocation