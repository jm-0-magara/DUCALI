# Chart Maximize Feature

## Overview

The chart maximize feature allows users to view charts in full-screen mode for better data visualization and analysis. This feature is available on all charts in the admin dashboard.

## Features

### ✅ **Maximize Button**
- Each chart has a maximize button (↗️) in the top-right corner
- Click to open the chart in full-screen mode

### ✅ **Full-Screen Modal**
- Charts open in a responsive modal that takes up most of the screen
- Larger chart height (500px) for better data visibility
- Dark theme consistent with the dashboard design

### ✅ **Multiple Ways to Close**
- **Close Button (X)**: Click the X button in the top-right corner
- **Minimize Button (↘️)**: Click the minimize button to return to normal view
- **Escape Key**: Press the Escape key to close the modal
- **Click Outside**: Click outside the modal area to close

### ✅ **Keyboard Support**
- **Escape Key**: Closes the modal
- **Body Scroll Prevention**: Prevents background scrolling when modal is open

### ✅ **Smooth Animations**
- Fade-in animation for the backdrop
- Zoom-in animation for the modal content
- Smooth transitions for better user experience

## Usage

### For Developers

1. **Wrap any chart with MaximizableChart**:
```tsx
import { MaximizableChart } from '../../../../components/charts';

<MaximizableChart title="Chart Title">
  <YourChartComponent data={data} />
</MaximizableChart>
```

2. **Charts automatically support height prop**:
```tsx
// Normal view (250px height)
<RevenueChart data={data} />

// Maximized view (500px height)
<RevenueChart data={data} height={500} />
```

### For Users

1. **Navigate to Analytics**: Go to `/dashboard/admin?tab=analytics`
2. **Find a Chart**: Look for charts like "Revenue Trend", "User Growth", or "Revenue by Category"
3. **Click Maximize**: Click the maximize button (↗️) in the top-right corner of any chart
4. **Analyze Data**: View the chart in full-screen mode for better detail
5. **Close Modal**: Use any of the closing methods mentioned above

## Available Charts

The maximize feature is currently available on:

- **Revenue Trend Chart**: Area chart showing revenue over time
- **User Growth Chart**: Line chart showing customer and artisan growth
- **Revenue by Category Chart**: Pie chart showing revenue distribution by category

## Technical Implementation

### Components
- `MaximizableChart.tsx`: Wrapper component that provides maximize functionality
- `AdminCharts.tsx`: Chart components with height prop support
- `AdminAnalytics.tsx`: Analytics page using MaximizableChart

### Props
```tsx
interface MaximizableChartProps {
  title: string;           // Chart title displayed in header
  children: React.ReactNode; // Chart component to wrap
  className?: string;      // Additional CSS classes
}
```

### Styling
- Uses Tailwind CSS for styling
- Consistent with dashboard dark theme
- Responsive design for different screen sizes
- Z-index management for proper modal layering

## Future Enhancements

Potential improvements for the maximize feature:

1. **Chart Controls**: Add zoom, pan, and export options in maximized view
2. **Multiple Charts**: Allow multiple charts to be maximized simultaneously
3. **Custom Heights**: Allow users to set custom chart heights
4. **Chart Comparison**: Side-by-side chart comparison in maximized mode
5. **Data Export**: Export chart data directly from maximized view

## Browser Support

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (responsive design)

## Accessibility

- Keyboard navigation support (Escape key)
- Screen reader friendly
- High contrast design
- Focus management for modal interactions
