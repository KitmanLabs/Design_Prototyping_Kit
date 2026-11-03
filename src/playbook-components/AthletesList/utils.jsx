import Chip from '@mui/material/Chip';

export const availabilityChip = (
  t,
  availability
) => {
  switch (availability) {
    case 'available':
      return <Chip size="small" color="success" label={t('Available')} />;
    case 'returning':
      return (
        <Chip
          size="small"
          color="success"
          label={t('Available (Returning from injury/illness)')}
        />
      );
    case 'injured':
      return (
        <Chip
          size="small"
          color="warning"
          label={t('Available (Injured/Ill)')}
        />
      );
    default:
      return <Chip size="small" color="error" label={t('Unavailable')} />;
  }
};

// Get initials for a full name

export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
};

// Export current rows to CSV (Excel-readable)
export const exportAthletesToCsv = (
  t,
  rows) => {
  if (!rows || rows.length === 0) return;

  const header = [t('Full Name'), t('Position'), t('Availability')];

  const escapeCsv = (value) => {
    const v = value ?? '';
    const needsQuotes = /[",\n]/.test(v);
    const escaped = v.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const availabilityLabel = (availability) => {
    switch (availability) {
      case 'available':
        return t('Available');
      case 'injured':
        return t('Injured');
      case 'returning':
        return t('Available (Returning from injury/illness)');
      default:
        return t('Unavailable');
    }
  };

  const lines = rows.map((row) => {
    const cols = [
      row.fullname || '',
      row.position || '',
      availabilityLabel(row.availability),
    ];
    return cols.map(escapeCsv).join(',');
  });

  const csv = [header.join(','), ...lines].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'athletes.csv');

  const body = document.body;
  if (!body) {
    // In non-browser / early DOM state just skip download
    URL.revokeObjectURL(url);
    return;
  }

  body.appendChild(link);
  link.click();
  body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const printAthletesTable = () => {
  window.print();
};
