// // @ts-nocheck

// import type { NextPage } from "next";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";
// import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
// import { useEffect, useState } from "react";

// // ? Material UI is a component library for easier styling and with some custom components
// import Box from "@mui/material/Box";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import { LoadingButton } from "@mui/lab";

// //import { TextField } from "@mui/material";
// import { TextareaAutosize } from "@material-ui/core";

// import Link from "next/link";

// import React, { useCallback, useMemo } from "react";
// import { Slate, Editable, withReact, useSlate } from "slate-react";

// import type { NextPage } from "next";
// import Head from "next/head";

// // ? Material UI is a component library for easier styling and with some custom components
// import { useRouter } from "next/router";
// import isHotkey from "is-hotkey";
// import {
//     Editor,
//     Transforms,
//     createEditor,
//     Descendant,
//     Element as SlateElement,
//     Text,
// } from "slate";
// import { withHistory } from "slate-history";
// import { Button, Icon, Toolbar } from "@mui/material";

// import FormatBoldOutlinedIcon from "@mui/icons-material/FormatBoldOutlined";
// import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
// import FormatUnderlinedOutlinedIcon from "@mui/icons-material/FormatUnderlinedOutlined";
// import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
// import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
// import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
// import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
// import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
// import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
// import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
// import FormatAlignJustifyOutlinedIcon from "@mui/icons-material/FormatAlignJustifyOutlined";

// import Rating from "react-rating-scale";

// import Prism from "prismjs";
// import "prismjs/components/prism-python";
// import "prismjs/components/prism-java";
// import { css } from "@emotion/css";

// import Checkbox from "@material-ui/core/Checkbox";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";

// import clientPromise from "../mongodb";

// const Submitted: NextPage = () => {
//     const router = useRouter();
//     const users = router.query.users;
//     return (
//         <div className="container">
//             <div>
//                 {users.map((user, index) => {
//                     return (
//                         <div className="card" key={index}>
//                             <h2>{user.username}</h2>
//                             <p>{user.password}</p>
//                             <p>{user.dateCreated}</p>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default Submitted;
