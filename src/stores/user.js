import { defineStore } from "pinia"

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { auth, usersCollectionRef } from "@/includes/firebase"
import { doc, setDoc } from "firebase/firestore"

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      )

      const newDoc = doc(usersCollectionRef, userCredential.user.uid)

      await setDoc(newDoc, {
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      })

      await updateProfile(userCredential.user, {
        displayName: values.name,
      })

      this.userLoggedIn = true
    },

    async authenticate(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      this.userLoggedIn = true
    },

    async logout() {
      await signOut(auth)
      this.userLoggedIn = false
    },
  },
})
