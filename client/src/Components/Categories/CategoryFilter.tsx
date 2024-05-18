import { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box, Button, Container, CssBaseline, Paper, Link, IconButton,
    Dialog, DialogTitle, DialogActions, MenuItem, Tooltip, TextField,
    FormControl, InputLabel, Select, OutlinedInput, Chip, SelectChangeEvent, Menu, List, ListItem, ListItemButton, ListItemText, Checkbox
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
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface Props {
    Categories: number[]
    SetCategories: React.Dispatch<React.SetStateAction<number[]>>
}

export default function CategoriesFilter(props: Props) {
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
        if(props.Categories.find(c => c === category_id) !== undefined){
            props.SetCategories([...props.Categories.filter(c => c !== category_id)]);
        }
        else{
            props.SetCategories([...props.Categories, category_id]);
        }
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
                label="Categories"
                icon={<FilterAltIcon />}
                variant="outlined"
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
                <List sx={{ maxHeight: 200, py: 0 }}>
                    {categories.map((category) => (
                        <ListItemButton
                            key={category.id}
                            onClick={() => handleSelect(category.id)}
                            sx={{py: 0}}
                        >
                            <Checkbox
                                edge="start"
                                checked={props.Categories.find(c => c === category.id) !== undefined}
                                tabIndex={-1}
                                disableRipple
                            />
                            {category.title}
                        </ListItemButton>
                    ))}
                </List>
            </Menu>
        </>
    )
}