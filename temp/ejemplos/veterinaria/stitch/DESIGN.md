# Design System Document: The Compassionate Guardian

## 1. Overview & Creative North Star
**Creative North Star: "The Organic Sanctuary"**

This design system moves away from the sterile, cold aesthetics of traditional medical clinics. Instead, it embraces a "High-End Editorial" approach that feels more like a premium lifestyle brand or a boutique Paraguayan estancia. We combine the "Noble" (authoritative, high-contrast, deep greens) with the "Friendly" (soft rounded geometry and warm cream surfaces). 

To break the "template" look, we utilize **Intentional Asymmetry**. Large-scale typography is often offset, and images of animals should bleed off the edge of containers or overlap layered surfaces. We treat the UI not as a digital grid, but as an editorial spread—spacious, breathable, and deeply tactile.

---

## 2. Colors & Surface Architecture

Our palette is inspired by the lush landscapes of Paraguay and the warmth of a welcoming home.

### Color Tokens
*   **Primary (`#154212`)**: A deep, noble forest green. Use this for high-impact brand moments and authoritative text.
*   **Secondary (`#465f88`)**: A professional navy blue. Reserved for secondary actions and "trust" indicators (e.g., certifications).
*   **Surface/Background (`#fdf9f0`)**: A warm, soft cream. This is our canvas; never use pure white (#ffffff) for large backgrounds.
*   **Tertiary (`#44371e`)**: An organic, earthy brown used for grounding elements and subtle accents.

### The "No-Line" Rule
**Prohibition:** 1px solid borders are strictly forbidden for sectioning or card definition. 
**Execution:** Boundaries must be defined through background color shifts. A section using `surface-container-low` should sit directly against a `surface` background. The transition should be felt, not seen as a stroke.

### The "Glass & Gradient" Rule
To add "soul" to the digital experience:
*   **Signature Textures:** Use a subtle linear gradient for Hero CTAs, transitioning from `primary` (#154212) to `primary_container` (#2d5a27).
*   **Glassmorphism:** For floating navigation bars or mobile overlays, use `surface` at 80% opacity with a `24px` backdrop-blur. This allows the warm imagery of the clinic to bleed through the interface.

---

## 3. Typography: The Editorial Voice

We pair a charismatic, rounded display face with a highly legible, technical body face to balance "Heart" and "Science."

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Friendly" anchors. Use `display-lg` for hero sections with tight letter-spacing (-2%) to create a premium, "locked-in" editorial feel.
*   **Body & Labels (Manrope):** A clean, modern sans-serif that ensures medical information is easy to digest.
*   **The Scale:**
    *   **Display-LG (3.5rem):** High-impact marketing statements.
    *   **Headline-MD (1.75rem):** Section titles, often paired with an asymmetrical layout.
    *   **Body-LG (1rem):** Primary reading text with a generous line-height (1.6) for accessibility.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are often "dirty." In this system, we use light and tone to create a sense of place.

### The Layering Principle
Hierarchy is achieved by stacking `surface-container` tiers. 
1.  **Level 0 (Base):** `surface` (#fdf9f0)
2.  **Level 1 (Sections):** `surface_container_low` (#f7f3ea)
3.  **Level 2 (Cards/Modules):** `surface_container_lowest` (#ffffff) 

### Ambient Shadows
If a floating element (like a "Book Appointment" modal) requires a shadow:
*   **Color:** Use a tinted shadow based on `on_surface` (#1c1c17) at 6% opacity.
*   **Blur:** High diffusion (32px to 64px) with 0 spread. This mimics natural sunlight filtered through a window.

### The "Ghost Border" Fallback
In rare cases where contrast is required (e.g., input fields), use a "Ghost Border": `outline_variant` at **15% opacity**. Never use a 100% opaque stroke.

---

## 5. Components

### Buttons (The Interaction Core)
*   **Primary:** `primary` background with `on_primary` text. Use `rounded-full` (9999px) for a friendly, approachable feel.
*   **Secondary:** `secondary_container` background with `on_secondary_container` text. These should feel "quieter" than the primary action.
*   **Tertiary:** No background. Use `primary` text with a subtle underline or an arrow icon for "Learn More" links.

### Service & Testimonial Cards
*   **Layout:** No dividers. Use `surface_container_highest` for the card background. 
*   **Padding:** Massive internal padding (`xl` scale).
*   **Typography:** Headlines within cards should use `title-lg`. 
*   **Interaction:** On hover, a card should shift from `surface_container_highest` to `surface_container_lowest` and gain an Ambient Shadow.

### Inputs & Forms
*   **Style:** Minimalist. `surface_container_low` background with a `Ghost Border` bottom-stroke only.
*   **States:** On focus, the bottom stroke transitions to `primary` (#154212) with a 2px thickness.

### Signature Component: The "Pet Portrait" Frame
*   For testimonials or staff bios, use an asymmetrical container with a `lg` (2rem) corner radius on the top-left and bottom-right, and a `none` (0px) radius on the other corners. This mimics high-end interior design frames.

---

## 6. Do's and Don'ts

### Do:
*   **Use Whitespace as a Tool:** If two sections feel too close, increase the vertical margin rather than adding a divider line.
*   **Localize Imagery:** Use photography that reflects the specific flora and urban/rural textures of Paraguay—lapacho flowers, warm wood textures, and natural light.
*   **Layer Elements:** Allow images of pets to slightly overlap the edge of a text container to create depth.

### Don't:
*   **Don't use pure black:** Use `on_surface` (#1c1c17) for text to maintain the "warm" atmosphere.
*   **Don't use hard corners:** Except for the "Pet Portrait" frame, stick to the `DEFAULT` (1rem) or `lg` (2rem) roundedness scale.
*   **Don't crowd the FAQ:** Use the `surface-container` tiers to separate FAQ items. If you need a divider, use a 10% opacity `outline_variant` that doesn't touch the edges of the container.