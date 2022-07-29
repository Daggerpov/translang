// @ts-nocheck

import type { NextPage } from "next";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import React from "react";


const AcceptedSuggestions: NextPage = (users) => {
    return (
        <>
            <main className={styles.main}>
                <p>accepted suggestions page</p>
            </main>

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
};
export default AcceptedSuggestions;
