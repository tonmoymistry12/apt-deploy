
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
  Box,
  Paper,
  Grid,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
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
  DollarSign,
} from "lucide-react";

// Interfaces
interface UserGrowthData {
  month: string;
  users: number;
  newUsers: number;
  appointments: number;
  revenue: number;
}

interface ActivityData {
  day: string;
  visits: number;
  bookings: number;
}

interface ExpenditureData {
  clinic: string;
  expenditure: number;
  profit: number;
  percentage: number;
  color: string;
}

interface ProfitBreakdownData {
  clinic: string;
  profit: number;
  percentage: number;
  color: string;
}

interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<{ size?: string | number }>;
  description: string;
}

// Data
const userGrowthData: UserGrowthData[] = [
  { month: "Jan", users: 1200, newUsers: 150, appointments: 890, revenue: 45000 },
  { month: "Feb", users: 1350, newUsers: 180, appointments: 1020, revenue: 52000 },
  { month: "Mar", users: 1530, newUsers: 220, appointments: 1180, revenue: 58000 },
  { month: "Apr", users: 1750, newUsers: 280, appointments: 1350, revenue: 67000 },
  { month: "May", users: 2030, newUsers: 320, appointments: 1520, revenue: 76000 },
  { month: "Jun", users: 2350, newUsers: 380, appointments: 1780, revenue: 89000 },
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

const expenditureData: Record<string, ExpenditureData[]> = {
  "Clinic A": [
    { clinic: "Branch 1", expenditure: 15000, profit: 25000, percentage: 25, color: "#3b82f6" },
    { clinic: "Branch 2", expenditure: 12000, profit: 18000, percentage: 20, color: "#10b981" },
    { clinic: "Branch 3", expenditure: 18000, profit: 22000, percentage: 30, color: "#f59e0b" },
    { clinic: "Branch 4", expenditure: 10000, profit: 15000, percentage: 25, color: "#ef4444" },
  ],
  "Clinic B": [
    { clinic: "Branch 1", expenditure: 13000, profit: 20000, percentage: 28, color: "#3b82f6" },
    { clinic: "Branch 2", expenditure: 11000, profit: 17000, percentage: 22, color: "#10b981" },
    { clinic: "Branch 3", expenditure: 16000, profit: 21000, percentage: 27, color: "#f59e0b" },
    { clinic: "Branch 4", expenditure: 9000, profit: 14000, percentage: 23, color: "#ef4444" },
  ],
  "Clinic C": [
    { clinic: "Branch 1", expenditure: 14000, profit: 23000, percentage: 26, color: "#3b82f6" },
    { clinic: "Branch 2", expenditure: 11500, profit: 17500, percentage: 21, color: "#10b981" },
    { clinic: "Branch 3", expenditure: 17000, profit: 21500, percentage: 29, color: "#f59e0b" },
    { clinic: "Branch 4", expenditure: 9500, profit: 14500, percentage: 24, color: "#ef4444" },
  ],
  "Clinic D": [
    { clinic: "Branch 1", expenditure: 16000, profit: 24000, percentage: 27, color: "#3b82f6" },
    { clinic: "Branch 2", expenditure: 12500, profit: 18500, percentage: 23, color: "#10b981" },
    { clinic: "Branch 3", expenditure: 19000, profit: 22500, percentage: 31, color: "#f59e0b" },
    { clinic: "Branch 4", expenditure: 10500, profit: 15500, percentage: 26, color: "#ef4444" },
  ],
};

// Updated profit breakdown data based on the image
const profitBreakdownData: ProfitBreakdownData[] = [
  { clinic: "Clinic A", profit: 80000, percentage: 25.4, color: "#3b82f6" }, // Blue
  { clinic: "Clinic B", profit: 72000, percentage: 22.9, color: "#10b981" }, // Green
  { clinic: "Clinic C", profit: 76500, percentage: 24.3, color: "#f59e0b" }, // Orange
  { clinic: "Clinic D", profit: 80500, percentage: 25.6, color: "#ef4444" }, // Red
];
// Note: Percentages are calculated based on total profit ($309,000), rounded to 1 decimal place.

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

const clinics = ["Clinic A", "Clinic B", "Clinic C", "Clinic D"];

export function UserAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [activeChart, setActiveChart] = useState("growth");
  const [selectedClinic, setSelectedClinic] = useState("Clinic A");

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

  // Reusable Distribution Component
  const DistributionChart = ({
    data,
    title,
    dataKey,
    nameKey,
    isProfitBreakdown = false,
  }: {
    data: any[];
    title: string;
    dataKey: string;
    nameKey: string;
    isProfitBreakdown?: boolean;
  }) => (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box sx={{ height: 264, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="percentage"
                label={({ [nameKey]: name, percentage }) => `${name}: ${percentage}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Paper sx={{ p: 2, border: 1, borderColor: "grey.300" }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {payload[0].payload[nameKey]}
                        </Typography>
                        <Typography variant="body2">
                          Profit: ${payload[0].payload.profit.toLocaleString()}
                        </Typography>
                        {payload[0].payload.expenditure && (
                          <Typography variant="body2">
                            Expenditure: ${payload[0].payload.expenditure.toLocaleString()}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          Percentage: {payload[0].payload.percentage}%
                        </Typography>
                      </Paper>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {data.map((item, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: item.color,
                  }}
                />
                <Typography variant="body1" fontWeight="medium">
                  {item[nameKey]}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" color="text.secondary">
                  Profit: ${item.profit.toLocaleString()}
                </Typography>
                {item.expenditure && (
                  <Typography variant="body2" color="text.secondary">
                    Expenditure: ${item.expenditure.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      </Grid>
    </Grid>
  );

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
            Profit Breakdown
          </Button>
          <Button
            variant={activeChart === "activity" ? "contained" : "outlined"}
            size="small"
            startIcon={<Activity size={16} />}
            onClick={() => setActiveChart("activity")}
          >
            Activity
          </Button>
          <Button
            variant={activeChart === "expenditure" ? "contained" : "outlined"}
            size="small"
            startIcon={<DollarSign size={16} />}
            onClick={() => setActiveChart("expenditure")}
          >
            Expenditure
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
          <Box>
            <Box sx={{ mb: 3 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Clinic</InputLabel>
                <Select
                  value={selectedClinic}
                  label="Clinic"
                  onChange={(e) => setSelectedClinic(e.target.value)}
                >
                  {clinics.map((clinic) => (
                    <MenuItem key={clinic} value={clinic}>
                      {clinic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <DistributionChart
              data={profitBreakdownData}
              title="Profit Breakdown"
              dataKey="profit"
              nameKey="clinic"
              isProfitBreakdown={true}
            />
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                {selectedClinic} Branch Breakdown
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {expenditureData[selectedClinic].map((item, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: item.color,
                        }}
                      />
                      <Typography variant="body1" fontWeight="medium">
                        {item.clinic}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" color="text.secondary">
                        Profit: ${item.profit.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expenditure: ${item.expenditure.toLocaleString()}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
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

        {activeChart === "expenditure" && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Clinic</InputLabel>
                <Select
                  value={selectedClinic}
                  label="Clinic"
                  onChange={(e) => setSelectedClinic(e.target.value)}
                >
                  {clinics.map((clinic) => (
                    <MenuItem key={clinic} value={clinic}>
                      {clinic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <DistributionChart
              data={expenditureData[selectedClinic]}
              title={`${selectedClinic} Expenditure & Profit`}
              dataKey="expenditure"
              nameKey="clinic"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
