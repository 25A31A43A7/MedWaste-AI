import React from 'react';

export default function StatusBadge({ status, type }) {
  let badgeClass = 'badge-info';

  const normalized = (status || type || '').toLowerCase();

  if (normalized.includes('yellow') || normalized.includes('infectious') || normalized.includes('warning') || normalized.includes('medium')) {
    badgeClass = 'badge-yellow';
  } else if (normalized.includes('red') || normalized.includes('critical') || normalized.includes('danger') || normalized.includes('high')) {
    badgeClass = 'badge-red';
  } else if (normalized.includes('blue') || normalized.includes('glass') || normalized.includes('collected') || normalized.includes('success')) {
    badgeClass = 'badge-blue';
  } else if (normalized.includes('white') || normalized.includes('sharp') || normalized.includes('pending') || normalized.includes('standby')) {
    badgeClass = 'badge-white';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {status || type}
    </span>
  );
}
