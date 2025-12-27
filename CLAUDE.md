# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev      # Start development server with hot-reload
npm run build    # Production build
npm run preview  # Preview production build locally
```

## Styling Guidelines

All styling uses **Tailwind CSS 4** utility classes. Follow these principles:

### Mobile-First Approach
Always style for mobile first, then add responsive modifiers for larger screens:
```html
<div class="text-sm md:text-base lg:text-lg">...</div>
```

### Responsive Priority: Container Queries First
Use container queries (`@container`) as the primary responsive strategy, falling back to media queries only when necessary.

**1. Container queries (preferred)** - Style based on parent container width:
```html
<div class="@container">
  <div class="flex flex-col @md:flex-row @lg:gap-4">
    <!-- Adapts to container size, not viewport -->
  </div>
</div>
```

**2. Named containers** - For nested containers or targeting specific ancestors:
```html
<div class="@container/card">
  <div class="@sm/card:grid-cols-2">...</div>
</div>
```

**3. Max-width container queries** - Apply styles below a container size:
```html
<div class="@max-md:hidden">Hides when container is smaller than md</div>
```

**4. Media queries (fallback)** - Use only for viewport-level concerns:
```html
<div class="md:grid-cols-2 lg:grid-cols-3">...</div>
```

### When to Use Each
- **Container queries**: Component-level responsive behavior (cards, sidebars, widgets)
- **Media queries**: Page layout, viewport-specific features (print, dark mode)

## Vue 3 Code Style

Follow the [official Vue.js Style Guide](https://vuejs.org/style-guide/). Key rules:

### Component Names
- Use **multi-word names** to avoid HTML element conflicts: `TodoItem`, not `Item`
- Use **PascalCase** for filenames: `MyComponent.vue`
- Prefix base/presentational components: `BaseButton.vue`, `BaseIcon.vue`

### Props
Always define props with types and validation:
```js
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['pending', 'active', 'done'].includes(value)
  }
})
```

### Multi-Attribute Elements
Elements with multiple attributes must span multiple lines, one attribute per line:
```html
<!-- Bad -->
<MyComponent foo="a" bar="b" baz="c"/>

<!-- Good -->
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

### Template Expressions
Keep template expressions simple. Move complex logic to computed properties:
```html
<!-- Bad -->
{{ fullName.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') }}

<!-- Good -->
{{ normalizedFullName }}
```

### Directive Shorthands
Use shorthands consistently: `:value`, `@click`, `#header`

### v-for
Always use `:key` with `v-for`. Never combine `v-if` with `v-for` on the same element.

## VueUse

Use [@vueuse/core](https://vueuse.org/) utilities whenever applicable. Prefer VueUse composables over custom implementations for common patterns:
- `useLocalStorage`, `useSessionStorage` - Reactive storage
- `useFetch`, `useAsyncState` - Data fetching
- `useMediaQuery`, `useBreakpoints` - Responsive logic
- `useDark`, `useColorMode` - Theme handling
- `useEventListener`, `onClickOutside` - Event handling
- `useDebounceFn`, `useThrottleFn` - Function utilities
- `useVModel` - Two-way binding helpers
