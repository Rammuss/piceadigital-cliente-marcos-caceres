# Design System Document

## 1. Overview & Creative North Star: "The Architectural Ledger"

This design system is built upon the concept of **Architectural Ledgering**. In the world of high-end accounting, trust isn’t built through flashy graphics, but through the precision of space and the weight of information. We move away from the "template" look of generic corporate sites by treating the digital canvas as a piece of premium stationery or an architectural blueprint.

**Creative North Star:** *The Architectural Ledger.*
We achieve this through:
*   **Intentional Asymmetry:** Breaking the rigid 12-column grid to create "editorial" breathing room.
*   **Tonal Authority:** Using deep navies and forest greens not just as accents, but as structural anchors.
*   **Layered Precision:** Replacing harsh lines with shifts in surface tone to define hierarchy.

---

## 2. Colors & Surface Philosophy

The palette is rooted in a "Modern Institutional" aesthetic. It balances the stability of `primary` (#002045) with the growth-oriented vitality of `secondary` (#0a6c44).

### The "No-Line" Rule
To maintain a high-end, bespoke feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` section sitting on a `surface` background provides a soft, sophisticated edge that a line cannot replicate.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of fine paper.
*   **Base:** `surface` (#f8f9fa) for the primary background.
*   **Depth:** Use `surface-container-low` to `surface-container-highest` to create "nested" depth. An inner module should be a step higher or lower than its parent to define its importance without cluttering the eye.

### The "Glass & Gradient" Rule
To prevent the design from feeling static:
*   **Glassmorphism:** Use semi-transparent versions of `surface_container_lowest` with a `backdrop-blur` (12px–20px) for floating navigation or sticky headers.
*   **Signature Textures:** For Hero sections or primary CTAs, use a subtle linear gradient from `primary` (#002045) to `primary_container` (#1a365d). This adds a "silk" finish that feels more expensive than a flat hex code.

---

## 3. Typography: Editorial Authority

We use a dual-typeface system to balance character with utility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech-meets-finance" feel. 
    *   *Usage:* Use `display-lg` for hero statements. Apply negative letter-spacing (-0.02em) to large headlines to create a tighter, more authoritative impact.
*   **Body & Labels (Inter):** The gold standard for legibility.
    *   *Usage:* Use `body-md` for standard text. Keep line-heights generous (1.6x) to reduce cognitive load, essential for complex financial data.

**Hierarchy as Identity:** The massive scale shift between a `display-lg` (3.5rem) headline and `body-lg` (1rem) body copy creates the "Editorial" look. It signals confidence.

---

## 4. Elevation & Depth

### The Layering Principle
Hierarchy is achieved through **Tonal Layering**. Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f4f5) section. This creates a natural "lift" that mimics real-world paper under soft light.

### Ambient Shadows
Shadows must be "felt, not seen."
*   **Spec:** `0px 4px 20px rgba(0, 32, 69, 0.05)` (using a tinted version of `primary` rather than black).
*   Shadows should only be used on interactive floating elements (modals, dropdowns) or "High-Active" cards.

### The "Ghost Border" Fallback
If a border is required for accessibility, use a **Ghost Border**: `outline-variant` at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` background with `on_primary` text. `DEFAULT` (0.5rem) roundedness.
*   **Secondary:** `secondary_container` background with `on_secondary_container` text. This is your "Trust" button, used for growth-related actions (e.g., "Open Account").
*   **Tertiary:** No background. Text-only with an icon. Use for low-emphasis actions.

### Cards & Service Modules
**Forbidden:** Divider lines. 
**Required:** Use `xl` (1.5rem) spacing between elements within a card. Separate different cards using a shift from `surface` to `surface-container-lowest`. Service cards should have a subtle hover state where the background shifts to `surface_bright`.

### Input Fields
*   **Style:** Minimalist. No heavy boxes. Use `surface_container_low` as the background with a `Ghost Border`.
*   **Active State:** Transition the border to `primary` (100% opacity) and add a subtle `primary_fixed` outer glow (4px).

### High-End Detail: The Financial Chip
For tax statuses or account types, use `secondary_fixed` chips with `on_secondary_fixed_variant` text. These should be `full` rounded (pills) to contrast against the architectural squareness of the rest of the UI.

---

## 6. Do's and Don'ts

### Do:
*   **Do** embrace white space. If you think there is enough space, add 20% more.
*   **Do** use `tertiary` (#321b00) and `tertiary_fixed` for "Warning" or "Alert" contexts sparingly; it provides a sophisticated alternative to "Error Red."
*   **Do** align text to a strict baseline grid to ensure the "Ledger" feel is maintained.

### Don't:
*   **Don't** use 100% black (#000000). Use `on_surface` (#191c1d) for all "black" text to maintain a softer, premium contrast.
*   **Don't** use standard drop shadows. If it looks like a "box shadow" from 2015, it's too heavy.
*   **Don't** use icons of different stroke weights. Stick to a 1.5pt or 2pt weight to match the Inter typeface.