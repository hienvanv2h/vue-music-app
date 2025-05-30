<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus et dolor mollis, congue augue non, venenatis elit.
          Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget,
          ullamcorper urna.
        </p>
      </div>
    </div>

    <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full" src="/assets/img/introduction-music.png" />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <i class="fa fa-headphones-alt float-right text-green-400 text-2xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <AppSongItem v-for="song in songs" :key="song.docID" :song="song" />
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script>
import { getDocs, getDoc, doc, query, limit, startAfter, orderBy } from "firebase/firestore";
import { songsCollectionRef } from '@/includes/firebase';
import AppSongItem from '@/components/SongItem.vue';

export default {
  name: 'HomeView',
  components: { AppSongItem },
  data() {
    return {
      songs: [],
      lastVisibleSong: null,
      maxPerPage: 20,
      pendingRequest: false
    }
  },
  methods: {
    async getSongs() {
      if (this.pendingRequest) return
      this.pendingRequest = true

      let q
      if (this.songs.length > 0) {
        this.lastVisibleSong = await getDoc(doc(songsCollectionRef, this.songs[this.songs.length - 1].docID))
        q = query(songsCollectionRef, orderBy('modifiedName'), limit(this.maxPerPage), startAfter(this.lastVisibleSong))
      } else {
        q = query(songsCollectionRef, orderBy('modifiedName'), limit(this.maxPerPage))
      }

      const songSnapshots = await getDocs(q)
      songSnapshots.forEach(document => {
        this.songs.push({ ...document.data(), docID: document.id })
      })

      this.pendingRequest = false
    },
    handleScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (scrollTop + clientHeight > scrollHeight - 10) {
        // console.log('bottom of page')
        this.getSongs()
      }
    }
  },
  async created() {
    this.getSongs()

    // observe scroll
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
