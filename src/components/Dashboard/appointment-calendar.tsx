'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

interface Appointment {
  id: number;
  date: Date;
  time: string;
  petName: string;
  ownerName: string;
  type: keyof typeof appointmentTypes;
  status: 'confirmed' | 'pending' | 'scheduled';
}

const appointmentTypes = {
  checkup: { color: '#3b82f6', label: 'Check-up' },
  vaccination: { color: '#10b981', label: 'Vaccination' },
  emergency: { color: '#ef4444', label: 'Emergency' },
  surgery: { color: '#8b5cf6', label: 'Surgery' },
  grooming: { color: '#f59e0b', label: 'Grooming' },
} as const;

const appointments: Appointment[] = [
  {
    id: 1,
    date: new Date(),
    time: '09:00',
    petName: 'Max',
    ownerName: 'John Smith',
    type: 'checkup',
    status: 'confirmed',
  },
  {
    id: 2,
    date: new Date(),
    time: '10:30',
    petName: 'Luna',
    ownerName: 'Sarah Johnson',
    type: 'vaccination',
    status: 'confirmed',
  },
  {
    id: 3,
    date: new Date(),
    time: '14:00',
    petName: 'Charlie',
    ownerName: 'Mike Davis',
    type: 'emergency',
    status: 'pending',
  },
  {
    id: 4,
    date: new Date(2025, 0, 17),
    time: '11:00',
    petName: 'Bella',
    ownerName: 'Lisa Wilson',
    type: 'surgery',
    status: 'scheduled',
  },
];

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const currentMonth = useMemo(() => new Date(), []);
  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      }),
    [currentMonth]
  );

  const getAppointmentsForDate = useCallback((date: Date) => {
    return appointments.filter((apt) => isSameDay(apt.date, date));
  }, []);

  const getTodayAppointments = useCallback(() => {
    return appointments.filter((apt) => isToday(apt.date));
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowNewAppointment(false);
  }, []);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight="bold">
            Calendar booking system
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Schedule and manage appointments
          </Typography>
        }
        action={
          <Button variant="contained" size="small" startIcon={<Plus size={16} />} onClick={() => setShowNewAppointment(true)}>
            New Appointment
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {/* Today's Appointments */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Calendar size={20} style={{ marginRight: 8 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              Today's Appointments
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {getTodayAppointments().map((appointment) => (
              <Paper
                key={appointment.id}
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': { bgcolor: 'grey.50' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: appointmentTypes[appointment.type]?.color,
                    }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {appointment.petName} - {appointment.ownerName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <Clock size={12} style={{ marginRight: 4 }} />
                      <Typography variant="body2">{appointment.time}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={appointment.status}
                    color={appointment.status === 'confirmed' ? 'primary' : 'default'}
                    size="small"
                  />
                  <IconButton size="small" aria-label="Edit appointment">
                    <Edit size={12} />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Mini Calendar */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
            {format(currentMonth, 'MMMM yyyy')}
          </Typography>
          <Grid container spacing={0.5}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs key={day}>
                <Box sx={{ p: 1, textAlign: 'center', fontSize: 12, fontWeight: 'medium', color: 'text.secondary' }}>
                  {day}
                </Box>
              </Grid>
            ))}
            {days.map((day) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);

              return (
                <Grid item xs key={day.toString()}>
                  <Button
                    onClick={() => setSelectedDate(day)}
                    sx={{
                      minWidth: 'auto',
                      width: '100%',
                      p: 1,
                      fontSize: 14,
                      position: 'relative',
                      bgcolor: isSelected ? 'primary.main' : 'transparent',
                      color: isSelected ? 'primary.contrastText' : 'text.primary',
                      border: isCurrentDay ? 2 : 0,
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: isSelected ? 'primary.dark' : 'grey.100',
                      },
                    }}
                    aria-label={`Select ${format(day, 'MMMM d, yyyy')}`}
                  >
                    {format(day, 'd')}
                    {dayAppointments.length > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 2,
                          right: 2,
                          width: 8,
                          height: 8,
                          bgcolor: 'primary.main',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Time Slots */}
        <Box>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
            Available Time Slots
          </Typography>
          <Grid container spacing={1}>
            {timeSlots.map((time) => (
              <Grid item xs={3} key={time}>
                <Button variant="outlined" size="small" fullWidth sx={{ fontSize: 12 }}>
                  {time}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* New Appointment Dialog */}
        <Dialog open={showNewAppointment} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField fullWidth label="Pet Name" placeholder="Enter pet name" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Owner Name" placeholder="Enter owner name" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="time" label="Time" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Appointment Type</InputLabel>
                  <Select label="Appointment Type">
                    <MenuItem value="checkup">Check-up</MenuItem>
                    <MenuItem value="vaccination">Vaccination</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                    <MenuItem value="surgery">Surgery</MenuItem>
                    <MenuItem value="grooming">Grooming</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <Button variant="outlined" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleCloseDialog}>
                    Schedule
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}