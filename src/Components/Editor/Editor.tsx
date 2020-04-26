import React, {useEffect, useRef, useState} from 'react';
import { EditorProps } from '../../Interfaces/Editor';
import {Grid, Paper, makeStyles, createStyles, Theme, Typography, TextField, Button} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            height: '50vh'
        },
        properties:{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        form: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        formTitle: {
            textAlign: 'center',
            width: '100%'
        },
        buttonOptions: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& > *': {
                margin: theme.spacing(1)
            }
        }
    })
);

export const Editor: React.FunctionComponent<EditorProps> = ({ image, handleImageChange }) =>{
    const classes = useStyles();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | undefined>(undefined);
    const [context, setContext] = useState<CanvasRenderingContext2D | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        setCanvas(canvas!);
        setContext(canvas!.getContext('2d')!);
    },[]);

    return (
        <Paper>
            <Grid container justify={"space-around"} alignItems={"center"}>
                <Grid className={classes.properties} item xs={12} sm={12} md={6}>
                    <div className={classes.form}>
                        <Typography variant={"h2"} gutterBottom className={classes.formTitle}> Properties</Typography>
                        <TextField
                            value={image.id}
                            id={"id"}
                            label={"ID"}
                            defaultValue={image.id}
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        <TextField
                            id={"name"}
                            label={"Name"}
                            value={image.name}
                            onChange={e => handleImageChange({ ...image, name: e.target.value })}
                            fullWidth
                        />
                        {/*imageEditorProperties*/}
                    </div>
                    <div className={classes.buttonOptions}>
                        <Button variant={"outlined"} color={"secondary"}>Clear</Button>
                        <Button variant={"contained"} color={"primary"}>Save</Button>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <canvas ref={canvasRef} width={"100%"} height={"100%"}/>
                </Grid>
            </Grid>
        </Paper>
    );
}
