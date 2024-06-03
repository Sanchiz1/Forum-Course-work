import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { requestUploadUserAvatar } from '../../API/userRequests';
import { enqueueSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';

export default function UploadAvatar() {
    const dispatch = useDispatch();
    const [file, setFile] = useState<File | null>(null);

    const onFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (file == null) return;
        const formData = new FormData();
        formData.append("file", file);
    
        requestUploadUserAvatar(formData).subscribe({
            next(value) {
                enqueueSnackbar(value, {
                    variant: 'success', anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'center'
                    },
                    autoHideDuration: 1500
                  });
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        });
    };

    return (
        <div>
            <Box component='form' onSubmit={onSubmit}>
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                    >
                        Upload avatar
                        <input
                            type="file"
                            onChange={onFileChange}
                            hidden
                        />
                    </Button>
                    <Button type="submit" fullWidth>Change</Button>
            </Box>
        </div>
    );
};
