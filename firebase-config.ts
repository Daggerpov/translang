// @ts-nocheck

import { initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, createUserWithEmailAndPassword,} from "firebase/auth";
import {getFirestore, query, getDocs, collection, where, addDoc,} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// ! I will make a new app with a different config once I'm done development
const firebaseConfig = {
  apiKey: "AIzaSyD1GLdCFZt4xL-5OtocheEyStUFiQs2dIk",
  authDomain: "translang-daggerpov.firebaseapp.com",
  projectId: "translang-daggerpov",
  storageBucket: "translang-daggerpov.appspot.com",
  messagingSenderId: "312070841034",
  appId: "1:312070841034:web:3355889ba3b857b1f5ca33",
  measurementId: "G-S7FMLFSP91",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore();


const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  sendPasswordResetEmail,
};