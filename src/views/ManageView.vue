<template>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
        <div class="md:grid md:grid-cols-3 md:gap-4">
            <div class="col-span-1">
                <MusicUpload ref="musicUpload" @add-song="addSong" />
            </div>
            <div class="col-span-2">
                <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                        <span class="card-title">My Songs</span>
                        <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
                    </div>
                    <div class="p-6">
                        <!-- Composition Items -->
                        <CompositionItem v-for="(song, idx) in songs" :key="song.docID" :song="song" :index="idx"
                            :updateUnsavedFlag="updateUnsavedFlag" @emit-update="updateSong"
                            @emit-delete="removeSong" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import MusicUpload from '@/components/MusicUpload.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import { query, where, getDocs } from "firebase/firestore";
import { songsCollectionRef, auth } from '@/includes/firebase';

// import useUserStore from '@/stores/user'

export default {
    name: 'ManageView',
    components: {
        MusicUpload,
        CompositionItem
    },
    data() {
        return {
            songs: [],
            unsavedFlag: false
        }
    },
    methods: {
        addSong(snapshot) {
            this.songs.push({ ...snapshot.data(), docID: snapshot.id })
        },
        updateSong(idx, name, genre) {
            this.songs[idx].modifiedName = name
            this.songs[idx].genre = genre
        },
        removeSong(idx) {
            this.songs.splice(idx, 1)
        },
        updateUnsavedFlag(value) {
            this.unsavedFlag = value
        }
    },
    async created() {
        const q = query(songsCollectionRef, where("uid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((document) => {
            this.addSong(document)
        });
    },
    beforeRouteLeave(to, from) {
        if (!this.unsavedFlag) {
            return true
        } else {
            const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
            return leave
        }
    }
    // beforeRouteEnter(to, from, next) {
    //     const userStore = useUserStore()

    //     if (!userStore.userLoggedIn) {
    //         next({ name: 'home' })
    //     } else {
    //         next()
    //     }
    // }
    // beforeRouteLeave(to, from) {
    //     //Cancel all uploads before leaving
    //     this.$refs.musicUpload.cancelUploads()
    //     return true
    // }
}
</script>