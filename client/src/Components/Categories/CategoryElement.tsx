import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Container, CssBaseline, Paper, Link, IconButton, Tooltip, MenuItem, Dialog, DialogTitle, DialogActions, TextField, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { GetLocalDate, timeSince } from '../../Helpers/TimeHelper';
import { Reply, ReplyInput } from '../../Types/Reply';
import { Comment } from '../../Types/Comment';
import { useState } from 'react';
import ButtonWithCheck from '../UtilComponents/ButtonWithCheck';
import ReplyInputElement from '../UtilComponents/ReplyInputElement';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { createReplyRequest, deleteReplyRequest, likeReplyRequest, updateReplyRequest } from '../../API/replyRequests';
import { enqueueSnackbar } from 'notistack';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import IconButtonWithCheck from '../UtilComponents/IconButtonWithCheck';
import { StyledMenu } from '../UtilComponents/StyledMenu';
import { Category } from '../../Types/Category';
import { deleteCategoryRequest, updateCategoryRequest } from '../../API/categoryRequests';

interface Props {
    category: Category;
    refetchCategories: () => void
}

export default function CategoryElement(props: Props) {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const Account = useSelector((state: RootState) => state.account.Account);


    // menu
    const [showButton, setShowButton] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // edit
    const [openEdit, setOpenEdit] = useState(false);
    const [error, setError] = useState<String>('');

    const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = data.get('title')!.toString().trim();
        if (title.trim().length === 0) {
            setError('Category cannot be empty');
            return;
        }

        updateCategoryRequest(title, props.category.id).subscribe({
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
                props.refetchCategories();
            },
            error(err) {
                setGlobalError(err.message);
            },
        })
    }

    // delete
    const [openDelete, setOpenDelete] = useState(false);

    const handleSubmitDelete = () => {
        deleteCategoryRequest(props.category.id).subscribe({
            next(value) {
              enqueueSnackbar(value, {
                variant: 'success', anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center'
                },
                autoHideDuration: 1500
              });
              setOpenDelete(false);
              props.refetchCategories();
            },
            error(err) {
              setError(err.message)
            },
          })
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <div
                onMouseOver={() => setShowButton(true)}
                onMouseOut={() => setShowButton(false)}
            >
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
                        alignItems: 'center'
                    }}>
                        <Grid item xs={11} md={11} lg={11}>
                            <Typography variant="subtitle1" component="p" sx={{ p: 0.5, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
                                {props.category.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={1} lg={1} sx={{ display: 'flex', mb: 'auto' }}>
                            {showButton ? <>
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
                                    <MenuItem onClick={() => { setOpenEdit(true); handleCloseMenu(); }} disableRipple>
                                        <EditIcon />
                                        Edit
                                    </MenuItem>
                                    <MenuItem onClick={() => { setOpenDelete(true); handleCloseMenu(); }} disableRipple>
                                        <DeleteIcon />
                                        Delete
                                    </MenuItem>
                                </StyledMenu>
                            </> : <></>}
                        </Grid>
                    </Grid>
                </Paper>
                <Dialog
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <Box component="form"
                        noValidate sx={{ m: 0 }}
                        onSubmit={handleSubmitEdit}
                    >
                        <DialogTitle id="alert-dialog-title" sx={{pb: 0}}>
                            <TextField
                                variant="standard"
                                placeholder='Add a category'
                                name="title"
                                required
                                fullWidth
                                multiline
                                minRows={1}
                                sx={{ mb: 2 }}
                                defaultValue={props.category.title}
                                error={error != ''}
                                onFocus={() => setError('')}
                                helperText={error}
                            />
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                            <Button type='submit' autoFocus>
                                Edit
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
                <Dialog
                    open={openDelete}
                    onClose={() => setOpenEdit(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-title" sx={{pb: 0}}>
                        {"Are You sure you want to delete this category?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button onClick={() => handleSubmitDelete()} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        </Grid >
    )
}