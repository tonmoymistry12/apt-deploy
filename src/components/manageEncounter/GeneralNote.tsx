import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  Button,
  Tooltip,
  Alert,
  Paper,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { MedicalRecord } from './medical'; // Assuming same MedicalRecord type as in previous components

interface GeneralNoteProps {
  record: any;
}

interface NoteEntry {
  content: string;
  createdAt: string;
  id: string;
}

const GeneralNote: React.FC<GeneralNoteProps> = ({ record }) => {
  const [noteContent, setNoteContent] = useState('');
  const [noteEntries, setNoteEntries] = useState<NoteEntry[]>([]);
  const quillRef = useRef<ReactQuill>(null);

  // Quill toolbar configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'table'],
      ['clean'],
    ],
  };

  // Autosave functionality (saves draft to localStorage every 5 seconds)
  useEffect(() => {
    const autosave = setInterval(() => {
      if (noteContent) {
        localStorage.setItem(`draftNote_${record.patientInfo.patientId}`, noteContent);
      }
    }, 5000);
    return () => clearInterval(autosave);
  }, [noteContent, record.patientInfo.patientId]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(`draftNote_${record.patientInfo.patientId}`);
    if (draft) {
      setNoteContent(draft);
    }
  }, [record.patientInfo.patientId]);

  const handleClear = () => {
    setNoteContent('');
    localStorage.removeItem(`draftNote_${record.patientInfo.patientId}`);
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) {
      alert('Please enter a note before saving.');
      return;
    }

    const newEntry: NoteEntry = {
      content: noteContent,
      createdAt: new Date().toLocaleString('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      id: `note-${Date.now()}`,
    };

    setNoteEntries([newEntry, ...noteEntries]);
    handleClear();
  };

  const handleFinish = () => {
    console.log('Notes submitted:', noteEntries);
    handleClear();
  };

  const handleCancel = () => {
    handleClear();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 3 }, bgcolor: 'grey.50', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)', color: 'white' }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          General Note
        </Typography>
        <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
          Add general notes for {record.patientInfo.patientName} (visible to patient)
        </Typography>
      </Paper>

      <Card
        elevation={2}
        sx={{
          background: 'linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        }}
        role="region"
        aria-label="General Note Editor"
      >
        <CardHeader
          title={
            <Typography variant="h6" fontWeight="600" color="text.primary">
              Add General Note
            </Typography>
          }
          sx={{ pb: 0, px: 2 }}
        />
        <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
          <Stack spacing={2}>
            <Alert severity="warning" sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
              Notice: General notes will always be visible to the patient.
            </Alert>

            <Box sx={{ '& .ql-toolbar': { borderRadius: '4px 4px 0 0' }, '& .ql-container': { borderRadius: '0 0 4px 4px' } }}>
              <ReactQuill
                ref={quillRef}
                value={noteContent}
                onChange={setNoteContent}
                modules={modules}
                placeholder="Type your note here… (visible to patient)"
                theme="snow"
                style={{ minHeight: '200px', backgroundColor: '#fff' }}
              />
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
              <Tooltip title="Save note and attach to record">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddNote}
                  size="small"
                  aria-label="Save note"
                >
                  Add
                </Button>
              </Tooltip>
              <Tooltip title="Clear the editor">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClear}
                  size="small"
                  aria-label="Clear the editor"
                >
                  Clear
                </Button>
              </Tooltip>
              <Tooltip title="Finish and submit notes">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleFinish}
                  size="small"
                  aria-label="Finish and submit notes"
                >
                  Finish
                </Button>
              </Tooltip>
              <Tooltip title="Discard and exit">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                  size="small"
                  aria-label="Cancel changes"
                >
                  Cancel
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GeneralNote;