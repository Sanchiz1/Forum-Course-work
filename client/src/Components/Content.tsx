import { createBrowserRouter, RouterProvider, Outlet, redirect, useLocation, useNavigate } from 'react-router-dom';
import SignIn from './Sign/Sign-in';
import Main from './Main';
import Header from './Navbar';
import UserPage from './User/UserPage';
import SignUp from './Sign/Sign-up';
import { isSigned } from '../API/loginRequests';
import CreatePost from './Posts/CreatePost';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalError, setLogInError, setPermissionError } from '../Redux/Reducers/AccountReducer';
import PostPage from './Posts/PostPage';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RootState } from '../Redux/store';
import AdminPage from './Admin/AdminPage';
import { requestAccount } from '../API/userRequests';
import CategoriesPage from './Categories/CategoriesPage';
import Search from './Search';
import Settings from './User/Settings';

const router = (SignInErrorAction: () => void, PermissionErrorAction: () => void) => createBrowserRouter([
    {
        element: <Header />,
        children: [
            {
                path: "/",
                element: <Main />
            },
            {
                path: "/Search/:search",
                element: <Search />
            },
            {
                path: "/user/:Username",
                element: <UserPage />
            },
            {
                path: "/settings",
                element: <Settings />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/post/:PostId",
                element: <PostPage />
            },
            {
                path: "/createPost",
                element: <CreatePost />,
                loader: async () => CheckSigned(SignInErrorAction),
            },
            {
                path: "/AdminPanel",
                element: <AdminPage />,
                loader: async () => CheckRole(SignInErrorAction, PermissionErrorAction),
            },
            {
                path: "/Categories",
                element: <CategoriesPage />,
                loader: async () => CheckRole(SignInErrorAction, PermissionErrorAction),
            }
        ]
    },
    {
        path: "/Sign-in",
        element: <SignIn />,
    },
    {
        path: "/Sign-up",
        element: <SignUp />,
    }
])


export default function AppContent() {
    const dispatch = useDispatch();
    const globalError = useSelector((state: RootState) => state.account.GlobalError);

    const setErrorSignIn = () => {
        dispatch(setLogInError('Not signed in'));
    }

    const setErrorPermission = () => {
        dispatch(setPermissionError('Don`t have permissions for this page'));
    }

    return (
        <>
            <Collapse in={globalError != ''}>
                <Alert
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            onClick={() => {
                                dispatch(setGlobalError(''));
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                    sx={{ fontSize: 15 }}
                >
                    {globalError}
                </Alert>
            </Collapse>
            <RouterProvider router={router(setErrorSignIn, setErrorPermission)} />
        </>
    );
}



function CheckSigned(Action: () => void) {
    if (!isSigned()) {
        Action();
        return redirect("/")
    };
    return null;
}

async function CheckRole(SignInErrorAction: () => void, PermissionErrorAction: () => void) {
    if (!isSigned()) {
        SignInErrorAction();
        return redirect("/")
    };
    try {
        const result = await requestAccount().toPromise();
        if (result!.role !== "Admin") {
            PermissionErrorAction();
            return redirect("/");
        };
    } catch (error) {
        PermissionErrorAction();
    }
    return null;
}
