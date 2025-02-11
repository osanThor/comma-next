export default class Sound {
  parent: HTMLElement;
  sounds: HTMLAudioElement[];
  muted: boolean;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.sounds = [];
    this.muted = true;
  }

  create(src: string, id: string, loop: boolean = false): HTMLAudioElement {
    const audio = document.createElement("audio");
    audio.src = src;
    audio.id = id;
    audio.muted = true;
    this.sounds.push(audio);
    this.parent.append(audio);

    if (loop) {
      audio.setAttribute("loop", "");
    }

    return audio;
  }

  soundSetting(): void {
    const soundItems = document.querySelectorAll<HTMLElement>(".sound-item");
    for (const soundItem of soundItems) {
      soundItem.addEventListener("click", () => {
        this.muteToggle();
      });
    }
  }

  muteToggle(): void {
    this.muted = !this.muted;

    for (const sound of this.sounds) {
      sound.muted = this.muted;
    }

    const speakerIcon = document.querySelector("#sound-speaker");
    const description = document.querySelector("#sound-description");

    if (speakerIcon) {
      speakerIcon.innerHTML = this.muted ? "\u{1F507}" : "\u{1F509}";
    }

    if (description) {
      description.innerHTML = this.muted ? "off" : "on";
    }
  }

  pause(): void {
    for (const sound of this.sounds) {
      sound.pause();
    }
  }

  play(): void {
    for (const sound of this.sounds) {
      sound.play();
    }
  }
}
