// @ts-nocheck
import axios from "axios";

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { useEffect, useState } from "react";

// ? Material UI is a component library for easier styling and with some custom components
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { LoadingButton } from "@mui/lab";
import MailIcon from "@material-ui/icons/Mail";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

//import { TextField } from "@mui/material";
import { TextareaAutosize } from "@material-ui/core";

import Link from "next/link";

import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import React, { useCallback, useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { Text, createEditor, Element as SlateElement, Descendant } from "slate";
import { withHistory } from "slate-history";
import { css } from "@emotion/css";

import clientPromise from "../mongodb";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../firebase";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";

const getLength = (token) => {
    if (typeof token === "string") {
        return token.length;
    } else if (typeof token.content === "string") {
        return token.content.length;
    } else {
        return token.content.reduce((l, t) => l + getLength(t), 0);
    }
};

// different token types, styles found on Prismjs website
const Leaf = ({ attributes, children, leaf }) => {
    return (
        <span
            {...attributes}
            className={css`
                font-family: monospace;
                background: hsla(0, 0%, 100%, 0.5);
                ${leaf.comment &&
                css`
                    color: slategray;
                `}
                ${(leaf.operator || leaf.url) &&
                css`
                    color: #9a6e3a;
                `}
        ${leaf.keyword &&
                css`
                    color: #07a;
                `}
        ${(leaf.variable || leaf.regex) &&
                css`
                    color: #e90;
                `}
        ${(leaf.number ||
                    leaf.boolean ||
                    leaf.tag ||
                    leaf.constant ||
                    leaf.symbol ||
                    leaf["attr-name"] ||
                    leaf.selector) &&
                css`
                    color: #905;
                `}
        ${leaf.punctuation &&
                css`
                    color: #999;
                `}
        ${(leaf.string || leaf.char) &&
                css`
                    color: #690;
                `}
        ${(leaf.function || leaf["class-name"]) &&
                css`
                    color: #dd4a68;
                `}
            `}
        >
            {children}
        </span>
    );
};

const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [
            {
                text: `import random
name = 'Daniel'
favourite_number = random.randint(0, 10)
print(f"{name}'s favourite number is: {favourite_number}")`,
            },
        ],
    },
];

// modifications and additions to prism library

