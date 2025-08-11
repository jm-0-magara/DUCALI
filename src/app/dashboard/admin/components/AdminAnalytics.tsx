import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Package, 
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { adminDataService, AdminStats } from '../../../../lib/adminDataService';
import { RevenueChart, UserGrowthChart, CategoryPieChart } from '../../../../components/charts/AdminCharts';
import { useCurrency } from '../../../../contexts/CurrencyContext';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export function AdminAnalytics() {
  const { formatCurrency } = useCurrency();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [revenueData, setRevenueData] = useState<ChartData | null>(null);
  const [userGrowthData, setUserGrowthData] = useState<ChartData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await adminDataService.getStats();
        setStats(statsData);
        
        // Generate mock chart data (in real app, this would come from Firebase)
        generateChartData();
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const generateChartData = () => {
    // Mock revenue data
    const revenueLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenueValues: number[] = [12000, 19000, 15000, 25000, 22000, 30000];
    
    setRevenueData({
      labels: revenueLabels,
      datasets: [{
        label: 'Revenue',
        data: revenueValues,
        borderColor: '#10B981',
        fill: true
      }]
    });

    // Mock user growth data
    const userLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const customerValues: number[] = [150, 200, 250, 300, 350, 400];
    const artisanValues: number[] = [20, 25, 30, 35, 40, 45];
    
    setUserGrowthData({
      labels: userLabels,
      datasets: [
        {
          label: 'Customers',
          data: customerValues,
          borderColor: '#3B82F6',
          fill: false
        },
        {
          label: 'Artisans',
          data: artisanValues,
          borderColor: '#F59E0B',
          fill: false
        }
      ]
    });
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };



  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-slate-400 mt-2">Platform performance insights</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-8 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-2">Platform performance insights</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">
                {stats ? formatCurrency(stats.totalRevenue) : '$0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5% from last month
          </div>
        </div>

        {/* Users */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.totalUsers.toLocaleString() : '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{stats ? stats.newUsersThisWeek : 0} this week
          </div>
        </div>

        {/* Orders */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.totalOrders.toLocaleString() : '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +8.2% from last month
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.averageRating.toFixed(1) : '0.0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +0.2 from last month
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          {revenueData && <RevenueChart data={revenueData} />}
        </div>

        {/* User Growth Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">User Growth</h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          {userGrowthData && <UserGrowthChart data={userGrowthData} />}
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Categories */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue by Category</h3>
          <CategoryPieChart 
            data={[
              { name: 'Jewelry', value: 15000, color: '#10B981' },
              { name: 'Furniture', value: 12000, color: '#3B82F6' },
              { name: 'Textiles', value: 8000, color: '#F59E0B' },
              { name: 'Pottery', value: 6000, color: '#8B5CF6' },
              { name: 'Others', value: 2000, color: '#EF4444' }
            ]} 
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New order placed', time: '2 min ago', type: 'order' },
              { action: 'Artisan verified', time: '5 min ago', type: 'verification' },
              { action: 'Payment received', time: '10 min ago', type: 'payment' },
              { action: 'User registered', time: '15 min ago', type: 'registration' },
              { action: 'Review posted', time: '20 min ago', type: 'review' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">{activity.action}</p>
                  <p className="text-slate-500 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Conversion Rate</span>
              <span className="text-white font-medium">3.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Avg Order Value</span>
              <span className="text-white font-medium">$127</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Customer Retention</span>
              <span className="text-white font-medium">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Response Time</span>
              <span className="text-white font-medium">2.4h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Satisfaction Score</span>
              <span className="text-white font-medium">4.6/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
