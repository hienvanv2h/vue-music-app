<template>
    <!-- Player -->
    <div class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16">
        <div class="relative">
            <!-- Play/Pause Button -->
            <div class="float-left w-7 h-7 leading-3">
                <button type="button" @click.prevent="toggleAudio">
                    <i class="fa text-gray-500 text-xl" :class="{ 'fa-play': !isPlaying, 'fa-pause': isPlaying }"></i>
                </button>
            </div>
            <!-- Current Position -->
            <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-1">
                <span class="player-currenttime">{{ seek }}</span>
            </div>
            <!-- Scrub -->
            <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub" @click.prevent="updateSeek">
                <div v-if="currentSong.modifiedName"
                    class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info">
                    <span class="song-title">{{ currentSong.modifiedName }}</span> by
                    <span class="song-artist">{{ currentSong.publishedBy }}</span>
                </div>
                <span class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer">
                    <span class="absolute top-neg-8 text-gray-800 text-lg" :style="{ left: playerProgress }">
                        <i class="fas fa-circle"></i>
                    </span>
                    <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
                        :style="{ width: playerProgress }"></span>
                </span>
            </div>
            <!-- Duration -->
            <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-1">
                <span class="player-duration">{{ duration }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import usePlayerStore from '@/stores/player'

export default {
    name: 'MusicPlayer',
    computed: {
        ...mapState(usePlayerStore, ['isPlaying', 'seek', 'duration', 'playerProgress', 'currentSong'])
    },
    methods: {
        ...mapActions(usePlayerStore, ['toggleAudio', 'updateSeek'])
    }
}
</script>