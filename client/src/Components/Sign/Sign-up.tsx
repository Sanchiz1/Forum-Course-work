import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserInput } from '../../Types/User';
import { createUserRequest } from '../../API/userRequests';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarProvider, VariantType, enqueueSnackbar, useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';

const validUsernamePattern = /^[a-zA-Z0-9_.]+$/;
const validEmailPattern = /^(?=.{0,64}$)[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const validPasswordPattern = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[a-zA-Z]).{8,21}$/;

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const [usernameError, SetUsernameError] = React.useState('');
    const [emailError, SetEmailError] = React.useState('');
    const [passwordError, SetPasswordError] = React.useState('');
    const [error, setError] = React.useState<String>('');


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username')!.toString().trim();
        const email = data.get('email')!.toString().trim();
        const password = data.get('password')!.toString().trim();

        if (!validUsernamePattern.test(username)) {
            SetUsernameError('Invalid username');
            return;
        }
        if (!validEmailPattern.test(email)) {
            SetEmailError('Invalid email');
            return;
        }
        if (!validPasswordPattern.test(password)) {
            SetPasswordError('Invalid pasword, password must contain from 8 to 20 symbols and 1 digit');
            return;
        }

        const userInput: UserInput = {
            username: username,
            email: email,
            password: password
        }

        createUserRequest(userInput).subscribe({
            next(value) {
                enqueueSnackbar(value, {variant: 'success', anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                  },
                  autoHideDuration: 1500});
                navigator("/Sign-in", { state: state })
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        })
    };




    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoComplete="off"
                                autoFocus
                                error={usernameError != ''}
                                onFocus={() => SetUsernameError('')}
                                helperText={usernameError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="off"
                                error={emailError != ''}
                                onFocus={() => SetEmailError('')}
                                helperText={emailError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="off"
                                error={passwordError != ''}
                                onFocus={() => SetPasswordError('')}
                                helperText={passwordError}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link variant="body2" onClick={() => navigator("/Sign-in", { state: state })} sx={{ cursor: 'pointer' }}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}