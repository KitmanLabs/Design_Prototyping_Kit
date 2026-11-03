# Understanding the Data

This prototype has no real server or database. All data lives in local JSON and JavaScript files in `src/data`. Think of them like spreadsheets that power the UI. You can ask Claude to add, change, or remove entries in any of these files.

## Data Files

| File | What it represents | Records |
|------|-------------------|---------|
| `assessments.json` | Physical assessments | 6 |
| `athletes.json` | Athlete profiles (the squad) | 8 |
| `calendar_events.json` | Calendar events | 274 |
| `calendarEventOptions.js` | Option lists for the Add game and Add session drawers | Config |
| `forms_templates.json` | Form templates (medical, wellness, screening) | 15 |
| `forms.js` | Forms pages and drawers: rows, summaries and option lists | Config |
| `games_matches.json` | Games and match events | 4 |
| `injuries_medical.json` | Medical records and injuries | 5 |
| `layout.js` | Layout constants (navigation, page titles) | Config |
| `messaging.js` | Messaging and chat data | Config |
| `questionnaires_wellbeing.json` | Wellbeing questionnaires | 6 |
| `saved_locations.json` | Saved venues and locations | 4 |
| `squads_teams.json` | Squads and team definitions | 4 |
| `training_sessions.json` | Training sessions and workouts | 6 |
| `users_staff.json` | Staff and user accounts | 10 |

## How to Modify the Data

Ask Claude Code to help you:
- **Add a new athlete:** "Add a new athlete to athletes.json with the name 'John Doe' and position 'Forward'"
- **Change existing data:** "Update the first athlete's injury status in injuries_medical.json"
- **Remove entries:** "Remove the third game from games_matches.json"

Claude will handle the formatting automatically. You don't need to edit these files manually, but you can if you want to.

## Form Templates

The `forms_templates.json` file contains 15+ form templates (medical screening, wellness checks, training feedback, etc.). These define the structure of forms used throughout the prototype.

## Important Notes

- These are **mock data** for prototyping only. They're not connected to iP: Intelligence Platform or any other Kitman Labs system
- Your changes only affect this prototype, not the product
- Use Claude Code to make changes safely without breaking the JSON structure
