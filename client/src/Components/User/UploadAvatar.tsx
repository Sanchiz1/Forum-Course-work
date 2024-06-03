import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { requestDeleteUserAvatar, requestUploadUserAvatar } from '../../API/userRequests';
import { enqueueSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';

export default function UploadAvatar() {
    const dispatch = useDispatch();

    const onFileChange = (e: any) => {
        let file = e.target.files[0];

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

    
    const DeleteAvatar = () => {
        requestDeleteUserAvatar().subscribe({
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
            <Box>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{mb: 1}}
                    >
                        Upload avatar
                        <input
                            type="file"
                            onChange={onFileChange}
                            hidden
                        />
                    </Button>
                    <Button
                        variant="outlined"
                        component="label"
                        color='error'
                        fullWidth
                        onClick={DeleteAvatar}
                    >
                        Delete avatar
                    </Button>
            </Box>
        </div>
    );
};
