import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import CustomPrimaryButton from '@/components/common/buttons/CustomPrimaryButton';

interface UsedRange {
  start: string;
  end: string;
}

interface CreateNewCalendarProps {
  open: boolean;
  onCancel: () => void;
  onOk: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
  initialStartDate?: Dayjs | null;
  initialEndDate?: Dayjs | null;
  usedRanges?: UsedRange[];
}

const isDateInRanges = (date: Dayjs, ranges: UsedRange[]) => {
  return ranges?.some(range => {
    const start = dayjs(range.start, 'DD.MM.YY');
    const end = dayjs(range.end, 'DD.MM.YY');
    return date.isSameOrAfter(start, 'day') && date.isSameOrBefore(end, 'day');
  });
};

const CreateNewCalendar: React.FC<CreateNewCalendarProps> = ({ open, onCancel, onOk, initialStartDate = null, initialEndDate = null, usedRanges = [] }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialEndDate);

  const handleOk = () => {
    onOk(startDate, endDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: '#174a7c', fontWeight: 700, textAlign: 'center' }}>Create New Calendar</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
                         <DatePicker
               label="Start Date"
               value={startDate}
               onChange={setStartDate}
               slotProps={{ textField: { fullWidth: true } }}
               maxDate={endDate || undefined}
               format="DD/MM/YYYY"
               shouldDisableDate={date => {
                 // Disable dates that are after end date or in used ranges
                 if (endDate && date.isAfter(endDate, 'day')) {
                   return true;
                 }
                 return isDateInRanges(date, usedRanges);
               }}
                              slots={{
                 day: (props) => {
                   const isAfterEnd = endDate && props.day.isAfter(endDate, 'day');
                   const isInUsedRanges = isDateInRanges(props.day, usedRanges);
                   const isDisabled = isAfterEnd || isInUsedRanges;
                   
                   return (
                     <PickersDay
                       {...props}
                       disabled={isDisabled}
                     />
                   );
                 }
               }}
             />
                         <DatePicker
               label="End Date"
               value={endDate}
               onChange={setEndDate}
               slotProps={{ textField: { fullWidth: true } }}
               minDate={startDate || undefined}
               format="DD/MM/YYYY"
               shouldDisableDate={date => {
                 // Disable dates that are before start date or in used ranges
                 if (startDate && date.isBefore(startDate, 'day')) {
                   return true;
                 }
                 return isDateInRanges(date, usedRanges);
               }}
                              slots={{
                 day: (props) => {
                   const isBeforeStart = startDate && props.day.isBefore(startDate, 'day');
                   const isInUsedRanges = isDateInRanges(props.day, usedRanges);
                   const isDisabled = isBeforeStart || isInUsedRanges;
                   
                   return (
                     <PickersDay
                       {...props}
                       disabled={isDisabled}
                     />
                   );
                 }
               }}
             />
          </Box>
          {/* Calendar UI can be added here if you want a visual calendar, or just use the pickers above */}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <CustomPrimaryButton text="Cancel" type="button" size="large" onClick={onCancel} sx={{ maxWidth: 140 }} />
          <CustomPrimaryButton text="OK" type="button" size="large" onClick={handleOk} sx={{ maxWidth: 140 }} />
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateNewCalendar; 