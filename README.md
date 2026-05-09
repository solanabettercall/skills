# skills

Personal collection of [Agent Skills](https://agentskills.io) — works with Claude Code, Cursor, GitHub Copilot, and any other compatible agent.

## Install

```bash
npx skills add clack/skills
```

Install a specific skill:

```bash
npx skills add clack/skills --skill codemirror
```

## Skills

| Skill | Description |
|---|---|
| [codemirror](skills/codemirror/SKILL.md) | Set up and configure CodeMirror 6 editor |

## Add a new skill

1. Copy `template/SKILL.md` to `skills/<skill-name>/SKILL.md`
2. Fill in `name` and `description` in the frontmatter
3. Write instructions in the body
4. Commit and push

Skill name must match the directory name: lowercase letters and hyphens only.

## Structure

```
skills/
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md          # required
│       ├── references/       # optional: detailed docs loaded on demand
│       └── assets/           # optional: templates, scripts
├── template/
│   └── SKILL.md
└── README.md
```
