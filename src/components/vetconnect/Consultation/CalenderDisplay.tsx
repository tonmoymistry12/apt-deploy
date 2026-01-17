import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en'; // Import English locale for ordinal suffixes

interface CalendarDisplayProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

// Custom Day component to apply styles based on consultation status
const ServerDay = (props: PickersDayProps<Dayjs>) => {
  const { day, outsideCurrentMonth, selected, ...other } = props;

  const isFourteenth = day.date() === 14;
  const isSixteenth = day.date() === 16;
  const isSeventeenth = day.date() === 17;
  const isTwentyThird = day.date() === 23;

  let dayColor = 'transparent';
  let textColor = '#174a7c';
  let fontWeight = 600;

  if (isSeventeenth || isTwentyThird) {
    dayColor = '#4CAF50'; // No booking
    textColor = '#fff';
  } else if (isFourteenth || isSixteenth) {
    dayColor = '#FFC107'; // Booking started
    textColor = '#174a7c';
  }

  // Highlight the current date (June 19, 2025)
  const isToday = day.isSame(dayjs().startOf('day'), 'day');

  return (
    <PickersDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      sx={{
        backgroundColor: selected ? '#174a7c' : (isToday ? '#e0f7fa' : dayColor),
        color: selected ? '#fff' : (isToday ? '#1976d2' : textColor),
        fontWeight: fontWeight,
        '&:hover': {
          backgroundColor: selected ? '#174a7c' : (isToday ? '#e0f7fa' : (dayColor === 'transparent' ? '#e0e0e0' : dayColor)),
          color: selected || isToday || dayColor !== 'transparent' ? (isToday ? '#1976d2' : textColor) : '#174a7c',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        border: selected ? '2px solid #174a7c' : (isToday ? '2px solid #1976d2' : 'none'),
        boxShadow: selected ? '0 0 0 2px #174a7c, 0px 2px 4px rgba(0, 0, 0, 0.1)' : (isToday ? '0 0 0 2px #1976d2, 0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none'),
        borderRadius: '12px',
        margin: '2px',
      }}
    />
  );
};

const CalendarDisplay: React.FC<CalendarDisplayProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date ? date.toDate() : null);
  };

  // Disable past dates
  const shouldDisableDate = (date: Dayjs) => {
    return date.isBefore(dayjs().startOf('day'), 'day');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ mt: 4, mb: 2, width: '95%', maxWidth: 450, mx: 'auto', borderRadius: 4, boxShadow: 6, background: '#ffffff', p: 0 }}>
        <Box sx={{ background: '#174a7c', borderTopLeftRadius: 16, borderTopRightRadius: 16, p: 2 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', letterSpacing: 1 }}>
            Select Date
          </Typography>
        </Box>
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <DateCalendar
            value={selectedDate ? dayjs(selectedDate) : null}
            onChange={handleDateChange}
            views={['day']}
            openTo="day"
            shouldDisableDate={shouldDisableDate} // Disable past dates
            slots={{ day: ServerDay }}
            slotProps={{
              day: {},
            }}
            sx={{
              width: '100%',
              height: 'auto',
              minHeight: '350px',
              border: 'none',
              borderRadius: '8px',
              padding: '0',
              '.MuiPickersCalendarHeader-root': {
                color: '#174a7c',
                fontSize: '1.3rem',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                padding: '0 10px',
              },
              '.MuiPickersCalendarHeader-labelContainer': {
                flexGrow: 1,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
              '.MuiDayCalendar-weekDayLabel': {
                color: '#174a7c',
                fontWeight: 700,
                fontSize: '1rem',
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '8px',
                marginBottom: '8px',
              },
              '.MuiSvgIcon-root': {
                color: '#174a7c',
                fontSize: '1.8rem',
                '&:hover': {
                  color: '#103a61',
                },
              },
              '.MuiPickersCalendarHeader-switchViewButton': {
                color: '#174a7c',
                fontSize: '1.3rem',
                fontWeight: 700,
                padding: '0 8px',
                '&:hover': {
                  backgroundColor: 'rgba(23, 74, 124, 0.1)',
                },
              },
              '.MuiPickersCalendarHeader-label': {
                color: '#174a7c',
                fontWeight: 700,
                fontSize: '1.3rem',
              },
              '.MuiPickersDay-root': {
                borderRadius: '16px',
                margin: '3px',
                width: '40px',
                height: '40px',
                fontSize: '1.1rem',
              },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#4CAF50' }}></Box>
              <Typography variant="body2" sx={{ color: '#174a7c', fontWeight: 500, fontSize: '0.9rem' }}>No booking</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#FFC107' }}></Box>
              <Typography variant="body2" sx={{ color: '#174a7c', fontWeight: 500, fontSize: '0.9rem' }}>Booking started</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#F44336' }}></Box>
              <Typography variant="body2" sx={{ color: '#174a7c', fontWeight: 500, fontSize: '0.9rem' }}>Fully booked</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default CalendarDisplay;