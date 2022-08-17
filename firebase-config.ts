// @ts-nocheck

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
    GoogleAuthProvider,
    GithubAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";
import { Admin } from "mongodb";

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

// getting all users

// const getAllUsers = () => {
//     getAuth
//         .getUsers()
//         .then((getUsersResult) => {
//             console.log("Successfully fetched user data:");
//             getUsersResult.users.forEach((userRecord) => {
//                 console.log(userRecord);
//             });

//             console.log(
//                 "Unable to find users corresponding to these identifiers:"
//             );
//             getUsersResult.notFound.forEach((userIdentifier) => {
//                 console.log(userIdentifier);
//             });
//         })
//         .catch((error) => {
//             console.log("Error fetching user data:", error);
//         });
// }

// const getAllUsers = (req, res) => {
//     const maxResults = 1; // optional arg.

//     auth.listUsers(maxResults)
//         .then((userRecords) => {
//             userRecords.users.forEach((user) => console.log(user.toJSON()));
//             res.end("Retrieved users list successfully.");
//         })
//         .catch((error) => console.log(error));
// };

// const functions = firebase.functions();

// making a user an admin

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;

        // setLoading(true);

        // let res = 
        await fetch("/api/userHandler", {
            method: "POST",
            body: JSON.stringify({
                uid: user.id,
                name: user.displayName,
                authProvider: "github",
                email: user.email,
                superuser: false,
            }),
        });
        // if (res.ok) {
        //     res = await res.json();
        // }

        // setLoading(false);

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                superuser: false,
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const githubProvider = new GithubAuthProvider();
const signInWithGithub = async () => {
    try {
        const res = await signInWithPopup(auth, githubProvider);

        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = res.user;

        // setLoading(true);

        // let res = 
        await fetch("/api/userHandler", {
            method: "POST",
            body: JSON.stringify({
                uid: user.id,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                superuser: false,
            }),
        });
        // if (res.ok) {
        //     res = await res.json();
        // }

        // setLoading(false);

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "github",
                email: user.email,
                superuser: false,
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
            superuser: false,
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

const logout = async () => {
    try {
        await signOut(auth);
        console.log("user logged out");
    } catch (error) {
        console.log(error.message);
    }
};

export {
    auth,
    db,
    signInWithGoogle,
    signInWithGithub,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    sendPasswordResetEmail,
};
