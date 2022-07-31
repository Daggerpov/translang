// @ts-nocheck

import type { NextPage } from "next";
import Image from "next/image";
import styles from "../../styles/Home.module.css";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import React from "react";

function generate(element: React.ReactElement) {
    return [0, 1, 2, 3, 4, 5, 6, 7,8,9,10].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

const Inbox: NextPage = (users) => {

    return (
        <>
            <main className={styles.main}>

                <List align="left" style={{height: "80%", width: "100%"}}>
                {generate(
                    <ListItem style={{ border: "1px solid gray" }}>
                        <ListItemText
                            primary="Single-line item"
                            secondary="Secondary text"
                        />
                    </ListItem>,
                )}
                </List>
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
export default Inbox;