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
import Image from "next/image";

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
        if (user) Router.push("/");
    });
    return (
        <>
            <div
                style={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "7px",
                }}
            >
                <div
                    style={{
                        marginTop: "7px",
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                        backgroundColor: "#dcdcdc",
                        padding: "30px",
                    }}
                >
                    <input
                        type="text"
                        style={{
                            padding: "10px",
                            fontSize: "18px",
                            marginBottom: "10px",
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail Address"
                    />
                    <input
                        type="password"
                        style={{
                            padding: "10px",
                            fontSize: "18px",
                            marginBottom: "10px",
                        }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button
                        style={{
                            padding: "10px",
                            fontSize: "18px",
                            marginBottom: "10px",
                            border: "none",
                            color: "white",
                            backgroundColor: "black",
                        }}
                        onClick={() =>
                            logInWithEmailAndPassword(email, password)
                        }
                    >
                        Login
                    </button>
                    <button
                        style={{
                            padding: "10px",
                            fontSize: "18px",
                            marginBottom: "10px",
                            border: "none",
                            color: "white",
                            backgroundColor: "#4285f4",
                        }}
                        onClick={signInWithGoogle}
                    >
                        Login with Google
                    </button>
                    <div style={{ marginTop: "7px" }}>
                        <Link href={{ pathname: "/auth/reset" }}>
                            Forgot Password
                        </Link>
                    </div>
                    <div style={{ marginTop: "7px" }}>
                        Don't have an account?{" "}
                        <Link href={{ pathname: "/auth/register" }}>
                            Register
                        </Link>{" "}
                        now.
                    </div>
                </div>
            </div>
            <footer className={styles.footer}>
                <a
                    href="https://github.com/Daggerpov/translang"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Code Repository{" "}
                    <span className={styles.logo}>
                        <Image
                            src="/github_logo.png"
                            alt="Github logo"
                            width={64}
                            height={64}
                        />
                    </span>
                </a>
            </footer>
        </>
    );
}
export default Login;
