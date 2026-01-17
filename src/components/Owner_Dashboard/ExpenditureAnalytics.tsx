import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
  Line
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Building2, Calculator, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

interface MonthlyFinancials {
  month: string;
  expenditure: number;
  revenue: number;
  profit: number;
  profitMargin: number;
}

interface ClinicFinancials {
  clinicName: string;
  location: string;
  expenditure: number;
  revenue: number;
  profit: number;
  profitMargin: number;
  color: string;
}

interface ExpenditureCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

const monthlyData: MonthlyFinancials[] = [
  { month: 'Jan', expenditure: 45000, revenue: 67000, profit: 22000, profitMargin: 32.8 },
  { month: 'Feb', expenditure: 48000, revenue: 72000, profit: 24000, profitMargin: 33.3 },
  { month: 'Mar', expenditure: 52000, revenue: 78000, profit: 26000, profitMargin: 33.3 },
  { month: 'Apr', expenditure: 49000, revenue: 82000, profit: 33000, profitMargin: 40.2 },
  { month: 'May', expenditure: 53000, revenue: 89000, profit: 36000, profitMargin: 40.4 },
  { month: 'Jun', expenditure: 55000, revenue: 95000, profit: 40000, profitMargin: 42.1 },
];

const clinicData: ClinicFinancials[] = [
  {
    clinicName: 'Downtown Veterinary Clinic',
    location: 'Downtown',
    expenditure: 18000,
    revenue: 32000,
    profit: 14000,
    profitMargin: 43.8,
    color: '#3b82f6'
  },
  {
    clinicName: 'Suburban Pet Care',
    location: 'Suburbs',
    expenditure: 15000,
    revenue: 28000,
    profit: 13000,
    profitMargin: 46.4,
    color: '#10b981'
  },
  {
    clinicName: 'Emergency Animal Hospital',
    location: 'Medical District',
    expenditure: 22000,
    revenue: 35000,
    profit: 13000,
    profitMargin: 37.1,
    color: '#f59e0b'
  }
];

const expenditureCategories: ExpenditureCategory[] = [
  { category: 'Staff Salaries', amount: 25000, percentage: 45.5, color: '#ef4444', trend: 'up' },
  { category: 'Medical Supplies', amount: 12000, percentage: 21.8, color: '#3b82f6', trend: 'stable' },
  { category: 'Equipment & Maintenance', amount: 8000, percentage: 14.5, color: '#10b981', trend: 'down' },
  { category: 'Utilities', amount: 4500, percentage: 8.2, color: '#f59e0b', trend: 'up' },
  { category: 'Marketing', amount: 3000, percentage: 5.5, color: '#8b5cf6', trend: 'stable' },
  { category: 'Other', amount: 2500, percentage: 4.5, color: '#6b7280', trend: 'down' },
];

