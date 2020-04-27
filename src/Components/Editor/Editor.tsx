import React, {useContext, useEffect, useRef, useState} from 'react';
import { EditorProps } from '../../Types/Editor';
import {
    Grid,
    Paper,
    makeStyles,
    createStyles,
    Theme,
    Typography,
    TextField,
    Button,
    useTheme,
    Input,
    ButtonGroup
} from "@material-ui/core";
import {Image as ImageData} from "../../Types/Image";
import { useParams } from 'react-router-dom';
import { context as ImageContext } from '../../Store';
import {Types} from "../../ImageReducer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
        },
        properties:{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid black',
            height: '80vh',
            margin: theme.spacing(2)
        },
        form: {
            display: 'flex',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(2)
            }
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

interface  rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const Editor: React.FunctionComponent = (props: any) =>{
    const classes = useStyles();
    const initImageData = {
        date: "",
        description: "",
        id: 0,
        imageData: "",
        name: ""
    }
    const { state, dispatch } = useContext(ImageContext);
    const { id } = useParams();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | undefined>(undefined);
    const [context, setContext] = useState<CanvasRenderingContext2D | undefined>(undefined);
    const [paint,setPaint] = useState<boolean>(false);
    const [mode,setMode] = useState<string>("rect");
    const [clickX, setClickX] = useState<number[]>([]);
    const [clickY, setClickY] = useState<number[]>([]);
    const [clickDrag, setClickDrag] = useState<boolean[]>([]);
    const [imageState,setImageState] = useState<ImageData>(initImageData);
    const theme = useTheme();

