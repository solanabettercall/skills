---
name: melt-ui
description: Build accessible, headless UI components for Svelte with Melt UI. Use when integrating Melt UI builders (accordion, dialog, combobox, select, etc.) into a Svelte or SvelteKit app — including setup, the builder pattern, controlled state, and accessibility.
license: MIT
metadata:
  author: solanabettercall
  version: "1.0"
compatibility: Svelte 4+, SvelteKit. Requires browser environment for interactive components.
---

# Melt UI

Melt UI is a headless component library for Svelte. Instead of shipping styled components, it provides **builders** — functions that return stores and actions you apply to any element. Zero predefined styles; full WAI-ARIA compliance built in.

## Install

```bash
# Automatic (recommended — also offers preprocessor setup)
npx @melt-ui/cli@latest init

# Manual
npm install -D @melt-ui/svelte
```

## Preprocessor (optional but recommended)

```bash
npm install -D @melt-ui/pp
```

```js
// svelte.config.js
import { preprocessMeltUI, sequence } from '@melt-ui/pp'

const config = {
  preprocess: sequence([
    // ...your other preprocessors
    preprocessMeltUI(), // must be last
  ])
}
export default config
```

With the preprocessor, `use:melt={$el}` expands automatically to `{...$el} use:$el.action`.

---

## The builder pattern

Every builder:
1. Returns `{ elements, states, helpers }` (and sometimes `options`)
2. **Elements** are Svelte stores — subscribe with `$` to get the props object
3. Apply with `use:melt={$element}` (preprocessor) or manually spread `{...$element}` + `use:$element.action`

```svelte
<script lang="ts">
  import { createCollapsible, melt } from '@melt-ui/svelte'

  const {
    elements: { root, trigger, content },
    states: { open },
  } = createCollapsible()
</script>

<div use:melt={$root}>
  <button use:melt={$trigger}>
    {$open ? 'Close' : 'Open'}
  </button>

  {#if $open}
    <div use:melt={$content}>Hidden content</div>
  {/if}
</div>
```

---

## Controlled vs. uncontrolled

Builders are **uncontrolled** by default (manage their own state). Four ways to take control:

### 1. Write to a returned state store directly

```ts
const { states: { open } } = createDialog()
open.set(true)
```

### 2. `createSync` — sync builder state with a prop

```ts
import { createDialog, createSync } from '@melt-ui/svelte'

export let open: boolean = false

const { states } = createDialog()
const sync = createSync(states)

$: sync.open(open, (v) => (open = v))
```

### 3. Bring your own store

```ts
import { writable } from 'svelte/store'

const customOpen = writable(false)
createDialog({ open: customOpen })
```

### 4. `onOpenChange` — intercept and gate changes

```ts
const { elements } = createDialog({
  onOpenChange: ({ curr, next }) => (canClose ? next : curr),
})
```

---

## Custom events

Melt dispatches prefixed custom events (`m-click`, `m-keydown`, etc.). Call `e.preventDefault()` on them to cancel the default behavior; access the original event via `e.detail.originalEvent`.

```svelte
<button use:melt={$trigger} on:m-click={(e) => {
  if (!confirmed) e.preventDefault()
}}>
  Open
</button>
```

---

## Transitions & animations

Svelte transitions can conflict with Melt's visibility logic. Set `forceVisible: true` and use CSS transitions instead, or use `data-*` attributes emitted by builders:

```svelte
<script>
  const { elements: { content } } = createCollapsible({ forceVisible: true })
</script>

<div use:melt={$content}>...</div>

<style>
  [data-state='closed'] { display: none; }
</style>
```

---

## Common builders

| Builder | Import | Key elements |
|---|---|---|
| Accordion | `createAccordion` | `root`, `item`, `trigger`, `content`, `heading` |
| Collapsible | `createCollapsible` | `root`, `trigger`, `content` |
| Dialog | `createDialog` | `trigger`, `portalled`, `overlay`, `content`, `title`, `description`, `close` |
| Combobox | `createCombobox` | `input`, `menu`, `item`, `label`, `group`, `groupLabel`, `arrow` |
| Select | `createSelect` | `trigger`, `menu`, `option`, `label`, `group`, `groupLabel`, `arrow` |
| Popover | `createPopover` | `trigger`, `content`, `arrow`, `close` |
| Tooltip | `createTooltip` | `trigger`, `content`, `arrow` |
| Dropdown Menu | `createDropdownMenu` | `trigger`, `menu`, `item`, `checkboxItem`, `radioGroup`, `radioItem`, `subMenu`, `subTrigger` |
| Tabs | `createTabs` | `root`, `list`, `trigger`, `content` |
| Checkbox | `createCheckbox` | `root`, `input`, `label` |
| Switch | `createSwitch` | `root`, `input`, `label` |
| Slider | `createSlider` | `root`, `range`, `thumb`, `ticks` |
| Pagination | `createPagination` | `root`, `prevButton`, `nextButton`, `pageTrigger` |
| Progress | `createProgress` | `root` |
| Calendar | `createCalendar` | `calendar`, `heading`, `grid`, `prevButton`, `nextButton`, `cell` |
| Date Picker | `createDatePicker` | combines Calendar + Popover + DateField |

