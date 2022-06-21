// @ts-nocheck

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

import React, { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {
    Editor,
    Transforms,
    createEditor,
    Descendant,
    Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
import { Button, Icon, Toolbar } from "@mui/material";

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
            { text: "This is " },
            { text: "editable ", italic: true },
            { text: "rich", bold: true },
            { text: " text" },
            { text: "!" },
        ],
    },
    {
        type: "paragraph",
        children: [
            {
                text: `Please leave any other comments that you'd like to include,
and feel free to utilize the tools above to `,
            },
            { text: "format", bold: true },
        ],
    },
];

const Complaint: NextPage = () => {
    const router = useRouter();
    const languageFrom = router.query.languageFrom
        ? router.query.languageFrom
        : "javascript";
    const languageTo = router.query.languageTo
        ? router.query.languageTo
        : "Python";

    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

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
                        />
                    </Slate>
                </Box>
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
