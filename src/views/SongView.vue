<template>
    <!-- Main Content -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
        <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
            style="background-image: url(/assets/img/song-header.png)">
        </div>
        <div class="container mx-auto flex items-center">
            <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
                @click.prevent="!isPlaying ? newSong(song) : toggleAudio()">
                <i class="fas"
                    :class="{ 'fa-play': !isPlaying || song.docID !== currentSong.docID, 'fa-pause': isPlaying && song.docID === currentSong.docID }"></i>
            </button>
            <!-- Song Info -->
            <div class="z-50 text-left ml-8">
                <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
                <div>{{ song.genre }}</div>
            </div>
        </div>
    </section>

    <section class="container mx-auto mt-6">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                <span class="card-title">Comments ({{ song.commentCount }})</span>
                <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
            </div>
            <div class="p-6">
                <div class="text-white text-center font-semibold px-8 py-4 rounded-md mb-2" :class="alertVariant"
                    v-if="showAlert">
                    {{ alertMessage }}
                </div>
                <!-- Comment Form -->
                <VeeForm :validation-schema="commentSchema" @submit="addComment" v-if="userLoggedIn">
                    <VeeField as="textarea" name="comment" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                        duration-500 focus:outline-none focus:border-black rounded mb-4"
                        placeholder="Your comment here...">
                    </VeeField>
                    <ErrorMessage name="comment" class="block text-red-600" />
                    <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600"
                        :disabled="formInSubmission">Submit</button>
                </VeeForm>
                <!-- Comment Sort -->
                <select v-model="sortOrder" class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
                        duration-500 focus:outline-none focus:border-black rounded">
                    <option value="desc">Latest</option>
                    <option value="asc">Oldest</option>
                </select>
            </div>
        </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto" id="comments">
        <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments" :key="comment.docID">
            <!-- Comment Author -->
            <div class="mb-5">
                <div class="font-bold">{{ comment.author }}</div>
                <time>{{ formatDate(comment.datePosted) }}</time>
            </div>

            <p>{{ comment.content }}</p>
        </li>
    </ul>
</template>

<script>
import { doc, getDoc, getDocs, addDoc, updateDoc, query, where } from "firebase/firestore";
import { songsCollectionRef, getCommentsCollectionRef, auth } from '@/includes/firebase';

import { mapState, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import usePlayerStore from "@/stores/player";

export default {
    name: 'SongView',
    computed: {
        ...mapState(useUserStore, ['userLoggedIn']),
        ...mapState(usePlayerStore, ['currentSong', 'isPlaying']),
        sortedComments() {
            return this.comments.slice().sort((a, b) => {
                return this.sortOrder === 'asc'
                    ? new Date(a.datePosted) - new Date(b.datePosted)
                    : new Date(b.datePosted) - new Date(a.datePosted)
            })
        }
    },
    data() {
        return {
            song: {},
            comments: [],
            sortOrder: 'asc',
            commentSchema: {
                comment: 'required|min:3'
            },
            formInSubmission: false,
            showAlert: false,
            alertVariant: 'bg-blue-500',
            alertMessage: 'Submiting comment...'
        }
    },
    methods: {
        ...mapActions(usePlayerStore, ['newSong', 'toggleAudio']),
        async addComment(values, context) {
            this.formInSubmission = true
            this.showAlert = true
            this.alertVariant = 'bg-blue-500'
            this.alertMessage = 'Submiting comment...'

            const comment = {
                content: values.comment,
                datePosted: new Date().toISOString(),
                author: auth.currentUser.displayName,
                songId: this.$route.params.id,
                userId: auth.currentUser.uid
            }

            const songRef = doc(songsCollectionRef, this.$route.params.id)
            const commentsRef = getCommentsCollectionRef(this.$route.params.id)

            await addDoc(commentsRef, comment)
            // update song comment count
            this.song.commentCount += 1
            await updateDoc(songRef, {
                commentCount: this.song.commentCount
            })

            this.alertVariant = 'bg-green-500'
            this.alertMessage = 'Comment has been added.'

            this.formInSubmission = false
            context.resetForm()
            await this.getComments()
        },
        async getComments() {
            const commentsRef = getCommentsCollectionRef(this.$route.params.id)
            const q = query(commentsRef, where('songId', '==', this.$route.params.id));
            const querySnapshot = await getDocs(q);

            this.comments = []
            querySnapshot.forEach((doc) => {
                this.comments.push({
                    ...doc.data(),
                    docID: doc.id,
                })
            })
        },
        formatDate(isoDate) {
            const date = new Date(isoDate)
            return new Intl.DateTimeFormat('vi-VN', {
                dateStyle: 'short',
                timeStyle: 'short'
            }).format(date)
        }
    },
    watch: {
        sortOrder(newVal) {
            if (newVal === this.$route.query.sort) return
            // add query param
            this.$router.push({ query: { ...this.$route.query, sort: newVal } })
        }
    },
    async created() {
        // fetch song
        const docRef = doc(songsCollectionRef, this.$route.params.id)
        const docSnapshot = await getDoc(docRef)
        if (!docSnapshot.exists()) {
            this.$router.push({ name: 'not-found' })
            return
        }
        this.song = {
            ...docSnapshot.data(),
            docID: docSnapshot.id
        }

        //check if exist sort param
        const { sort } = this.$route.query
        this.sortOrder = sort === 'desc' || sort === 'asc' ? sort : 'desc'

        // fetch comments
        this.getComments()
    }
}
</script>