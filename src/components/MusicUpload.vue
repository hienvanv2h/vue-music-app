<template>
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
            <!-- Upload Dropbox -->
            <div class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{ 'text-white bg-green-400 border-green-400 border-solid': isDragover }" @drag.prevent.stop=""
                @dragstart.prevent.stop="" @dragend.prevent.stop="" @dragover.prevent.stop=""
                @dragenter.prevent.stop="onDragOver" @dragleave.prevent.stop="onDragLeave"
                @drop.prevent.stop="upload($event)">
                <h5>Drop your files here</h5>
            </div>
            <!-- Fallback input field -->
            <input type="file" multiple @change="upload($event)" accept="audio/mpeg">

            <hr class="my-6" />

            <!-- Progress Bars -->
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
                <div class="font-bold text-sm" :class="upload.textClass">
                    <i :class="upload.icon"></i> {{ upload.name }}
                </div>
                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <div class="transition-all progress-bar" :class="upload.variant"
                        :style="{ width: `${upload.currentProgress}%` }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { auth, storage, songsCollectionRef } from '@/includes/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, getDoc } from "firebase/firestore";

import { v4 as uuidv4 } from 'uuid';

export default {
    name: 'MusicUpload',
    emits: ['add-song'],
    data() {
        return {
            isDragover: false,
            uploads: []
        }
    },
    methods: {
        onDragOver() {
            // console.log('onDragOver')
            this.isDragover = true
        },
        onDragLeave() {
            // console.log('onDragLeave')
            this.isDragover = false
        },
        upload(event) {
            this.isDragover = false
            const files = event.dataTransfer
                ? Array.from(event.dataTransfer.files)  // for drag and drop
                : Array.from(event.target.files)    // for manual file upload

            this.uploads = []
            files.forEach(file => {
                // Check file format
                if (file.type !== 'audio/mpeg') {
                    return
                }

                // Create unique name
                const ext = file.name.split('.').pop()
                const originalName = file.name
                const storageName = `${originalName.replace(/\.[^/.]+$/, '')}-${uuidv4()}.${ext}`

                const storageRef = ref(storage) // vuemusic-a2376.firebasestorage.app
                const songsRef = ref(storageRef, `songs/${storageName}`) // vuemusic-a2376.firebasestorage.app/songs/example-<uuid>.mp3
                const uploadTask = uploadBytesResumable(songsRef, file)

                const uploadsLength = this.uploads.push({
                    uploadTask,
                    currentProgress: 0,
                    name: file.name,
                    variant: 'bg-blue-400',
                    icon: "fas fa-spinner fa-spin",
                    textClass: ""
                })
                const uploadIndex = uploadsLength - 1

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        this.uploads[uploadIndex].currentProgress = progress
                    },
                    (error) => {
                        this.uploads[uploadIndex].variant = "bg-red-400"
                        this.uploads[uploadIndex].icon = "fas fa-times"
                        this.uploads[uploadIndex].textClass = "text-red-400"
                        console.log(error)
                    },
                    async () => {
                        // store data in database
                        const song = {
                            uid: auth.currentUser.uid,
                            publishedBy: auth.currentUser.displayName,
                            originalName: originalName,
                            modifiedName: originalName,
                            storageName: storageName,
                            genre: "",
                            commentCount: 0
                        }

                        song.url = await getDownloadURL(uploadTask.snapshot.ref)

                        const songRef = await addDoc(songsCollectionRef, song)
                        const songSnapshot = await getDoc(songRef)

                        this.$emit("add-song", songSnapshot)
                        this.uploads[uploadIndex].variant = "bg-green-400"
                        this.uploads[uploadIndex].icon = "fas fa-check"
                        this.uploads[uploadIndex].textClass = "text-green-400"
                    }
                )
            })
        },
        cancelUploads() {
            this.uploads.forEach(upload => {
                upload.uploadTask.cancel()
            })
        }
    },
    beforeUnmount() {
        // Cancel all uploads before leaving
        this.cancelUploads()
    }
}
</script>