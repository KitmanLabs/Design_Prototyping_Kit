#!/bin/bash
# Stop: run design system validation before Claude finishes a turn, and block
# once with the errors if it fails. Skips when nothing lintable has changed.

input=$(cat)
# Already blocked once this turn: let Claude stop rather than loop.
[ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false')" = true ] && exit 0

cd "$CLAUDE_PROJECT_DIR" || exit 0

if [ ! -x node_modules/.bin/eslint ]; then
  jq -n '{systemMessage: "Design system validation skipped: dependencies are not installed. Run npm ci."}'
  exit 0
fi

changed=$(git status --porcelain -- src eslint-plugin-design-system stylelint-plugin-design-system \
  scripts/validate-design-system.js eslint.config.js .stylelintrc.json .stylelintignore 2>/dev/null)
[ -z "$changed" ] && exit 0

out=$(npm run --silent validate-design-system 2>&1) && exit 0

# Keep the failures, drop passing checks, warnings and npm noise.
printf '%s\n' "$out" \
  | grep -vE '^npm notice|^[[:space:]]+[0-9]+:[0-9]+[[:space:]]+warning|^(✅|📋|📁|🔧|🔍|🎨|=)|^Starting|^[[:space:]]*$' \
  | tail -40 \
  | jq -Rs '{decision: "block", reason: ("Design system validation failed. Fix these errors before finishing:\n" + .)}'
exit 0
