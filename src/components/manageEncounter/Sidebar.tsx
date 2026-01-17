import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Home,
  History,
  MonitorHeart,
  Feedback,
  Warning,
  Assignment,
  Science,
  Medication,
  LocalHospital,
  Note,
  Lock,
  PersonAdd,
  Upload,
  Summarize,
} from '@mui/icons-material';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  menuItems: { id: string; label: string; icon: React.ReactNode; tooltip: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, menuItems }) => {
  const handleSectionChange = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <Box
      sx={{
        minWidth: 250,
        bgcolor: '#4B6CB7',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        color: 'white',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        
      }}
    >
      
      <Divider sx={{  bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
      <List
        sx={{
          px: 1,
          flexGrow: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent track
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)', // Light thumb
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.5)', // Darker on hover
            },
          },
        }}
      >
        {menuItems.map((item) => (
          <Tooltip key={item.id} title={item.tooltip} placement="right">
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={activeSection === item.id}
                onClick={() => handleSectionChange(item.id)}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  transition: 'all 0.2s ease-in-out',
                  bgcolor: activeSection === item.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateX(4px)',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': { color: 'white' },
                  },
                }}
                aria-label={item.label}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: activeSection === item.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: activeSection === item.id ? '600' : '500',
                    color: activeSection === item.id ? 'white' : 'rgba(255, 255, 255, 0.9)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
};

export default React.memo(Sidebar);