## NFL Forms Prototype — Implementation Plan

Link: [Forms wireframes](https://www.figma.com/design/3xM2DVsZv6kIz2ptcuAsFi/Forms?node-id=10674-70873&t=1HvRqP5KsStDEepS-11)

### What I understand from the wireframes
- **MUI-based workflow**: A sequence of screens laid out in order (a workflow), designed with MUI and Kitman tokens.
- **Navigation context**: Lives under the app’s “Forms” section (route base `/questionnaires`).
- **In-scope screens**: Only the screens explicitly shown in the shared wireframes, implemented 1:1 as pages. No additional screens, flows, or states beyond what is visible.
- **Interactions**: Buttons and controls are non-functional unless the wireframes specify behavior; otherwise, render as visual duds.
- **Design tokens**: Open Sans typography, primary `#3b4960`, white backgrounds, subtle dividers, sentence case text.

### Goals
- Implement the core pages and components of the NFL forms workflow under the app’s Forms area using MUI, aligned with the design tokens and patterns in `src/styles/design-tokens.css`.

### Scope and Deliverables
- **Routing**
  - Keep route base as `/questionnaires` (front-end label “Forms”).
  - Create one subroute per wireframe screen, ordered to match the workflow. Example pattern (actual slugs will follow frame titles):
    - `/questionnaires` — first screen in the workflow
    - `/questionnaires/<slug-2>` — second screen
    - `/questionnaires/<slug-3>` — third screen
    - … continue for each screen shown

- **Pages (under `src/pages/forms/`)**
  - Create exactly one page component for each wireframe screen in order, using the frame titles as filenames (slugified). Example:
    - `Screen01_<FrameTitle>.jsx`
    - `Screen02_<FrameTitle>.jsx`
    - … (one per screen)


- **Shared Components**
  - Only create small presentational components if they are needed to render repeated UI seen in the wireframes. Avoid adding components or states not visible in the designs.

- **Data**
  - Use inline mocked/stubbed values within each page solely to render the visuals shown. Do not introduce new JSON data files unless the wireframes explicitly require list content.

- **Navigation updates**
  - Ensure `MainNavigation.jsx` keeps path `/questionnaires` and label “Forms”.
  - Map titles in `LayoutWithMainNav.jsx` for `/questionnaires` and subroutes.

- **UI/Design**
  - Use MUI components throughout; align with `design-tokens.css`.
  - Sentence case, small/medium buttons, subtle elevation, divider usage.

### Implementation Steps
1) Add routes under `/questionnaires` for each wireframe screen (1:1 mapping, ordered by workflow).
2) Create minimal page components that visually match each screen using MUI and existing design tokens.
3) Add only stubbed/static content needed to render the layouts; make buttons non-functional unless behavior is specified.
4) Ensure titles and navigation reflect “Forms” while keeping `/questionnaires` as the path.
5) Light UI polish for spacing/typography to match tokens.

### Acceptance Criteria
- Each wireframe screen has a corresponding route under `/questionnaires` and renders as designed using MUI.
- Buttons and controls are present visually; only those with specified behaviors perform actions; others are non-functional duds.
- No extra screens, flows, or features beyond what is depicted in the wireframes.
- Visuals align with existing design tokens.

### Assumptions
- NFL templates and copy can be approximated from the wireframes; exact copy not critical for prototype.
- No backend required; all state/mock data in JSON and local component state.
- Export and notifications are stubbed actions.

- ### Open Questions
- Route naming confirmed to stay at `/questionnaires` (front-end label “Forms”).
- Confirm the exact ordered list of screen/frame titles to use for route slugs and filenames.
- Required template categories for NFL (initial set vs. full taxonomy)?
- Any specific analytics/metrics beyond completion rate and due date?

### Nice-to-haves (time permitting)
- Quick filters on Forms Home (status, owner, squad).
- Duplicate form flow from card actions.
- Per-athlete response detail drawer.


