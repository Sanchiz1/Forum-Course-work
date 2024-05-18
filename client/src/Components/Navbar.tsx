import React, { useEffect, useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import { Outlet, useLocation, useNavigate, Link as RouterLink, ScrollRestoration } from 'react-router-dom';
import { LogoutRequest, isSigned } from '../API/loginRequests';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppBar, FormControl } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { Backdrop, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { getAccount, setLogInError, setPermissionError } from '../Redux/Reducers/AccountReducer';
import Card from '@mui/material/Card';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import { getUserAccount } from '../Redux/Epics/AccountEpics';
import { setCookie } from '../Helpers/CookieHelper';
import { User } from '../Types/User';
import SearchIcon from '@mui/icons-material/Search';

export default function Header() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const location = useLocation();
  const User = useSelector((state: RootState) => state.account.Account);
  const error = useSelector((state: RootState) => state.account.LogInError);
  const permissionerror = useSelector((state: RootState) => state.account.PermissionError);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);


  const [search, setSearch] = useState<string>('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (search.trim() === '') return;
    navigator("/search/" + search.trim());
  }


  useEffect(() => {
    setCookie({ name: "refresh_sent", value: "false" })
    if (isSigned()) {
      dispatch(getUserAccount())
    }
  }, [])

  //Sign in error
  const handleErrorClose = () => {
    dispatch(setLogInError(''))
    dispatch(setPermissionError(''))
  };
  //Sign in error


  //Account menu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={error == "Not signed in"}
        onClick={handleErrorClose}
      >
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 30, textAlign: 'center' }} gutterBottom>
              Sign in
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigator("/Sign-in", { state: location })}
            >
              Sign In
            </Button>
            <Link onClick={() => navigator("/Sign-up", { state: location })} sx={{ cursor: 'pointer' }} variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </CardContent>
        </Card>
      </Backdrop>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={error == "Invalid token"}
        onClick={handleErrorClose}
      >
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 30, textAlign: 'center' }} gutterBottom>
              Invalid token,
            </Typography>
            <Typography variant="subtitle2" align="center" color="text.secondary" component="p" gutterBottom>
              Provided token is invalid, please sign in again
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigator("/Sign-in", { state: location })}
            >
              Sign In
            </Button>
            <Link href="#" variant="body2" onClick={() => navigator("/Sign-up", { state: location })}>
              {"Don't have an account? Sign Up"}
            </Link>
          </CardContent>
        </Card>
      </Backdrop>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={permissionerror !== ''}
        onClick={handleErrorClose}
      >
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 30, textAlign: 'center' }} gutterBottom>
              Permission Error
            </Typography>
            <Typography variant="subtitle2" align="center" color="text.secondary" component="p" gutterBottom>
              You don`t have permissions for this page
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigator("/")}
            >Go back
            </Button>
          </CardContent>
        </Card>
      </Backdrop>
      <AppBar position='sticky'>
        <Toolbar>
          <Link component={RouterLink} variant="h5" to={'/'}
            sx={{ mr: 'auto', textDecoration: 'none', color: 'text.secondary' }}>
            Forum
          </Link>
          <Box component="form" sx={{ mr: 'auto', textDecoration: 'none', color: 'text.secondary' }} onSubmit={(e) => handleSearch(e)}>
            <TextField
              size="small"
              variant="outlined"
              value={search}
              autoComplete='off'
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            {isSigned() ?
              <Link variant="subtitle1" align="center" color="text.primary" component="span" onClick={handleClick} sx={{ textDecoration: 'none', ":hover": { cursor: 'pointer' } }}>
                {User.username}
              </Link>
              :
              <Button variant="text" onClick={() => navigator("/Sign-in", { state: location })}>Sign in</Button>
            }

          </Box>
          <Menu
            disableAutoFocusItem
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { navigator('/user/' + User.username); handleClose(); }}>
              <Avatar /> My account
            </MenuItem>
            <Divider />
            {User?.role === "Admin" &&
              <MenuItem onClick={() => { navigator('/AdminPanel'); handleClose(); }} hidden={!(User?.role === "Admin")}>
                <ListItemIcon>
                  <SupervisorAccountIcon fontSize="small" />
                </ListItemIcon>
                Admin panel
              </MenuItem>}
            <MenuItem onClick={() => { navigator('/Settings'); handleClose(); }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={() => { LogoutRequest().subscribe(() => { dispatch(getAccount({} as User)); navigator(location) }); handleClose() }}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Outlet />
      <ScrollRestoration />
    </React.Fragment>
  );
}