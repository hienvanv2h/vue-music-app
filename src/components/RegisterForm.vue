<template>
    <div class="text-white text-center font-semibold px-8 py-4 rounded-md mb-2" :class="alertVariant" v-if="showAlert">
        {{ alertMessage }}
    </div>
    <!-- Registration Form -->
    <VeeForm :validation-schema="registerSchema" @submit="register" :initial-values="userData">
        <!-- Name -->
        <div class="mb-3">
            <label class="inline-block mb-2">Name</label>
            <VeeField name="name" type="text" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                                    duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name" />
            <ErrorMessage name="name" class="text-red-600" />
        </div>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <VeeField name="email" type="email" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                                    duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            <ErrorMessage name="email" class="text-red-600" />
        </div>
        <!-- Age -->
        <div class="mb-3">
            <label class="inline-block mb-2">Age</label>
            <VeeField name="age" type="number" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                                    duration-500 focus:outline-none focus:border-black rounded" />
            <ErrorMessage name="age" class="text-red-600" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <VeeField name="password" :bails="false" v-slot="{ field, errors }">
                <input type="password" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                                    duration-500 focus:outline-none focus:border-black rounded" placeholder="Password"
                    v-bind="field" />
                <div class="text-red-600" v-for="error in errors" :key="error"> {{ error }}</div>
            </VeeField>
        </div>
        <!-- Confirm Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Confirm Password</label>
            <VeeField name="confirm_password" type="password" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                                    duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password" />
            <ErrorMessage name="confirm_password" class="text-red-600" />
        </div>
        <!-- Country -->
        <div class="mb-3">
            <label class="inline-block mb-2">Country</label>
            <VeeField as="select" name="country" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                                    duration-500 focus:outline-none focus:border-black rounded">
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
                <option value="China">China</option>
            </VeeField>
            <ErrorMessage name="country" class="text-red-600" />
        </div>
        <!-- TOS -->
        <div class="mb-3 pl-6">
            <VeeField name="tos" type="checkbox" value="1" class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
            <label class="inline-block">Accept terms of service</label>
            <ErrorMessage name="tos" class="text-red-600 block" />
        </div>
        <button type="submit" :disabled="formInSubmission"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700">
            Submit
        </button>
    </VeeForm>
</template>

<script>

import { mapActions } from 'pinia';
import useUserStore from '@/stores/user'

export default {
    name: 'RegisterForm',
    data() {
        return {
            activeTab: 'register',
            registerSchema: {
                name: 'required|min:3|max:100|alpha_spaces',
                email: "required|email",
                age: "required|integer|min_value:18|max_value:150",
                password: "required|min:9|max:100|excluded:password",
                confirm_password: "password_match:@password",
                country: "required|country_excluded:China",
                tos: "tos"
            },
            userData: {
                name: 'test',
                email: 'test@123.com',
                age: 25,
                password: '1234567890',
                confirm_password: '1234567890',
                country: 'USA'
            },
            formInSubmission: false,
            showAlert: false,
            alertVariant: 'bg-blue-500',
            alertMessage: 'Please wait! Your account is being created.'
        }
    },
    computed: {},
    methods: {
        ...mapActions(useUserStore, {
            createUser: 'register'
        }),
        async register(values) {
            this.formInSubmission = true
            this.showAlert = true
            this.alertVariant = 'bg-blue-500'
            this.alertMessage = 'Please wait! Your account is being created.'

            try {
                await this.createUser(values)
            } catch (error) {
                this.alertVariant = 'bg-red-500'
                this.alertMessage = "Unexpected error. Please try again later."
                this.formInSubmission = false
                console.error(error)
                return
            }

            this.alertVariant = 'bg-green-500'
            this.alertMessage = "Success! Your account has been created."
        },
    }
}
</script>