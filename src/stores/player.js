import { defineStore } from "pinia"
import { Howl } from "howler"

import { formatTime } from "@/includes/helper"

export default defineStore("player", {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  }),
  getters: {
    isPlaying(state) {
      return state.sound && state.sound.playing && state.sound.playing()
    },
  },
  actions: {
    async newSong(song) {
      // Unload sound before loading a new one
      if (this.sound instanceof Howl) {
        this.sound.unload()
      }
      this.currentSong = song
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      })

      this.sound.play()

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      if (!this.sound.playing) return

      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    progress() {
      this.seek = formatTime(this.sound.seek())
      this.duration = formatTime(this.sound.duration())
      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) return

      const { x, width } = event.currentTarget.getBoundingClientRect() // properties của element gắn sự kiện
      const clickX = event.clientX - x // lấy tọa độ X tương đối với element
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)
      this.sound.once("seek", this.progress)
    },
  },
})
