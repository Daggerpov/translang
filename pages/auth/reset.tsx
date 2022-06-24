// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import Link from "next/link";
import { auth, sendPasswordResetEmail } from "../../firebase";
import Image from "next/image";

function Reset() {
    const [email, setEmail] = useState("");
    const [user, loading, error] = useAuthState(auth);
    useEffect(() => {
        if (loading) return;
        if (user) navigate("/");
    });
    return (
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
                <button
                    style={{
                        padding: "10px",
                        fontSize: "18px",
                        marginBottom: "10px",
                        border: "none",
                        color: "white",
                        backgroundColor: "black",
                    }}
                    onClick={() => sendPasswordResetEmail(auth, email)}
                >
                    Send password reset email
                </button>
                <div style={{ marginTop: "7px" }}>
                    Don't have an account?{" "}
                    <Link href={{ pathname: "/auth/register" }}>Register</Link>{" "}
                    now.
                </div>
            </div>
        </div>
    );
}
export default Reset;
