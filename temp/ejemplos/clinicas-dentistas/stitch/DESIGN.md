# Design System Document: The Clinical Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Ethereal Clinic"**
This design system moves away from the sterile, rigid grids of traditional medical software and toward a high-end, editorial experience. It is designed for a premium dental clinic in Paraguay, blending the precision of dental science with the warmth of Latin hospitality. 

The aesthetic is "Soft Minimalism"—a style that prioritizes breathing room, asymmetric layouts, and tonal depth. By utilizing overlapping elements and a massive typographic scale contrast, we create an environment that feels welcoming yet authoritative. The UI should feel less like a "database of services" and more like a curated wellness journal.

---

## 2. Colors: The Tonal Depth Strategy
We utilize a sophisticated palette of teals and medical cyans, but the "premium" feel comes from how these colors are layered, not just applied.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections.
Boundaries must be created through background shifts. A section using `surface-container-low` (#f2f4f5) sitting against a `background` (#f8fafb) creates a sophisticated, "borderless" transition that feels modern and hygienic.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper.
*   **Base:** `surface` (#f8fafb)
*   **Lower Depth:** `surface-container-low` (#f2f4f5) for large background sections.
*   **Actionable Depth:** `surface-container-lowest` (#ffffff) for cards or interactive elements. This creates a "lifted" effect without heavy shadows.

### The "Glass & Gradient" Rule
To avoid a flat, "standard" look:
*   **Glassmorphism:** Use `surface-container-lowest` at 70% opacity with a `backdrop-blur` of 20px for floating navigation bars or appointment modals.
*   **Signature Textures:** Apply a subtle linear gradient (from `primary` #00616c to `primary-container` #007c89) at a 135-degree angle for primary CTAs. This adds a "jewel" quality to the interaction.

---

## 3. Typography: The Editorial Scale
We use a dual-font approach to balance clinical professionalism with high-end fashion.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech" feel. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero sections to create a bold, editorial impact.
*   **Body & Titles (Inter):** Chosen for its unparalleled legibility. Inter provides the "trustworthy" foundation required for medical descriptions.

**The Hierarchy of Trust:**
*   **Hero Headlines:** `display-md` (Manrope) – Dramatic, confident, and welcoming.
*   **Service Titles:** `title-lg` (Inter) – Clear, professional, and accessible.
*   **Body Copy:** `body-lg` (Inter) – Generous line-height (1.6) to ensure the medical information feels easy to digest, never cramped.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "digital." We mimic natural light.

*   **The Layering Principle:** Instead of shadows, place a `surface-container-lowest` card on a `surface-container-low` background. The subtle 3% shift in brightness is enough for the eye to perceive depth.
*   **Ambient Shadows:** If an element must float (e.g., a "Book Now" FAB), use a shadow color of `on-surface` (#191c1d) at 4% opacity with a 40px blur and 10px Y-offset.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` (#bdc8cb) at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Primary Buttons (Signature CTAs)
*   **Style:** `primary` (#00616c) background, `on-primary` (#ffffff) text.
*   **Rounding:** `full` (9999px) to convey a friendly, welcoming "pill" shape.
*   **States:** On hover, shift to `primary-container` (#007c89). Use a 300ms ease-in-out transition.

### Medical Service Cards
*   **Rule:** Forbid divider lines.
*   **Structure:** Use a `surface-container-lowest` background with `xl` (0.75rem) rounded corners.
*   **Layout:** Asymmetric. Place the service icon (Teal) in the top right, with `headline-sm` text aligned to the bottom left. This breaks the "template" look.

### Professional Profiles (The Specialists)
*   **Visuals:** Use high-key photography with the background removed, placed against a `secondary-container` (#c9e5e9) soft-round shape. 
*   **Detail:** Labels for "Specialization" should use `label-md` in `on-tertiary-fixed-variant` (#00504a) for a sophisticated color pop.

### Input Fields
*   **Style:** Minimalist. No background. Only a bottom border using `outline-variant` (#bdc8cb) at 40% opacity.
*   **Focus:** When active, the bottom border animates to 2px thickness using `primary` (#00616c).

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place a large medical image slightly off-center, overlapping a background color block.
*   **Embrace Negative Space:** If you think there is enough white space, add 20% more. Premium dental care is about "room to breathe."
*   **Use Intentional Gradients:** Only use them on the `primary` action buttons to draw the eye.

### Don’t:
*   **Don't Use Pure Black:** Use `on-surface` (#191c1d) for text. It is softer and feels more "natural."
*   **Don't Use 1px Dividers:** Use vertical spacing (32px, 64px, or 128px) or subtle tonal shifts in the background to separate content sections.
*   **Don't Use Sharp Corners:** Avoid the `none` or `sm` roundedness tokens. Use `lg` or `xl` to maintain a "gentle" clinical feel.

---

## 7. Signature Interaction: The "Hygienic Wipe"
When transitioning between pages or opening a profile, use a "wipe" animation where a `primary-fixed` (#96f1ff) surface slides across the screen. This reinforces the concept of "cleaning" and "hygiene" through motion design.