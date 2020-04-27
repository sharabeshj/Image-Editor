import React, {createContext, useReducer} from "react";
import {ImageReducer} from "./ImageReducer";
import {InitialState} from "./Types/InitialState";

const initialState:InitialState = {
    images: []
};
export const context = createContext<{state: InitialState; dispatch: React.Dispatch<any>;}>({
    state: initialState,
    dispatch: () => null
});

const { Provider } = context;

export const ImageProvider: React.FunctionComponent = ({children}) => {
    const [state, dispatch] = useReducer(ImageReducer,initialState);
    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    );
}
