// @flow
import { type GridColDef, type GridRowsProp } from '@mui/x-data-grid-premium';

export const baseColumns: Array<GridColDef> = [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
    filterable: true,
    type: 'number',
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    filterable: true,
    groupable: false,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 180,
    filterable: true,
    groupable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    filterable: true,
    groupable: true,
  },
  {
    field: 'quantity',
    type: 'number',
    headerName: 'Qty',
    width: 100,
    filterable: true,
    groupable: false,
  },
  {
    field: 'lastUpdated',
    headerName: 'Last Updated',
    type: 'date',
    width: 180,
    valueGetter: (value: string) => value && new Date(value), // Ensure it's a Date object for MUI
    groupable: false,
  },
];

export const sampleRows: GridRowsProp = [
  {
    id: 1,
    name: 'Alpha Item',
    category: 'Gadgets',
    status: 'Active',
    quantity: 10,
    lastUpdated: '2023-01-15',
  },
  {
    id: 2,
    name: 'Beta Component',
    category: 'Parts',
    status: 'Inactive',
    quantity: 50,
    lastUpdated: '2023-02-20',
  },
  {
    id: 3,
    name: 'Gamma Product',
    category: 'Gadgets',
    status: 'Archived',
    quantity: 5,
    lastUpdated: '2023-03-10',
  },
  {
    id: 4,
    name: 'Delta Tool',
    category: 'Tools',
    status: 'Active',
    quantity: 22,
    lastUpdated: '2023-04-05',
  },
  {
    id: 5,
    name: 'Epsilon Gear',
    category: 'Parts',
    status: 'Active',
    quantity: 100,
    lastUpdated: '2023-05-01',
  },
  {
    id: 6,
    name: 'Zeta Device',
    category: 'Gadgets',
    status: 'Inactive',
    quantity: 0,
    lastUpdated: '2023-06-18',
  },
  {
    id: 7,
    name: 'Eta System',
    category: 'Systems',
    status: 'Active',
    quantity: 7,
    lastUpdated: '2023-07-22',
  },
  {
    id: 8,
    name: 'Theta Module',
    category: 'Parts',
    status: 'Archived',
    quantity: 30,
    lastUpdated: '2023-08-30',
  },
  {
    id: 9,
    name: 'Iota Gizmo',
    category: 'Gadgets',
    status: 'Active',
    quantity: 12,
    lastUpdated: '2023-09-11',
  },
  {
    id: 10,
    name: 'Kappa Fixture',
    category: 'Tools',
    status: 'Inactive',
    quantity: 8,
    lastUpdated: '2023-10-25',
  },
  {
    id: 11,
    name: 'Lambda Unit',
    category: 'Systems',
    status: 'Active',
    quantity: 3,
    lastUpdated: '2023-11-05',
  },
  {
    id: 12,
    name: 'Mu Device',
    category: 'Gadgets',
    status: 'Active',
    quantity: 15,
    lastUpdated: '2023-12-01',
  },
  {
    id: 13,
    name: 'Nu Component',
    category: 'Parts',
    status: 'Active',
    quantity: 60,
    lastUpdated: '2024-01-10',
  },
  {
    id: 14,
    name: 'Xi Product',
    category: 'Gadgets',
    status: 'Inactive',
    quantity: 2,
    lastUpdated: '2024-02-15',
  },
  {
    id: 15,
    name: 'Omicron Tool',
    category: 'Tools',
    status: 'Archived',
    quantity: 18,
    lastUpdated: '2024-03-20',
  },
  {
    id: 16,
    name: 'Pi Gadget',
    category: 'Gadgets',
    status: 'Active',
    quantity: 25,
    lastUpdated: '2024-04-10',
  },
  {
    id: 17,
    name: 'Rho Part',
    category: 'Parts',
    status: 'Active',
    quantity: 70,
    lastUpdated: '2024-05-05',
  },
  {
    id: 18,
    name: 'Sigma System',
    category: 'Systems',
    status: 'Inactive',
    quantity: 1,
    lastUpdated: '2024-05-20',
  },
];

export const allServerRows = [
  // Create a larger dataset for more realistic pagination
  ...Array.from({ length: 106 }, (_, i) => ({
    id: i + 1,
    name: `Server Item ${i + 1}`,
    category: (() => {
      if (i % 3 === 0) return 'Electronics';
      if (i % 3 === 1) return 'Books';
      return 'Clothing';
    })(),
    quantity: Math.floor(Math.random() * 100) + 1,
    status: i % 4 === 0 ? 'Active' : 'Inactive',
    lastUpdated: new Date(2024, 0, 1 + i).toLocaleDateString(),
  })),
];
