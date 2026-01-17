import React, { useState } from 'react';
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import PrivateRoute from "@/components/PrivateRoute";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography, TablePagination, Grid, Select, MenuItem, TextField
} from '@mui/material';
import UserSelfConfirmModal from '@/components/MaintainOtherUsers/DoctorSelfConfirmModal';
import EditUserDetailsModal from '@/components/MaintainOtherUsers/EditUserDetailsModal';
import AssignUserPrivilegeModal from '@/components/MaintainOtherUsers/AssignUserPrivilegeModal';
import EditIcon from '@mui/icons-material/Edit';

interface User {
  id: number;
  image: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  area: string;
  country: string;
  state: string;
  pin: string;
  cellNo: string;
  userName: string;
  status: string;
}

interface PrivilegeUser {
  id: number;
  firstName: string;
  lastName: string;
  image?: string;
}

const getDummyUsers = () => [
  {
    id: 1,
    image: '',
    title: 'Mr.',
    firstName: 'Partha',
    lastName: 'Test',
    email: 'namosiva6@gmail.com',
    address1: 'Test',
    address2: '',
    city: 'Kolkata',
    area: 'Salt Lake',
    country: 'India',
    state: 'West Bengal',
    pin: '700091',
    cellNo: '9932123125',
    userName: typeof window !== 'undefined' ? localStorage.getItem('userName') || '' : '',
    status: 'Active',
  },
];

const blankUser: User = {
  id: 0,
  image: '',
  title: 'Mr.',
  firstName: '',
  lastName: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  area: '',
  country: '',
  state: '',
  pin: '',
  cellNo: '',
  userName: '',
  status: 'Active',
};

const mockFacilities = ['All Facilities', 'Test Facility 1', 'Test Facility 2'];

const UsersTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selfConfirmOpen, setSelfConfirmOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [privilegeModalOpen, setPrivilegeModalOpen] = useState(false);
  const [privilegeUser, setPrivilegeUser] = useState<PrivilegeUser | null>(null);
  const [facilityFilter, setFacilityFilter] = useState('All Facilities');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const dummyUsers = getDummyUsers();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = dummyUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const filteredUsers = paginatedUsers.filter(user => {
    const firstNameMatch = user.firstName.toLowerCase().includes(firstNameFilter.toLowerCase());
    const lastNameMatch = user.lastName.toLowerCase().includes(lastNameFilter.toLowerCase());
    const statusMatch = !statusFilter || user.status.toLowerCase() === statusFilter.toLowerCase();
    return firstNameMatch && lastNameMatch && statusMatch;
  });

  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Maintain Other Users
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" mb={2}>
            <Grid item xs={12} sm={3}>
              <Select
                fullWidth
                displayEmpty
                value={facilityFilter}
                onChange={e => setFacilityFilter(e.target.value)}
                variant="outlined"
              >
                {mockFacilities.map(fac => <MenuItem key={fac} value={fac}>{fac}</MenuItem>)}
              </Select>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="First Name"
                value={firstNameFilter}
                onChange={e => setFirstNameFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Last Name"
                value={lastNameFilter}
                onChange={e => setLastNameFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Select
                fullWidth
                displayEmpty
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={3} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{
                  background: "#174a7c"
                }}
                onClick={() => { setSelectedUser(blankUser); setEditModalOpen(true); }}
              >
                Add New User
              </Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#0a3761' }}>
                  <TableCell sx={{ color: 'white' }}><b>Image</b></TableCell>
                  <TableCell sx={{ color: 'white' }}><b>Name</b></TableCell>
                  <TableCell sx={{ color: 'white' }}><b>Phone</b></TableCell>
                  <TableCell sx={{ color: 'white' }}><b>Email</b></TableCell>
                  <TableCell sx={{ color: 'white' }}><b>Status</b></TableCell>
                  <TableCell sx={{ color: 'white' }}><b>Action</b></TableCell>
                  <TableCell sx={{ color: 'white' }}><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No records to view
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar alt={user.firstName + ' ' + user.lastName} src={user.image} />
                      </TableCell>
                      <TableCell>{user.firstName + ' ' + user.lastName}</TableCell>
                      <TableCell>{user.cellNo}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={() => { setSelectedUser(user); setEditModalOpen(true); }}>Edit User Details</Button>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" onClick={() => { setPrivilegeUser({
                          id: user.id,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          image: user.image,
                        }); setPrivilegeModalOpen(true); }}>Assign User Privilege</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={dummyUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
          <UserSelfConfirmModal
            open={selfConfirmOpen}
            onYes={() => setSelfConfirmOpen(false)}
            onNo={() => { setSelfConfirmOpen(false); setDetailsOpen(false); }}
          />
          {selectedUser && (
            <EditUserDetailsModal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              user={selectedUser}
              onSubmit={(updatedUser) => {
                // TODO: handle update logic
                setEditModalOpen(false);
              }}
            />
          )}
          {privilegeUser && (
            <AssignUserPrivilegeModal
              open={privilegeModalOpen}
              onClose={() => setPrivilegeModalOpen(false)}
              user={privilegeUser}
              onSubmit={(data) => {
                // handle save
                setPrivilegeModalOpen(false);
              }}
            />
          )}
        </Box>
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default UsersTable;
