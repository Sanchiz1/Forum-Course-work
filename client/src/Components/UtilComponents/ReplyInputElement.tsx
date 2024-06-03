import { Box, Button, TextField } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useState } from 'react';

interface ReplyInputProps {
    Action: (e: string) => void,
    sx?: SxProps<Theme> | undefined,
    Reply?: string,
    setState: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ReplyInputElement(Props: ReplyInputProps) {
    const [comment, setComment] = useState(Props.Reply);

    const handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(comment == null || comment?.trim() == '') return;
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
                inputProps={{ maxLength: 5000 }}
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