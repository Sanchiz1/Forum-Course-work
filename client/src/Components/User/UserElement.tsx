import React, { useState } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from "@mui/material/styles";
import Divider from '@mui/material/Divider';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Paper, Link, Stack, IconButton, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../../Types/Post';
import { GetLocalDate, timeSince } from '../../Helpers/TimeHelper';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import IconButtonWithCheck from '../UtilComponents/IconButtonWithCheck';
import { likePostRequest } from '../../API/postRequests';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { User } from '../../Types/User';

interface Props {
    user: User;
    customClickEvent: React.MouseEventHandler<HTMLDivElement>
    sx?: SxProps<Theme> | undefined,
}

export default function UserElement(props: Props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <Grid item xs={12} md={12} lg={12} onClick={props.customClickEvent} sx={props.sx}>
            <Paper sx={{
                p: 1,
                width: 1,
                ":hover": {
                    boxShadow: 5
                }
            }}>
                <Grid sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    pl: 0.5
                }}>
                    <Link variant="caption" onClick={(e) => e.stopPropagation()} component={RouterLink} to={'/user/' + props.user.username} color="primary" sx={{
                        mr: 0.5, textDecoration: 'none', cursor: 'pointer', color: 'white',
                        ":hover": {
                            textDecoration: 'underline'
                        }
                    }
                    } >
                        {props.user.username}
                    </Link>
                    <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5, fontFamily: 'cursive' }}>
                        ·
                    </Typography>
                    <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5 }}>
                        {props.user.posts} posts
                    </Typography>
                </Grid>
                <Typography variant="subtitle1" component="p" sx={{
                    maxHeight: '150px', overflow: 'hidden',
                    whiteSpace: 'pre-line',
                    textOverflow: 'ellipsis',
                    content: 'none',
                    position: 'relative',
                    "&::before": {
                        content: 'no-close-quote',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        background: 'linear-gradient(transparent 70px, #1E1E1E)'
                    }
                }}>
                    {props.user.bio}
                </Typography>
            </Paper>
        </Grid>
    )
}