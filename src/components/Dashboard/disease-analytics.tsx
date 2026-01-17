'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  AlertTitle,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { AlertTriangle, Activity, Filter, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface SeasonalData {
  season: string;
  respiratory: number;
  skin: number;
  digestive: number;
  parasitic: number;
  total: number;
}

interface DiseaseData {
  name: string;
  value: number;
  color: string;
  trend: number;
}

interface MonthlyTrend {
  month: string;
  cases: number;
  severity: number;
  prevention: number;
}

interface Outbreak {
  disease: string;
  location: string;
  cases: number;
  severity: 'low' | 'moderate' | 'high';
  trend: 'increasing' | 'stable' | 'decreasing';
}

const seasonalData: SeasonalData[] = [
  { season: 'Spring', respiratory: 45, skin: 32, digestive: 28, parasitic: 55, total: 160 },
  { season: 'Summer', respiratory: 25, skin: 48, digestive: 35, parasitic: 72, total: 180 },
  { season: 'Fall', respiratory: 38, skin: 22, digestive: 40, parasitic: 35, total: 135 },
  { season: 'Winter', respiratory: 65, skin: 18, digestive: 30, parasitic: 20, total: 133 },
];

const currentDiseases: DiseaseData[] = [
  { name: 'Skin Allergies', value: 28, color: '#3b82f6', trend: 5.2 },
  { name: 'Respiratory Issues', value: 23, color: '#10b981', trend: -2.1 },
  { name: 'Digestive Problems', value: 19, color: '#f59e0b', trend: 3.8 },
  { name: 'Parasitic Infections', value: 15, color: '#ef4444', trend: -1.5 },
  { name: 'Others', value: 15, color: '#8b5cf6', trend: 0.8 },
];

const monthlyTrends: MonthlyTrend[] = [
  { month: 'Jan', cases: 145, severity: 6.2, prevention: 8.5 },
  { month: 'Feb', cases: 132, severity: 5.8, prevention: 8.8 },
  { month: 'Mar', cases: 168, severity: 7.1, prevention: 8.2 },
  { month: 'Apr', cases: 189, severity: 7.8, prevention: 7.9 },
  { month: 'May', cases: 203, severity: 8.2, prevention: 7.5 },
  { month: 'Jun', cases: 178, severity: 7.4, prevention: 8.1 },
];

const recentOutbreaks: Outbreak[] = [
  {
    disease: 'Kennel Cough',
    location: 'North District',
    cases: 12,
    severity: 'moderate',
    trend: 'increasing',
  },
  {
    disease: 'Parvovirus',
    location: 'East District',
    cases: 5,
    severity: 'high',
    trend: 'stable',
  },
];

export function DiseaseAnalytics() {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeChart, setActiveChart] = useState('seasonal');

  const filteredData = useMemo(() => {
    if (selectedSeason === 'all') return seasonalData;
    return seasonalData.filter((data) => data.season.toLowerCase() === selectedSeason.toLowerCase());
  }, [selectedSeason]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: 1, borderColor: 'grey.300' }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight="bold">
            Pychart Seasonal disease
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Disease patterns and outbreak monitoring
          </Typography>
        }
        action={
          <Button variant="outlined" size="small" startIcon={<Filter size={16} />}>
            Filter
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {/* Disease Outbreak Alerts */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
            Recent Outbreak Alerts
          </Typography>
          {recentOutbreaks.map((outbreak, index) => (
            <Alert key={index} severity="warning" sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="body2">
                  <strong>{outbreak.disease}</strong> in {outbreak.location} - {outbreak.cases} cases
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={outbreak.severity}
                    color={outbreak.severity === 'high' ? 'error' : 'default'}
                    size="small"
                  />
                  <Chip label={outbreak.trend} variant="outlined" size="small" />
                </Box>
              </Box>
            </Alert>
          ))}
        </Box>

       

        
      </CardContent>
    </Card>
  );
}