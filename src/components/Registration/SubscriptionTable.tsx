
import { Box, Button, FormControlLabel, Grid, Radio, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  getPricingDetails,
  postProvisionalSubscription,
  savePlans
} from "@/services/registrationService";
import Message from '../common/Message';


interface Props {
  open?:boolean;
  noOfDaysExtended?: any;
  provRegOrgId? : any
}

const SubscriptionTable: React.FC<Props> = ({ open,noOfDaysExtended, provRegOrgId  }) => {
  
  const subsSetupId = noOfDaysExtended[0]?.facilityTypeId;
 
  const trialPeriod = noOfDaysExtended[0]?.trialPeriod;
  const prevRegOrgId = localStorage.getItem("provOrgId")
 const [pricingDetails, setPricingDetails] = useState<any>([])
 const [openSnackbar, setOpenSnackbar] = useState(false);
 const [duration, setDuration] = useState<any>({});
 const [durationOptions, setDurationOptions] = useState<any>([])
 const [selectedFacilityDetails, setSelectedFacilityDetails] = useState<any[]>([]);
 const [subscriptionData, setSubscriptionData] = useState<any[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
   const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
     "error"
   );
 //let durationOptions:any = []
  useEffect(() => {
      const fetchPricingDetails = async () => {
        try {
          
          const data:any = await getPricingDetails();
          // or another `roleId` prop
          setPricingDetails(data.Clinic);
         let options = data.Clinic.map((item: any) => ({
  id: item.subscription_setup_master_id,
  label: item.discount_percentage > 0 
    ? `${item.subscription_duration} (You Save ${item.discount_percentage}%)`
    : item.subscription_duration,
  months: item.subscription_duration === "Three Months" ? 3 
        : item.subscription_duration === "Six Months" ? 6 
        : item.subscription_duration === "One Year" ? 12 
        : 0,
  discount: parseFloat(item.discount_percentage),
  payable: parseFloat(item.subscription_payable_amount),
}));

const subData: any = Object.values(
  data.Clinic.reduce((acc:any, item:any,index:any) => {
    if (!acc[item.subscription_setup_master_id]) {
      acc[item.subscription_setup_master_id] = {
        id: Number(item.subscription_setup_master_id),
        slab: index+1,
        price: parseFloat(item.subscription_amount),
        label: `INR ${parseFloat(item.subscription_amount).toLocaleString()} per month per facility`,
        desc: item.facility_type,
      };
    }
    return acc;
  }, {})
);
if (options.length > 0) {
setDuration(options[0])
setDurationOptions(options)
}
if(subData.length >0){
setSubscriptionData(subData)
const data = {...subData[0],noOfDoctors:1,}
setSelectedFacilityDetails((prev: any[]) => [
    ...prev,
    data
  ])
}

        } catch (error) {
          console.error('Error fetching role details:', error);
          // Handle error (e.g., show notification or fallback)
        }
      };
    
      fetchPricingDetails();
      

    }, [open]);
    


// Step 1: Extract subscriptionData (unique facilities)



/* setSelectedFacilityDetails((prev: any[]) => [
    ...prev,
    subscriptionData[0]
  ]); */



// Step 2: Extract durationOptions (unique durations)


 const [facilityCounts, setFacilityCounts] = useState([1, 0, 0]);
 
  const handleFacilityChange = (index: number, value: number,item:any) => {
    const updated = [...facilityCounts];
   
  //  item.noOfDoctors = value;
  //  const selectedFacilityItems:any = [];
   // if()
   // selectedFacilityItems.push(item)
    updated[index] = value;
    setFacilityCounts(updated);
  //  setSelectedFacilityDetails(selectedFacilityItems)
   
  };

  const handleBlurFacilityChange = (value: number,item:any) => {
   
    const updatedItem = { ...item, noOfDoctors: value };

  setSelectedFacilityDetails((prev: any[]) => [
    ...prev,
    updatedItem
  ]);
 
  };

  const handleFreeTrial = async()=>{
   
    
    if(selectedFacilityDetails.length == 0){
      
       try{
       let obj = {
        "provRegOrgId": prevRegOrgId,
        "firstSlabChk": "true",
        "secondSlabChk": "false",
        "thirdSlabChk": "false",
        "firstSlabTxt": subscriptionData[0].noOfDoctors,
        "secondSlabTxt": "0",
        "thirdSlabTxt": "0",
        "firstSlabSubTxt": subscriptionData[0].price,
        "secondSlabSubTxt": "0",
        "thirdSlabSubTxt": "0",
        "firstFacilityTypeSlabId": subscriptionData[0].id,
        "secondFacilityTypeSlabId": "0",
        "thirdFacilityTypeSlabId": "0",
        "subsSetupId": subsSetupId,
        "noOfDaysExtended": trialPeriod,
        "noOfMonths": durationOptions[0].months,
        "subscriptionType": "TRIAL"
      }

      const response =  await savePlans(obj);
      finalSubmit(response)
   
     
    }catch(error:any){
    
      setSnackbarMessage(
          error?.response?.data?.message || "Failed to fetch doctors"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
    }
    }else{
      
     try {
      const removeDeuplitcate = selectedFacilityDetails.filter((obj1, i, arr) => 
                                  arr.findIndex(obj2 => (obj2.id === obj1.id)) === i
                               )
     
      const filterFacility = removeDeuplitcate.filter(x => x.noOfDoctors > 0);
     
      let firstSlab:any;
       let secondSlab:any;
       let thirdSlab:any;
      if(filterFacility.length > 0){
        const value1 = filterFacility.filter(x=>x.slab == 1);
        firstSlab = value1[0]
        const value2 = filterFacility.filter(x=>x.slab == 2);
        secondSlab = value2[0]
        const value3 = filterFacility.filter(x=>x.slab == 3);
        thirdSlab = value3[0]
      }
      
       let obj = {
        "provRegOrgId": prevRegOrgId,
        "firstSlabChk": firstSlab ? true :false,
        "secondSlabChk": secondSlab? true: false,
        "thirdSlabChk": thirdSlab? true : false,
        "firstSlabTxt": firstSlab ? firstSlab.noOfDoctors : "0",
        "secondSlabTxt": secondSlab ? secondSlab.noOfDoctors:"0",
        "thirdSlabTxt": thirdSlab ? thirdSlab.noOfDoctors:"0",
        "firstSlabSubTxt": firstSlab ? firstSlab.price :  "0",
        "secondSlabSubTxt": secondSlab ? secondSlab.price : "0",
        "thirdSlabSubTxt": thirdSlab ? thirdSlab.price : "0",
        "firstFacilityTypeSlabId": firstSlab ? firstSlab.id :  "0",
        "secondFacilityTypeSlabId": secondSlab ? secondSlab.id : "0",
        "thirdFacilityTypeSlabId": thirdSlab ? thirdSlab.id : "0",
        "subsSetupId": subsSetupId,
        "noOfDaysExtended": trialPeriod,
        "noOfMonths":durationOptions[0].months,
        "subscriptionType": "TRIAL"
      }

     const response =  await savePlans(obj);
    
     finalSubmit(response)
    
    }catch(error:any){
      
      setSnackbarMessage(
          error?.response?.data?.message || "Failed to fetch doctors"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
    }
      
    }
  }

  const finalSubmit = async(obj:any)=>{
    try{
      const savedObj = {
        provRegOrgId: obj.provRegOrgId,
        attemptId: obj.attemptId,
        provLogId: obj.provLogId
      }
      const response =  await postProvisionalSubscription(savedObj);
       setSnackbarMessage(
          response?.data?.message || "Subscription saved"
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    }catch(error:any){
    
      setSnackbarMessage(
          error?.response?.data?.message || "Error occured not saved"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
    }
  }

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const monthlyTotal = facilityCounts.reduce(
  (acc, count, i) => acc + (subscriptionData[i] ? count * subscriptionData[i].price : 0),
  0
);

  const discountedMonthly =
    monthlyTotal - (monthlyTotal * duration?.discount) / 100;
  const totalPayable = discountedMonthly * duration?.months;

  // Shared fields
  return (
   
    <Box border={1} borderColor="grey.400" p={2} maxWidth={800} mx="auto">
      
      {/* Subscription Options */}
      <Grid container spacing={2} mt={2}>
        {subscriptionData.map((item:any, index:any) => (
          <Grid item xs={4} key={item.id}>
            <Box border={1} p={2} textAlign="center">
              <Typography variant="body1" fontWeight="bold">
                {item.label}
              </Typography>
              <Typography variant="body2">{item.desc}</Typography>
              <TextField
                type="number"
                value={facilityCounts[index]}
                onChange={(e) =>
                  handleFacilityChange(index, parseInt(e.target.value) || 0,item)
                }
                onBlur={(e) =>
                  handleBlurFacilityChange(parseInt(e.target.value) || 0,item)
                }
                inputProps={{ min: 0 }}
                sx={{ mt: 1, width: 60 }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Monthly Total */}
      <Box mt={2} borderTop="1px dotted grey" pt={2}>
        <Typography>
          Monthly subscription in INR{" "}
          <strong>{monthlyTotal.toFixed(2)}</strong>
        </Typography>
      </Box>

      {/* Duration */}
      <Box mt={2}>
        <Typography fontWeight="bold" color="red">
          * Subscription Duration : 
        </Typography>
        {durationOptions.map((opt:any) => (
          <FormControlLabel
            key={opt.id}
            value={duration?.id}
            control={
              <Radio
                value={opt.id}
                checked={duration?.id === opt.id}
                onChange={() => setDuration(opt)}
              />
            }
            label={opt.label}
          />
        ))}
      </Box>

      {/* Total Section */}
      <Box mt={2} borderTop="1px dotted grey" pt={2}>
        <Typography>
          Total subscription amount in INR{" "}
          <strong>{duration?.months ? (monthlyTotal * duration?.months).toFixed(2):0}</strong>
        </Typography>
        <Typography>
          You pay in INR <strong>{totalPayable ? totalPayable.toFixed(2): 0}</strong>
        </Typography>
      </Box>

      {/* Buttons */}
      <Box display="flex" justifyContent="center" mt={2} gap={1}>
        <Button variant="contained" color="primary">
          Go Back
        </Button>
        <Button variant="contained" sx={{ bgcolor: "#0a3c6b" }}>
          Pay Now
        </Button>
      </Box>

      {/* Free Trial */}
      <Box textAlign="center" mt={2}>
        <Typography>Otherwise</Typography>
        <Button onClick={handleFreeTrial} variant="contained" sx={{ bgcolor: "#0a3c6b", mt: 1 }}>
          Start Your Free Trial
        </Button>
      </Box> 
        <Message
          openSnackbar={openSnackbar}
          handleCloseSnackbar={handleCloseSnackbar}
          snackbarSeverity={snackbarSeverity}
          snackbarMessage={snackbarMessage}
        />  
    </Box>


  )
};

export default SubscriptionTable;