Prism.languages.python = Prism.languages.extend("python", {});
Prism.languages.insertBefore("python", "prolog", {
    comment: { pattern: /##[^\n]*/, alias: "comment" },
});
Prism.languages.javascript = Prism.languages.extend("javascript", {});
Prism.languages.insertBefore("javascript", "prolog", {
    comment: { pattern: /\/\/[^\n]*/, alias: "comment" },
});

const Home: NextPage = (users) => {
    const [user, setUser] = useAuthState(auth);

    const [numNotifications, setNumNotifications] = useState<number>(0);

    const [translationPerformed, setTranslationPerformed] =
        useState<boolean>(false);

    const [codeInput, setCodeInput] = useState<string>(`import random
name = 'Daniel'
favourite_number = random.randint(0, 10)
print(f"{name}'s favourite number is: {favourite_number}")`);

    const initialValue: Descendant[] = [
        {
            type: "paragraph",
            children: [
                {
                    text: codeInput,
                },
            ],
        },
    ];

    const [codeOutput, setCodeOutput] = useState<any>(null);
    const [languageFrom, setLanguageFrom] = useState<any>("python");
    const [languageTo, setLanguageTo] = useState<any>("java");

    const [numLines, setNumLines] = useState<number>(0);

    const handleChange1 = (event: SelectChangeEvent) => {
        setLanguageFrom(event.target.value as string);
    };

    const handleChange2 = (event: SelectChangeEvent) => {
        setLanguageTo(event.target.value as string);
    };

    const [defaultOutputMessage, setDefaultOutputMessage] =
        useState<boolean>(true);

    const translate = (
        codeInput: string,
        languageFrom: string,
        languageTo: string
    ) => {
        let codeOutput: string = codeInput;

        let codeOutputLines: Array<any>;

        codeOutputLines = codeOutput.split(/[\r\n]+/); // RegEx for splitting by line

        setNumLines(codeOutputLines.length);

        // console.log("lines split: " + codeOutputLines + numLines);

        // this is a dictionary to keep track of the lines that have been adjusted
        const linesChecked: { [lineNumber: number]: string } = {};

        for (let i: number = 0; i < codeOutputLines.length; i++) {
            linesChecked[i] = "unmodified";
        }

        if (languageTo === "java" || languageTo === "javascript") {
            // * better way to add semicolon to each line then convert to string
            codeOutputLines = codeOutputLines.map((item) => `${item};`);

            // this filters out the semicolon-only lines from the output after having added
            // these semicolons to every line with the language conversion (prevents empty lines
            // at the end of the code block)
            let filteredCodeOutputLines = codeOutputLines.filter(function (
                element
            ) {
                return element != ";";
            });

            codeOutput = filteredCodeOutputLines.join("\n");
        }

        if (languageFrom === "python") {
            // ? could alternatively use RegEx (Regular Expressions) instead of the first
            // ? argument being a string, but I don't believe I'll need this
            codeOutput = codeOutput.replaceAll(
                "print",
                // * what it's replaced with depends on whether it's to JS or java
                languageTo === "java" ? "System.out.println" : "console.log"
            );
        }

        // console.log(linesChecked);

        if (codeInput != codeOutput) {
            setCodeOutput(codeOutput);
            setTranslationPerformed(true);
        } else {
            setDefaultOutputMessage(false);
        }
    };

    const [isCopied, setIsCopied] = useState(false);

    async function copyTextToClipboard(text: string) {
        if ("clipboard" in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand("copy", true, text);
        }
    }

    // onClick handler function for the copy button
    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(codeOutput)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const openNotifications = () => {
        console.log("hello these are the notifications being opened");
    };

    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    // * useful for checking the code upon any changes, will remove soon since I'm almost done with this section
    // useEffect(() => {
    // users.map((user, index) => {
    //     console.log(user.username, index);
    // });
    // try{
    //     console.log("username:" + JSON.parse(JSON.stringify(complaintsState)).username);
    // } catch(e){}

    // });

    useEffect(() => {
        try {
            setPostsState(posts);
            console.log(posts);
        } catch (e) {}
    }, []);

    // decorate function depends on the language selected
    // this decorates the code, as in highlights the
    const decorate = useCallback(
        ([node, path]) => {
            const ranges = [];
            if (!Text.isText(node)) {
                return ranges;
            }
            const tokens = Prism.tokenize(
                node.text,
                Prism.languages[languageFrom]
            );

            if (codeInput === "") {
                setCodeInput(initialValue[0].children[0].text);
            } else {
                setCodeInput(node.text);
            }

            let start = 0;

            for (const token of tokens) {
                const length = getLength(token);
                const end = start + length;

                if (typeof token !== "string") {
                    ranges.push({
                        [token.type]: true,
                        anchor: { path, offset: start },
                        focus: { path, offset: end },
                    });
                }

                start = end;
            }

            return ranges;
        },
        [languageFrom]
    );
    const [complaintsState, setComplaintsState] = useState();
    const [submissionCode, setSubmissionCode] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/handler", {
                responseType: "text",
                transformResponse: [(v) => v],
            })
            .then((res) => {
                setComplaintsState(res.data.split("]")[0].replaceAll("[", ""));
                console.log(res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }); //[0].submissionCode

    return (
        <>
            <div className={styles.container}>
                <Head>
                    <title>translang</title>
                    <meta
                        name="description"
                        content="Generated by create next app"
                    />
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        translang - the programming language converter
                    </h1>

                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                        }}
                    >
                        <nav aria-label="main mailbox folders">
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Inbox" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <DraftsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Submitted Complaints" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </nav>
                    </Box>

                    {user && (
                        <Link
                            href={{
                                pathname: "/auth/login",
                            }}
                        >
                            <Button
                                // style={}
                                variant="outlined"
                                className="btn"
                            >
                                Sign Out
                            </Button>
                        </Link>
                    )}
                    {!user && (
                        <Link
                            href={{
                                pathname: "/auth/login",
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={logout()}
                                // style={}
                                className="btn"
                            >
                                Login
                            </Button>
                        </Link>
                    )}

                    <h2>Most recent complaint:</h2>

                    {complaintsState}

                    {/* <div className={styles.container}>
                        <ul>
                            {complaints.map((complaint, i) => (
                                return (
                                    <div className="card" key={index}>
                                        <h2>{complaint}</h2>
                                    </div>
                                );
                            ));}
                        </ul>
                </div> */}

                    {/* <div className={styles.container}>
                        <ul>
                            {complaints.map((complaint, i) => (
                                return (
                                    <div className="card" key={index}>
                                        <h2>{complaint.submissionCode}</h2>
                                    </div>
                                );
                            ))}
                        </ul>
                    )}}
                </div> */}

                    {/* <ul>
                        
                        {/* {complaintsState.map((complaint) => (
                        <li key={complaint}></li>
                    ))} 
                    </ul> */}

                    {/* <Link
                    href={{
                        pathname: "/complaint",
                        query: { languageFrom, languageTo, codeOutput, numLines },
                    }}
                >
                    <button
                        // onClick={}
                        // style={}
                        className="btn"
                    >
                        Fake Complaint
                    </button>
                </Link> */}

                    {/* <Box component="form" style={{ padding: "10px" }}> */}
                    {/* this is the selection dropdown for language from */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="simple-select-autowidth-label">
                            Language From
                        </InputLabel>
                        <Select
                            value={languageFrom}
                            onChange={handleChange1}
                            labelId="simple-select-autowidth-label"
                            id="simple-select-autowidth"
                            autoWidth
                            label="language from"
                        >
                            <MenuItem value={"python"}>Python</MenuItem>
                            <MenuItem value={"java"}>Java</MenuItem>
                            <MenuItem value={"javascript"}>JavaScript</MenuItem>
                        </Select>
                    </FormControl>

                    {/* this is the code editor from */}

                    <Slate editor={editor} value={initialValue}>
                        <Editable
                            decorate={decorate}
                            renderLeaf={renderLeaf}
                            onChange={(e) => setCodeInput(e.target.value)}
                        />
                    </Slate>
                    {/* </Box> */}
                    {/* <Box component="form" style={{ padding: "10px" }}> */}

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="simple-select-autowidth-label">
                            Language To
                        </InputLabel>
                        <Select
                            value={languageTo}
                            onChange={handleChange2}
                            labelId="simple-select-autowidth-label"
                            id="simple-select-autowidth"
                            autoWidth
                            label="language to"
                        >
                            <MenuItem value={"python"}>Python</MenuItem>
                            <MenuItem value={"java"}>Java</MenuItem>
                            <MenuItem value={"javascript"}>javascript</MenuItem>
                        </Select>
                    </FormControl>

                    <div>
                        <TextareaAutosize
                            // id="outlined-multiline-flexible"
                            placeholder={
                                defaultOutputMessage
                                    ? "This is where your code will be output"
                                    : "No conversion was performed"
                            }
                            minRows={3}
                            maxRows={10}
                            value={codeOutput}
                            disabled={true}
                        />
                    </div>
                    {/* the following is only displayed upon translation execution */}
                    {translationPerformed && (
                        <Button variant="outlined" onClick={handleCopyClick}>
                            {isCopied ? "Copied!" : "Copy to Clipboard"}
                        </Button>
                    )}
                    {translationPerformed && (
                        <Link
                            href={{
                                pathname: "/complaint",
                                query: {
                                    languageFrom,
                                    languageTo,
                                    codeOutput,
                                    numLines,
                                },
                            }}
                        >
                            <Button
                                variant="outlined"
                                // onClick={}
                                // style={}
                                className="btn"
                            >
                                Submit a Complaint
                            </Button>
                        </Link>
                    )}
                    {/* </Box> */}

                    <LoadingButton
                        onClick={() =>
                            // this gets only the codeInput's actual text value,
                            // which is all I care about for now
                            translate(codeInput, languageFrom, languageTo)
                        }
                        style={styles.button}
                    >
                        Translate!
                    </LoadingButton>
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
            </div>
        </>
    );
};

export default Home;

export async function getServerSideProps(context) {
    let res = await fetch("http://localhost:3000/api/handler", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let complaints = await res.json();

    return {
        props: { complaints },
    };
}

async function getComplaints(req, res) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // fetch the posts
        let complaints = await db
            .collection("RequestsAndResponses")
            .find({})
            .sort({ published: -1 })
            .toArray();
        // return the posts
        return res.json({
            message: JSON.parse(JSON.stringify(complaints)),
            success: true,
        });
    } catch (error) {
        // return the error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}
