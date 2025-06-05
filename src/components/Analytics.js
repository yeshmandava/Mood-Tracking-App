import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, BarChart3, PieChart as PieIcon, Filter } from 'lucide-react';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, isWithinInterval } from 'date-fns';

const Analytics = ({ moodData }) => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, year, all
  const [chartType, setChartType] = useState('line'); // line, bar, pie

  const timeRanges = [
    { value: 'week', label: '7 Days' },
    { value: 'month', label: '30 Days' },
    { value: 'year', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: TrendingUp },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'pie', label: 'Pie Chart', icon: PieIcon }
  ];

  const filteredData = useMemo(() => {
    if (!moodData.length) return [];
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subDays(now, 30);
        break;
      case 'year':
        startDate = subDays(now, 365);
        break;
      default:
        return moodData;
    }
    
    return moodData.filter(entry => 
      isWithinInterval(new Date(entry.date), { start: startDate, end: now })
    );
  }, [moodData, timeRange]);

  const chartData = useMemo(() => {
    if (!filteredData.length) return [];
    
    // Group data by date for line and bar charts
    const groupedByDate = filteredData.reduce((acc, entry) => {
      const date = format(new Date(entry.date), 'MMM d');
      if (!acc[date]) {
        acc[date] = { date, moods: [], total: 0, count: 0 };
      }
      acc[date].moods.push(entry.mood.value);
      acc[date].total += entry.mood.value;
      acc[date].count += 1;
      return acc;
    }, {});
    
    return Object.values(groupedByDate).map(day => ({
      ...day,
      average: Math.round((day.total / day.count) * 10) / 10
    })).sort((a, b) => new Date(a.date + ', 2024') - new Date(b.date + ', 2024'));
  }, [filteredData]);

  const pieData = useMemo(() => {
    if (!filteredData.length) return [];
    
    const moodCounts = filteredData.reduce((acc, entry) => {
      const moodLabel = entry.mood.label;
      acc[moodLabel] = (acc[moodLabel] || 0) + 1;
      return acc;
    }, {});
    
    const colors = {
      'Very Sad': '#6B7280',
      'Sad': '#9CA3AF',
      'Neutral': '#D1D5DB',
      'Happy': '#93C5FD',
      'Very Happy': '#60A5FA',
      'Ecstatic': '#3B82F6'
    };
    
    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood,
      value: count,
      color: colors[mood] || '#6B7280'
    }));
  }, [filteredData]);

  const stats = useMemo(() => {
    if (!filteredData.length) return null;
    
    const moodValues = filteredData.map(entry => entry.mood.value);
    const average = moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length;
    const highest = Math.max(...moodValues);
    const lowest = Math.min(...moodValues);
    const total = filteredData.length;
    
    return { average: Math.round(average * 10) / 10, highest, lowest, total };
  }, [filteredData]);

  const getMoodEmoji = (value) => {
    const emojiMap = {
      1: '😢',
      2: '😟',
      3: '😐',
      4: '🙂',
      5: '😊',
      6: '🤩'
    };
    return emojiMap[value] || '😐';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            Average Mood: {payload[0].value} {getMoodEmoji(Math.round(payload[0].value))}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!chartData.length && chartType !== 'pie') {
      return (
        <div className="empty-chart">
          <TrendingUp size={48} className="empty-icon" />
          <h3>No data to display</h3>
          <p>Start logging your moods to see beautiful charts and insights!</p>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                domain={[1, 6]} 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                domain={[1, 6]} 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="average" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        if (!pieData.length) {
          return (
            <div className="empty-chart">
              <PieIcon size={48} className="empty-icon" />
              <h3>No data to display</h3>
              <p>Start logging your moods to see the distribution!</p>
            </div>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="analytics">
      <div className="analytics-content">
        <div className="analytics-header">
          <h2>Mood Analytics</h2>
          <p>Discover patterns and insights from your mood data</p>
        </div>

        <div className="analytics-controls">
          <div className="control-group">
            <label>Time Range</label>
            <div className="button-group">
              {timeRanges.map(range => (
                <button
                  key={range.value}
                  className={`control-button ${timeRange === range.value ? 'active' : ''}`}
                  onClick={() => setTimeRange(range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Chart Type</label>
            <div className="button-group">
              {chartTypes.map(type => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    className={`control-button ${chartType === type.value ? 'active' : ''}`}
                    onClick={() => setChartType(type.value)}
                  >
                    <IconComponent size={16} />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.average}</div>
              <div className="stat-label">Average Mood</div>
              <div className="stat-emoji">{getMoodEmoji(Math.round(stats.average))}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.highest}</div>
              <div className="stat-label">Highest Mood</div>
              <div className="stat-emoji">{getMoodEmoji(stats.highest)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.lowest}</div>
              <div className="stat-label">Lowest Mood</div>
              <div className="stat-emoji">{getMoodEmoji(stats.lowest)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Entries</div>
              <div className="stat-emoji">📊</div>
            </div>
          </div>
        )}

        <div className="chart-container">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

