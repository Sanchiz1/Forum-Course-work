import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import UsersDataTable from './UsersDataTable';

export default function UsersAdminPage() {
    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                minHeight: '100vh',
                overflow: 'auto',
                display: 'flex'
            }}
        >
            <Container maxWidth='lg' sx={{
                mt: 4, mb: 4, width: 1
            }}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <UsersDataTable></UsersDataTable>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}