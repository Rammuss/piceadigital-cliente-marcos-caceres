# Design System Specification: The Architectural Counsel

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Estate"**
This design system rejects the frantic, cluttered aesthetic of traditional legal tech. Instead, it adopts the persona of a high-end architectural firm—stable, spacious, and meticulously curated. We move beyond the "template" look by utilizing intentional asymmetry, overlapping structural elements, and a radical commitment to whitespace.

The system is designed for "cold traffic" (potential clients in high-stress situations). By using a "Low Cognitive Load" philosophy, we guide the eye through editorial-style typography and a clear visual hierarchy that whispers rather than shouts. We don't just build pages; we curate experiences that instill immediate psychological safety and professional trust.

## 2. Color & Tonal Depth
The palette is rooted in a deep petrol blue (`primary`) and grounded by a sophisticated suite of "off-white" and "soft-grey" surfaces.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. 
*   **How to define boundaries:** Use background color shifts. A section using `surface-container-low` (#f2f4f5) sitting atop a `surface` (#f8fafb) background provides all the separation necessary.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. Never use 100% opaque lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the Material Design surface tiers to create "nested" importance:
*   **Base:** `surface` (#f8fafb) for the overall page background.
*   **Lowered Sections:** `surface-container-low` (#f2f4f5) for secondary content areas.
*   **Elevated Elements:** `surface-container-lowest` (#ffffff) for primary cards or interactive modules to create a "pop-out" effect against the softer background.

### The "Glass & Gradient" Rule
To avoid a "flat" corporate feel, utilize Glassmorphism for floating navigation bars or modal overlays. Use a semi-transparent `surface` color with a `backdrop-blur` of 12px–20px. 
*   **Signature Textures:** For primary CTAs or Hero backgrounds, use a subtle linear gradient (135°) from `primary` (#001d2f) to `primary_container` (#00334e). This adds a "visual soul" and a sense of premium material depth.

## 3. Typography
The system uses a dual-font approach to balance authority with approachability.

*   **Display & Headline (Manrope):** Chosen for its geometric stability and modern "editorial" feel. Large scales (Display LG at 3.5rem) should be used with tight letter-spacing (-0.02em) to create an authoritative, "bold-statement" presence.
*   **Body & UI (Inter):** Chosen for its exceptional legibility. Inter handles the heavy lifting of legal nuances, ensuring cold traffic can digest complex information without eye strain.
*   **Hierarchy as Brand:** Use `display-lg` for value propositions, and `title-md` for lead-ins. Maintain generous line-heights (1.6 for body) to facilitate rapid scanning.

## 4. Elevation & Depth
We convey hierarchy through **Tonal Layering** rather than structural lines.

*   **The Layering Principle:** Stack your containers. An "Expertise" card should be `surface-container-lowest` (pure white) placed on a `surface-container` (light grey) section. This creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements (e.g., active dropdowns), use "Ambient Shadows." 
    *   *Settings:* Y: 12px, Blur: 32px, Spread: -4px. 
    *   *Color:* Use `on-surface` (#191c1d) at 6% opacity. Avoid pure black shadows; let the shadow "breath" the color of the background.
*   **Glassmorphism:** Use for persistent elements like Header Nav. It allows the rich petrol and mint colors of the content to bleed through softly as the user scrolls, creating an integrated, high-end feel.

## 5. Components

### Buttons
*   **Primary (High Conversion):** Use the `tertiary_container` (#00390a) background with `on_tertiary_fixed` text. The soft mint/forest green is reserved *only* for high-intent actions (e.g., "Schedule Consultation").
*   **Secondary:** Petrol blue (`primary_container`) with `on_primary` text.
*   **Tertiary:** No background, `primary` text, with a 2px underline that expands on hover.
*   **Shape:** Use `md` (0.375rem) for a professional, "tailored" look. Avoid fully rounded "pill" buttons which feel too informal for law.

### Cards & Lists
*   **The "No Divider" Rule:** Forbid the use of horizontal lines in lists. Use vertical whitespace (padding-bottom: 2rem) or subtle background shifts between items.
*   **Cards:** Should never have a border. Use `surface-container-low` for the card body and `surface-container-lowest` for the inner content area to create depth.

### Input Fields
*   **Style:** Minimalist. No bottom line, no full box border. Use a subtle `surface-container-high` background color with a 4px corner radius.
*   **Focus State:** Transition the background to `surface-container-lowest` and add a 2px `primary` "Ghost Border" at 20% opacity.

### Featured Component: "The Case Study Carousel"
A bespoke component using intentional asymmetry. The image should be offset from the text container, overlapping with a subtle `backdrop-blur` element to tie the two together, breaking the rigid grid.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., 10% left, 15% right) to create an editorial flow.
*   **Do** prioritize "Reading Time" indicators for long legal insights to reduce cognitive load.
*   **Do** use micro-animations (e.g., 200ms ease-out opacity shifts) when elements enter the viewport.

### Don't
*   **Don't** use 100% opaque black (#000000). Use `on_surface` (#191c1d) for a softer, more premium contrast.
*   **Don't** crowd the "Contact" CTA. Give it a minimum of 80px "buffer" whitespace on all sides.
*   **Don't** use standard 1px dividers. If separation is desperate, use a 4px height bar in `surface-variant` with 50% width to create a "stylistic break" rather than a hard wall.