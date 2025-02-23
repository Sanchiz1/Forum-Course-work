import { Box, Chip, Container, CssBaseline, Paper, Skeleton } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { requestSearchedPosts } from '../API/postRequests';
import { requestSearchedUsers } from '../API/userRequests';
import { setGlobalError } from '../Redux/Reducers/AccountReducer';
import { Post } from '../Types/Post';
import { User } from '../Types/User';
import PostElement from './Posts/PostElement';
import UserElement from './User/UserElement';

export default function Search() {
    const { search } = useParams();
    const next = 4;
    const [searchTitle, setSearchTitle] = useState("Posts");
    const [userTimestamp, setUserTimestamp] = useState(new Date());
    const [offset, setOffset] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const dispatch = useDispatch();
    const navigator = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        setHasMore(true);
        setPosts([]);
        setUsers([]);
        setOffset(0);
        setUserTimestamp(new Date());
        if (searchTitle === "Posts") {
            fetchposts();
        }
        else {
            fetchusers()
        }
    }, [searchTitle, search]);

    const fetchposts = () => {
        requestSearchedPosts(offset, next, userTimestamp, search!).subscribe({
            next(value) {
                if (value.length == 0) {
                    setHasMore(false);
                    return;
                }
                setPosts([...posts, ...value])
                if (document.documentElement.offsetHeight - window.innerHeight < 100) {
                    setOffset(offset + next);
                }
            },
            error(err) {
                setHasMore(false);
                dispatch(setGlobalError(err.message));
            },
        })
    }

    const fetchusers = () => {
        requestSearchedUsers(offset, next, userTimestamp, search!).subscribe({
            next(value) {
                if (value.length == 0) {
                    setHasMore(false);
                    return;
                }
                setUsers([...users, ...value])
                if (document.documentElement.offsetHeight - window.innerHeight < 100) {
                    setOffset(offset + next);
                }
            },
            error(err) {
                setHasMore(false);
                dispatch(setGlobalError(err.message));
            },
        })
    }

    useEffect(() => {
        if (searchTitle === "Posts") {
            fetchposts();
        }
        else {
            fetchusers()
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset]);

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.scrollHeight - 10 || !hasMore) return;
        setOffset(offset + next);
    }


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    minHeight: '100vh',
                    overflow: 'auto',
                    display: 'flex'
                }}
            >
                <Container maxWidth='lg' sx={{
                    mt: 4, mb: 4
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper sx={{
                                p: 1,
                                width: 1,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Chip label="Posts" variant={searchTitle === "Posts" ? "filled" : "outlined"} sx={{ mr: 1 }} onClick={() => setSearchTitle("Posts")} />
                                <Chip label="Users" variant={searchTitle === "Users" ? "filled" : "outlined"} sx={{ mr: 1 }} onClick={() => setSearchTitle("Users")} />
                            </Paper>
                        </Grid>
                        {searchTitle === "Posts" ?
                            <>
                                {
                                    posts?.map((post, index) =>
                                        <PostElement post={post} key={index} customClickEvent={(event: React.MouseEvent<HTMLDivElement>) => navigator('/post/' + post.Id, { state: state })}></PostElement>
                                    )
                                }
                            </>
                            :
                            <>
                                {
                                    users?.map((user, index) =>
                                        <UserElement user={user} key={index} customClickEvent={(event: React.MouseEvent<HTMLDivElement>) => navigator('/user/' + user.Username, { state: state })}></UserElement>
                                    )
                                }
                            </>
                        }
                        <Grid item xs={12} md={12} lg={12}>
                            {
                                hasMore ?
                                    <Paper sx={{
                                        p: 1,
                                        width: 1,
                                        ":hover": {
                                            boxShadow: 5
                                        }
                                    }}>
                                        <Skeleton width="10%" animation="wave" sx={{ fontSize: '10px' }} />
                                        <Skeleton width="30%" animation="wave" />
                                        <Divider />
                                        <Skeleton animation="wave" height={40} />
                                    </Paper>
                                    :
                                    <Paper sx={{
                                        p: 1,
                                        width: 1,
                                        ":hover": {
                                            boxShadow: 5
                                        }
                                    }}>
                                        <Typography>
                                            You scrolled to the end...
                                        </Typography>
                                    </Paper>
                            }
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )


}