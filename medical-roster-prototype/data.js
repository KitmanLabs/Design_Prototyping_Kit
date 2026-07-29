// Placeholder mock data — invented players, not real athlete records.
const ROSTER_DATA = [
  {
    name: "Bishop, Andre",
    position: "Wide Receiver",
    number: "84",
    photo: null,
    injuries: [
      { date: "May 14, 2026", title: "Lateral ankle sprain – ligament unknown [left]", status: "Full", severity: "resolved" }
    ],
    latestNote: { date: "May 14, 2026", label: "Medical note", text: "Routine check-in note" },
    cardiac: "outstanding",
    allergies: [
      { label: "Ibuprofen", severity: "severe" }
    ],
    roster: "Active"
  },
  {
    name: "Carrington, Malik",
    position: "Tight End",
    number: "88",
    photo: true,
    injuries: [
      { date: "Jun 22, 2026", title: "Head concussion [N/A]", status: "Out", severity: "active" },
      { date: "May 30, 2026", title: "Test injury 5_30", status: "Out", severity: "active" },
      { date: "May 24, 2026", title: "Hamstring common tendon strain – proximal [right]", status: "Out", severity: "active" },
      { date: "May 22, 2026", title: "Knee injury", status: "Preliminary", severity: "resolved" },
      { date: "Mar 23, 2026", title: "Test 2", status: "Out", severity: "active" }
    ],
    latestNote: { date: "May 30, 2026", label: "Medical note", text: "Test note" },
    cardiac: "outstanding",
    allergies: [
      { label: "Shellfish", severity: "severe" },
      { label: "Peanuts", severity: "moderate" },
      { label: "Sulfa drugs", severity: "moderate" },
      { label: "Almonds", severity: "mild" }
    ],
    roster: "Active"
  },
  {
    name: "Delgado, Owen",
    position: "Guard",
    number: "62",
    photo: true,
    injuries: [
      { date: "Jul 15, 2026", title: "Shoulder glenohumeral joint (GHJ) subluxation – recurrent", status: "Preliminary", severity: "resolved" },
      { date: "Apr 4, 2024", title: "Test red", status: "Out", severity: "active" },
      { date: "Jan 12, 2024", title: "Chronic lower back strain", status: "Full", severity: "resolved" }
    ],
    latestNote: { date: "Sep 25, 2023", label: "Medical note", text: "Owen reports to training room, no acute complaints today. Continues monitoring plan as previously discussed." },
    cardiac: "outstanding",
    allergies: [
      { label: "Aspirin", severity: "moderate" }
    ],
    roster: "Active"
  },
  {
    name: "Whitfield, Sam",
    position: "Cornerback",
    number: "24",
    photo: false,
    injuries: [],
    latestNote: { date: "Jun 2, 2026", label: "Medical note", text: "Cleared for full participation" },
    cardiac: "cleared",
    allergies: [],
    roster: "Active"
  },
  {
    name: "Okafor, Jerome",
    position: "Linebacker",
    number: "51",
    photo: true,
    injuries: [
      { date: "Jul 3, 2026", title: "Groin strain – adductor longus [left]", status: "Out", severity: "active" }
    ],
    latestNote: { date: "Jul 3, 2026", label: "Medical note", text: "Initial evaluation completed, imaging pending" },
    cardiac: "cleared",
    allergies: [
      { label: "Penicillin", severity: "severe" },
      { label: "Latex", severity: "mild" }
    ],
    roster: "Active"
  }
];
