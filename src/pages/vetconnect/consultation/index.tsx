import React, { useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { FaclityServiceResponse } from '@/interfaces/facilityInterface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';
import ConsultationFacilitySelector from "@/components/vetconnect/Consultation/ConsultationFacilitySelector";
import AlertPopup from "@/components/vetconnect/Consultation/AlertPopup";
import ListOfConsultation from "@/components/vetconnect/Consultation/ListOfConsultation";
import { viewPatientsInSlot } from '@/services/manageCalendar';

interface ConsultationItem {
  petName: string;
  ownerName: string;
  timeRange: string;
  imageUrl?: string;
  // API fields for updatestatusarrive
  patientMrn?: number;
  petOwnerUid?: string;
  patientUid?: number;
  appointmentId?: number;
  facilityId?: number;
  appointmentStatus?: string;
}

const Consultation: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<FaclityServiceResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [patientSlots, setPatientSlots] = useState<any[]>([]);
  const [showListOfConsultation, setShowListOfConsultation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  // Sample patient data for appointment booking
  const [selectedPatient, setSelectedPatient] = useState<{
    petOwnerUid: string;
    patientUid: string;
    patientId: number;
    petName: string;
    ownerName: string;
  } | null>(null);

  // Map API data to ConsultationItem format
  const mapPatientSlotsToConsultations = (slots: any[]): ConsultationItem[] => {
    return slots
      .filter(slot => slot.patientName) // Only include slots with actual patients
      .map(slot => ({
        petName: slot.patientName || 'Unknown Pet',
        ownerName: slot.petOwnerUid ? `Owner ${slot.petOwnerUid}` : 'Unknown Owner',
        timeRange: `${slot.startTime || '00:00'} - ${slot.stopTime || '00:00'}`,
        imageUrl: undefined, // No image URL in API response
        // API fields for updatestatusarrive
        patientMrn: parseInt(slot.patientMrn) || 1,
        petOwnerUid: slot.petOwnerUid?.toString() || '4',
        patientUid: parseInt(slot.patientUid) || 125,
        appointmentId: parseInt(slot.appointmentId) || 1174,
        facilityId: selectedFacility?.facilityId || 1,
        appointmentStatus: slot.appointmentStatus || 'Scheduled'
      }));
  };


  const isToday = (date: Date) => {
    const today = new Date();
    return date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };

  const handleDateSelect = (date: Dayjs, slots?: any[]) => {
    const dateObj = date.toDate();
    setSelectedDate(dateObj);
    setPatientSlots(slots || []);
    if (isToday(dateObj)) {
      setShowListOfConsultation(true);
    } else {
      setShowListOfConsultation(false);
      setShowAlert(true);
    }
  };

  const handleArriveClick = (consultation: ConsultationItem) => {
    console.log(`${consultation.petName} has arrived!`);
    // Optionally trigger modal or update status here
  };

  const handleAppointmentSaved = (response: { message: string; status: string }) => {
    console.log('Appointment saved:', response.message);
    // You can show a success message or redirect here
    alert(`Appointment booked successfully! ${response.message}`);
  };

  const refreshConsultations = async () => {
    if (!selectedFacility?.facilityId || !selectedDate) return;
    
    try {
      const response = await viewPatientsInSlot({
        callingFrom: 'web',
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        loggedInFacilityId: selectedFacility.facilityId,
        orgId: parseInt(localStorage.getItem('orgId') || '39'),
        facilityId: selectedFacility.facilityId,
        slotIndex: 1,
        startDate: dayjs(selectedDate).format('DD/MM/YYYY')
      });
      
      setPatientSlots(response);
    } catch (error) {
      console.error('Error refreshing consultations:', error);
    }
  };



  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#174a7c', mb: 3, textAlign: 'center' }}>
            Consultation
          </Typography>

          <ConsultationFacilitySelector
            onFacilitySelect={setSelectedFacility}
            onSelectConsultationDate={handleDateSelect}
            selectedFacility={selectedFacility}
            selectedPatient={selectedPatient}
            onAppointmentSaved={handleAppointmentSaved}
          />
          {showListOfConsultation && selectedDate && isToday(selectedDate) && (
            <ListOfConsultation
              selectedDate={selectedDate}
              consultations={mapPatientSlotsToConsultations(patientSlots)}
              onArriveClick={handleArriveClick}
              onRefresh={refreshConsultations}
            />
          )}

          {showAlert && <AlertPopup onClose={() => setShowAlert(false)} />}
        </Box>
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default Consultation;