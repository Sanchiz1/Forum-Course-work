import AddIcon from '@mui/icons-material/Add';
import { Chip, List, ListItemButton, Menu } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestAllCategories } from '../../API/categoryRequests';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { RootState } from '../../Redux/store';
import { Category } from '../../Types/Category';

interface Props{
    AddCategory: (category_id: number) => void,
    Categries: Category[]
}

export default function CategoriesSelect(props: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const dispatch = useDispatch();


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
                            key={category.Id}
                            onClick={() => handleSelect(category.Id)}
                            disabled={props.Categries.find(c => c.Id === category.Id) !== undefined}
                            sx={{py: 0}}
                        >
                            {category.Title}
                        </ListItemButton>
                    ))}
                </List>
            </Menu>
        </>
    )
}