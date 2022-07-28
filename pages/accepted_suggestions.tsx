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
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { styled } from "@mui/material/styles";

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
