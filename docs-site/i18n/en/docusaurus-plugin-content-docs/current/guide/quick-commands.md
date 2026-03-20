---
sidebar_position: 4
---

# Quick Commands

Quick Commands let you save and execute frequent commands with a single click.

## Create a Quick Command

1. In the **Quick Commands** panel on the right sidebar, click **Add**
2. Fill in:

| Field | Description |
|-------|-------------|
| Label | Display name for the command |
| Category | Command category (e.g., K8s, Docker) |
| Description | Optional description |
| Color Tag | Custom display color |
| Icon | Custom icon |
| Pin to Top | Show at the top of the list |
| Execution Mode | Execute immediately or append to prompt |
| Command Script | The command content |

## Execution Modes

### Execute Immediately

The command runs automatically in the terminal when clicked. Best for well-known, safe commands.

### Append to Prompt

The command is placed at the terminal prompt for review before execution. Best for commands that need parameter verification.

## Variable Substitution

Command scripts support `{{variableName}}` syntax for dynamic parameters:

```bash
docker exec -it {{container_name}} bash
```

A dialog will prompt you to fill in variable values when executing.

## Category Management

- Create categories to organize commands
- Filter by category using the dropdown next to the search bar
- Search or create new categories inline

## Search Commands

Type keywords in the search box to quickly filter the command list.
