import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography,
  } from '@material-ui/core';
  import { Close } from '@material-ui/icons';
  
  const ConfirmDialog = () => {
    return (
      <Dialog open={true} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm the action</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>some message here</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained">
            Cancel
          </Button>
          <Button color="secondary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ConfirmDialog;