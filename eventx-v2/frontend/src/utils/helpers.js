// Format date to readable Indian format
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const formatDateShort = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

// Format currency in INR
export const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN')}`;

// Calculate seat fill percentage
export const seatPercent = (booked, total) =>
  Math.round((booked / total) * 100);

// Color for seat fill bar
export const seatColor = (pct) => {
  if (pct >= 90) return '#ef4444';
  if (pct >= 70) return '#f59e0b';
  return '#10b981';
};

// Category accent colors
export const categoryColor = {
  Technology: '#7c3aed',
  Music:      '#db2777',
  Business:   '#0891b2',
  Art:        '#d97706',
  Food:       '#16a34a',
  Sports:     '#dc2626',
  Other:      '#6b7280',
};

export const ALL_CATEGORIES = [
  'All', 'Technology', 'Music', 'Business', 'Art', 'Food', 'Sports', 'Other',
];
