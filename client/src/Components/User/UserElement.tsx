import { Avatar, Link, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from "@mui/material/styles";
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
                    pl: 0.5
                }}>
                    <Grid><Avatar
                        component={RouterLink} to={'/user/' + props.user.Username}
                        src={'http://localhost:8000/avatars/' + props.user.Id + ".png"}
                        sx={{
                            bgcolor: '#212121',
                            color: '#757575',
                            textDecoration: 'none',
                            border: '2px solid #424242',
                            mr: 1
                        }}
                    >{props.user.Username[0].toUpperCase()}</Avatar></Grid>
                    <Grid>
                        <Grid sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            pl: 0.5
                        }}>
                            <Link variant="caption" onClick={(e) => e.stopPropagation()} component={RouterLink} to={'/user/' + props.user.Username} color="primary" sx={{
                                mr: 0.5, textDecoration: 'none', cursor: 'pointer', color: 'white',
                                ":hover": {
                                    textDecoration: 'underline'
                                }
                            }
                            } >
                                {props.user.Username}
                            </Link>
                            <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5, fontFamily: 'cursive' }}>
                                ·
                            </Typography>
                            <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5 }}>
                                {props.user.Posts} posts
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
                            {props.user.Bio}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}