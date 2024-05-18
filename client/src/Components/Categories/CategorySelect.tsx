import { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box, Button, Container, CssBaseline, Paper, Link, IconButton,
    Dialog, DialogTitle, DialogActions, MenuItem, Tooltip, TextField,
    FormControl, InputLabel, Select, OutlinedInput, Chip, SelectChangeEvent, Menu, List, ListItem, ListItemButton, ListItemText
} from '@mui/material';
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
import { createCategoryRequest, requestAllCategories, requestCategories } from '../../API/categoryRequests';
import CategoryElement from './CategoryElement';
import AddIcon from '@mui/icons-material/Add';

interface Props{
    AddCategory: (category_id: number) => void,
    Categries: Category[]
}

export default function CategoriesSelect(props: Props) {
    const ref = useRef(null)
    const [seacrh, setSearch] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([])
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Account = useSelector((state: RootState) => state.account.Account);


    // menu 
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (category_id: number) => {
        setAnchorEl(null);
        props.AddCategory(category_id);
    }

    const fetchCategories = () => {
        requestAllCategories().subscribe({
            next(value) {
                setCategories(value);
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        })
    };

    useEffect(() => {
        if (!open) {
            setCategories([]);
            return;
        }
        fetchCategories()
    }, [open])

    return (
        <>
            <Chip
                label="Add"
                icon={<AddIcon />}
                variant="outlined"
                sx={{ mb: 1, mr: 1 }}
                onClick={handleClick}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <List sx={{maxHeight: 200, py: 0}}>
                    {categories.map((category) => (
                        <ListItemButton
                            key={category.id}
                            onClick={() => handleSelect(category.id)}
                            disabled={props.Categries.find(c => c.id === category.id) !== undefined}
                            sx={{py: 0}}
                        >
                            {category.title}
                        </ListItemButton>
                    ))}
                </List>
            </Menu>
        </>
    )
}