#!/bin/bash
# PreToolUse (Edit|Write|MultiEdit): block edits to secret or vendored files.
# Exit 2 blocks the tool call and shows stderr to Claude.

f=$(jq -r '.tool_input.file_path // empty')

case "$f" in
  */.env | */.env.* | */node_modules/* | */.git/*)
    echo "BLOCKED: $f must not be edited directly (secrets, installed dependencies or git internals)." >&2
    exit 2
    ;;
esac
exit 0
