import { Box, Container, Typography } from "@mui/material";

export default function UserNotFoundPage() {
    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <Container sx={{ height: 1, display: "flex", justifyContent: "center", py: '10px' }}>
                <Typography variant="h3" gutterBottom>
                    User not found
                </Typography>
            </Container>
        </Box>
    )
}