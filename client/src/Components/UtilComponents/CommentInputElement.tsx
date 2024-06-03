import { useState } from 'react';
import { Button, Box, TextField } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { OverridableStringUnion } from '@mui/types';
import { useDispatch } from "react-redux";
import { isSigned } from "../../API/loginRequests";
import { setLogInError } from "../../Redux/Reducers/AccountReducer";

interface CommentInputProps {
    Action: (e : string) => void,
    sx?: SxProps<Theme> | undefined,
    Comment?: string,
    CancelAction?: () => void
}

export default function CommentInputElement(Props: CommentInputProps) {
    const dispatch = useDispatch();
    const [comment, setComment] = useState(Props.Comment);
    const [focuse, setFocuse] = useState(false);


    const handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(comment == null || comment?.trim() == '') return;
        Props.Action(comment!.toString())
        setComment('');
        setFocuse(false);
    }
    return (
        <Box component="form"
            noValidate sx={{ m: 0 }}
            onSubmit={handlesubmit}
        >
            <TextField
                variant="standard"
                placeholder='Add a comment'
                name="comment"
                required
                fullWidth
                inputProps={{ maxLength: 5000 }}
                multiline
                minRows={1}
                sx={{ mb: 2 }}
                onFocus={(e) => {
                    if (!isSigned()) {
                        e.currentTarget?.blur();
                        dispatch(setLogInError('Not signed in'));
                    }
                    else {
                        setFocuse(true);
                    }
                }
                }

                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            {focuse ?
                <Box sx={{ display: 'flex' }}>
                    <Button
                        color='secondary'
                        sx={{ ml: 'auto', mr: 1 }}
                        variant="text"
                        onClick={() => { setFocuse(false); setComment(''); if(Props.CancelAction) Props.CancelAction!()}}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="text"
                    >
                        Submit
                    </Button>
                </Box>
                :
                <></>}
        </Box>
    )
}