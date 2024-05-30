import { Grid, Typography } from "@mui/material";

export default function ReplyInputElement(input: string) {
    return (
        <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center">
            <Typography variant="subtitle1" component="p">{input}</Typography>
        </Grid>
    )
}