// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Link from "next/link";
import {
    auth,
    logInWithEmailAndPassword,
    signInWithGoogle,
} from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import styles from "../../styles/Home.module.css";

import Router from "next/router";
import { TextBox } from "@syncfusion/ej2-react-inputs";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    // const navigate = useNavigate();
    // const classes = useStyles();
    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) Router.push("/");;
    });
    return (
        <div className="login">
            <div className={styles.container}>
                <input
                    type="text"
                    style={{padding: "10px", fontSize: "18px", marginBottom: "10px"}}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address"
                />
                <input
                    type="password"
                    className="login__textBox"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button
                    className="login__btn"
                    onClick={() => logInWithEmailAndPassword(email, password)}
                >
                    Login
                </button>
                <button
                    className="login__btn login__google"
                    onClick={signInWithGoogle}
                >
                    Login with Google
                </button>
                <div>
                    <Link href={{ pathname: "/reset" }}>Forgot Password</Link>
                </div>
                <div>
                    Don't have an account?{" "}
                    <Link href={{ pathname: "/register" }}>Register</Link> now.
                </div>
            </div>
        </div>
    );
}
export default Login;

