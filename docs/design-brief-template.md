# Design Brief: [Project Name]

> Companion to: [Link to PRD]
> Design system reference: Asana Design System (ADS/Sol) — invoke `/asana-design-system` skill for tokens, component specs, and accessibility rules
> Last updated: [Date]

---

## 1. User Personas

Define 1-3 personas. For each, capture context, pain, goal, and technical comfort. The primary persona drives design decisions when trade-offs arise.

### Primary: [Role / Title]

- **Context:** [What they do day-to-day, what tools they use]
- **Current pain:** [What's broken or missing today]
- **Goal:** [What success looks like for them]
- **Technical comfort:** [What Asana concepts they already know; what interaction patterns they expect]

### Secondary: [Role / Title]

- **Context:**
- **Current pain:**
- **Goal:**
- **Technical comfort:**

---

## 2. User Stories

Group stories by theme. Each story should be independently deliverable and testable.

### [Theme name, e.g., "Core workflow"]

| ID | Story | Acceptance criteria |
|----|-------|-------------------|
| US-1 | As a [persona], I want to [action] so that [outcome] | [Observable result; what the user sees/can do after completion] |
| US-2 | | |

### [Theme name]

| ID | Story | Acceptance criteria |
|----|-------|-------------------|
| US-N | | |

---

## 3. User Journey: [Key Scenario Name]

Write the primary narrative a stakeholder should experience during a demo or first-run. Each scene should note the user's emotional state and the design goal — this keeps the team aligned on *feel*, not just function.

```
Scene 1: [Starting state]
  User does X → sees Y
  Emotional state: "[What they're thinking/feeling]"
  Design goal: [What the UI should communicate]

Scene 2: [First action]
  User does X → sees Y
  Emotional state: ""
  Design goal:

Scene 3: [Building momentum]
  ...

Scene N: [Payoff moment]
  User sees the full picture
  Emotional state: "This is the value"
  Design goal: The "aha" moment is unmistakable
```

Add additional journeys for secondary flows if needed.

---

## 4. Interaction States

Define visual and behavioral states for each key interaction pattern. Use ADS token names (invoke `/asana-design-system` to look up exact values).

### 4.1 [Pattern name, e.g., "Editable cell"]

| State | Visual treatment | Trigger |
|-------|-----------------|---------|
| **Default** | [Description; reference ADS token if applicable] | — |
| **Hover** | | Mouse enters element |
| **Focused** | | Tab/keyboard navigation |
| **Active/editing** | | Click or Enter |
| **Saving** | | Action submitted |
| **Error** | | API/validation failure |
| **Disabled** | | Precondition not met |

### 4.2 [Pattern name]

| State | Visual treatment | Trigger |
|-------|-----------------|---------|

### 4.3 Modal / panel transitions

| Element | Enter | Exit |
|---------|-------|------|
| [Modal name] | [Animation + ADS duration token] | [Animation + ADS duration token] |
| [Panel name] | | |

---

## 5. Empty States

Every container that can be empty needs a message and a call-to-action. Empty states are a primary onboarding mechanism.

| Context | Message | Action |
|---------|---------|--------|
| [First-launch / no content] | [What goes here + encouragement] | [Primary CTA button or link] |
| [Content filtered to zero] | [Explain why it's empty] | [Clear filter / adjust criteria] |
| [Sub-element empty] | | |

---

## 6. Edge Cases and Error Handling

Enumerate scenarios the PRD doesn't cover. These are UX decisions, not API decisions.

| Scenario | Expected behavior |
|----------|------------------|
| [Invalid input] | [Validation message, disabled button, etc.] |
| [Conflicting state] | [Which state wins, what the user sees] |
| [Backend unavailable] | [Error display, retry mechanism, data preservation] |
| [Boundary condition] | [What happens at zero, one, max items] |
| [Data edge case] | [Empty strings, very long values, special characters] |

---

## 7. Keyboard and Accessibility

### Keyboard shortcuts

| Key | Context | Action |
|-----|---------|--------|
| | | |

### Accessibility notes

ADS baseline requirements (invoke `/asana-design-system` for full rules):
- `:focus-visible` with 2px+ border, 3:1 contrast ratio
- `prefers-reduced-motion` respected for all animations
- ARIA roles and labels on all interactive elements
- Arrow key navigation in menus and lists

Add project-specific accessibility considerations here:
- [ ] [e.g., Screen reader announcement for inline save confirmation]
- [ ] [e.g., Live region for filter result count]

---

## 8. Responsive Behavior

| Viewport | Behavior |
|----------|----------|
| >= [breakpoint] | [Full layout description] |
| [range] | [Adapted layout] |
| < [minimum] | [Unsupported message or degraded experience] |

> If this prototype is desktop-only, state that explicitly and note the minimum supported width.

---

## 9. Open Design Questions

Track unresolved decisions here. Each should have an owner and a resolve-by date.

- [ ] [Question] — Owner: [name], resolve by: [date]
- [ ] [Question] — Owner: [name], resolve by: [date]

---

## 10. Design-to-Implementation Traceability

Map each section of this brief back to PRD flows, architecture components, and implementation milestones. This ensures nothing falls through the cracks and gives engineers a path from "why" to "where in the code."

| Design brief section | PRD reference | Architecture reference | Implementation milestone |
|---------------------|---------------|----------------------|------------------------|
| User stories [range] | [Flow name/number] | [Component names] | [Milestone] |
| Interaction states | — | [Component tree section] | [Milestone] |
| Empty states | — | [EmptyState component] | [Milestone] |
| Edge cases | — | [Error handling section] | [Milestone] |

---

## How to Use This Template

1. **Copy this file** and rename it `design-brief-[project-name].md`
2. **Fill in sections 1-3 first** (personas, stories, journey) — these frame everything else
3. **Use `/asana-design-system`** when filling in section 4 (interaction states) to get exact ADS token names and component patterns
4. **Review with engineering** using section 10 (traceability) to confirm all stories map to planned work
5. **Keep section 9 (open questions) alive** — update it as decisions are made; close items rather than deleting them so there's a record
6. **This brief sits between the PRD and the design system** — the PRD says *what* to build, ADS says *how components look*, this brief says *how the product feels and behaves*
