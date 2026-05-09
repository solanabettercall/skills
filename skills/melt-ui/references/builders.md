# Melt UI — Builders cheatsheet

Quick reference for all builders. See each builder's docs page for full prop tables and examples.

---

## Form & Input

### `createCheckbox`
**Elements:** `root`, `input`, `label`
**States:** `checked` (`boolean | 'indeterminate'`)
**Props:** `defaultChecked`, `checked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`

### `createRadioGroup`
**Elements:** `root`, `item`, `itemInput`, `label`
**States:** `value`
**Props:** `defaultValue`, `value`, `onValueChange`, `disabled`, `required`, `loop`, `orientation`

### `createSelect`
**Elements:** `trigger`, `menu`, `option`, `label`, `group`, `groupLabel`, `arrow`, `hiddenInput`
**States:** `open`, `selected`, `highlighted`
**Helpers:** `isSelected`
**Props:** `defaultSelected`, `selected`, `onSelectedChange`, `defaultOpen`, `open`, `onOpenChange`, `multiple`, `loop`, `closeOnOutsideClick`, `escapeBehavior`, `preventScroll`, `portal`, `positioning`, `forceVisible`, `name`, `ids`

### `createCombobox`
**Elements:** `input`, `menu`, `item`, `label`, `group`, `groupLabel`, `arrow`, `hiddenInput`
**States:** `open`, `inputValue`, `touchedInput`, `selected`, `highlighted`
**Helpers:** `isSelected`, `isHighlighted`
**Props:** `defaultSelected`, `selected`, `onSelectedChange`, `multiple`, `defaultOpen`, `open`, `onOpenChange`, `scrollAlignment`, `loop`, `closeOnOutsideClick`, `escapeBehavior`, `highlightOnHover`, `preventScroll`, `portal`, `positioning`, `forceVisible`, `name`, `ids`

### `createTagsInput`
**Elements:** `root`, `input`, `tag`, `deleteTrigger`, `edit`
**States:** `tags`, `inputValue`
**Helpers:** `isSelected`, `isEditing`
**Props:** `defaultTags`, `tags`, `onTagsChange`, `add`, `remove`, `update`, `trim`, `allowDuplicates`, `editable`, `blur`, `addOnPaste`, `maxTags`, `allowed`, `denied`, `separator`, `name`, `unique`, `ids`

### `createPinInput`
**Elements:** `root`, `input`, `hiddenInput`
**States:** `value`, `valueStr`
**Helpers:** `clear`
**Props:** `defaultValue`, `value`, `onValueChange`, `placeholder`, `disabled`, `type`, `name`, `id`

### `createSlider`
**Elements:** `root`, `range`, `thumb`, `ticks`
**States:** `value`
**Props:** `defaultValue`, `value`, `onValueChange`, `min`, `max`, `step`, `orientation`, `disabled`, `dir`

### `createSwitch`
**Elements:** `root`, `input`, `label`
**States:** `checked`
**Props:** `defaultChecked`, `checked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`

### `createToggle`
**Elements:** `root`
**States:** `pressed`
**Props:** `defaultPressed`, `pressed`, `onPressedChange`, `disabled`

### `createToggleGroup`
**Elements:** `root`, `item`
**States:** `value`
**Props:** `defaultValue`, `value`, `onValueChange`, `type` (`'single' | 'multiple'`), `disabled`, `rovingFocus`, `loop`, `orientation`, `dir`

---

## Layout & Navigation

### `createAccordion`
**Elements:** `root`, `item(id)`, `trigger(id)`, `content(id)`, `heading({ level })`
**States:** `value`
**Props:** `multiple`, `disabled`, `defaultValue`, `value`, `onValueChange`, `forceVisible`

### `createCollapsible`
**Elements:** `root`, `trigger`, `content`
**States:** `open`
**Props:** `defaultOpen`, `open`, `onOpenChange`, `disabled`, `forceVisible`

### `createTabs`
**Elements:** `root`, `list`, `trigger(value)`, `content(value)`
**States:** `value`
**Props:** `defaultValue`, `value`, `onValueChange`, `orientation`, `activateOnFocus`, `loop`, `autoSet`

### `createScrollArea`
**Elements:** `root`, `viewport`, `content`, `scrollbarX`, `scrollbarY`, `thumbX`, `thumbY`, `cornerEl`
**Props:** `type` (`'auto' | 'always' | 'scroll' | 'hover'`), `dir`, `hideDelay`

### `createSeparator`
**Elements:** `root`
**Props:** `orientation`, `decorative`

### `createTableOfContents`
**Elements:** `item(id)`
**States:** `activeHeadingIdxs`, `headingsTree`
**Props:** `selector`, `exclude`, `scrollOffset`, `scrollBehavior`, `activeType`

### `createToolbar`
**Elements:** `root`, `button`, `link`, `separator`
**Props:** `loop`, `orientation`, `dir`

