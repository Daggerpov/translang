// @ts-nocheck

import type { NextPage } from "next";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

// ? Material UI is a component library for easier styling and with some custom components
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { styled } from '@mui/material/styles';

import Link from "next/link";
import { useRouter } from "next/router";

import React, { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {
    Editor,
    Transforms,
    createEditor,
    Descendant,
    Element as SlateElement,
    Text,
} from "slate";
import { withHistory } from "slate-history";
import { Button, FormControlLabel, Icon, Toolbar } from "@mui/material";

import FormatBoldOutlinedIcon from "@mui/icons-material/FormatBoldOutlined";
import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
import FormatUnderlinedOutlinedIcon from "@mui/icons-material/FormatUnderlinedOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
import FormatAlignJustifyOutlinedIcon from "@mui/icons-material/FormatAlignJustifyOutlined";

import { css } from "@emotion/css";

import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import { MenuProps, useStyles } from "../utils/multiselect";

import { auth } from "../firebase-config";

import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

import Prism from "prismjs";


// for the slate text editor:
const HOTKEYS = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
    "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
    );
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    });
    let newProperties: Partial<SlateElement>;
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        };
    } else {
        newProperties = {
            type: isActive ? "paragraph" : isList ? "list-item" : format,
        };
    }
    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor, format, blockType = "type") => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n[blockType] === format,
        })
    );

    return !!match;
};

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align };
    switch (element.type) {
        case "block-quote":
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            );
        case "bulleted-list":
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            );
        case "heading-one":
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            );
        case "heading-two":
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            );
        case "list-item":
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            );
        case "numbered-list":
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            );
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
    }
};

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
            )}
            onMouseDown={(event) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
        >
            {format === "block-quote" && (
                <FormatQuoteOutlinedIcon></FormatQuoteOutlinedIcon>
            )}
            {format === "numbered-list" && (
                <FormatListNumberedOutlinedIcon></FormatListNumberedOutlinedIcon>
            )}
            {format === "bulleted-list" && (
                <FormatListBulletedOutlinedIcon></FormatListBulletedOutlinedIcon>
            )}
            {format === "left" && (
                <FormatAlignLeftOutlinedIcon></FormatAlignLeftOutlinedIcon>
            )}
            {format === "center" && (
                <FormatAlignCenterOutlinedIcon></FormatAlignCenterOutlinedIcon>
            )}
            {format === "right" && (
                <FormatAlignRightOutlinedIcon></FormatAlignRightOutlinedIcon>
            )}
            {format === "justify" && (
                <FormatAlignJustifyOutlinedIcon></FormatAlignJustifyOutlinedIcon>
            )}
        </Button>
    );
};

const MarkButton = ({ format }) => {
    const editor = useSlate();
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            {format === "bold" && (
                <FormatBoldOutlinedIcon></FormatBoldOutlinedIcon>
            )}
            {format === "italic" && (
                <FormatItalicOutlinedIcon></FormatItalicOutlinedIcon>
            )}
            {format === "underline" && (
                <FormatUnderlinedOutlinedIcon></FormatUnderlinedOutlinedIcon>
            )}
            {format === "code" && <CodeOutlinedIcon></CodeOutlinedIcon>}
        </Button>
    );
};

const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [
            { text: "Please leave " },
            {
                text: "any other comments that you'd like to include ",
                bold: true,
                underline: true,
            },
            { text: "and be sure to utilize the tools above" },
        ],
    },
];

// * the rest of these constants are for the code text editor:

const codeGetLength = (token) => {
    if (typeof token === "string") {
        return token.length;
    } else if (typeof token.content === "string") {
        return token.content.length;
    } else {
        return token.content.reduce((l, t) => l + codeGetLength(t), 0);
    }
};

