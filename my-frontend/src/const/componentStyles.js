import {makeStyles} from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    modal: {
        position: 'absolute',
        width: 460,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    form: {
        width: 460,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),

    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),
        width: '100%',
    },
    icons: {
        cursor: 'pointer'
    },
    inputMaterial: {
        width: '100%'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    cardGold: {
        root: {
            borderRadius: 12,
            minWidth: 256,
            textAlign: 'center',
            padding: '0px'
        },
        header: {
            textAlign: 'center',
        },
        list: {
            padding: '20px',
        },
        button: {
            margin: theme.spacing(1),
            width: '100%',
            variant: "contained",
            size: "large",
            color: "primary"
        },
        action: {
            display: 'flex',
            justifyContent: 'space-around',
        }
    },
    warning: {
        position: 'absolute',
        width: 460,
        backgroundColor: '#fce4ec',
        color: '#e53935',
        border: '2px solid #e53935',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    ok:{
        position: 'absolute',
        width: 460,
        backgroundColor: '#e8f5e9',
        color: '#00c853',
        border: '2px solid #00c853',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
}));
