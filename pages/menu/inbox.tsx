// @ts-nocheck

import type { NextPage } from "next";
import Image from "next/image";
import styles from "../../styles/Home.module.css";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from "@mui/material/Toolbar";
import AdbIcon from '@mui/icons-material/Adb';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Link from "next/link";
import MenuItem from "@mui/material/MenuItem";

import InboxIcon from "@mui/icons-material/Inbox";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import React from "react";

function generate(element: React.ReactElement) {
    return [0, 1, 2, 3, 4, 5, 6, 7,8,9,10].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
};

const handleCloseUserMenu = () => {
    setAnchorElUser(null);
};

const Inbox: NextPage = (users) => {

    return (
        <>
            <main className={styles.main}>
                <div align="right">
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
                                                            // auth.currentUser
                                                            //     .displayName
                                                        }
                                                    </Typography>
                                                    <Avatar
                                                        alt="Google Photo/Initial"
                                                        // src={
                                                        //     auth.currentUser
                                                        //         .photoURL
                                                        // }
                                                    />
                                                </Button>
                                            </Tooltip>
                                            <Menu
                                                sx={{ mt: "0" }}
                                                id="menu-appbar"
                                                //anchorEl={anchorElUser}
                                                anchorOrigin={{
                                                    vertical: "bottom",
                                                    horizontal: "right",
                                                }}
                                                keepMounted
                                                transformOrigin={{
                                                    vertical: "top",
                                                    horizontal: "right",
                                                }}
                                                //open={Boolean(anchorElUser)}
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
                                        {(
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

                </div>
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