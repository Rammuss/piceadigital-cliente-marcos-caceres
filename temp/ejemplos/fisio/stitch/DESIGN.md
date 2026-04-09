# Design System Strategy: The Human Sanctuary

## 1. Overview & Creative North Star
The objective of this design system is to transcend the "medical clinic" stereotype. In the context of Paraguayan physiotherapy—where personal trust and "nobleza" (nobility) are paramount—we are building **The Human Sanctuary**. 

This system rejects the cold, sterile, and rigid grids of traditional healthcare. Instead, it adopts a **High-End Editorial** aesthetic. We break the "template" look through intentional asymmetry, generous whitespace, and a "soft-touch" layering approach. By mixing high-contrast typography scales with organic, rounded shapes, we create a digital environment that feels as restorative as the physical therapy itself.

**Creative North Star: "The Curated Sanctuary"**
*   **Nobility:** Expressed through spacious layouts and serif body copy that feels like a premium publication.
*   **Simplicity:** Achieved by removing "visual noise" like borders and dividers.
*   **Friendliness:** Evoked through soft tonal shifts and deeply rounded corners.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the earth and sea—warm whites and soft teals. It is designed to feel "human-centric" rather than "hospital-centric."

### The "No-Line" Rule
To maintain a premium, editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries between content must be defined exclusively through background color shifts or subtle tonal transitions. For example, a `surface-container-low` card sitting on a `background` provides all the definition needed without the "cheapness" of a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like fine paper stacked on a wooden desk.
*   **Background (#fbf9f2):** Your base canvas. Always warm, never pure white.
*   **Surface-Container-Lowest (#ffffff):** Used for primary content cards that need to "pop" from the warm background.
*   **Surface-Container-High (#e9e9de):** Use this for secondary utility areas or "pockets" of information.
*   **Nesting Rule:** When placing a container inside another, always move one "tier" up or down in the surface scale to ensure the eye perceives the depth naturally.

### The "Glass & Gradient" Rule
To add "soul" to the professional foundation:
*   **Glassmorphism:** Use for floating navigation bars or appointment modals. Combine `surface` colors at 80% opacity with a `20px` backdrop-blur.
*   **Signature Gradients:** For Hero backgrounds or primary CTAs, use a subtle linear gradient from `primary` (#33685d) to `primary_container` (#b6eee0). This prevents the "flat" look and adds a sense of light and vitality.

---

## 3. Typography: The Editorial Voice
Our typography pairing is the cornerstone of the "Nobleza" vibe. 

*   **Headings (Manrope - Sans-Serif):** Modern, clean, and authoritative. Use `display-lg` for hero statements with tight letter-spacing (-0.02em) to feel bespoke.
*   **Body (Noto Serif):** This is where the "trust" happens. Using a serif for body copy (`body-lg`) suggests a high level of care and academic depth. It makes the content feel like a conversation with a wise professional.
*   **Hierarchy:** Always favor extreme scale. A very large `display-md` heading paired with a significantly smaller `label-md` creates an "editorial" contrast that feels much more expensive than standard web typography.

---

## 4. Elevation & Depth
Depth in this system is organic, not mechanical.

*   **Tonal Layering:** Avoid shadows wherever possible. Use the difference between `surface_container_low` and `surface_container_highest` to create a "recessed" or "lifted" feel.
*   **Ambient Shadows:** If a floating element (like a FAB or Modal) requires a shadow, it must be "Ambient." Use the `on_surface` color at 5% opacity with a blur radius of at least `30px`. This mimics natural light rather than a digital drop shadow.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a border (e.g., in high-contrast modes), use a "Ghost Border": the `outline_variant` token at 15% opacity. Never use 100% opaque outlines.

---

## 5. Components

### Buttons (The "Soft-Touch" Action)
*   **Primary:** Solid `primary` (#33685d) with `on_primary` text. Corner radius: `full`. Use a subtle inner-glow (top-down white gradient at 10%) to give it a 3D "human" feel.
*   **Secondary:** `primary_container` background. No border.
*   **Tertiary:** Text-only in `primary` with a `surface_variant` hover state.

### Cards & Lists (The "Anti-Grid")
*   **The Rule:** Forbid divider lines.
*   **Cards:** Use `surface_container_lowest` for cards. Apply the `xl` (1.5rem) roundedness. 
*   **Spacing:** Use vertical white space (32px - 48px) to separate list items. If a separator is needed, use a 4px wide vertical "accent bar" of `primary_fixed` on the left side of the active item instead of a horizontal line.

### Input Fields
*   Background: `surface_container_low`.
*   Shape: `md` (0.75rem) corner radius.
*   Focus State: A `2px` glow of `primary_fixed` rather than a sharp border. This keeps the "Amigable" (friendly) promise.

### Special Component: The "Relief Card"
For physiotherapy services, use a "Relief Card": an asymmetric layout where an image (with `lg` rounded corners) overlaps the edge of a `surface_container` card by 24px. This creates a sense of movement and "breaking the box."

---

## 6. Do's and Don'ts

### Do:
*   **Do** use "Manrope" in All-Caps for `label-sm` to create a professional, architectural feel.
*   **Do** use asymmetrical margins. For example, a wider left margin than right for body text blocks to create editorial tension.
*   **Do** prioritize "Natural Motion." When elements appear, use a "Decelerated" easing curve (0.0, 0.0, 0.2, 1) to make the UI feel calm and steady.

### Don't:
*   **Don't** use 1px dividers. Ever. Use space or color shifts.
*   **Don't** use sharp corners. Even a `none` or `sm` corner feels too clinical for this brand. Stick to `md` and above.
*   **Don't** use pure black (#000000) for text. Use `on_surface` (#32332b) to keep the warmth.
*   **Don't** overcrowd. If you think a section is finished, add 20% more white space. Nobleza requires room to breathe.