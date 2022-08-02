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
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import AdbIcon from "@mui/icons-material/Adb";
//import TextareaAutosize from '@mui/material/TextareaAutosize';

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
import { auth, logout, getAllUsers, db } from "../firebase-config";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    onSnapshot,
} from "firebase/firestore";

// const querySnapshot = await getDocs(collection(firestoreDB, "users"));
// querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
// });

// const querySnapshot = await getDocs(collection(db, "users"));
// querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
//     console.log(doc.uid, " => ", doc.data());
// });



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
        const q = query(collection(db, "users"))
        const unsub = onSnapshot(q, (querySnapshot) => {
            console.log(
                "Data",
                querySnapshot.docs//.map((d) => doc.data())
            );
        });

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

    const pages = [];

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        axios
            .get("/api/handler", {
                responseType: "text",
                transformResponse: [(v) => v],
            })
            .then((res) => {
                setComplaintsState(res.data.split("]")[0].replaceAll("[", ""));
                // console.log(res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }); 

    // console.log(usersFromDB);

    return (
        <>
            <div align="right">
                {user && (
                    <div>
                        <AppBar position="static">
                            <Container maxWidth="xl">
                                <Toolbar>
                                    <AdbIcon
                                        sx={{
                                            display: { xs: "none", md: "flex" },
                                            mr: 1,
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        component="a"
                                        href="/"
                                        sx={{
                                            mr: 2,
                                            display: { xs: "none", md: "flex" },
                                            fontFamily: "monospace",
                                            fontWeight: 700,
                                            letterSpacing: ".3rem",
                                            color: "inherit",
                                            textDecoration: "none",
                                        }}
                                    >
                                        TRANSLANG - THE ONLINE CODE CONVERTER
                                    </Typography>

                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            display: { xs: "flex", md: "none" },
                                        }}
                                    ></Box>
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            display: { xs: "none", md: "flex" },
                                        }}
                                    ></Box>

                                    <Box sx={{ flexGrow: 0, px: "15px" }}>
                                        <Tooltip title="Open settings">
                                            <Button
                                                variant="contained"
                                                onClick={handleOpenUserMenu}
                                            >
                                                <Typography
                                                    textAlign="center"
                                                    sx={{ mr: "5px" }}
                                                >
                                                    {
                                                        auth.currentUser
                                                            .displayName
                                                    }
                                                </Typography>
                                                <Avatar
                                                    alt="Google Photo/Initial"
                                                    src={
                                                        auth.currentUser
                                                            .photoURL
                                                    }
                                                />
                                            </Button>
                                        </Tooltip>
                                        <Menu
                                            sx={{ mt: "0" }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "right",
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                        >
                                            <Link
                                                href={{
                                                    pathname: "/menu/inbox",
                                                }}
                                            >
                                                <MenuItem key="Inbox">
                                                    <InboxIcon
                                                        sx={{ pr: "5px" }}
                                                    ></InboxIcon>
                                                    <Typography textAlign="center">
                                                        Inbox
                                                    </Typography>
                                                </MenuItem>
                                            </Link>
                                            <Link
                                                href={{
                                                    pathname:
                                                        "/menu/submitted-complaints",
                                                }}
                                            >
                                                <MenuItem
                                                    key="Submitted Complaints"
                                                    onClick={
                                                        handleCloseUserMenu
                                                    }
                                                >
                                                    <UploadFileIcon
                                                        sx={{ pr: "5px" }}
                                                    ></UploadFileIcon>
                                                    <Typography textAlign="center">
                                                        Submitted Complaints
                                                    </Typography>
                                                </MenuItem>
                                            </Link>
                                            <Link
                                                href={{
                                                    pathname:
                                                        "/menu/accepted-suggestions",
                                                }}
                                            >
                                                <MenuItem
                                                    key="Accepted Suggestions"
                                                    onClick={
                                                        handleCloseUserMenu
                                                    }
                                                >
                                                    <DoneAllIcon
                                                        sx={{ pr: "5px" }}
                                                    ></DoneAllIcon>
                                                    <Typography textAlign="center">
                                                        Accepted Suggestions
                                                    </Typography>
                                                </MenuItem>
                                            </Link>
                                        </Menu>
                                    </Box>
                                    {user && (
                                        // <Link
                                        //     href={{
                                        //         pathname: "/auth/login",
                                        //     }}
                                        // >
                                        <Button
                                            sx={{ px: "15px" }}
                                            // style={}
                                            onClick={() => {
                                                logout();
                                            }}
                                            color="inherit"
                                            variant="outlined"
                                            className="btn"
                                        >
                                            Sign Out
                                        </Button>
                                        // </Link>
                                    )}
                                </Toolbar>
                            </Container>
                        </AppBar>
                    </div>
                )}
                {!user && (
                    <AppBar position="static">
                        <Container maxWidth="xl">
                            <Toolbar>
                                <AdbIcon
                                    sx={{
                                        display: { xs: "none", md: "flex" },
                                        mr: 1,
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: { xs: "none", md: "flex" },
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        letterSpacing: ".3rem",
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                >
                                    TRANSLANG - THE ONLINE CODE CONVERTER
                                </Typography>
                                <Box component="div" sx={{ flexGrow: 1 }}></Box>
                                {!user && (
                                    <Link
                                        href={{
                                            pathname: "/auth/login",
                                        }}
                                    >
                                        <Button
                                            align="right"
                                            variant="outlined"
                                            color="inherit"
                                            // style={}
                                            className="btn"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                )}
                            </Toolbar>
                        </Container>
                    </AppBar>
                )}
            </div>

            <div className={styles.container}>
                <Head>
                    <title>translang</title>
                    <meta
                        name="description"
                        content="An online code converter between Python, Java, and JavaScript code, with complaint submission + logins and notifications"
                    />
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>translang</h1>

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
                    <div style={{ width: "95%" }}>
                        <div style={{ width: "45%", display: "inline-block" }}>
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
                                    <MenuItem value={"javascript"}>
                                        JavaScript
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div
                            style={{ width: "10%", display: "inline-block" }}
                        ></div>
                        <div style={{ width: "45%", display: "inline-block" }}>
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
                                    <MenuItem value={"javascript"}>
                                        javascript
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div style={{ width: "95%" }}>
                        <div style={{ width: "45%", display: "inline-block" }}>
                            {/* this is the code editor from */}

                            <Slate editor={editor} value={initialValue}>
                                <Editable
                                    decorate={decorate}
                                    renderLeaf={renderLeaf}
                                    onChange={(e) =>
                                        setCodeInput(e.target.value)
                                    }
                                    style={{ border: "1px solid gray" }}
                                />
                            </Slate>
                        </div>
                        <div
                            style={{ width: "10%", display: "inline-block" }}
                        ></div>
                        {/* </Box> */}
                        {/* <Box component="form" style={{ padding: "10px" }}> */}
                        <div style={{ width: "45%", display: "inline-block" }}>
                            <TextareaAutosize
                                value={codeOutput}
                                placeholder={
                                    defaultOutputMessage
                                        ? "This is where your code will be output"
                                        : "No conversion was performed"
                                }
                                style={{
                                    width: "100%",
                                    lineHeight: "1.6",
                                }}
                                disabled
                                minRows={4}
                            />
                        </div>
                    </div>
                    <br />
                    {/* the following is only displayed upon translation execution */}
                    <div style={{ width: "95%" }}>
                        <div style={{ display: "inline-block" }}>
                            <LoadingButton
                                onClick={() =>
                                    // this gets only the codeInput's actual text value,
                                    // which is all I care about for now
                                    translate(
                                        codeInput,
                                        languageFrom,
                                        languageTo
                                    )
                                }
                                style={styles.button}
                            >
                                Translate!
                            </LoadingButton>
                        </div>
                        <div
                            style={{ display: "inline-block", float: "right" }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleCopyClick}
                                style={{ marginRight: "15px" }}
                            >
                                {isCopied ? "Copied!" : "Copy to Clipboard"}
                            </Button>

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
                        </div>
                    </div>
                    {/* </Box> */}

                    <div style={{ height: "200px" }}></div>
                    <h2>Most recent complaint:</h2>

                    {complaintsState}
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
                    {/* <Button onClick={() => getAllUsers()} style={styles.button}>
                        Load Users in Console
                    </Button> */}
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
    let res = await fetch(process.env.API_PREFIX+"/api/handler", {
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
