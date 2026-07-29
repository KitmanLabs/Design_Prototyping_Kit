export const STAFF = [
  { id: 1, name: 'Form Builder', username: 'fbuilder', role: 'Form Builder', email: 'tcoe+fbuilder@kitmanlabs.com', created: 'March 25, 2026', status: 'Active' },
  { id: 2, name: 'Test 2 2', username: 't2x', role: 'Club Athletic Trainer', email: 'jonathan@kitmanlabs.com', created: 'March 4, 2025', status: 'Active' },
  { id: 3, name: 'Jon Adamson', username: 'jadamson', role: 'Club Athletic Trainer', email: 'jadamson@kitmanlabs.com', created: 'October 3, 2022', status: 'Active' },
  { id: 4, name: 'Grisha Alexander Arnold', username: 'galexanderarnold', role: 'Club Athletic Trainer', email: 'glevinerozenvayn@kitmanlabs.com', created: 'September 20, 2022', status: 'Active' },
  { id: 5, name: 'Gustavo Amendola', username: 'gbrazil', role: 'Club Athletic Trainer', email: 'gustavo+nfl@kitmanlabs.com', created: 'October 27, 2022', status: 'Active' },
  { id: 6, name: 'Club Athletic Trainer', username: 'cathletictrainer', role: 'Club Athletic Trainer', email: 'stuart@kitmanlabs.com', created: 'November 3, 2022', status: 'Active' },
  { id: 7, name: 'Jeremy Baxter', username: 'jbaxter', role: 'Doctor', email: 'adowns+texansnfldemo@kitmanlabs.com', created: 'November 26, 2022', status: 'Active' },
  { id: 8, name: 'Bill Bergin', username: 'bbergin', role: 'Head Coach', email: 'bill.bergin@nfl.com', created: 'September 15, 2022', status: 'Active' },
  { id: 9, name: 'Billius Bergin', username: 'bbergin1', role: 'Assistant Coach', email: 'bbergin+nfl@kitmanlabs.com', created: 'November 17, 2022', status: 'Active' },
  { id: 10, name: 'Diarmaid Brennan', username: 'dbrennan', role: 'Psychologist', email: 'dbrennan+nfldemo@kitmanlabs.com', created: 'March 11, 2025', status: 'Active' },
  { id: 11, name: 'Ezron Bryson', username: 'ebryson', role: 'Athletic Trainer', email: 'email@email.com', created: 'November 26, 2022', status: 'Active' },
  { id: 12, name: 'Carla Mendez', username: 'cmendez', role: 'Club Physiotherapist', email: 'cmendez+nfl@kitmanlabs.com', created: 'January 14, 2023', status: 'Inactive' },
]

export function initials(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
