# ResponsivePageHeader documentation

`ResponsivePageHeader` is a fully responsive page header component used across Playbook and Profiler.  
It provides a unified layout for:

- Back button  
- Page title  
- Optional avatar  
- Metadata list (list items)  
- Badges with overflow support (`+N`)  
- Primary / secondary actions  
- Overflow menu (more actions + export actions)  
- Mobile truncation and tooltips  

This component manages layout and display only, not routing or business logic.

---

## ✨ Features Overview

### **Responsive behavior**

#### **Mobile (sm and below):**
- Title is truncated and reveals a tooltip on tap.
- List item values are truncated and reveal tooltips on tap.
- Only **2 badges** are shown; the rest move into a `+N` chip.
- Primary action shows as a button; secondary and menu actions go into the overflow menu.
- Export actions appear in a separate section of the overflow menu.
- `ClickAwayListener` closes all tooltips automatically.

#### **Desktop (md and above):**
- Full title layout with hover tooltips.
- Up to **5 badges** shown; the rest grouped under `+N`.
- Primary and secondary actions always visible.
- Overflow menu contains moreActions and exportActions.

---

## Props

### **HeaderListItem**
```ts
type HeaderListItem = {
  id: string,
  label: string, // i18n key
  value: string, // may be truncated
};
```

### **HeaderBadge**
```ts
type HeaderBadge = {
  id: string,
  label: string, // i18n key
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error',
  icon?: React.Node,
};
```

### **HeaderAction**
```ts
type HeaderAction = {
  id: string,
  label: string,        // final UI string (not translated)
  onClick: () => void,
  disabled?: boolean,
};
```

### **HeaderNewProps**
```ts
type HeaderNewProps = {
  title: string,

  // Back button
  onBackClick?: () => void,
  showBackButton?: boolean,

  // Avatar
  avatarSrc?: string,
  avatarAlt?: string,
  showAvatar?: boolean,

  // List items
  listItems?: Array<HeaderListItem>,
  showListItems?: boolean,

  // Badges
  badges?: Array<HeaderBadge>,
  showBadges?: boolean,

  // Actions
  primaryAction?: HeaderAction,
  secondaryAction?: HeaderAction,
  moreActions?: Array<HeaderAction>,
  exportActions?: Array<HeaderAction>,
  isAvailableToExport?: boolean,
  showActions?: boolean,

  // i18n injected via HOC
  // t: (key: string) => string
};
```

---

## Overflow Menu Logic

### Mobile
Order inside the menu:

1. Secondary action (if exists)  
2. `moreActions`  
3. Divider  
4. `exportActions` (only if `isAvailableToExport`)  

### Desktop
- Secondary button rendered next to primary.
- Overflow menu contains:
  - moreActions
  - (divider)
  - exportActions (optional)

---

## Tooltip System

- Only one tooltip can be open at a time.
- Applies to title, list items, and badges overflow.
- Click/tap outside closes everything.
- Clicking interactive elements does NOT close tooltips.

---

## Example Usage

```jsx
<ResponsivePageHeaderTranslated
  title="Manchester City – Squad Overview"
  onBackClick={() => console.log('Back clicked')}
  avatarSrc="https://i.pravatar.cc/150?img=32"
  listItems={[
    { id: 'team', label: 'Team', value: 'First Team – Premier League' },
    { id: 'coach', label: 'Head coach', value: 'Pep Guardiola' },
  ]}
  badges={[
    { id: 'active', label: 'Active', color: 'success' },
    { id: 'risk', label: 'HighRisk', color: 'warning' },
  ]}
  primaryAction={{
    id: 'save',
    label: 'Save changes',
    onClick: () => console.log('Save'),
  }}
  moreActions={[
    { id: 'duplicate', label: 'Duplicate', onClick: () => {} },
    { id: 'archive', label: 'Archive', onClick: () => {} },
  ]}
  isAvailableToExport
  exportActions={[
    { id: 'csv', label: 'Export as CSV', onClick: () => {} },
    { id: 'pdf', label: 'Export as PDF', onClick: () => {} },
  ]}
/>
```

---

## Component Exports

```js
// With i18n
export const ResponsivePageHeaderTranslated =
  withNamespaces()(ResponsivePageHeader);

// Raw component (used in Storybook)
export default ResponsivePageHeader;
```
