"use client";

import { useMemo, useState } from "react";
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
  Grid,
  Box,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  UserPlus,
  Calendar,
  CalendarCheck,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";

interface UserGrowthData {
  month: string;
  users: number;
  newUsers: number;
  appointments: number;
  revenue: number;
}

interface DemographicData {
  ageGroup: string;
  count: number;
  percentage: number;
  color: string;
}

interface ActivityData {
  day: string;
  visits: number;
  bookings: number;
}

interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<{ size?: string | number }>;
  description: string;
}

const userGrowthData: UserGrowthData[] = [
  {
    month: "Jan",
    users: 1200,
    newUsers: 150,
    appointments: 890,
    revenue: 45000,
  },
  {
    month: "Feb",
    users: 1350,
    newUsers: 180,
    appointments: 1020,
    revenue: 52000,
  },
  {
    month: "Mar",
    users: 1530,
    newUsers: 220,
    appointments: 1180,
    revenue: 58000,
  },
  {
    month: "Apr",
    users: 1750,
    newUsers: 280,
    appointments: 1350,
    revenue: 67000,
  },
  {
    month: "May",
    users: 2030,
    newUsers: 320,
    appointments: 1520,
    revenue: 76000,
  },
  {
    month: "Jun",
    users: 2350,
    newUsers: 380,
    appointments: 1780,
    revenue: 89000,
  },
];

const demographicData: DemographicData[] = [
  { ageGroup: "18-25", count: 320, percentage: 15, color: "#3b82f6" },
  { ageGroup: "26-35", count: 680, percentage: 32, color: "#10b981" },
  { ageGroup: "36-45", count: 590, percentage: 28, color: "#f59e0b" },
  { ageGroup: "46-55", count: 380, percentage: 18, color: "#ef4444" },
  { ageGroup: "55+", count: 150, percentage: 7, color: "#8b5cf6" },
];

const weeklyActivity: ActivityData[] = [
  { day: "Mon", visits: 245, bookings: 32 },
  { day: "Tue", visits: 312, bookings: 45 },
  { day: "Wed", visits: 289, bookings: 38 },
  { day: "Thu", visits: 356, bookings: 52 },
  { day: "Fri", visits: 423, bookings: 67 },
  { day: "Sat", visits: 398, bookings: 58 },
  { day: "Sun", visits: 234, bookings: 28 },
];

const stats: Stat[] = [
  {
    title: "Total Users",
    value: "2,350",
    change: "+12.5%",
    changeType: "increase",
    icon: Users,
    description: "Registered pet owners",
  },
  {
    title: "New Users",
    value: "380",
    change: "+8.3%",
    changeType: "increase",
    icon: UserPlus,
    description: "This month",
  },
  {
    title: "Previous Appointments",
    value: "1,247",
    change: "-2.1%",
    changeType: "decrease",
    icon: Calendar,
    description: "Last month",
  },
  {
    title: "Upcoming Bookings",
    value: "324",
    change: "+15.7%",
    changeType: "increase",
    icon: CalendarCheck,
    description: "Next month",
  },
];

export function UserAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [activeChart, setActiveChart] = useState("growth");

  const chartData = useMemo(() => userGrowthData, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: 1, borderColor: "grey.300" }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight="bold">
            Graph user analytics, month wise
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            User growth and appointment statistics
          </Typography>
        }
        action={
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={selectedPeriod}
                label="Period"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="1month">1 Month</MenuItem>
                <MenuItem value="3months">3 Months</MenuItem>
                <MenuItem value="6months">6 Months</MenuItem>
                <MenuItem value="1year">1 Year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Download size={16} />}
            >
              Export
            </Button>
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat) => (
            <Grid item xs={6} key={stat.title}>
              <Paper sx={{ p: 2, "&:hover": { bgcolor: "grey.50" } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <stat.icon size={20} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color:
                        stat.changeType === "increase"
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {stat.changeType === "increase" ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Chart Selection */}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Button
            variant={activeChart === "growth" ? "contained" : "outlined"}
            size="small"
            startIcon={<TrendingUp size={16} />}
            onClick={() => setActiveChart("growth")}
          >
            Growth
          </Button>
          <Button
            variant={activeChart === "demographics" ? "contained" : "outlined"}
            size="small"
            startIcon={<Users size={16} />}
            onClick={() => setActiveChart("demographics")}
          >
            Demographics
          </Button>
          <Button
            variant={activeChart === "activity" ? "contained" : "outlined"}
            size="small"
            startIcon={<Activity size={16} />}
            onClick={() => setActiveChart("activity")}
          >
            Activity
          </Button>
        </Box>

        {/* Dynamic Charts */}
        {activeChart === "growth" && (
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
              User Growth & Revenue Trend
            </Typography>
            <Box sx={{ height: 320, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis yAxisId="left" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    name="Total Users"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}

        {activeChart === "demographics" && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ mb: 2 }}
              >
                User Demographics
              </Typography>
              <Box sx={{ height: 264, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographicData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ ageGroup, percentage }) =>
                        `${ageGroup}: ${percentage}%`
                      }
                    >
                      {demographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ mb: 2 }}
              >
                Age Distribution
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {demographicData.map((demo, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: demo.color,
                        }}
                      />
                      <Typography variant="body1" fontWeight="medium">
                        {demo.ageGroup}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body1" fontWeight="bold">
                        {demo.count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {demo.percentage}%
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>
        )}

        {activeChart === "activity" && (
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
              Weekly Activity Pattern
            </Typography>
            <Box sx={{ height: 264, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyActivity}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="visits"
                    fill="#3b82f6"
                    name="Site Visits"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="#10b981"
                    name="Bookings"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: "#3b82f6",
                    borderRadius: "50%",
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Site Visits</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: "#10b981",
                    borderRadius: "50%",
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Bookings</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
