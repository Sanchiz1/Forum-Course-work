import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Checkbox, Chip, List, ListItemButton, Menu } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { requestAllCategories } from '../../API/categoryRequests';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { Category } from '../../Types/Category';

interface Props {
    Categories: number[]
    SetCategories: React.Dispatch<React.SetStateAction<number[]>>
}

export default function CategoriesFilter(props: Props) {
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
        if(props.Categories.find(c => c === category_id) !== undefined){
            props.SetCategories([...props.Categories.filter(c => c !== category_id)]);
        }
        else{
            props.SetCategories([...props.Categories, category_id]);
        }
    }

    useEffect(() => {
        if (!open) {
            setCategories([]);
            return;
        }
        requestAllCategories().subscribe({
            next(value) {
                setCategories(value);
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        });
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
                            key={category.Id}
                            onClick={() => handleSelect(category.Id)}
                            sx={{py: 0}}
                        >
                            <Checkbox
                                edge="start"
                                checked={props.Categories.find(c => c === category.Id) !== undefined}
                                tabIndex={-1}
                                disableRipple
                            />
                            {category.Title}
                        </ListItemButton>
                    ))}
                </List>
            </Menu>
        </>
    )
}