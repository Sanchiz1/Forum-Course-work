import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Container, CssBaseline, Paper, Link, IconButton, Dialog, DialogTitle, DialogActions, MenuItem, Tooltip, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { StyledMenu } from '../UtilComponents/StyledMenu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { GetLocalDate, timeSince } from '../../Helpers/TimeHelper';
import { Reply, ReplyInput } from '../../Types/Reply';
import { Comment } from '../../Types/Comment';
import { createReplyRequest, requestReplies } from '../../API/replyRequests';
import ButtonWithCheck from '../UtilComponents/ButtonWithCheck';
import { isSigned } from '../../API/loginRequests';
import CommentInputElement from '../UtilComponents/CommentInputElement';
import { enqueueSnackbar } from 'notistack';
import ReplyInputElement from '../UtilComponents/ReplyInputElement';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { RootState } from '../../Redux/store';
import { deleteCommentRequest, likeCommentRequest, requestCommentById, updateCommentRequest } from '../../API/commentRequests';
import IconButtonWithCheck from '../UtilComponents/IconButtonWithCheck';
import { Category } from '../../Types/Category';
import { createCategoryRequest, requestCategories } from '../../API/categoryRequests';
import CategoryElement from './CategoryElement';


export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Account = useSelector((state: RootState) => state.account.Account);

    const next = 4;
    const [fetching, setFetching] = useState(false);
    const [userTimestamp, setUserTimestamp] = useState(new Date());
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const refetchCategories = () => {
        setCategories([]);
        setOffset(0);
    }
    const fetchCategories = () => {
        requestCategories(offset, next).subscribe({
            next(value) {
                if (value.length == 0) {
                    setHasMore(false);
                    return;
                }
                setCategories([...categories, ...value]);
                if (document.documentElement.offsetHeight - window.innerHeight < 100) {
                    setOffset(offset + next);
                }
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        })
    };

    useEffect(() => {
        fetchCategories()
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset])

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.scrollHeight - 10 || !hasMore) return;
        setOffset(offset + next);
    }

    // create
    const [openCreate, setOpenCreate] = useState(false);
    const [error, setError] = useState<String>('');

    const handleSubmitCreate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = data.get('title')!.toString().trim();
        if (title.trim().length === 0) {
            setError('Category cannot be empty');
            return;
        }

        createCategoryRequest(title).subscribe({
            next(value) {
                enqueueSnackbar(value, {
                    variant: 'success', anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 1500
                });
                setError('');
                setOpenCreate(false);
                refetchCategories();
            },
            error(err) {
                setGlobalError(err.message);
            },
        })
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
                                alignItems: 'stretch',
                            }}>
                                <Typography variant="caption" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                                    Categories
                                </Typography>
                                <Button sx={{ ml: 'auto' }} onClick={() => setOpenCreate(true)}>Add category</Button>
                            </Paper>
                        </Grid>
                        {
                            categories?.map(category =>
                                <CategoryElement refetchCategories={refetchCategories} category={category} key={category.id}></CategoryElement>
                            )
                        }
                    </Grid>
                </Container>
                <Dialog
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <Box component="form"
                        noValidate sx={{ m: 0 }}
                        onSubmit={handleSubmitCreate}
                    >
                        <DialogTitle id="alert-dialog-title" sx={{pb: 0}}>
                            <TextField
                                variant="standard"
                                placeholder='Add a category'
                                name="title"
                                required
                                fullWidth
                                multiline
                                inputProps={{ maxLength: 50 }}
                                minRows={1}
                                sx={{ mb: 2 }}
                                error={error != ''}
                                onFocus={() => setError('')}
                                helperText={error}
                            />
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                            <Button type='submit' autoFocus>
                                Create
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
            </Box>
        </Box>
    )
}