import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { useState } from "react";

// ? Material UI is a component library for easier styling and with some custom components
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { LoadingButton } from "@mui/lab";

//import { TextField } from "@mui/material";
import { TextareaAutosize } from "@material-ui/core";

import Link from "next/link";
import { useRouter } from "next/router";

const Complaint: NextPage = () => {
    const router = useRouter();
    const languageFrom = router.query.languageFrom
        ? router.query.languageFrom
        : "JavaScript";
    const languageTo = router.query.languageTo
        ? router.query.languageTo
        : "Python";

    return (
        <>
            <main className={styles.main}>
                <h1>Submit a Complaint here</h1>
                <h2>
                    <Link
                        href={{
                            pathname: "/",
                            // query: { languageFrom, languageTo },
                        }}
                    >
                        <button
                            // onClick={}
                            // style={}
                            className="btn"
                        >
                            Make another translation
                        </button>
                    </Link>
                </h2>

                <h1>
                    You translated from: {languageFrom} to: {languageTo}
                </h1>

                
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

export default Complaint;
