import { Box, Container, Typography } from "@mui/material";

type Props = {
    input: string
}

export default function NotFoundPage(props: Props) {
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
            <Container sx={{ height: 1, display: "flex", justifyContent: "center", py: '100px' }}>
                <Typography variant="h4" gutterBottom>
                    {props.input}
                </Typography>
            </Container>
        </Box>
    )
}