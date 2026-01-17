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
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Syringe,
  Bell,
  CheckCircle,
  AlertCircle,
  Users,
  CalendarDays,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

interface Appointment {
  id: number;
  date: Date;
  time: string;
  petName: string;
  ownerName: string;
  type: 'checkup' | 'vaccination' | 'emergency' | 'surgery' | 'grooming';
  status: 'confirmed' | 'pending' | 'scheduled';
}

interface Vaccination {
  id: number;
  petName: string;
  ownerName: string;
  vaccine: string;
  dueDate: string;
  status: 'due' | 'upcoming' | 'scheduled';
  priority: 'high' | 'medium' | 'low';
}

interface FollowUp {
  id: number;
  petName: string;
  ownerName: string;
  lastVisit: string;
  nextFollowUp: string;
  condition: string;
  status: 'pending' | 'scheduled' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

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
];

const vaccinations: Vaccination[] = [
  {
    id: 1,
    petName: 'Max',
    ownerName: 'John Smith',
    vaccine: 'Rabies',
    dueDate: '2025-01-20',
    status: 'due',
    priority: 'high',
  },
  {
    id: 2,
    petName: 'Luna',
    ownerName: 'Sarah Johnson',
    vaccine: 'DHPP',
    dueDate: '2025-01-25',
    status: 'upcoming',
    priority: 'medium',
  },
  {
    id: 3,
    petName: 'Charlie',
    ownerName: 'Mike Davis',
    vaccine: 'Bordetella',
    dueDate: '2025-02-01',
    status: 'scheduled',
    priority: 'low',
  },
];

const followUps: FollowUp[] = [
  {
    id: 1,
    petName: 'Bella',
    ownerName: 'Lisa Wilson',
    lastVisit: '2025-01-10',
    nextFollowUp: '2025-01-24',
    condition: 'Post-surgery recovery',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 2,
    petName: 'Rocky',
    ownerName: 'Tom Brown',
    lastVisit: '2025-01-12',
    nextFollowUp: '2025-01-26',
    condition: 'Chronic medication monitoring',
    status: 'scheduled',
    priority: 'medium',
  },
  {
    id: 3,
    petName: 'Milo',
    ownerName: 'Emma Davis',
    lastVisit: '2025-01-08',
    nextFollowUp: '2025-01-22',
    condition: 'Skin allergy treatment',
    status: 'completed',
    priority: 'low',
  },
];

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function AppointmentDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'scheduled':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Calendar Booking System" />
        <Tab label="Vaccination Event" />
        <Tab label="Followup Tracker" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {/* Calendar */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Calendar Booking System
                  </Typography>
                }
                action={
                  <Button variant="contained" size="small" startIcon={<Plus size={16} />} onClick={() => setShowNewAppointment(true)}>
                    New Appointment
                  </Button>
                }
              />
              <CardContent>
                {/* Mini Calendar */}
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                  {format(currentMonth, 'MMMM yyyy')}
                </Typography>
                <Grid container spacing={0.5} sx={{ mb: 3 }}>
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

                {/* Time Slots */}
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
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Appointments */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Calendar size={20} style={{ marginRight: 8 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Today's Appointments
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {appointment.petName} - {appointment.ownerName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 0.5 }}>
                          <Clock size={12} style={{ marginRight: 4 }} />
                          <Typography variant="body2">{appointment.time}</Typography>
                          <Typography variant="body2" sx={{ ml: 2 }}>
                            {appointment.type}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                        <IconButton size="small">
                          <Edit size={12} />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Syringe size={20} style={{ marginRight: 8 }} />
                <Typography variant="h6" fontWeight="bold">
                  Vaccination Event
                </Typography>
              </Box>
            }
            action={
              <Button variant="contained" size="small" startIcon={<Calendar size={16} />}>
                Schedule Vaccination
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {vaccinations.map((vaccination) => (
                <Paper
                  key={vaccination.id}
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Syringe size={20} color={getPriorityColor(vaccination.priority) === 'error' ? '#ef4444' : getPriorityColor(vaccination.priority) === 'warning' ? '#f59e0b' : '#10b981'} />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {vaccination.petName} - {vaccination.ownerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vaccination.vaccine} • Due: {vaccination.dueDate}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={vaccination.priority}
                      color={getPriorityColor(vaccination.priority)}
                      size="small"
                    />
                    <Chip
                      label={vaccination.status}
                      color={getStatusColor(vaccination.status)}
                      size="small"
                    />
                    <Button variant="outlined" size="small" startIcon={<Bell size={12} />}>
                      Remind
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Users size={20} style={{ marginRight: 8 }} />
                <Typography variant="h6" fontWeight="bold">
                  Followup Tracker
                </Typography>
              </Box>
            }
            action={
              <Button variant="contained" size="small" startIcon={<Plus size={16} />}>
                Add Follow-up
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {followUps.map((followUp) => (
                <Paper
                  key={followUp.id}
                  sx={{
                    p: 2,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {followUp.petName} - {followUp.ownerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {followUp.condition}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={followUp.priority}
                        color={getPriorityColor(followUp.priority)}
                        size="small"
                      />
                      <Chip
                        label={followUp.status}
                        color={getStatusColor(followUp.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">
                        Last Visit
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {followUp.lastVisit}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">
                        Next Follow-up
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {followUp.nextFollowUp}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="outlined" size="small" startIcon={<CalendarDays size={12} />}>
                          Schedule
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

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
    </Box>
  );
}