### `createPagination`
**Elements:** `root`, `prevButton`, `nextButton`, `pageTrigger`
**States:** `page`, `pages`, `range`, `totalPages`
**Props:** `count`, `perPage`, `siblingCount`, `defaultPage`, `page`, `onPageChange`

### `createProgress`
**Elements:** `root`
**States:** `value`
**Props:** `defaultValue`, `value`, `onValueChange`, `max`

### `createTree`
**Elements:** `tree`, `item(id)`, `group(id)`
**States:** `expanded`, `selected`
**Props:** `defaultExpanded`, `expanded`, `onExpandedChange`, `defaultSelected`, `selected`, `onSelectedChange`, `multiple`, `forceVisible`

---

## Overlays & Floating

### `createDialog`
**Elements:** `trigger`, `portalled`, `overlay`, `content`, `title`, `description`, `close`
**States:** `open`
**Props:** `role`, `preventScroll`, `escapeBehavior`, `closeOnOutsideClick`, `portal`, `forceVisible`, `openFocus`, `closeFocus`, `defaultOpen`, `open`, `onOpenChange`, `ids`

### `createPopover`
**Elements:** `trigger`, `content`, `arrow`, `close`
**States:** `open`
**Props:** `defaultOpen`, `open`, `onOpenChange`, `positioning`, `arrowSize`, `closeOnOutsideClick`, `escapeBehavior`, `closeOnFocusOutside`, `portal`, `forceVisible`, `openFocus`, `closeFocus`, `ids`

### `createTooltip`
**Elements:** `trigger`, `content`, `arrow`
**States:** `open`
**Props:** `positioning`, `arrowSize`, `defaultOpen`, `open`, `onOpenChange`, `closeOnPointerDown`, `openDelay`, `closeDelay`, `forceVisible`, `portal`, `group`, `disableHoverableContent`, `ids`

### `createContextMenu`
**Elements:** `trigger`, `menu`, `item`, `checkboxItem`, `radioGroup`, `radioItem`, `subMenu`, `subTrigger`, `separator`, `group`, `groupLabel`, `arrow`
**States:** `open`

### `createDropdownMenu`
**Elements:** `trigger`, `menu`, `item`, `checkboxItem`, `radioGroup`, `radioItem`, `subMenu`, `subTrigger`, `separator`, `group`, `groupLabel`, `arrow`
**States:** `open`
**Props:** `positioning`, `arrowSize`, `defaultOpen`, `open`, `onOpenChange`, `closeOnOutsideClick`, `escapeBehavior`, `closeOnItemClick`, `typeahead`, `loop`, `preventScroll`, `portal`, `forceVisible`, `ids`

### `createMenubar`
**Elements:** (creates multiple menus via `createMenu`) `root`, `trigger`, `menu`, `item`, `arrow`
**States:** `open`

### `createLinkPreview`
**Elements:** `trigger`, `content`, `arrow`
**States:** `open`
**Props:** `positioning`, `openDelay`, `closeDelay`, `defaultOpen`, `open`, `onOpenChange`, `forceVisible`, `portal`, `ids`

---

## Date & Time

All date builders use `@internationalized/date` types (`CalendarDate`, `DateValue`, etc.).

### `createCalendar`
**Elements:** `calendar`, `heading`, `grid`, `cell`, `prevButton`, `nextButton`
**States:** `value`, `months`, `headingValue`, `daysOfWeek`
**Props:** `defaultValue`, `value`, `onValueChange`, `placeholder`, `multiple`, `minValue`, `maxValue`, `disabled`, `unavailable`, `isDateDisabled`, `isDateUnavailable`, `locale`, `pagedNavigation`, `weekStartsOn`, `fixedWeeks`, `numberOfMonths`

### `createRangeCalendar`
Same as Calendar but `value` is `{ start, end }`.

### `createDateField`
**Elements:** `field`, `label`, `segment`, `editableSegmentContent`, `hiddenInput`
**States:** `value`, `segmentContents`, `segmentValues`
**Props:** like Calendar + `hourCycle`, `granularity`, `hideTimeZone`, `name`, `ids`

### `createDatePicker`
Combines `createDateField` + `createPopover` + `createCalendar`.
**Elements:** all from DateField + `trigger`, `calendar`, `content`, `prevButton`, `nextButton`, `grid`, `cell`

### `createDateRangeField` / `createDateRangePicker`
Same as DateField / DatePicker but for ranges.

---

## Misc

### `createAvatar`
**Elements:** `image`, `fallback`
**Props:** `src`, `delayMs`

### `createLabel`
**Elements:** `root`

---

## `positioning` option (Floating UI)

Used by Popover, Tooltip, Select, Combobox, Dropdown, etc.

```
positioning: {
  placement: 'bottom' | 'top' | 'left' | 'right' | 'bottom-start' | 'bottom-end' | ...
  strategy:  'absolute' | 'fixed'
  offset:    { mainAxis: 8, crossAxis: 0 }
  sameWidth: false    // match trigger width
  flip:      true
  gutter:    4
}
```
