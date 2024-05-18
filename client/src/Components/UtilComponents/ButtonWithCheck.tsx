import { Button, ButtonPropsVariantOverrides } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { OverridableStringUnion } from '@mui/types';
import { useDispatch } from "react-redux";
import { isSigned } from "../../API/loginRequests";
import { setLogInError } from "../../Redux/Reducers/AccountReducer";

interface ButtonProps {
    variant: OverridableStringUnion<'text' | 'outlined' | 'contained', ButtonPropsVariantOverrides>,
    ActionWithCheck: () => void,
    sx?: SxProps<Theme> | undefined,
    children?: string | JSX.Element | JSX.Element[]
}

export default function ButtonWithCheck(Props: ButtonProps) {
    const dispatch = useDispatch();

    return (
        <Button variant={Props.variant} sx = {Props.sx} onClick={() => {
            if (!isSigned()) {
                dispatch(setLogInError('Not signed in'));
                return;
            }
            Props.ActionWithCheck();
        }}>{Props.children}</Button>
    )
}