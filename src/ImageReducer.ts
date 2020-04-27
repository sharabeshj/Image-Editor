import {InitialState} from "./Types/InitialState";
import {Image} from "./Types/Image";

type ActionMap<M extends { [index: string]: any }> = {
    [key in keyof M]: M[key] extends undefined
        ? {
            type: key
        } : {
            type: key,
            payload: M[key]
        }
}

export enum Types {
    Load = 'LOAD_IMAGES',
    Add = 'ADD_IMAGE'
}

type ImagePayload = {
    [Types.Load]: {
        images: Image[];
    },
    [Types.Add]: {
        image: Image
    }
}

export type ImageActions = ActionMap<ImagePayload>[keyof ActionMap<ImagePayload>];

const pushToImages = (arr: Image[],img:Image): Image[] => {
    const index = arr.findIndex(e => e.id === img.id);
    if(index === -1){
        arr.push(img);
    } else {
        arr[index] = img;
    }
    return arr;
}

export const ImageReducer = (state: InitialState,action: ImageActions) => {
    switch (action.type) {
        case Types.Load:
            const data = action.payload.images;
            data.sort((a,b) => b.id - a.id);
            return {
                ...state,
                images: data
            }
        case Types.Add:
            const newImages = pushToImages(state.images,action.payload.image);
            newImages.sort((a,b) => b.id - a.id);
            return {
                ...state,
                images: newImages
            }
        default:
            return {
                ...state
            }
    }
}