const colors = {
  revenue: '#10b981',
  expenditure: '#ef4444',
  profit: '#3b82f6',
  profitMargin: '#8b5cf6',
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[12rem]">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex justify-between items-center mb-1">
          <span className="text-sm" style={{ color: entry.color }}>
            {entry.name}:
          </span>
          <span className="font-medium" style={{ color: entry.color }}>
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
      {payload[0] && payload[1] && (
        <div className="border-t pt-2 mt-2 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">Profit Margin:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {(((payload[1].value - payload[0].value) / payload[1].value) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const ClinicTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[14rem]">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.clinicName}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{data.location}</p>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Revenue:</span>
          <span className="font-medium text-green-600 dark:text-green-400">${data.revenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Expenditure:</span>
          <span className="font-medium text-red-600 dark:text-red-400">${data.expenditure.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t pt-2 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-300">Profit:</span>
          <span className="font-medium text-blue-600 dark:text-blue-400">${data.profit.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Margin:</span>
          <span className="font-medium text-purple-600 dark:text-purple-400">{data.profitMargin.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <ArrowUpRight size={14} className="text-red-500 dark:text-red-400" />;
    case 'down':
      return <ArrowDownRight size={14} className="text-green-500 dark:text-green-400" />;
    default:
      return <div className="w-3.5 h-0.5 bg-gray-400 dark:bg-gray-500" />;
  }
};

export function ExpenditureAnalytics() {
  const [activeView, setActiveView] = useState<'overview' | 'clinics' | 'categories'>('overview');

  const metrics = useMemo(() => ({
    totalExpenditure: monthlyData[monthlyData.length - 1].expenditure,
    totalRevenue: monthlyData[monthlyData.length - 1].revenue,
    totalProfit: monthlyData[monthlyData.length - 1].profit,
    profitMargin: monthlyData[monthlyData.length - 1].profitMargin,
  }), []);

  const MetricCard: React.FC<{ title: string; value: string | number; icon: JSX.Element; trend: string; color: string }> = ({
    title, value, icon, trend, color,
  }) => (
    <div className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-lg p-4 transform hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</span>
      </div>
      <div className={`text-2xl font-bold text-${color}-900 dark:text-${color}-300`}>{value}</div>
      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
        <TrendingUp size={14} />
        {trend}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Analytics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Expenditure, profit, and clinic performance insights</p>
        </div>
        <div className="flex gap-2">
          {[
            { view: 'overview', label: 'Overview', icon: <TrendingUp size={14} /> },
            { view: 'clinics', label: 'By Clinic', icon: <Building2 size={14} /> },
            { view: 'categories', label: 'Categories', icon: <Calculator size={14} /> },
          ].map(({ view, label, icon }) => (
            <button
              key={view}
              onClick={() => setActiveView(view as typeof activeView)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeView === view
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={20} className="text-blue-600 dark:text-blue-400" />}
          trend="+12.3% vs last month"
          color="blue"
        />
        <MetricCard
          title="Expenditure"
          value={`$${metrics.totalExpenditure.toLocaleString()}`}
          icon={<Calculator size={20} className="text-red-600 dark:text-red-400" />}
          trend="+3.8% vs last month"
          color="red"
        />
        <MetricCard
          title="Profit"
          value={`$${metrics.totalProfit.toLocaleString()}`}
          icon={<Target size={20} className="text-green-600 dark:text-green-400" />}
          trend="+25.7% vs last month"
          color="green"
        />
        <MetricCard
          title="Profit Margin"
          value={`${metrics.profitMargin.toFixed(1)}%`}
          icon={<TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />}
          trend="+2.1% vs last month"
          color="purple"
        />
      </div>

      {activeView === 'overview' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Financial Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.revenue} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.revenue} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenditureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.expenditure} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.expenditure} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                <YAxis fontSize={12} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="expenditure"
                  stackId="1"
                  stroke={colors.expenditure}
                  fill="url(#expenditureGradient)"
                  strokeWidth={2}
                  name="Expenditure"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="2"
                  stroke={colors.revenue}
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke={colors.profit}
                  strokeWidth={3}
                  dot={{ fill: colors.profit, strokeWidth: 2, r: 4 }}
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeView === 'clinics' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Clinic-wise Financial Performance</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clinicData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="clinicName"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    stroke="#6b7280"
                  />
                  <YAxis fontSize={12} stroke="#6b7280" />
                  <Tooltip content={<ClinicTooltip />} />
                  <Bar dataKey="expenditure" fill={colors.expenditure} name="Expenditure" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="revenue" fill={colors.revenue} name="Revenue" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {clinicData.map((clinic, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{clinic.clinicName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{clinic.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${clinic.profit.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{clinic.profitMargin.toFixed(1)}% margin</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Revenue: </span>
                      <span className="font-medium text-green-600 dark:text-green-400">${clinic.revenue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Expenditure: </span>
                      <span className="font-medium text-red-600 dark:text-red-400">${clinic.expenditure.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expenditure Breakdown</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenditureCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                    labelLine={{ stroke: '#6b7280' }}
                  >
                    {expenditureCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Category Details</h3>
            <div className="space-y-3">
              {expenditureCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{category.category}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>{category.percentage}% of total</span>
                        {getTrendIcon(category.trend)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">${category.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">monthly</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}