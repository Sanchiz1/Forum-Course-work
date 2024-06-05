import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createUserRequest } from '../../API/userRequests';
import { ShowFailure, ShowSuccess } from '../../Helpers/SnackBarHelper';
import { UserInput } from '../../Types/User';

const validUsernamePattern = /^[a-zA-Z0-9_]+$/;
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

const defaultTheme = createTheme();

export default function SignUp() {
    const navigator = useNavigate();
    const { state } = useLocation();
    const [usernameError, SetUsernameError] = React.useState('');
    const [emailError, SetEmailError] = React.useState('');
    const [passwordError, SetPasswordError] = React.useState('');


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
                ShowSuccess(value);
                navigator("/Sign-in", { state: state })
            },
            error(err) {
                ShowFailure(err.message);
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
                                error={usernameError !== ''}
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
                                error={emailError !== ''}
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
                                error={passwordError !== ''}
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
        </Container>
    );
}