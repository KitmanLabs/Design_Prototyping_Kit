#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Friendly names for data files
const FILE_NAMES = {
  'athletes.json': 'Athlete profiles (players in the squad)',
  'squads_teams.json': 'Squads and team definitions',
  'games_matches.json': 'Games and match events',
  'training_sessions.json': 'Training sessions and workouts',
  'calendar_events.json': 'Calendar events',
  'injuries_medical.json': 'Medical records and injuries',
  'assessments.json': 'Physical assessments',
  'questionnaires_wellbeing.json': 'Wellbeing questionnaires',
  'users_staff.json': 'Staff and user accounts',
  'saved_locations.json': 'Saved venues and locations',
  'forms_templates.json': 'Form templates (medical, wellness, screening)',
  'layout.js': 'Layout constants (navigation, page titles)',
  'messaging.js': 'Messaging and chat data',
};

const DATA_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(__dirname, '../wiki/Understanding-the-Data.md');

function getFileInfo(filePath) {
  const fileName = path.basename(filePath);
  let recordCount = 'N/A';
  let fields = [];

  try {
    if (filePath.endsWith('.json')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      if (Array.isArray(data)) {
        recordCount = data.length;
        if (data.length > 0 && typeof data[0] === 'object') {
          fields = Object.keys(data[0]).slice(0, 5); // First 5 fields
        }
      } else if (typeof data === 'object') {
        // For non-array objects, count properties
        fields = Object.keys(data).slice(0, 5);
      }
    } else if (filePath.endsWith('.js')) {
      // For JS files, just note them as config
      recordCount = 'Config';
    }
  } catch (e) {
    // If we can't parse, that's ok - just skip
  }

  return {
    fileName,
    recordCount,
    fields: fields.join(', ') || '(no fields)',
  };
}

function generateMarkdown() {
  let files = [];

  // Read all files in data directory
  const entries = fs.readdirSync(DATA_DIR);

  entries.forEach((entry) => {
    const filePath = path.join(DATA_DIR, entry);
    const stat = fs.statSync(filePath);

    // Only process JSON and JS files, not subdirectories
    if (stat.isFile() && (entry.endsWith('.json') || entry.endsWith('.js'))) {
      const info = getFileInfo(filePath);
      files.push({
        name: entry,
        friendly: FILE_NAMES[entry] || entry,
        ...info,
      });
    }
  });

  // Sort by filename
  files.sort((a, b) => a.name.localeCompare(b.name));

  // Generate markdown
  let markdown = `# Understanding the Data

This prototype has no real server or database. All data lives in local JSON files — think of them like spreadsheets that power the UI. You can ask Claude to add, change, or remove entries in any of these files.

## Data Files

| File | What it represents | Records |
|------|-------------------|---------|
`;

  files.forEach((file) => {
    markdown += `| \`${file.name}\` | ${file.friendly} | ${file.recordCount} |\n`;
  });

  markdown += `
## How to Modify the Data

Ask Claude Code to help you:
- **Add a new athlete:** "Add a new athlete to athletes.json with the name 'John Doe' and position 'Forward'"
- **Change existing data:** "Update the first athlete's injury status in injuries_medical.json"
- **Remove entries:** "Remove the third game from games_matches.json"

Claude will handle the JSON formatting automatically — you don't need to edit these files manually, but you can if you want to.

## Form Templates

The \`forms_templates.json\` file contains 15+ form templates (medical screening, wellness checks, training feedback, etc.). These define the structure of forms used throughout the prototype.

## Important Notes

- These are **mock data** for prototyping only — they're not connected to real KitmanLabs systems
- Your changes only affect this prototype — they won't impact the actual product
- Use Claude Code to make changes safely without breaking the JSON structure
`;

  return markdown;
}

try {
  const markdown = generateMarkdown();
  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');
  console.log(`✓ Generated ${OUTPUT_FILE}`);
} catch (error) {
  console.error(`Error generating data docs: ${error.message}`);
  process.exit(1);
}
