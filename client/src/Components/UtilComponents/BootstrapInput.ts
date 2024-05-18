import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

export const BootstrapInput = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    fontSize: 'inherit',
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      color: 'inherit',
      borderRadius: 4,
      position: 'relative',
      backgroundColor: 'inherit',
      border: 'none',
      fontSize: 'inherit',
      padding: '0px 26px 0px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
  }));