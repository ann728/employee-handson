import React, {forwardRef} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert,Slide} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next'

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteDialog({open, onClose, onDelete}) {
    const { t } = useTranslation()
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{'& .MuiDialog-paper': {p: 2}}}
            fullWidth
            // slots={{transition: Transition}}
        >
            <DialogContent>
                <Alert severity="info" variant="outlined">
                    {t('deleteDialog.message')}
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}color="primary">  {t('deleteDialog.cancel')}</Button>
                <Button onClick={onDelete} color="error" variant="contained" startIcon={<DeleteIcon/>}>
                    {t('deleteDialog.delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
