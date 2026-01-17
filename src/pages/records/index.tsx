import React, { useState } from 'react';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const RecordsPage: React.FC = () => {
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const handleDeleteClick = (recordId: string) => {
    setRecordToDelete(recordId);
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    setRecordToDelete(null);
    // Here you would remove the record from your list
  };
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setRecordToDelete(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Medical Records
      </Typography>
      <Paper sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Typography sx={{ minWidth: 180, fontWeight: 600 }}>
          Blood Test Report
        </Typography>
        <Typography sx={{ minWidth: 120 }}>2025-07-15</Typography>
        <Typography sx={{ minWidth: 140 }}>Pathology (PDF)</Typography>
        <Typography sx={{ minWidth: 100 }}>My Vet</Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton aria-label="share" size="small" sx={{ color: '#174a7c', mr: 1 }} onClick={() => setOpenShareDialog(true)}>
          <ShareOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="delete" size="small" sx={{ color: '#d32f2f' }} onClick={() => handleDeleteClick('dummy-id')}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Are you sure you want to delete?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecordsPage; 