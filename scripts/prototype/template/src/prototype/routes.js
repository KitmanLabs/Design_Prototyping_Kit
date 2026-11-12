// Every route this prototype shows. Plain data with no imports, so the build can read it to
// write the manifest. The rules (PROTOTYPE.md, "Routes"):
// - path is literal, with no parameters, written as a string in single quotes, because
//   Accelerate's checks read this file as text. Each state a scenario needs is a path of its
//   own, such as /session/planning/save-fails, never a query string.
// - A page that stands in for an item in the main navigation takes that item's path, or a path
//   under it, such as /athletes or /athletes/no-results (the paths are in
//   src/components/MainNavigation.jsx), so the navigation reaches it and highlights it.
// - The version opens on the first route here, unless one has the path '/'.
// - page names a component that src/prototype/pages exports.
// - floorplan is the floorplan the page uses; baseline is the iP page it started from, if any.
// - scenarios lists the specification's scenario_ids the route shows, once a specification exists.
// - title names the route, in sentence case.

export const routes = []
