import React, { useEffect, useState } from "react";
import {
  FaclityServiceResponse,
  FaclityServicePayload,
} from "@/interfaces/facilityInterface";
import { getOwnFacilites } from "@/services/faclilityService";
import { getSlotDates, viewPatientsInSlot, saveAppointment } from "@/services/manageCalendar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs, { Dayjs } from 'dayjs';

interface ConsultationFacilitySelectorProps {
  onFacilitySelect: (facility: FaclityServiceResponse | null) => void;
  onSelectConsultationDate: (selectedDate: Dayjs, patientSlots?: any[]) => void;
  selectedFacility: FaclityServiceResponse | null;
  selectedPatient?: {
    petOwnerUid: string;
    patientUid: string;
    patientId: number;
    petName: string;
    ownerName: string;
  } | null;
  onAppointmentSaved?: (response: { message: string; status: string }) => void;
}

interface SlotDates {
  available: string[];
  notavailable: string[];
  fullavailable: string[];
}

const CONTROL_HEIGHT = 56;

const ConsultationFacilitySelector: React.FC<
  ConsultationFacilitySelectorProps
> = ({ onFacilitySelect, onSelectConsultationDate, selectedFacility, selectedPatient, onAppointmentSaved }) => {
  const [facilities, setFacilities] = useState<FaclityServiceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [slotDates, setSlotDates] = useState<SlotDates>({
    available: [],
    notavailable: [],
    fullavailable: []
  });
  const [loadingSlotDates, setLoadingSlotDates] = useState(false);
  const [patientSlots, setPatientSlots] = useState<any[]>([]);
  const [loadingPatientSlots, setLoadingPatientSlots] = useState(false);
  const [savingAppointment, setSavingAppointment] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      try {
        const payload: FaclityServicePayload = {
          userName: localStorage.getItem('userName') || '',
          userPass: localStorage.getItem('userPwd') || '',
          deviceStat: "M",
          callingFrom: "web",
          orgId: localStorage.getItem('orgId') || '39',
          searchFacility: "",
          status: "All",
        };
        const data = await getOwnFacilites(payload);
        setFacilities(data);
      } catch (error) {
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  // Debug effect to track state changes
  useEffect(() => {
    console.log('State changed - selectedPatient:', !!selectedPatient, 'selectedSlot:', !!selectedSlot, 'patientSlots.length:', patientSlots.length);
  }, [selectedPatient, selectedSlot, patientSlots]);

  const handleChange = (event: any) => {
    const facility =
      facilities.find((f) => f.facilityId === event.target.value) || null;
    onFacilitySelect(facility);
    setShowHelper(false);
  };

  const fetchSlotDates = async () => {
    if (!selectedFacility?.facilityId) return;
    
    setLoadingSlotDates(true);
    try {
      const response = await getSlotDates({
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'M',
        facilityId: selectedFacility.facilityId
      });

      if (response.status === 'ok') {
        const available = response.available ? response.available.split(',').map(date => date.trim()) : [];
        const notavailable = response.notavailable ? response.notavailable.split(',').map(date => date.trim()) : [];
        const fullavailable = response.fullavailable ? response.fullavailable.split(',').map(date => date.trim()) : [];
        
        setSlotDates({
          available,
          notavailable,
          fullavailable
        });
      }
    } catch (error) {
      console.error('Error fetching slot dates:', error);
    } finally {
      setLoadingSlotDates(false);
    }
  };

  const fetchPatientSlots = async (date: Dayjs) => {
    if (!selectedFacility?.facilityId) return;
    
    setLoadingPatientSlots(true);
    try {
      const response = await viewPatientsInSlot({
        callingFrom: 'web',
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        loggedInFacilityId: selectedFacility.facilityId,
        orgId: parseInt(localStorage.getItem('orgId') || '39'),
        facilityId: selectedFacility.facilityId,
        slotIndex: 1,
        startDate: date.format('DD/MM/YYYY')
      });
      
      setPatientSlots(response);
      return response;
    } catch (error) {
      console.error('Error fetching patient slots:', error);
      return [];
    } finally {
      setLoadingPatientSlots(false);
    }
  };

  const handleSelectConsultationDate = () => {
    if (!selectedFacility) {
      setShowHelper(true);
    } else {
      setShowHelper(false);
      setOpenCalendar(true);
      fetchSlotDates();
    }
  };

  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(currentMonth.subtract(1, 'month'));
    } else {
      setCurrentMonth(currentMonth.add(1, 'month'));
    }
  };

  const handleConfirmDate = async () => {
    if (selectedDate) {
      console.log('Fetching slots for date:', selectedDate.format('DD/MM/YYYY'));
      const slots = await fetchPatientSlots(selectedDate);
      console.log('Fetched slots:', slots);
      onSelectConsultationDate(selectedDate, slots);
      
      // If we have a selected patient, show slots for booking
      if (selectedPatient && slots && slots.length > 0) {
        console.log('Setting patient slots:', slots);
        setPatientSlots(slots);
        // Don't close calendar yet, show slot selection
      } else {
        console.log('No patient selected or no slots available');
        setOpenCalendar(false);
        setSelectedDate(null);
      }
    }
  };

  const handleCloseCalendar = () => {
    setOpenCalendar(false);
    setSelectedDate(null);
    setCurrentMonth(dayjs());
    setSelectedSlot(null);
    setPatientSlots([]);
  };

  const handleSaveAppointment = async (slot: any) => {
    console.log('handleSaveAppointment called with slot:', slot);
    console.log('selectedFacility:', selectedFacility);
    console.log('selectedPatient:', selectedPatient);
    console.log('selectedDate:', selectedDate);
    
    if (!selectedFacility || !selectedPatient || !selectedDate) {
      console.error('Missing required data for appointment');
      console.error('selectedFacility:', !!selectedFacility);
      console.error('selectedPatient:', !!selectedPatient);
      console.error('selectedDate:', !!selectedDate);
      return;
    }

    setSavingAppointment(true);
    try {
      const payload = {
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'M',
        orgId: localStorage.getItem('orgId') || '2',
        facilityId: selectedFacility.facilityId,
        bookAppType: 'timeslot',
        apptSelDate: selectedDate.format('DD/MM/YYYY'),
        startTime: slot.startTime,
        stopTime: slot.stopTime,
        episode: 'new',
        petOwnerUid: selectedPatient.petOwnerUid,
        patientUid: selectedPatient.patientUid,
        patientId: selectedPatient.patientId
      };

      console.log('Sending appointment payload:', payload);
      const response = await saveAppointment(payload);
      console.log('Appointment API response:', response);
      
      if (response.status === 'success') {
        // Call the callback if provided
        if (onAppointmentSaved) {
          onAppointmentSaved(response);
        }
        
        // Close calendar and reset state
        setOpenCalendar(false);
        setSelectedDate(null);
        setSelectedSlot(null);
        setPatientSlots([]);
        
        console.log('Appointment saved successfully:', response.message);
      } else {
        console.error('Failed to save appointment:', response.message);
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setSavingAppointment(false);
    }
  };

  const getCalendarDays = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');
    
    const days = [];
    let day = startOfWeek;
    
    while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }
    
    return days;
  };

  const isCurrentMonth = (date: Dayjs) => {
    return date.month() === currentMonth.month();
  };

  const isSelected = (date: Dayjs) => {
    return selectedDate && date.isSame(selectedDate, 'day');
  };

  const isDateAvailable = (date: Dayjs) => {
    const dateStr = date.format('DD/MM/YYYY');
    return slotDates.available.includes(dateStr);
  };

  const isDateFullAvailable = (date: Dayjs) => {
    const dateStr = date.format('DD/MM/YYYY');
    return slotDates.fullavailable.includes(dateStr);
  };

  const isDateNotAvailable = (date: Dayjs) => {
    const dateStr = date.format('DD/MM/YYYY');
    return slotDates.notavailable.includes(dateStr);
  };

  const isToday = (date: Dayjs) => {
    return date.isSame(dayjs(), 'day');
  };

  return (
    <>
      <Card
        sx={{
          width: "80%",
          maxWidth: 800,
          mx: "auto",
          mt: 4,
          borderRadius: 4,
          boxShadow: 6,
          background: "#ffffff",
          border: "1px solid #e0e0e0",
          p: 0,
        }}
      >
        <Box
          sx={{
            background: "#174a7c",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            Select Your Facility
          </Typography>
        </Box>
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                minWidth: 220,
                maxWidth: 500,
                flex: 1,
                height: CONTROL_HEIGHT,
                background: "#fff",
                borderRadius: 2,
              }}
              error={showHelper}
            >
              <InputLabel id="facility-select-label">Facility</InputLabel>
              <Select
                labelId="facility-select-label"
                value={selectedFacility?.facilityId || ""}
                onChange={handleChange}
                label="Facility"
                sx={{
                  background: "#f8fafc",
                  borderRadius: 2,
                  fontWeight: 500,
                  height: CONTROL_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                }}
                disabled={loading || facilities.length === 0}
                inputProps={{
                  sx: {
                    height: CONTROL_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                {facilities.map((facility) => (
                  <MenuItem key={facility.facilityId} value={facility.facilityId}>
                    {facility.facilityName}
                  </MenuItem>
                ))}
              </Select>
              {showHelper && (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  Please select a facility.
                </FormHelperText>
              )}
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSelectConsultationDate}
              startIcon={<CalendarMonthIcon />}
              sx={{
                bgcolor: '#174a7c',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 3,
                py: 1.5,
                px: 4,
                height: CONTROL_HEIGHT,
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: '#103a61',
                },
              }}
            >
              View Calendar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Calendar Modal */}
    <Dialog 
      open={openCalendar} 
      onClose={handleCloseCalendar}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle sx={{ 
        position: 'relative', 
        p: 3, 
        borderBottom: '1px solid #e0e0e0',
        bgcolor: '#f7f9fc'
      }}>
        <IconButton
          onClick={handleCloseCalendar}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#666'
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ pr: 4 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: '#174a7c', mb: 1 }}>
            Select Consultation Date
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {selectedFacility?.facilityName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
              Legend:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                  Available
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800' }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                  Partial
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                  Full
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loadingSlotDates ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ color: '#174a7c' }} />
            <Typography variant="body2" sx={{ ml: 2, color: '#666' }}>
              Loading available dates...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Calendar Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mb: 2,
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <IconButton 
                onClick={() => handleMonthChange('prev')}
                size="small"
                sx={{ color: '#666' }}
              >
                <ChevronLeftIcon />
              </IconButton>
              
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#174a7c' }}>
                {currentMonth.format('MMMM YYYY')}
              </Typography>
              
              <IconButton 
                onClick={() => handleMonthChange('next')}
                size="small"
                sx={{ color: '#666' }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Calendar Grid */}
            <Box sx={{ bgcolor: 'white', borderRadius: '8px', p: 2, border: '1px solid #e0e0e0' }}>
              {/* Week Days Header */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <Typography key={day} variant="body2" sx={{ fontWeight: 600, color: '#666', py: 1, textAlign: 'center' }}>
                    {day}
                  </Typography>
                ))}
              </Box>

              {/* Calendar Days */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
                {getCalendarDays().map((date, index) => (
                  <Box
                    key={index}
                    onClick={() => handleDateClick(date)}
                    sx={{
                      height: '40px',
                      width: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      margin: 'auto',
                      ...(isCurrentMonth(date) && {
                        color: '#333',
                        '&:hover': {
                          bgcolor: '#e3f2fd',
                          transform: 'scale(1.1)',
                          borderRadius: '50%'
                        }
                      }),
                      ...(!isCurrentMonth(date) && {
                        color: '#ccc'
                      }),
                      ...(isSelected(date) && {
                        bgcolor: '#174a7c',
                        color: 'white',
                        fontWeight: 600,
                        transform: 'scale(1.1)',
                        boxShadow: '0 2px 8px rgba(23, 74, 124, 0.3)'
                      }),
                      ...(isDateFullAvailable(date) && !isSelected(date) && {
                        bgcolor: '#4caf50',
                        color: 'white',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: '#45a049',
                          transform: 'scale(1.1)',
                          borderRadius: '50%'
                        }
                      }),
                      ...(isDateAvailable(date) && !isSelected(date) && {
                        bgcolor: '#ff9800',
                        color: 'white',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: '#f57c00',
                          transform: 'scale(1.1)',
                          borderRadius: '50%'
                        }
                      }),
                      ...(isDateNotAvailable(date) && !isSelected(date) && {
                        bgcolor: '#f44336',
                        color: 'white',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: '#d32f2f',
                          transform: 'scale(1.1)',
                          borderRadius: '50%'
                        }
                      }),
                      ...(isToday(date) && !isSelected(date) && {
                        border: '2px solid #174a7c',
                        fontWeight: 600
                      })
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: isSelected(date) ? 600 : 400 }}>
                      {date.date()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

           

            {/* Slot Selection */}
            {selectedPatient && patientSlots.length > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#174a7c', fontWeight: 600 }}>
                  Available Time Slots for {selectedPatient.petName}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 1 }}>
                  {patientSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedSlot === slot ? 'contained' : 'outlined'}
                      onClick={() => {
                        console.log('Slot clicked:', slot);
                        setSelectedSlot(slot);
                        console.log('Selected slot set to:', slot);
                      }}
                      disabled={savingAppointment}
                      sx={{
                        py: 1,
                        px: 2,
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        ...(selectedSlot === slot ? {
                          bgcolor: '#174a7c',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#0d3a5f'
                          }
                        } : {
                          borderColor: '#174a7c',
                          color: '#174a7c',
                          '&:hover': {
                            borderColor: '#0d3a5f',
                            bgcolor: '#f0f4f8'
                          }
                        })
                      }}
                    >
                      {slot.startTime} - {slot.stopTime}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0', gap: 2 }}>
        <Button
          onClick={handleCloseCalendar}
          variant="outlined"
          sx={{
            color: '#666',
            borderColor: '#ddd',
            '&:hover': {
              borderColor: '#999',
              bgcolor: '#f5f5f5'
            }
          }}
        >
          Cancel
        </Button>
        
        {selectedPatient && selectedSlot ? (
          <Button
            onClick={() => {
              console.log('Book Appointment button clicked');
              console.log('selectedSlot:', selectedSlot);
              handleSaveAppointment(selectedSlot);
            }}
            variant="contained"
            disabled={savingAppointment}
            sx={{
              bgcolor: '#174a7c',
              '&:hover': {
                bgcolor: '#0d3a5f'
              },
              '&:disabled': {
                bgcolor: '#ccc'
              }
            }}
          >
            {savingAppointment ? 'Booking...' : 'Book Appointment'}
          </Button>
        ) : (
          <Button
            onClick={handleConfirmDate}
            variant="contained"
            disabled={!selectedDate}
            sx={{
              bgcolor: '#174a7c',
              '&:hover': {
                bgcolor: '#0d3a5f'
              },
              '&:disabled': {
                bgcolor: '#ccc'
              }
            }}
          >
            Select Date
          </Button>
        )}
      </DialogActions>
    </Dialog>
    </>
  );
};

export default ConsultationFacilitySelector;
