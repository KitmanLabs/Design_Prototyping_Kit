// All hardcoded mock data for the Export athlete profiles prototype.

// Rows shown in the main "Manage Athletes" table.
export const TABLE_ATHLETES = [
  { id: 1, name: 'Akshay Ahuja', username: 'akshay+athlete', position: 'Hooker', squad: 'International Squad', primary: true, date: 'Mar 25, 2026', labels: [] },
  { id: 2, name: 'Sabin Amariei', username: 'samariei', position: 'Tight-head Prop', squad: 'International Squad', primary: false, date: 'Jun 17, 2026', labels: [] },
  { id: 3, name: 'Tymofii Antoniuk', username: 'timaantonuk', position: 'Hooker', squad: 'International Squad', primary: true, date: 'Jun 4, 2025', labels: [] },
  { id: 4, name: 'Akanksha', username: 'akankshaAth', position: 'Second Row', squad: 'International Squad', primary: true, date: 'May 25, 2023', labels: ['Conas Atá Tú Aisling?'], extraLabels: 12 },
  { id: 5, name: 'test', username: 'Anderson Test', position: 'Outside Center', squad: 'International Squad', primary: true, date: 'Aug 1, 2023', labels: ['Class Of 2026'] },
  { id: 6, name: 'Craig Athlete', username: 'CB_Athlete', position: 'Second Row', squad: 'International Squad', primary: true, date: 'Mar 15, 2023', labels: ['Class Of 2026'] },
  { id: 7, name: 'Daniel Athlete', username: 'danielathlete', position: 'Loose-head Prop', squad: 'International Squad', primary: true, date: 'Aug 19, 2022', labels: ['Class Of 2026'] },
  { id: 8, name: 'Herbert Austin', username: 'haustin', position: 'Goalkeeper', squad: 'U16', primary: true, date: 'Apr 20, 2023', labels: [] },
  { id: 9, name: 'Jen Barber', username: 'jbarber2', position: 'Centre Back', squad: 'U18', primary: true, date: 'Apr 20, 2023', labels: [] },
  { id: 10, name: 'Myron Barrett', username: 'mbarrett2', position: 'Central Midfielder', squad: 'U18', primary: true, date: 'Apr 20, 2023', labels: [] },
  { id: 11, name: 'Wendell Dow', username: 'wdow', position: 'Centre Forward', squad: 'PGAAC', primary: true, date: 'Apr 20, 2023', labels: [] },
  { id: 12, name: 'Alejandro Hansen', username: 'ahansen4', position: 'Goalkeeper', squad: 'U16', primary: true, date: 'Apr 20, 2023', labels: [] },
]

// Athletes shown in the drawer selector (squad-grouped).
export const ATHLETES = [
  { id: 1, name: 'Herbert Austin', username: 'haustin', position: 'Goalkeeper', squad: 'U16' },
  { id: 2, name: 'Jen Barber', username: 'jbarber2', position: 'Centre Back', squad: 'U18' },
  { id: 3, name: 'Myron Barrett', username: 'mbarrett2', position: 'Central Midfielder', squad: 'U18' },
  { id: 4, name: 'Wendell Dow', username: 'wdow', position: 'Centre Forward', squad: 'PGAAC' },
  { id: 5, name: 'Alejandro Hansen', username: 'ahansen4', position: 'Goalkeeper', squad: 'U16' },
  { id: 6, name: 'Casey Snyder', username: 'csnyder', position: 'Left Winger', squad: 'PGAAC' },
  { id: 7, name: 'Chester Silva', username: 'csilva', position: 'Right Back', squad: 'PGAAC' },
]

// Saved field templates.
export const TEMPLATES = [
  { id: 1, name: 'Tour travel pack', fields: ['Full name', 'Preferred name', 'Date of birth'] },
  { id: 2, name: 'Emergency & medical card', fields: ['Full name', 'Blood type', 'Medical notes', 'Emergency contact name', 'Emergency contact phone'] },
  { id: 3, name: 'Guardian consent sheet', fields: ['Full name', 'Date of birth', 'Emergency contact name', 'Emergency contact phone'] },
]

// Field catalogue grouped by category. `category` is denormalised onto each
// field so a selected field always knows which group it came from.
export const FIELD_GROUPS = [
  {
    category: 'Profile basics',
    fields: ['Full name', 'Preferred name', 'Date of birth', 'Gender', 'Nationality', 'Roster position', 'Squad(s)', 'Age'],
  },
  {
    category: 'Contact',
    fields: ['Email', 'Phone', 'Address'],
  },
  {
    category: 'Medical',
    fields: ['Blood type', 'Medical notes', 'Emergency contact name', 'Emergency contact phone'],
  },
]

// Flat lookup: field name -> category.
export const FIELD_CATEGORY = FIELD_GROUPS.reduce((acc, g) => {
  g.fields.forEach((f) => { acc[f] = g.category })
  return acc
}, {})

// Rows for the Manage Athletes table (matches the reference design).
export const MANAGE_ATHLETE_ROWS = Array.from({ length: 13 }, (_, i) => ({
  id: i + 1,
  userName: 'Jcdermo',
  rosterPosition: 'Wing',
  squads: 'International squad (primary, Ac...',
  squadsOverflow: 5,
  creation: '7 Oct 2025',
  label: 'This is a chip',
  labelsOverflow: 5,
}))
