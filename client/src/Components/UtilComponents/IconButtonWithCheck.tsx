import { IconButton, ButtonPropsVariantOverrides } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { OverridableStringUnion } from '@mui/types';
import { useDispatch } from "react-redux";
import { isSigned } from "../../API/loginRequests";
import { setLogInError } from "../../Redux/Reducers/AccountReducer";

interface ButtonProps {
    ActionWithCheck: () => void,
    sx?: SxProps<Theme> | undefined,
    children?: string | JSX.Element | JSX.Element[]
}

export default function IconButtonWithCheck(Props: ButtonProps) {
    const dispatch = useDispatch();

    return (
        <IconButton  sx = {Props.sx} onClick={(e) => {
            e.stopPropagation(); 
            if (!isSigned()) {
                dispatch(setLogInError('Not signed in'));
                return;
            }
            Props.ActionWithCheck();
        }}>{Props.children}</IconButton>
    )
}