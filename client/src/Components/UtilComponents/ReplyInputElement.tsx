import { useState } from 'react';
import { Button, Box, TextField } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { OverridableStringUnion } from '@mui/types';
import { useDispatch } from "react-redux";
import { isSigned } from "../../API/loginRequests";
import { setLogInError } from "../../Redux/Reducers/AccountReducer";

interface ReplyInputProps {
    Action: (e: string) => void,
    sx?: SxProps<Theme> | undefined,
    Reply?: string,
    setState: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ReplyInputElement(Props: ReplyInputProps) {
    const dispatch = useDispatch();
    const [comment, setComment] = useState(Props.Reply);

    const handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        Props.Action(comment!.toString())
        setComment('');
        Props.setState(false);
    }

    return (
        <Box component="form"
            noValidate sx={{ m: 0 }}
            onSubmit={handlesubmit}
        >
            <TextField
                variant="standard"
                placeholder='Add a reply'
                name="reply"
                required
                fullWidth
                inputProps={{ maxLength: 1000 }}
                multiline
                minRows={1}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 1, fontSize: '16px' }}
            />
            <Box sx={{ display: 'flex' }}>
                <Button
                    color='secondary'
                    sx={{ ml: 'auto', mr: 1, fontSize: '12px important!' }}
                    variant="text"
                    onClick={() => {
                        setComment('');
                        Props.setState(false);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="text"
                    sx={{ fontSize: '12px important!' }}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    )
}