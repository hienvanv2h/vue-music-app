<template>
    <!-- Header -->
    <header id="header" class="bg-gray-700">
        <nav class="container mx-auto flex justify-start items-center py-5 px-4">
            <!-- App Name -->
            <router-link class="text-white font-bold text-2xl mr-4" :to="{ name: 'home' }"
                exact-active-class="no-active">V2HMusic App</router-link>

            <div class="flex flex-grow items-center justify-end">
                <!-- Primary Navigation -->
                <ul class="flex flex-row mt-1">
                    <!-- Navigation Links -->
                    <li>
                        <router-link class="px-2 text-white" :to="{ name: 'about' }">About</router-link>
                    </li>
                    <li v-if="!userStore.userLoggedIn">
                        <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">Login / Register</a>
                    </li>
                    <template v-else>
                        <li>
                            <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
                        </li>
                        <li>
                            <router-link class="px-2 text-white" :to="{ name: 'home' }"
                                @click.prevent="userStore.logout">Logout</router-link>
                        </li>
                    </template>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
import { mapStores } from 'pinia'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'

export default {
    name: 'AppHeader',
    computed: {
        ...mapStores(useModalStore),
        ...mapStores(useUserStore)
    },
    methods: {
        toggleAuthModal() {
            this.modalStore.isOpen = !this.modalStore.isOpen
            console.log('modalStore.isOpen', this.modalStore.isOpen)
        }
    }
}
</script>