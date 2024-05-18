import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import {
    Stack, Container, CssBaseline, IconButton, LinearProgress,
    TextField, Link, MenuItem, Button, Dialog, DialogTitle, DialogActions, Tooltip, Chip
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link as RouterLink } from 'react-router-dom';
import { Post } from '../../Types/Post';
import { addPostCategoryRequest, deletePostRequest, likePostRequest, removePostCategoryRequest, requestPostById, updatePostRequest } from '../../API/postRequests';
import { GetLocalDate, timeSince } from '../../Helpers/TimeHelper';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledMenu } from '../UtilComponents/StyledMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { enqueueSnackbar } from 'notistack';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { User } from '../../Types/User';
import CommentsSection from './CommentsSection';
import IconButtonWithCheck from '../UtilComponents/IconButtonWithCheck';
import CategoriesSelect from '../Categories/CategorySelect';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function PostPage() {

    const [post, setPost] = useState<Post>();
    const [liked, SetLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [postExists, setPostExists] = useState(true);


    let { PostId } = useParams();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const Account: User = useSelector((state: RootState) => state.account.Account);

    const fetchPost = () => {
        requestPostById(parseInt(PostId!)).subscribe({
            next(post) {
                if (post === null) {
                    setPostExists(false);
                    return;
                }
                setPost(post);
                SetLiked(post.liked);
                setLikes(post.likes.valueOf());
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        })
    }
    useEffect(() => {
        fetchPost()
    }, [PostId])


    //menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };


    //edit
    const [openEdit, setOpenEdit] = useState(false);
    const [openCategortyEdit, setOpenCategortyEdit] = useState(false);
    const [error, setError] = useState<String>('');

    const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const text = data.get('text')!.toString().trim();



        updatePostRequest(text, post?.id!).subscribe({
            next(value) {
                enqueueSnackbar(value, {
                    variant: 'success', anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 1500
                });
                setError('');
                setOpenEdit(false);
                fetchPost();
            },
            error(err) {
                setError(err.message)
            },
        })
    }


    // delete
    const [openDelete, setOpenDelete] = useState(false);
    const handleSubmitDelete = () => {
        deletePostRequest(post?.id!).subscribe({
            next(value : any) {
                enqueueSnackbar(value, {
                    variant: 'success', anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 1500
                });
                setError('');
                setOpenDelete(false);
                if (state == null) {
                    navigator('/');
                    return;
                }
                navigator(state);
            },
            error(err: any) {
                setError(err.message)
            },
        })
    }


    // categories
    const handleAddPostCategory = (post_id: number, category_id: number) => {
        addPostCategoryRequest(post_id, category_id).subscribe({
            next(value) {
                // enqueueSnackbar(value, {
                //     variant: 'success', anchorOrigin: {
                //         vertical: 'top',
                //         horizontal: 'center'
                //     },
                //     autoHideDuration: 1500
                // });
                fetchPost();
            },
            error(err) {
                setError(err.message)
            },
        })
    }

    const handleRemovePostCategory = (post_id: number, category_id: number) => {
        removePostCategoryRequest(post_id, category_id).subscribe({
            next(value) {
                // enqueueSnackbar(value, {
                //     variant: 'success', anchorOrigin: {
                //         vertical: 'top',
                //         horizontal: 'center'
                //     },
                //     autoHideDuration: 1500
                // });
                fetchPost();
            },
            error(err) {
                setError(err.message)
            },
        })
    }

    return (
        <>
            {postExists ?
                <>
                    {post ?
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
                                    mt: 4, mb: 4, width: 1
                                }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={12} lg={12}>
                                            <Paper sx={{
                                                p: 1,
                                                width: 1,
                                            }}>
                                                <Grid item sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <Link variant="caption" onClick={(e) => e.stopPropagation()} component={RouterLink} to={'/user/' + post.user_Username} color="primary" sx={{
                                                        mr: 0.5, textDecoration: 'none', cursor: 'pointer', color: 'white',
                                                        ":hover": {
                                                            textDecoration: 'underline'
                                                        }
                                                    }
                                                    } >
                                                        {post.user_Username}
                                                    </Link>
                                                    <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5, fontFamily: 'cursive' }}>
                                                        ·
                                                    </Typography>
                                                    <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5 }}>
                                                        {timeSince(GetLocalDate(new Date(post.date_Created)))}
                                                    </Typography>
                                                    {post.date_Edited ?
                                                        <>
                                                            <Tooltip title={timeSince(GetLocalDate(new Date(post.date_Edited)))} sx={{ m: 0 }} placement="right" arrow>
                                                                <Typography variant="caption" color="text.disabled" component="p">
                                                                    (edited)
                                                                </Typography>
                                                            </Tooltip>
                                                        </>
                                                        :
                                                        <>
                                                        </>}
                                                    {(post.user_Id == Account.id || Account.role === 'Admin' || Account.role === 'Moderator') ? <>
                                                        <IconButton
                                                            aria-label="more"
                                                            id="long-button"
                                                            aria-controls={open ? 'long-menu' : undefined}
                                                            aria-expanded={open ? 'true' : undefined}
                                                            aria-haspopup="true"
                                                            onClick={handleClickMenu}
                                                            sx={{ ml: 'auto', p: 0.5 }}
                                                        >
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <StyledMenu
                                                            id="demo-customized-menu"
                                                            MenuListProps={{
                                                                'aria-labelledby': 'demo-customized-button',
                                                            }}
                                                            anchorEl={anchorEl}
                                                            open={open}
                                                            onClose={handleCloseMenu}
                                                        >
                                                            {post.user_Id == Account.id &&
                                                                <MenuItem onClick={() => { setOpenEdit(true); handleCloseMenu(); }} disableRipple>
                                                                    <EditIcon />
                                                                    Edit
                                                                </MenuItem>
                                                            }
                                                            <MenuItem onClick={() => { setOpenCategortyEdit(true); handleCloseMenu(); }} disableRipple>
                                                                <CategoryIcon />
                                                                Categories
                                                            </MenuItem>
                                                            <MenuItem onClick={() => { setOpenDelete(true); handleCloseMenu(); }} disableRipple>
                                                                <DeleteIcon />
                                                                Delete
                                                            </MenuItem>
                                                        </StyledMenu>
                                                    </> : <></>}
                                                </Grid>
                                                <Typography variant="subtitle1" component="p">
                                                    {post.title}
                                                </Typography>
                                                <Divider sx={{ mb: 1 }} />
                                                {openEdit ?
                                                    <>
                                                        <Box component="form" onSubmit={handleSubmitEdit} noValidate sx={{ mt: 2 }}>
                                                            <TextField
                                                                fullWidth
                                                                id="text"
                                                                label="Text"
                                                                name="text"
                                                                multiline
                                                                defaultValue={post.text}
                                                            />
                                                            <Box sx={{ my: 1, display: 'flex' }}>
                                                                <Button
                                                                    color='secondary'
                                                                    sx={{ ml: 'auto', mr: 1 }}
                                                                    onClick={() => setOpenEdit(false)}
                                                                    variant="outlined"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    type="submit"
                                                                    variant="outlined"
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </>
                                                    :
                                                    <>
                                                        <Typography variant="subtitle1" component="p" sx={{ mt: 2, mb: 2, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
                                                            {post.text}
                                                        </Typography>
                                                    </>
                                                }
                                                {
                                                    openCategortyEdit ?
                                                        <>
                                                            <Grid sx={{
                                                                display: 'flex',
                                                                flexWrap: 'wrap'
                                                            }}>
                                                                {post.categories.map(category =>
                                                                    <Chip label={category.title} key={category.id} sx={{ mb: 1, mr: 1 }} onDelete={() => handleRemovePostCategory(post.id.valueOf(), category.id)} variant="outlined"></Chip>
                                                                )}
                                                                <CategoriesSelect AddCategory={(category_id: number) => handleAddPostCategory(post.id.valueOf(), category_id)} Categries={post.categories}></CategoriesSelect>
                                                            </Grid>

                                                            <Box sx={{ my: 1, display: 'flex' }}>
                                                                <Button
                                                                    color='secondary'
                                                                    sx={{ ml: 'auto', mr: 1 }}
                                                                    onClick={() => setOpenCategortyEdit(false)}
                                                                    variant='outlined'
                                                                >
                                                                    Hide
                                                                </Button>
                                                            </Box>
                                                        </>
                                                        :
                                                        <Grid sx={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap'

                                                        }}>
                                                            {post.categories.map(category =>
                                                                <Chip label={category.title} key={category.id} sx={{ mb: 1, mr: 1 }} variant="outlined"></Chip>
                                                            )}
                                                        </Grid>
                                                }
                                                <Stack
                                                    direction="row"
                                                    divider={<Divider orientation="vertical" flexItem />}
                                                    spacing={1}
                                                >
                                                    <Grid>
                                                        <Typography variant="caption" color="text.disabled" component="p" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                                                            <IconButtonWithCheck sx={{ p: 0.5, color: 'inherit' }} ActionWithCheck={() => {
                                                                setLikes(liked ? likes - 1 : likes + 1); SetLiked(!liked)
                                                                likePostRequest(post.id).subscribe({
                                                                    next(value) {

                                                                    },
                                                                    error(err) {
                                                                        dispatch(setGlobalError(err.message));
                                                                    },
                                                                })
                                                            }}>
                                                                {liked ? <FavoriteIcon></FavoriteIcon> : <FavoriteBorderIcon></FavoriteBorderIcon>}
                                                            </IconButtonWithCheck>
                                                            {likes.toString()}
                                                        </Typography>
                                                    </Grid>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                        <CommentsSection Post={post}></CommentsSection>
                                    </Grid>
                                    <Dialog
                                        open={openDelete}
                                        onClose={() => setOpenDelete(false)}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title" sx={{pb: 0}}>
                                            {"Are You sure you want to delete this post?"}
                                        </DialogTitle>
                                        <DialogActions>
                                            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                                            <Button onClick={() => handleSubmitDelete()} autoFocus>
                                                Delete
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Container>
                            </Box>
                        </Box>
                        :
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    }
                </>
                :
                <>Post not found</>
            }
        </>
    );
}