    const [rects, setRects] = useState<rect[]>([]);
    const [temp,setTemp] = useState<rect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });

    const initRect: rect = {
        x:0,
        y:0,
        width: 0,
        height: 0
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas!.getContext('2d');

        setContext(context!);
        setCanvas(canvas!);
    },[]);

    useEffect(() => {
        if(id === null || id === undefined) {
            //implement local storage latest id retrieval
            if(state.images.length === 0) {
                setImageState(initImageData);
            } else {
                setImageState({
                    ...initImageData,
                    id: state.images[0].id+1
                })
            }
        } else {
            //get the imageState of given id
            const foundImage = state.images.find(image => image.id === +id);
            console.log('here', +id, state.images);
            if(foundImage !== undefined){
                setImageState(foundImage);
                if(context !== null && context !== undefined)
                loadTheImage(foundImage.imageData);
            }
        }
    },[state.images.length,context])

    const handleName = (e: React.ChangeEvent<{ value: unknown }>) => {
        setImageState({ ...imageState, name: e.target.value as string });
    }

    const handleSave = () => {
        if(imageState.name === '') {
            alert('Enter a name please.')
            return;
        }
        const imageData = canvas!.toDataURL('image/png');
        dispatch({
            type: Types.Add,
            payload: {
                image: {
                    ...imageState,
                    imageData: imageData
                }
            }
        });
        const imageString = JSON.stringify(state.images);
        localStorage.setItem('images',imageString);
        props.history.push("/images");
    }

    const redraw = () => {
        let contextChange = context!;
        if(mode === 'free'){
            contextChange.lineCap = "round";
            contextChange.lineWidth = 1;
            contextChange.lineJoin = "round";
            contextChange.strokeStyle = 'black';
            for (let i=0; i<clickX.length; ++i) {
                contextChange.beginPath();
                if(clickDrag[i] && i) {
                    contextChange.moveTo(clickX[i-1], clickY[i-1])
                } else {
                    contextChange.moveTo(clickX[i]-1, clickY[i])
                }
                contextChange.lineTo(clickX[i],clickY[i]);
                contextChange.stroke();
            }
            contextChange.closePath();
        }
        else {
            for(let i=0;i<rects.length;++i) {
                const rect = rects[i];
                contextChange.beginPath();
                contextChange.rect(rect.x, rect.y, rect.width, rect.height);
                contextChange.strokeStyle = 'black';
                contextChange.lineWidth = 10;
                contextChange.stroke();
            }
            if(paint){
                contextChange.beginPath();
                contextChange.rect(temp.x, temp.y, temp.width, temp.height);
                contextChange.strokeStyle = 'black';
                contextChange.lineWidth = 10;
                contextChange.stroke();
            }
        }
    }

    const addClick = (x: number, y: number, dragging: boolean) => {
        setClickX([...clickX, x]);
        setClickY([...clickY, y]);
        setClickDrag([...clickDrag, dragging]);
    }

    const clearCanvas = () => {
        context?.clearRect(0,0,canvas!.width, canvas!.height);
        setClickX([]);
        setClickY([]);
        setClickDrag([]);
        setRects([]);
    }

    const releaseEventHandler = () => {
        setPaint(false);
        setRects([...rects,temp]);
        setTemp(initRect);
        redraw();
    }

    const pressEventHandler = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageX : (e as React.MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageY : (e as React.MouseEvent).pageY;
        mouseX -= canvas!.offsetLeft;
        mouseY -= canvas!.offsetTop;
        setPaint(true);
        if(mode === "free"){
            addClick(mouseX,mouseY,false);
        } else {
            setTemp({
                ...initRect,
                x: mouseX,
                y: mouseY
            });
        }
        redraw();
    }

    const dragEventHandler = ( e:React.MouseEvent<HTMLCanvasElement,MouseEvent> | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageX : (e as React.MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageY : (e as React.MouseEvent).pageY;
        mouseX -= canvas!.offsetLeft;
        mouseY -= canvas!.offsetTop;
        if(paint) {
            if(mode == "free") {
                addClick(mouseX, mouseY, true);
            } else {
                context?.clearRect(temp.x, temp.y, temp.width, temp.height);
                setTemp({
                    ...temp,
                    width: mouseX - temp.x,
                    height: mouseY - temp.y,
                });
            }
            redraw();
        }
        e.preventDefault();
    }

    const readTheFile = (file: Blob) => {
        const reader = new FileReader();
        return new Promise((resolve => {
            reader.onload = (e) => {
                resolve(e.target!.result);
            };
            reader.readAsDataURL(file);
        }))
    }

    const loadTheImage = (image: any) => {
        const img = new Image();
        img.onload = () => {
            clearCanvas();
            context!.drawImage(img, 0, 0);
        }
        img.src = image;
    }

    const load = (e: React.BaseSyntheticEvent) => {
        const file = [...e.target.files].pop();
        readTheFile(file)
            .then((image) => loadTheImage(image))
    }

    return (
        <Paper className={classes.paper}>
            <Grid container justify={"space-around"} alignItems={"center"}>
                <Grid className={classes.properties} item xs={12} sm={5} md={5}>
                    <div className={classes.form}>
                        <Typography variant={"h2"} gutterBottom className={classes.formTitle}> Properties</Typography>
                        <TextField
                            value={imageState.id}
                            id={"id"}
                            label={"ID"}
                            defaultValue={imageState.id}
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
                            value={imageState.name}
                            onChange={ handleName }
                            fullWidth
                            variant={"outlined"}
                        />
                        {/*imageEditorProperties*/}
                        <ButtonGroup variant={"contained"} color={"primary"}>
                            <Button onClick={() => setMode("free")}>Free Style</Button>
                            <Button onClick={() => setMode("rect")}>Rectangle</Button>
                        </ButtonGroup>
                    </div>
                    <div className={classes.buttonOptions}>
                        <Button variant={"outlined"} onClick={() => props.history.push("/images")} color={"secondary"}>
                            Back
                        </Button>
                        <Button variant={"contained"} onClick={handleSave} color={"primary"}>Save</Button>
                    </div>
                </Grid>
                <Grid style={{ height: '75vh'}} item xs={12} sm={12} md={6}>
                    <Grid container justify={"center"}>
                        <Grid item xs={12} style={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: theme.spacing(2)
                        }}>
                            <canvas
                                ref={canvasRef}
                                id={'id'}
                                style={{
                                    border: '1px solid black',
                                    cursor: mode === "free" ? 'pointer' : 'crosshair'
                                }}
                                width={400}
                                height={400}
                                onMouseMove={dragEventHandler}
                                onMouseDown={pressEventHandler}
                                onMouseUp={releaseEventHandler}
                                onMouseOut={() => setPaint(false)}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.buttonOptions}>
                            <Button component={"label"} variant={"contained"} color={"primary"}>
                                Load Image
                                <input onChange={load} type={"file"} style={{ display: 'none' }} accept={"image/png"}/>
                            </Button>
                            <Button variant={"contained"} color={"secondary"} onClick={clearCanvas}>Clear</Button>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </Paper>
    );
}
