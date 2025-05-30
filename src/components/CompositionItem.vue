<template>
    <div v-show="showAlert && !isUpdated" class="text-white text-center font-bold p-3 mb-4" :class="alertVariant">
        {{ alertMessage }}
    </div>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <div v-show="!showForm">
            <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                @click.prevent="deleteSong">
                <i class="fa fa-times"></i>
            </button>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click.prevent="showForm = !showForm">
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
        <div v-show="showForm">
            <VeeForm :validation-schema="songSchema" :initial-values="initialValues" @submit="editSong">
                <div v-show="showAlert && isUpdated" class="text-white text-center font-bold p-3 mb-4"
                    :class="alertVariant">
                    {{ alertMessage }}
                </div>

                <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <VeeField name="modified_name" type="text" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title" @input="updateUnsavedFlag(true)" />
                    <ErrorMessage name="modified_name" class="text-red-600" />
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <VeeField name="genre" type="text" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre" @input="updateUnsavedFlag(true)" />
                    <ErrorMessage name="genre" class="text-red-600" />
                </div>
                <div class="flex justify-start items-center gap-4">
                    <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600"
                        :disabled="formInSubmission">
                        Submit
                    </button>
                    <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
                        :disabled="formInSubmission" @click.prevent="showForm = false; showAlert = false">
                        Go Back
                    </button>
                </div>
            </VeeForm>
        </div>
    </div>
</template>

<script>
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { ref, deleteObject } from "firebase/storage";
import { songsCollectionRef, storage } from '@/includes/firebase'

export default {
    name: 'CompositionItem',
    props: {
        song: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true
        },
        updateUnsavedFlag: {
            type: Function,
            required: false
        }
    },
    emits: ['emit-update', 'emit-delete'],
    data() {
        return {
            showForm: false,
            songSchema: {
                modified_name: 'required',
                genre: 'alpha_spaces'
            },
            initialValues: {
                modified_name: this.song.modifiedName,
                genre: this.song.genre
            },
            formInSubmission: false,
            showAlert: false,
            isUpdated: false,
            alertVariant: 'bg-blue-500',
            alertMessage: 'Updating song info...',
            timer: null
        }
    },
    methods: {
        async editSong(values) {
            this.formInSubmission = true
            this.alertVariant = 'bg-blue-500'
            this.alertMessage = 'Updating song info...'
            this.showAlert = true
            this.isUpdated = true

            const songsRef = doc(songsCollectionRef, this.song.docID)
            try {
                await updateDoc(songsRef, {
                    ...this.song,
                    modifiedName: values.modified_name,
                    genre: values.genre,
                })
            } catch (error) {
                console.log(error)
                this.alertVariant = 'bg-red-500'
                this.alertMessage = 'Something went wrong! Try again later.'
                this.popAlert()
                return
            } finally {
                this.formInSubmission = false
            }

            this.$emit("emit-update", this.index, values.modified_name, values.genre)
            this.updateUnsavedFlag(false)

            this.alertVariant = 'bg-green-500'
            this.alertMessage = 'Success! Song info has been updated.'
            this.popAlert()

        },
        async deleteSong() {
            this.alertVariant = 'bg-blue-500'
            this.alertMessage = 'Deleting song...'
            this.showAlert = true

            const storageRef = ref(storage, `songs/${this.song.storageName}`)
            try {
                await deleteObject(storageRef);
                await deleteDoc(doc(songsCollectionRef, this.song.docID));

            } catch (error) {
                console.log(error)
                this.alertVariant = 'bg-red-500'
                this.alertMessage = 'Something went wrong! Try again later.'
                this.popAlert()
                return
            }

            this.$emit("emit-delete", this.song.docID);

            this.alertVariant = 'bg-green-500'
            this.alertMessage = 'Song deleted!'
            this.popAlert()
        },
        popAlert(duration) {
            if (this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.showAlert = false
                this.isUpdated = false
                this.timer = null
            }, duration || 3000);
        }
    },
    beforeUnmount() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
    }

}
</script>