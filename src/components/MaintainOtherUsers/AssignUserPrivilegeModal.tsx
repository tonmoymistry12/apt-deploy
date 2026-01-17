import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { 
  getAssignedFacilities, 
  AssignedFacility, 
  getAllRolesOfFacility,
  FacilityRole,
  getAllPrivsOfRoleInOrg,
  RolePrivilege,
  saveUserPrivileges,
  getOrgFacilityUserRoleMapping,
  FacilityUserRoleMapping,
  getOrgUserFacilityPrivilegeMapping,
  UserFacilityPrivilegeMapping
} from '@/services/userService';
import { getOwnFacilites } from '@/services/faclilityService';
import { FaclityServiceResponse } from '@/interfaces/facilityInterface';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  image?: string;
  isDoctor?: number; // 0 or 1
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: { facility: string; roles: string[]; privileges: string[] }) => void;
}

const AssignUserPrivilegeModal: React.FC<Props> = ({ open, onClose, user, onSubmit }) => {
  const [facilities, setFacilities] = useState<FaclityServiceResponse[]>([]);
  const [assignedFacilityIds, setAssignedFacilityIds] = useState<Set<number>>(new Set());
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<FaclityServiceResponse | null>(null);
  const [roles, setRoles] = useState<FacilityRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [privileges, setPrivileges] = useState<RolePrivilege[]>([]);
  const [loadingPrivileges, setLoadingPrivileges] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  // Store all saved role and privilege mappings for all facilities
  const [allUserRoleMappings, setAllUserRoleMappings] = useState<FacilityUserRoleMapping[]>([]);
  const [allUserPrivilegeMappings, setAllUserPrivilegeMappings] = useState<UserFacilityPrivilegeMapping[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Fetch facilities when modal opens
  useEffect(() => {
    if (open && user.id) {
      const fetchFacilities = async () => {
        setLoadingFacilities(true);
        try {
          // Fetch all facilities from getownfacility
          const allFacilitiesPayload = {
            userName: localStorage.getItem('userName') || '',
            userPass: localStorage.getItem('userPwd') || '',
            deviceStat: 'M',
            callingFrom: 'web',
            orgId: localStorage.getItem('orgId') || '',
            searchFacility: '',
            status: 'All',
          };
          const allFacilities = await getOwnFacilites(allFacilitiesPayload);
          
          // Ensure response is an array
          if (Array.isArray(allFacilities)) {
            setFacilities(allFacilities);
            
            // Fetch assigned facilities to know which ones are selected
            try {
              const assignedFacilities = await getAssignedFacilities(user.id.toString());
              if (Array.isArray(assignedFacilities)) {
                const assignedIds = new Set(assignedFacilities.map(f => f.facilityId));
                setAssignedFacilityIds(assignedIds);
              }
            } catch (assignedError) {
              console.error('Error fetching assigned facilities:', assignedError);
              setAssignedFacilityIds(new Set());
            }

            // Fetch all saved role and privilege mappings for this user (for all facilities)
            try {
              const [roleMappings, privilegeMappings] = await Promise.all([
                getOrgFacilityUserRoleMapping(user.id.toString()),
                getOrgUserFacilityPrivilegeMapping(user.id.toString())
              ]);
              setAllUserRoleMappings(roleMappings || []);
              setAllUserPrivilegeMappings(privilegeMappings || []);
            } catch (mappingError) {
              console.error('Error fetching user mappings:', mappingError);
              setAllUserRoleMappings([]);
              setAllUserPrivilegeMappings([]);
            }
          } else {
            console.error('Invalid response format - expected array:', allFacilities);
            setFacilities([]);
            setAssignedFacilityIds(new Set());
          }
        } catch (error) {
          console.error('Error fetching facilities:', error);
          setFacilities([]);
          setAssignedFacilityIds(new Set());
        } finally {
          setLoadingFacilities(false);
        }
      };
      fetchFacilities();
    } else {
      // Reset facilities when modal closes
      setFacilities([]);
      setAssignedFacilityIds(new Set());
      setAllUserRoleMappings([]);
      setAllUserPrivilegeMappings([]);
    }
  }, [open, user.id]);

  // Fetch roles when facility is selected
  useEffect(() => {
    if (selectedFacility && user.id) {
      const fetchRoles = async () => {
        setLoadingRoles(true);
        setSelectedPrivileges([]);
        setPrivileges([]);
        
        try {
          // Step 1: Fetch ALL available roles for the facility based on user type (Doctor/Non-Doctor)
          const isDoctor = user.isDoctor === 1;
          const allFacilityRoles = await getAllRolesOfFacility(
            selectedFacility.facilityId.toString(),
            isDoctor
          );
          
          console.log('getAllRolesOfFacility response:', allFacilityRoles);
          
          // Ensure allFacilityRoles is an array - always set roles if it's an array
          if (Array.isArray(allFacilityRoles)) {
            setRoles(allFacilityRoles);
            console.log('Roles set:', allFacilityRoles.length, 'roles');
            
            // Step 2: Fetch the selected/assigned roles for this user (handle errors gracefully)
            let userRoleMappings: FacilityUserRoleMapping[] = [];
            try {
              userRoleMappings = await getOrgFacilityUserRoleMapping(user.id.toString());
              console.log('getOrgFacilityUserRoleMapping response:', userRoleMappings);
              // Ensure it's an array
              if (!Array.isArray(userRoleMappings)) {
                userRoleMappings = [];
              }
            } catch (mappingError) {
              console.log('No role mappings found or error fetching mappings:', mappingError);
              userRoleMappings = [];
            }
            
            // Step 3: Filter roles that are assigned to this user for the selected facility
            const selectedRoleIds = userRoleMappings
              .filter(mapping => mapping.facilityId === selectedFacility.facilityId)
              .map(mapping => mapping.roleId);
            
            console.log('Selected role IDs for facility:', selectedRoleIds);
            
            // Step 4: Pre-select only the roles that are assigned to this user in this facility
            // Match by roleId (orgRoleId from getAllRolesOfFacility matches roleId from getOrgFacilityUserRoleMapping)
            const selectedRoleNames = allFacilityRoles
              .filter(role => selectedRoleIds.includes(role.orgRoleId))
              .map(role => role.roleName);
            
            console.log('Selected role names:', selectedRoleNames);
            setSelectedRoles(selectedRoleNames);
          } else {
            console.warn('getAllRolesOfFacility did not return an array:', allFacilityRoles, typeof allFacilityRoles);
            setRoles([]);
            setSelectedRoles([]);
          }
        } catch (error) {
          console.error('Error fetching facility roles:', error);
          setRoles([]);
          setSelectedRoles([]);
        } finally {
          setLoadingRoles(false);
        }
      };
      fetchRoles();
    } else {
      setRoles([]);
      setPrivileges([]);
      setSelectedRoles([]);
      setSelectedPrivileges([]);
    }
  }, [selectedFacility, user.id, user.isDoctor]);

  // Fetch privileges when roles are selected
  useEffect(() => {
    if (selectedFacility && selectedRoles.length > 0 && roles.length > 0) {
      const fetchPrivileges = async () => {
        setLoadingPrivileges(true);
        
        try {
          // Step 1: Get orgRoleId for selected role names (from UI selections)
          const selectedRoleIds = roles
            .filter(role => selectedRoles.includes(role.roleName))
            .map(role => role.orgRoleId);
          
          if (selectedRoleIds.length > 0) {
            // Step 2: Fetch ALL available privileges for the selected roles
            const allPrivileges = await getAllPrivsOfRoleInOrg(
              selectedFacility.facilityId.toString(),
              selectedRoleIds
            );
            setPrivileges(allPrivileges);
            
            // Step 3: Fetch the assigned/selected privileges for this user
            const userPrivilegeMappings = await getOrgUserFacilityPrivilegeMapping(user.id.toString());
            
            // Step 4: Filter privileges that are assigned to this user for the selected facility
            const assignedPrivilegeIds = userPrivilegeMappings
              .filter(mapping => mapping.facilityId === selectedFacility.facilityId)
              .map(mapping => mapping.privilegeId);
            
            // Step 5: Pre-select only the privileges that are assigned to this user in this facility
            // Match by privilegeId
            const assignedPrivilegeNames = allPrivileges
              .filter(priv => assignedPrivilegeIds.includes(priv.privilegeId))
              .map(priv => priv.menuName);
            
            setSelectedPrivileges(assignedPrivilegeNames);
          } else {
            setPrivileges([]);
            setSelectedPrivileges([]);
          }
        } catch (error) {
          console.error('Error fetching privileges for selected roles:', error);
          setPrivileges([]);
          setSelectedPrivileges([]);
        } finally {
          setLoadingPrivileges(false);
        }
      };
      fetchPrivileges();
    } else if (selectedRoles.length === 0) {
      // Clear privileges when no roles are selected
      setPrivileges([]);
      setSelectedPrivileges([]);
    }
  }, [selectedRoles, selectedFacility, roles, user.id]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handlePrivilegeToggle = (priv: string) => {
    setSelectedPrivileges((prev) =>
      prev.includes(priv) ? prev.filter((p) => p !== priv) : [...prev, priv]
    );
  };

  const handleFacilitySelect = (facility: FaclityServiceResponse) => {
    setSelectedFacility(facility);
  };

  const handleSave = async () => {
    if (!selectedFacility) {
      setSnackbar({
        open: true,
        message: 'Please select a facility',
        severity: 'error'
      });
      return;
    }

    if (selectedRoles.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one role',
        severity: 'error'
      });
      return;
    }

    setIsSaving(true);
    try {
      // Step 1: Get current facility's selections
      const currentFacilityRoleIds = roles
        .filter(role => selectedRoles.includes(role.roleName))
        .map(role => ({
          facilityId: selectedFacility.facilityId,
          roleId: role.orgRoleId
        }));

      const currentFacilityPrivIds = privileges
        .filter(priv => selectedPrivileges.includes(priv.menuName))
        .map(priv => ({
          facilityId: selectedFacility.facilityId,
          privilegeId: priv.privilegeId
        }));

      // Step 2: Get all other facilities' saved data (exclude current facility)
      const otherFacilitiesRoleIds = allUserRoleMappings
        .filter(mapping => mapping.facilityId !== selectedFacility.facilityId)
        .map(mapping => ({
          facilityId: mapping.facilityId,
          roleId: mapping.roleId
        }));

      const otherFacilitiesPrivIds = allUserPrivilegeMappings
        .filter(mapping => mapping.facilityId !== selectedFacility.facilityId)
        .map(mapping => ({
          facilityId: mapping.facilityId,
          privilegeId: mapping.privilegeId
        }));

      // Step 3: Merge current selections with saved data for other facilities
      const allFacilityRoleIds = [...currentFacilityRoleIds, ...otherFacilitiesRoleIds];
      const allFacilityPrivIds = [...currentFacilityPrivIds, ...otherFacilitiesPrivIds];

      // Step 4: Get all unique facility IDs
      const allFacilityIds = new Set<number>();
      allFacilityRoleIds.forEach(fr => allFacilityIds.add(fr.facilityId));
      allFacilityPrivIds.forEach(fp => allFacilityIds.add(fp.facilityId));
      const facilityIdsArray = Array.from(allFacilityIds);

      // Log for debugging
      console.log('Saving user privileges (all facilities):', {
        currentFacilityId: selectedFacility.facilityId,
        allFacilityIds: facilityIdsArray,
        totalRolesCount: allFacilityRoleIds.length,
        totalPrivilegesCount: allFacilityPrivIds.length,
        facilityRoleIds: allFacilityRoleIds.map(fr => `${fr.facilityId}_${fr.roleId}`).join(','),
        facilityPrivIds: allFacilityPrivIds.map(fp => `${fp.facilityId}_${fp.privilegeId}`).join(','),
      });

      // Step 5: Call the API (using 'edit' mode as default - can handle both add and edit)
      const response = await saveUserPrivileges(
        user.id.toString(),
        facilityIdsArray,
        allFacilityRoleIds,
        allFacilityPrivIds,
        'edit' // Using 'edit' mode as default
      );

      // Step 6: Update the saved mappings with current selections
      // Remove old mappings for current facility and add new ones
      const updatedRoleMappings = [
        ...allUserRoleMappings.filter(m => m.facilityId !== selectedFacility.facilityId),
        ...currentFacilityRoleIds.map(fr => ({
          roleName: roles.find(r => r.orgRoleId === fr.roleId)?.roleName || '',
          roleGroupName: '',
          roleId: fr.roleId,
          facilityId: fr.facilityId,
          orgUserId: user.id,
          activeInd: 1
        }))
      ];

      const updatedPrivMappings = [
        ...allUserPrivilegeMappings.filter(m => m.facilityId !== selectedFacility.facilityId),
        ...currentFacilityPrivIds.map(fp => ({
          id: 0,
          privilegeId: fp.privilegeId,
          parentId: 0,
          facilityId: fp.facilityId,
          menuName: privileges.find(p => p.privilegeId === fp.privilegeId)?.menuName || '',
          displayName: null,
          menuAction: null,
          facilityName: null
        }))
      ];

      setAllUserRoleMappings(updatedRoleMappings);
      setAllUserPrivilegeMappings(updatedPrivMappings);

      setSnackbar({
        open: true,
        message: response.message || 'Role and Privilege Saved Successfully!',
        severity: 'success'
      });

      // Call the onSubmit callback if provided
      onSubmit({
        facility: selectedFacility.facilityName,
        roles: selectedRoles,
        privileges: selectedPrivileges,
      });

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving user privileges:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save role and privilege. Please try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: '#174a7c', color: 'white', fontWeight: 'bold' }}>
        ASSIGN USER PRIVILEGE
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
          <Typography variant="subtitle1" sx={{ flex: 1 }}>
            Privilege management for {user.firstName} {user.lastName} [Employee Id: {user.id}]
          </Typography>
          <Avatar src={user.image} sx={{ width: 56, height: 56, bgcolor: '#e0e0e0' }} />
        </Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          ** Please select only one facility at a time
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          {/* Facility List */}
          <Paper sx={{ flex: 1, minHeight: 300, p: 1, boxShadow: 3 }}>
            <Typography fontWeight="bold" mb={1}>Choose Facility :</Typography>
            {loadingFacilities ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
              </Box>
            ) : !Array.isArray(facilities) || facilities.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No facilities assigned to this user
                </Typography>
              </Box>
            ) : (
              <List>
                {facilities.map((facility) => {
                  const isAssigned = assignedFacilityIds.has(facility.facilityId);
                  return (
                    <ListItem
                      key={facility.facilityId}
                      button
                      selected={selectedFacility?.facilityId === facility.facilityId}
                      onClick={() => handleFacilitySelect(facility)}
                      sx={{
                        bgcolor: isAssigned ? '#e3f2fd' : 'transparent',
                        '&:hover': {
                          bgcolor: isAssigned ? '#bbdefb' : '#f5f5f5',
                        },
                      }}
                    >
                      <ListItemText 
                        primary={facility.facilityName}
                        secondary={isAssigned ? 'Assigned' : ''}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
          {/* Roles List */}
          <Paper sx={{ flex: 1, minHeight: 300, p: 1, boxShadow: 3 }}>
            <Typography fontWeight="bold" mb={1}>Roles in Facility :</Typography>
            {!selectedFacility ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Please select a facility first
                </Typography>
              </Box>
            ) : loadingRoles ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
              </Box>
            ) : roles.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No roles available for this facility
                </Typography>
              </Box>
            ) : (
              <List>
                {roles.map((role) => (
                  <ListItem key={role.orgRoleId} dense button onClick={() => handleRoleToggle(role.roleName)}>
                    <Checkbox
                      edge="start"
                      checked={selectedRoles.includes(role.roleName)}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText primary={role.roleName} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
          {/* Privileges List */}
          <Paper sx={{ flex: 1, minHeight: 300, p: 1, boxShadow: 3 }}>
            <Typography fontWeight="bold" mb={1}>Assign Privilege :</Typography>
            {!selectedFacility ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Please select a facility first
                </Typography>
              </Box>
            ) : selectedRoles.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Please select one or more roles first
                </Typography>
              </Box>
            ) : loadingPrivileges ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
              </Box>
            ) : privileges.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No privileges available for selected roles
                </Typography>
              </Box>
            ) : (
              <List>
                {privileges.map((privilege) => (
                  <ListItem key={privilege.privilegeId} dense button onClick={() => handlePrivilegeToggle(privilege.menuName)}>
                    <Checkbox
                      edge="start"
                      checked={selectedPrivileges.includes(privilege.menuName)}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText primary={privilege.menuName} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pr: 4, pb: 2 }}>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          sx={{ bgcolor: '#174a7c' }}
          disabled={isSaving || !selectedFacility || selectedRoles.length === 0}
          startIcon={isSaving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : null}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ bgcolor: '#174a7c' }}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </DialogActions>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AssignUserPrivilegeModal; 