// different token types, styles found on Prismjs website
const CodeLeaf = ({ attributes, children, leaf }) => {
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

// modifications and additions to prism library

Prism.languages.python = Prism.languages.extend("python", {});
Prism.languages.insertBefore("python", "prolog", {
    comment: { pattern: /##[^\n]*/, alias: "comment" },
});
Prism.languages.javascript = Prism.languages.extend("javascript", {});
Prism.languages.insertBefore("javascript", "prolog", {
    comment: { pattern: /\/\/[^\n]*/, alias: "comment" },
});

const user = auth.currentUser;

const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
        color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
        color: "#ff3d47",
    },
});

const Complaint: NextPage = (users) => {
    // Complaint rows into database
    const [submissionCode, setSubmissionCode] = useState<string>(codeOutput);
    const [additionalNotes, setAdditionalNotes] =
        useState<string>(initialValue);
    const [complaintsState, setComplaintsState] = useState([]);
    const [rating, setRating] = useState<number>(0);
    const [loading, setLoading] = useState(false);


    let submitForm = async (e) => {
        setComplaintsState([...complaintsState, res]);
        setSubmissionCode("");
        setAdditionalNotes(initialValue);

        setLoading(true);
        e.preventDefault();

        let res = await fetch("http://localhost:3000/api/handler", {
            method: "POST",
            body: JSON.stringify({
                username: user,
                // title: title,
                submissionCode: submissionCode,
                additionalNotes: additionalNotes,
                rating: rating,
                time: new Date(),
                isAccepted: false,
            }),
        });
        if (res.ok) {
            res = await res.json();
        }
        
        setLoading(false);
    };

    const router = useRouter();
    const languageFrom = router.query.languageFrom
        ? router.query.languageFrom
        : "javascript";
    const languageTo = router.query.languageTo
        ? router.query.languageTo
        : "python";
    const codeOutput = router.query.codeOutput;
    const numLines = router.query.numLines;

    const codeInitialValue: Descendant[] = [
        {
            type: "paragraph",
            children: [
                {
                    text: codeOutput,
                },
            ],
        },
    ];

    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    const codeRenderLeaf = useCallback((props) => <CodeLeaf {...props} />, []);
    const codeEditor = useMemo(
        () => withHistory(withReact(createEditor())),
        []
    );

    // decorate function depends on the language selected
    const codeDecorate = useCallback(
        ([node, path]) => {
            const ranges = [];
            if (!Text.isText(node)) {
                return ranges;
            }
            const tokens = Prism.tokenize(
                node.text,
                Prism.languages[languageFrom]
            );

            if (submissionCode === "") {
                setSubmissionCode(initialValue[0].children[0].text);
            } else {
                setSubmissionCode(node.text);
            }

            let start = 0;

            for (const token of tokens) {
                const length = codeGetLength(token);
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

    useEffect(() => {
        console.log("this is the current user: " + user);
    });
    // all for the multi-select input:

    const options = Array.from({ length: numLines }, (_, i) => i + 1);

    const [selected, setSelected] = useState([]);
    const isAllSelected =
        options.length > 0 && selected.length === options.length;

    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelected(selected.length === options.length ? [] : options);
            return;
        }
        setSelected(value);
    };

    // const handleRatingChange = (value) => {
    //     setRating(value);
    // };

    // _handleTextFieldChange: function(e) {
    //     this.setState({
    //         textFieldValue: e.target.value
    //     });
    // },

    const classes = useStyles();

    return (
        <>
            <main className={styles.main}>
                {/* <TextField
                    id="standard-basic"
                    label="Title"
                    variant="standard"
                    onChange={setTitle}
                /> */}

                <h2>
                    <Link
                        href={{
                            pathname: "/",
                            query: users,
                        }}
                    >
                        <Button variant="outlined" className="btn">
                            Make another translation
                        </Button>
                    </Link>
                </h2>

                <h1>
                    You translated from: {languageFrom} to: {languageTo} and had{" "}
                    {numLines} lines of code
                </h1>

                <FormControl sx={{ m: 1, minWidth: 140 }}>
                    <InputLabel id="simple-select-autowidth-label">
                        Faulty Lines
                    </InputLabel>
                    <Select
                        labelId="simple-select-autowidth-label"
                        id="simple-select-autowidth"
                        autoWidth
                        label="faulty lines"
                        multiple
                        value={selected}
                        onChange={handleChange}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                    >
                        <MenuItem
                            value="all"
                            classes={{
                                root: isAllSelected ? classes.selectedAll : "",
                            }}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    classes={{
                                        indeterminate:
                                            classes.indeterminateColor,
                                    }}
                                    checked={isAllSelected}
                                    indeterminate={
                                        selected.length > 0 &&
                                        selected.length < options.length
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText
                                classes={{ primary: classes.selectAllText }}
                                primary="Select All"
                            />
                        </MenuItem>
                        {options.map((option) => (
                            <MenuItem key={option} value={option}>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={selected.indexOf(option) > -1}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={option} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box
                    component="form"
                    style={{ padding: "10px", border: "1px solid grey" }}
                >
                    <Slate editor={codeEditor} value={codeInitialValue}>
                        <Editable
                            decorate={codeDecorate}
                            renderLeaf={codeRenderLeaf}
                            onChange={(e) => setSubmissionCode(e.target.value)}
                        />
                    </Slate>
                </Box>

                <br />

                <Box
                    component="form"
                    style={{ padding: "10px", border: "1px solid grey" }}
                >
                    <Slate editor={editor} value={initialValue}>
                        <Toolbar>
                            <MarkButton format="bold" />
                            <MarkButton format="italic" />
                            <MarkButton format="underline" />
                            <MarkButton format="code" />
                            <BlockButton format="block-quote" />
                            <BlockButton format="numbered-list" />
                            <BlockButton format="bulleted-list" />
                            <BlockButton format="left" />
                            <BlockButton format="center" />
                            <BlockButton format="right" />
                            <BlockButton format="justify" />
                        </Toolbar>
                        <Editable
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            placeholder="Enter some rich text…"
                            spellCheck
                            autoFocus
                            onKeyDown={(event) => {
                                for (const hotkey in HOTKEYS) {
                                    if (isHotkey(hotkey, event as any)) {
                                        event.preventDefault();
                                        const mark = HOTKEYS[hotkey];
                                        toggleMark(editor, mark);
                                    }
                                }
                            }}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                        />
                    </Slate>
                </Box>

                <div align="center">
                    <Typography component="legend">
                        Rate the urgency of this complaint:
                    </Typography>
                    {
                        <StyledRating
                            name="customized-color"
                            defaultValue={2}
                            value={rating}
                            getLabelText={(value: number) =>
                                `${value} Heart${value !== 1 ? "s" : ""}`
                            }
                            precision={1}
                            icon={<PriorityHighIcon fontSize="inherit" />}
                            emptyIcon={<PriorityHighIcon fontSize="inherit" />}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                    }
                </div>
                <form onSubmit={submitForm}>
                    <Button
                        variant="outlined"
                        type="submit"
                        className="btn"
                        disabled={loading ? true : false}
                    >
                        {loading ? "Submitted" : "Submit for validation"}
                    </Button>
                </form>

                {/* <div>
                    {complaintsState.map((complaint, index) => {
                        return (
                            <div className="card" key={index}>
                                <p>
                                    {loading ? complaint.submissionCode : ""}
                                </p>
                                <p>
                                    {loading ? complaint.additionalNotes : ""}
                                </p>
                            </div>
                        );
                    })}
                </div> */}

                {/* <div className="add-form">
                            <form onSubmit={submitForm}>
                                <textarea
                                    type="text"
                                    name="content"
                                    rows="10"
                                    placeholder="Content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={loading ? true : false}
                                >
                                    {loading ? "Adding" : "Add"}
                                </button>
                            </form>
                        </div> */}
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
