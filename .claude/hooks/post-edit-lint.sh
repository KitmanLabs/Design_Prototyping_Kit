#!/bin/bash
# PostToolUse (Edit|Write|MultiEdit): lint the file Claude just changed and report
# errors back to Claude (exit 2). Never rewrites the file, so Claude's view of it
# stays accurate. Warnings are ignored here; validate-design-system reports them.

f=$(jq -r '.tool_input.file_path // empty')
root="$CLAUDE_PROJECT_DIR"

case "$f" in "$root"/*) ;; *) exit 0 ;; esac
[ -f "$f" ] || exit 0

case "$f" in
  *.js | *.jsx)
    bin="$root/node_modules/.bin/eslint"
    [ -x "$bin" ] || exit 0
    out=$(cd "$root" && "$bin" --quiet "$f" 2>&1)
    ;;
  *.css)
    bin="$root/node_modules/.bin/stylelint"
    [ -x "$bin" ] || exit 0
    out=$(cd "$root" && "$bin" --allow-empty-input "$f" 2>&1)
    ;;
  *) exit 0 ;;
esac
rc=$?

[ $rc -eq 0 ] && exit 0
printf 'Lint errors in %s (fix these; the file was not modified):\n%s\n' "$f" "$out" >&2
exit 2
