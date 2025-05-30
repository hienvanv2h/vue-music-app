<template>
    <div class="text-white text-center font-semibold px-8 py-4 rounded-md mb-2" :class="alertVariant" v-if="showAlert">
        {{ alertMessage }}
    </div>
    <!-- Login Form -->
    <VeeForm :validation-schema="loginSchema" @submit="login">
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <VeeField name="email" type="email" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                                    duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            <ErrorMessage name="email" class="text-red-600" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <VeeField name="password" type="password" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                                    duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
            <ErrorMessage name="password" class="text-red-600" />
        </div>
        <button type="submit" class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                                hover:bg-purple-700">
            Login
        </button>
    </VeeForm>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

import { getAuthErrorMessage } from '@/utils/firebaseAuthErrors'

export default {
    name: 'LoginForm',
    data() {
        return {
            activeTab: 'login',
            loginSchema: {
                email: 'required|email',
                password: 'required|min:9|max:100'
            },
            formInSubmission: false,
            showAlert: false,
            alertVariant: '',
            alertMessage: ''
        }
    },
    methods: {
        ...mapActions(useUserStore, ['authenticate']),
        async login(values) {
            this.formInSubmission = true
            this.alertVariant = 'bg-blue-500'
            this.alertMessage = 'Please wait! Your are being logged in.'
            this.showAlert = true

            try {
                await this.authenticate(values)
            } catch (error) {
                this.alertVariant = 'bg-red-500'
                this.alertMessage = `Authenticate failed: ${getAuthErrorMessage(error.code)}`
                this.formInSubmission = false
                return
            }

            this.alertVariant = 'bg-green-500'
            this.alertMessage = 'Success! Your account has been created.'
            this.formInSubmission = false
        }
    }
}
</script>