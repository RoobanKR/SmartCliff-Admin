import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const autoCloseTime = 5000;
const hideProgressBar = false;
const closeOnClick = false;
const pauseOnHover = true;
const draggable = false;
const theme = ["colored", "dark", "light"][2];

const getPosition = (position) => {
    if (position === 'top_right') {
        return toast.POSITION.TOP_RIGHT;
    } else if (position === 'top_left') {
        return toast.POSITION.TOP_LEFT;
    } else if (position === 'bottom_right') {
        return toast.POSITION.BOTTOM_RIGHT;
    } else if (position === 'bottom_left') {
        return toast.POSITION.BOTTOM_LEFT;
    } else {
        console.warn(`Invalid position "${position}". Defaulting to BOTTOM_RIGHT.`);
        return toast.POSITION.BOTTOM_RIGHT;
    }
};


export const successToast = (message) => {
    // console.log("Toast position:", toast.POSITION.BOTTOM_RIGHT);
    toast.success(message, {
        // position: toast.POSITION.BOTTOM_RIGHT,   
        autoClose: autoCloseTime,
        hideProgressBar: hideProgressBar,
        closeOnClick: closeOnClick,
        pauseOnHover: pauseOnHover,
        draggable: draggable,
        theme: theme,
    });
    
};


export const errorToast = (message, position) => {
    console.log("error toast called")
    toast.error(message, {
        // position: getPosition(position),        
        autoClose: autoCloseTime,
        hideProgressBar: hideProgressBar,
        closeOnClick: closeOnClick,
        pauseOnHover: pauseOnHover,
        draggable: draggable,
        theme: theme,
    });
};

export const warningToast = (message, position) => {
    toast.warning(message, {
        position: getPosition(position),        
        autoClose: autoCloseTime,
        hideProgressBar: hideProgressBar,
        closeOnClick: closeOnClick,
        pauseOnHover: pauseOnHover,
        draggable: draggable,
        theme: theme,
    });
};

export const infoToast = (message, position) => {
    toast.info(message, {
        position: getPosition(position),        
        autoClose: autoCloseTime,
        hideProgressBar: hideProgressBar,
        closeOnClick: closeOnClick,
        pauseOnHover: pauseOnHover,
        draggable: draggable,
        theme: theme,
    });
};