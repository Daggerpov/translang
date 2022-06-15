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

const Home: NextPage = () => {
    const [translationPerformed, setTranslationPerformed] = useState<boolean>(false);

    const [codeInput, setCodeInput] = useState<any>(null);
    const [codeOutput, setCodeOutput] = useState<any>(null);
    const [languageFrom, setLanguageFrom] = useState<any>(null);
    const [languageTo, setLanguageTo] = useState<any>(null);

    const handleChange1 = (event: SelectChangeEvent) => {
        setLanguageFrom(event.target.value as string);
    };

    const handleChange2 = (event: SelectChangeEvent) => {
        setLanguageTo(event.target.value as string);
    };

    const [defaultOutputMessage, setDefaultOutputMessage] = useState<boolean>(true);

    const translate = (
        codeInput: string,
        languageFrom: string,
        languageTo: string
    ) => {
        let codeOutput: string = codeInput;
        let codeOutputLines: Array<any>;

        codeOutputLines = codeOutput.split(/[\r\n]+/); // RegEx for splitting by line

        // this is a dictionary to keep track of the lines that have been adjusted
        const linesChecked: { [lineNumber: number]: string } = {};

        for (let i: number = 0; i < codeOutputLines.length; i++) {
            linesChecked[i] = "unmodified";
        }

        if (languageTo === "Java" || languageTo === "JavaScript") {
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

        if (languageFrom === "Python") {
            // ? could alternatively use RegEx (Regular Expressions) instead of the first
            // ? argument being a string, but I don't believe I'll need this
            codeOutput = codeOutput.replaceAll(
                "print",
                // * what it's replaced with depends on whether it's to JS or Java
                languageTo === "Java" ? "System.out.println" : "console.log"
            );
        }

        console.log(linesChecked);

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

    return (
        <div className={styles.container}>
            <Head>
                <title>translang</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    translang - the programming language converter
                </h1>
                <Box component="form" style={{ padding: "10px" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Language From
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={languageFrom}
                            label="Age"
                            onChange={handleChange1}
                        >
                            <MenuItem value={"Python"}>Python</MenuItem>
                            <MenuItem value={"Java"}>Java</MenuItem>
                            <MenuItem value={"JavaScript"}>JavaScript</MenuItem>
                            {/* <MenuItem value={"C++"}>C++</MenuItem> */}
                        </Select>
                    </FormControl>

                    <div className="multiline">
                        <TextBoxComponent
                            multiline={true}
                            placeholder="Paste code here (Cmd/Ctrl + V) or enter it manually"
                            onChange={setCodeInput}
                        />
                    </div>
                </Box>
                <Box component="form" style={{ padding: "10px" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Language To
                        </InputLabel>
                        <Select
                            id="outlined-multiline-flexible"
                            value={languageTo}
                            label="Age"
                            onChange={handleChange2}
                        >
                            <MenuItem value={"Python"}>Python</MenuItem>
                            <MenuItem value={"Java"}>Java</MenuItem>
                            <MenuItem value={"JavaScript"}>JavaScript</MenuItem>
                            {/* <MenuItem value={"C++"}>C++</MenuItem> */}
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
                        <input
                            type="button"
                            onClick={handleCopyClick}
                            value={isCopied ? "Copied!" : "Copy to Clipboard"}
                        />
                    )}
                </Box>

                <LoadingButton
                    onClick={() =>
                        // this gets only the codeInput's actual text value,
                        // which is all I care about for now
                        translate(codeInput.value, languageFrom, languageTo)
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
    );
};

export default Home;
