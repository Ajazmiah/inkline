import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Styles from './Logo.module.css';
import classNames from 'classnames';

function Logo() {
    return (
        <Box>
            <Typography
                variant="h5"
                noWrap
                component="a"
                sx={{
                    mr: 2,
                    display: { xs: "flex" },
                    flexGrow: 1,
                    margin: { xs: 'auto' },
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "#000",
                    textDecoration: "none",
                }}
            >
                <Link className={classNames(Styles.logo)} to="/">
                    <span>Inkline.com</span>
                </Link>
            </Typography>
        </Box>
    );
}

export default Logo;
