// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import Image from "next/image";
import {
    auth,
    registerWithEmailAndPassword,
    signInWithGithub,
    signInWithGoogle,
} from "../../firebase-config";

import styles from "../../styles/Home.module.css";
import Router from "next/router";

import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const register = () => {
        if (!name) alert("Please enter name");
        registerWithEmailAndPassword(name, email, password);
    };
    useEffect(() => {
        if (loading) return;
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                    />
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
                            backgroundColor: "#14b814",
                        }}
                        onClick={register}
                    >
                        Register
                    </button>
                    <button
                        style={{
                            fontSize: "18px",
                            marginBottom: "10px",
                            border: "none",
                            color: "white",
                            backgroundColor: "#4385f4",
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                        }}
                        onClick={signInWithGoogle}
                    >
                        <p>Register with Google</p>
                        <GoogleIcon style={{ paddingLeft: "10px", fontSize: "41px", paddingLeft: "8px"}}></GoogleIcon>
                    </button>
                    <button
                        style={{
                            fontSize: "18px",
                            marginBottom: "10px",
                            border: "none",
                            color: "white",
                            backgroundColor: "black",
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                        }}
                        onClick={signInWithGithub}
                    >
                        <p>Register with GitHub</p>
                        <GitHubIcon style={{ paddingLeft: "10px", fontSize: "40px", paddingLeft: "10px",}}></GitHubIcon>
                    </button>
                    <div style={{ marginTop: "7px" }}>
                        Already have an account?{" "}
                        <div style={{ display: "inline", color: "blue", textDecoration: "underline" }}>
                            <Link href={{ pathname: "/auth/login" }}>Login</Link>
                        </div>
                        {" "}
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
export default Register;
