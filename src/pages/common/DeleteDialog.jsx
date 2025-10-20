import React, {forwardRef} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert,Slide} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteDialog({open, onClose, onDelete}) {
    return (
        <Dialog open={open} onClose={onClose} sx={{'& .MuiDialog-paper': {p: 2}}}
                slots={{transition: Transition}}>
            <DialogContent>
                <Alert severity="info" variant="outlined">
                    本当に削除してもよろしいですか？
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">キャンセル</Button>
                <Button onClick={onDelete} color="error" variant="contained" startIcon={<DeleteIcon/>}>
                    削除
                </Button>
            </DialogActions>
        </Dialog>
    );
}
