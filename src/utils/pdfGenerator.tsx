import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import React from 'react';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column' as const,
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a237e'
  },
  destinationTitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    color: '#2c3e50'
  },
  section: {
    margin: 10,
    padding: 10,
    borderRadius: 5
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    color: '#1976d2'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 5,
    marginBottom: 5
  },
  cell: {
    flex: 1,
    padding: 5
  },
  label: {
    fontSize: 10,
    color: '#666'
  },
  value: {
    fontSize: 12,
    color: '#000'
  },
  total: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'right',
    color: '#1976d2'
  },
  grandTotal: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'right',
    color: '#1a237e'
  },
  transferDetails: {
    marginTop: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#1976d2',
  },
  subLabel: {
    fontSize: 10,
    color: '#1976d2',
    marginBottom: 4,
  },
  note: {
    fontSize: 9,
    color: '#4caf50',
    marginRight: 8,
  },
  extras: {
    flexDirection: 'row',
    marginTop: 4,
  },
  totalCost: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'right',
    color: '#1976d2'
  }
});

// Create Document Component
const TripBudgetPDF = ({ tripData }: { tripData: any }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="portrait">
      <Text style={styles.title}>Trip Budget Summary</Text>

      {tripData.destinations.map((destination: any, index: number) => (
        <View key={index} style={styles.section}>
          <Text style={styles.destinationTitle}>
            {destination.city || `Destination ${index + 1}`}
          </Text>

          {/* Accommodation Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accommodation</Text>
            {destination.hotels?.map((hotel: any, idx: number) => (
              <View key={idx} style={styles.row}>
                <View style={styles.cell}>
                  <Text style={styles.label}>Hotel</Text>
                  <Text style={styles.value}>{hotel.name}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.label}>Rooms & Nights</Text>
                  <Text style={styles.value}>
                    {hotel.numberOfRooms} rooms × {hotel.nights} nights
                  </Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.label}>Total</Text>
                  <Text style={styles.value}>₹{hotel.totalPrice.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Transport Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transport</Text>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.label}>Type</Text>
                <Text style={styles.value}>
                  {destination.transport?.type} - {destination.transport?.vehicleCategory}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.label}>Duration & Cost</Text>
                <Text style={styles.value}>
                  {destination.transport?.numberOfDays} days × ₹{destination.transport?.pricePerDay}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.label}>Base Cost</Text>
                <Text style={styles.value}>
                  ₹{((destination.transport?.pricePerDay || 0) * 
                     (destination.transport?.numberOfDays || 0)).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Transfer costs */}
            {(destination.transport?.needsPickup || destination.transport?.needsDrop) && (
              <View style={styles.transferDetails}>
                <Text style={styles.subLabel}>Airport Transfers:</Text>
                {destination.transport?.needsPickup && (
                  <Text style={styles.value}>
                    Pickup: ₹{destination.transport.pickupCost.toLocaleString()}
                  </Text>
                )}
                {destination.transport?.needsDrop && (
                  <Text style={styles.value}>
                    Drop: ₹{destination.transport.dropCost.toLocaleString()}
                  </Text>
                )}
              </View>
            )}

            {/* Extras */}
            <View style={styles.extras}>
              {destination.transport?.includeDriver && (
                <Text style={styles.note}>Includes Driver</Text>
              )}
              {destination.transport?.includeFuel && (
                <Text style={styles.note}>Includes Fuel</Text>
              )}
            </View>

            <Text style={styles.totalCost}>
              Total Transport Cost: ₹{(
                (destination.transport?.pricePerDay || 0) * (destination.transport?.numberOfDays || 0) +
                (destination.transport?.needsPickup ? destination.transport?.pickupCost || 0 : 0) +
                (destination.transport?.needsDrop ? destination.transport?.dropCost || 0 : 0)
              ).toLocaleString()}
            </Text>
          </View>

          {/* Activities Section */}
          {destination.activities?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activities</Text>
              {destination.activities.map((activity: any, idx: number) => (
                <View key={idx} style={styles.row}>
                  <View style={styles.cell}>
                    <Text style={styles.label}>Activity</Text>
                    <Text style={styles.value}>{activity.name}</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.label}>Participants</Text>
                    <Text style={styles.value}>{activity.participants}</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.label}>Cost</Text>
                    <Text style={styles.value}>₹{activity.price.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.total}>
            Destination Total: ₹{calculateDestinationTotal(destination).toLocaleString()}
          </Text>
        </View>
      ))}

      <Text style={styles.grandTotal}>
        Grand Total: ₹{calculateGrandTotal(tripData).toLocaleString()}
      </Text>
    </Page>
  </Document>
);

const calculateDestinationTotal = (destination: any) => {
  const hotelCost = (destination.hotels || []).reduce((sum: number, h: any) => sum + h.totalPrice, 0);
  const transportCost = (destination.transport?.pricePerDay || 0) * (destination.transport?.numberOfDays || 0);
  const activityCost = (destination.activities || []).reduce((sum: number, a: any) => 
    sum + (a.price * a.participants), 0);
  return hotelCost + transportCost + activityCost;
};

const calculateGrandTotal = (tripData: any) => {
  return tripData.destinations.reduce((total: number, dest: any) => 
    total + calculateDestinationTotal(dest), 0);
};

// Export a component that renders the PDFDownloadLink
export const TripBudgetPDFDownload = ({ tripData }: { tripData: any }) => (
  <PDFDownloadLink
    document={<TripBudgetPDF tripData={tripData} />}
    fileName="trip-budget.pdf"
    style={{
      textDecoration: 'none',
      color: 'inherit'
    }}
  >
    {({ loading, error }) => 
      loading ? 'Generating PDF...' : 
      error ? 'Error generating PDF!' : 
      'Download PDF'
    }
  </PDFDownloadLink>
); 