---

## Dialog — full example

```svelte
<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte'

  const {
    elements: { trigger, portalled, overlay, content, title, description, close },
    states: { open },
  } = createDialog({
    role: 'dialog',         // or 'alertdialog'
    preventScroll: true,
    closeOnOutsideClick: true,
    portal: 'body',         // where portalled content is teleported
  })
</script>

<button use:melt={$trigger}>Open</button>

{#if $open}
  <div use:melt={$portalled}>
    <div use:melt={$overlay} class="overlay" />
    <div use:melt={$content} class="dialog">
      <h2 use:melt={$title}>Title</h2>
      <p use:melt={$description}>Description</p>
      <button use:melt={$close}>×</button>
    </div>
  </div>
{/if}

<style>
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); }
  .dialog  { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: white; padding: 2rem; border-radius: 8px; }
</style>
```

### `createDialog` props

| Prop | Default | Type | Description |
|---|---|---|---|
| `role` | `'dialog'` | `'dialog' \| 'alertdialog'` | ARIA role |
| `preventScroll` | `true` | `boolean` | Lock body scroll |
| `escapeBehavior` | `'close'` | `'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore'` | Escape key |
| `closeOnOutsideClick` | `true` | `boolean` | Click-outside closes |
| `portal` | `'body'` | `string \| HTMLElement \| null` | Portal target |
| `forceVisible` | `false` | `boolean` | Keep in DOM (for CSS transitions) |
| `defaultOpen` | `false` | `boolean` | Initial state |
| `open` | — | `Writable<boolean>` | Controlled store |
| `onOpenChange` | — | `ChangeFn<boolean>` | Intercept changes |

---

## Combobox — full example

```svelte
<script lang="ts">
  import { createCombobox, melt } from '@melt-ui/svelte'

  type Fruit = { name: string; disabled?: boolean }

  let fruits: Fruit[] = [
    { name: 'Apple' }, { name: 'Banana' }, { name: 'Cherry' },
  ]

  const {
    elements: { input, menu, item, label },
    states: { open, inputValue, selected, highlighted },
    helpers: { isSelected },
  } = createCombobox<Fruit>({ forceVisible: true })

  $: filtered = fruits.filter((f) =>
    f.name.toLowerCase().includes($inputValue.toLowerCase())
  )
</script>

<label use:melt={$label}>Fruit</label>
<input use:melt={$input} placeholder="Search…" />

{#if $open}
  <ul use:melt={$menu}>
    {#each filtered as fruit}
      <li use:melt={$item({ value: fruit, label: fruit.name, disabled: fruit.disabled ?? false })}>
        {fruit.name}
        {#if isSelected(fruit)} ✓ {/if}
      </li>
    {:else}
      <li>No results</li>
    {/each}
  </ul>
{/if}
```

---

## Accordion — full example

```svelte
<script lang="ts">
  import { createAccordion, melt } from '@melt-ui/svelte'

  const items = [
    { id: 'a', title: 'Section A', content: 'Content A' },
    { id: 'b', title: 'Section B', content: 'Content B' },
  ]

  const {
    elements: { root, item, trigger, content, heading },
    states: { value },
  } = createAccordion({ multiple: false, defaultValue: 'a' })
</script>

<div use:melt={$root}>
  {#each items as { id, title, body }}
    <div use:melt={$item(id)}>
      <div use:melt={$heading({ level: 3 })}>
        <button use:melt={$trigger(id)}>{title}</button>
      </div>
      {#if $value === id}
        <div use:melt={$content(id)}>{body}</div>
      {/if}
    </div>
  {/each}
</div>
```

---

## Gotchas

- **Pre-1.0**: breaking changes may ship in minor releases — pin versions.
- **SSR**: elements use DOM APIs; guard with `browser` from `$app/environment` in SvelteKit if rendering server-side.
- **`forceVisible`**: set to `true` whenever using CSS transitions so the element stays in the DOM during the transition.
- **Portal + z-index**: `portalled` teleports content to `<body>` — stacking context issues come from the portal target, not the component's position in the tree.
- **Item builders are functions**: `$item(id)` and `$trigger(id)` are called with an argument, not used bare.
- **`melt` import**: when not using the preprocessor, import `melt` action explicitly and use `use:melt={$el}` — the spread + action pair must both be present.

## Reference

- [Builders cheatsheet](references/builders.md) — all builders with props and elements at a glance

### Official docs

- [Introduction](https://melt-ui.com/docs/introduction)
- [Usage / builder pattern](https://melt-ui.com/docs/usage)
- [Controlled components](https://melt-ui.com/docs/controlled)
- [Preprocessor](https://melt-ui.com/docs/preprocessor)
- [All builders](https://melt-ui.com/docs/builders/accordion)
