import React from 'react';
import {Paper, createStyles, makeStyles, Theme, Grid, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            textAlign: 'center'
        }
    })
)

export const Home: React.FunctionComponent = () => {
    const classes = useStyles();
    return (
        <Paper className={classes.paper}>
            <Grid container justify={"center"} alignItems={"center"}>
                <Grid item sm={12}>
                    <Typography variant={"h1"} gutterBottom>
                        DASHBOARD
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}
