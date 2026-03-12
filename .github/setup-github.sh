#!/usr/bin/env bash
# Run this once after pushing to main to configure labels and GitHub Projects.
# Requires: gh auth refresh -s project,read:project
# Then run: bash .github/setup-github.sh

set -e
REPO="KitmanLabs/Design_Prototyping_Kit"
OWNER="KitmanLabs"

echo "=== Creating labels ==="

create_label() {
  local name="$1" color="$2" description="$3"
  gh label create "$name" --repo "$REPO" --color "$color" --description "$description" --force 2>&1 || true
}

# Type
create_label "type: bug"      "d73a4a" "Something is broken"
create_label "type: feature"  "0075ca" "New functionality"
create_label "type: refactor" "e4e669" "Code improvement without behavior change"
create_label "type: docs"     "0075ca" "Documentation only"
create_label "type: chore"    "ededed" "Maintenance, config, dependencies"
create_label "type: testing"  "bfd4f2" "Test additions or fixes"

# Priority
create_label "priority: critical" "b60205" "P0 — blocking"
create_label "priority: high"     "e4330a" "P1 — this sprint"
create_label "priority: medium"   "fbca04" "P2 — next sprint"
create_label "priority: low"      "0e8a16" "P3 — someday"

# Scope
create_label "scope: frontend"       "c2e0c6" "UI and component work"
create_label "scope: design-system"  "1d76db" "Design tokens, playbook components"
create_label "scope: infrastructure" "5319e7" "CI/CD, build, config"

# Agent-readiness (purple)
create_label "agent-ready"       "7057ff" "Spec complete — safe to assign to AI agent"
create_label "needs-spec"        "e99695" "Needs more detail before agent can work"
create_label "needs-human"       "d4c5f9" "Requires human judgment"
create_label "agent-in-progress" "0052cc" "Agent is currently working on this"
create_label "needs-review"      "0e8a16" "Agent completed — needs human review"

# Effort
create_label "effort: XS" "f9d0c4" "< 30 min"
create_label "effort: S"  "f9d0c4" "30 min – 2 hrs"
create_label "effort: M"  "f9d0c4" "2–4 hrs"
create_label "effort: L"  "f9d0c4" "4–8 hrs"
create_label "effort: XL" "e11d48" "Needs decomposition — break it down first"

echo "=== Creating GitHub Project ==="

PROJECT_ID=$(gh project create \
  --owner "$OWNER" \
  --title "Design Prototyping Kit" \
  --format json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)['number'])" 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
  echo "Project may already exist. Listing projects..."
  gh project list --owner "$OWNER"
  echo ""
  echo "Enter the project number to configure: "
  read PROJECT_ID
fi

echo "Configuring project #$PROJECT_ID..."

# Add Status field options
gh project field-create "$PROJECT_ID" --owner "$OWNER" \
  --name "Status" \
  --data-type "SINGLE_SELECT" 2>/dev/null || true

# Add Priority field
gh project field-create "$PROJECT_ID" --owner "$OWNER" \
  --name "Priority" \
  --data-type "SINGLE_SELECT" 2>/dev/null || true

# Add Effort field
gh project field-create "$PROJECT_ID" --owner "$OWNER" \
  --name "Effort" \
  --data-type "NUMBER" 2>/dev/null || true

# Add Worker field
gh project field-create "$PROJECT_ID" --owner "$OWNER" \
  --name "Worker" \
  --data-type "SINGLE_SELECT" 2>/dev/null || true

# Link repo to project
gh project link "$PROJECT_ID" --owner "$OWNER" --repo "$REPO" 2>/dev/null || true

echo ""
echo "=== Done ==="
echo ""
echo "Manual steps still needed in github.com/$REPO/settings:"
echo "  1. Branch protection on main:"
echo "     - Require pull request before merging"
echo "     - Require 1 approval"
echo "     - Dismiss stale approvals on new pushes"
echo "     - Require status checks: 'Lint & Build'"
echo "     - Require conversation resolution before merge"
echo "     - Require branches to be up to date"
echo "     - Enable 'Require review from Code Owners'"
echo "  2. Repository secrets (Settings → Secrets → Actions):"
echo "     - ANTHROPIC_API_KEY"
echo "     - VITE_PUBLIC_BUILDER_KEY"
echo "     - VITE_MUI_X_LICENSE_KEY"
echo "  3. Merge settings (Settings → General):"
echo "     - Allow squash merging (default)"
echo "     - Disable merge commits and rebase merging"
echo "     - Auto-delete head branches: ON"
echo "  4. GitHub Project views — add in the project UI:"
echo "     - Kanban: group by Status"
echo "     - Agent Queue: filter label:agent-ready"
echo "     - Backlog: table sorted by Priority"
echo "     - Roadmap: timeline view with iteration field"
