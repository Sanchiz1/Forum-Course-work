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
import { LoginRequest } from '../../API/loginRequests';
import { useLocation, useNavigate } from 'react-router-dom';
import { Credentials } from "../../Types/Credentials"
import { useDispatch } from 'react-redux';
import { getUserAccount } from '../../Redux/Epics/AccountEpics';
import { ReturnErrorMessage } from '../../Helpers/ErrorHandleHelper';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';

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

export default function SignIn() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { state } = useLocation();

  const [error, setError] = React.useState<String>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let credentials: Credentials = {
      loginOrEmail: data.get('email')!.toString(),
      password: data.get('password')!.toString()
    }
    if(credentials.loginOrEmail == '' || credentials.password == ''){
      dispatch(setGlobalError('Fill all fields'));
      return;
    }
    LoginRequest(credentials).subscribe({
      next() {
        dispatch(getUserAccount());
        if(state == null){
            navigator('/');
            return;
        }
        navigator(state);
      },
      error(err) {
        dispatch(setGlobalError(err.message));
      },
    });
  };

  return (
    <>
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username or email address"
              name="email"
              autoComplete="off"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="off"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2" onClick={() => navigator("/Sign-up", { state: state })} sx={{cursor:'pointer'}}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </>
  );
}