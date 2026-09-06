# O'BUUMBA DESIGN SYSTEM

## PRIMARY COLOR PALETTE

### Heritage Colors (O'BUUMBA Cultural Identity)

```
Deep Navy Blue
HEX: #0F1B3C
RGB: 15, 27, 60
CMYK: 75%, 55%, 0%, 76%
Purpose: Foundation, authority, Zambezi depth, night sky over Livingstone
Usage: Primary backgrounds, headers, main frames
```

```
Metallic Gold
HEX: #D4AF37
RGB: 212, 175, 55
CMYK: 0%, 17%, 74%, 17%
Purpose: Accent, premium touch, sun on the Zambezi, cultural elevation
Usage: Highlights, borders, premium elements, interactive states
```

```
Gold Leaf
HEX: #C9A961
RGB: 201, 169, 97
CMYK: 0%, 16%, 52%, 21%
Purpose: Secondary accent, framing, elegance
Usage: Sub-accents, decorative elements, secondary highlights
```

```
Off-White / Cream
HEX: #F5F1E8
RGB: 245, 241, 232
CMYK: 0%, 2%, 5%, 4%
Purpose: Primary text surface, matting, breathing space
Usage: Text backgrounds, content areas, matting frames
```

---

## SECONDARY PALETTE (Functional & Emotional)

### Status & Feedback

```
Success / Growth
HEX: #10B981
RGB: 16, 185, 129
Purpose: Verification, free tools, active states
```

```
Warning / Attention
HEX: #F59E0B
RGB: 245, 158, 11
Purpose: Tool deprecation, verification pending, caution
```

```
Experimental / Mashup Energy
HEX: #8B5CF6
RGB: 139, 92, 246
Purpose: Creative experimentation, mashup mode, new features
```

```
Critical / Paid
HEX: #EF4444
RGB: 239, 68, 68
Purpose: Paywall alerts, critical issues, fallback warnings
```

---

## EXTENDED PALETTE (Cultural Expression)

### Zambian Cultural Touches

```
Zambezi River Blue
HEX: #1E40AF
RGB: 30, 64, 175
Purpose: Water, flow, continuity, journey
```

```
Mosi-oa-Tunya Mist
HEX: #E5E7EB
RGB: 229, 231, 235
Purpose: Misty backgrounds, subtle overlays, ethereal moments
```

```
Earth / Soil Tone
HEX: #92400E
RGB: 146, 64, 14
Purpose: Grounding, authenticity, street reality
```

```
Maramba / Dambwa Green
HEX: #065F46
RGB: 6, 95, 70
Purpose: Community, growth, roots, neighborhood identity
```

---

## TYPOGRAPHY SYSTEM

### Primary Font Stack
```
Font Family: Inter, SF Pro Display, Segoe UI, sans-serif
Rationale: Clean, modern, globally accessible
Fallback: System fonts for Chromebook/Android compatibility
```

### Font Weights & Sizes

| Usage | Weight | Size | Line Height |
|-------|--------|------|-------------|
| **Display/Hero** | Bold (700) | 48px–64px | 1.2 |
| **Heading 1** | Bold (700) | 36px–48px | 1.3 |
| **Heading 2** | Semibold (600) | 28px–36px | 1.3 |
| **Heading 3** | Semibold (600) | 20px–24px | 1.4 |
| **Body Text** | Regular (400) | 16px–18px | 1.6 |
| **Small Text** | Regular (400) | 12px–14px | 1.5 |
| **Code / Mono** | Regular (400) | 14px | 1.4 |

---

## COLOR APPLICATION RULES

### Primary Content Area
- **Background**: Off-White (#F5F1E8)
- **Text**: Deep Navy (#0F1B3C)
- **Accents**: Metallic Gold (#D4AF37)
- **Borders**: Gold Leaf (#C9A961) at 30% opacity

### Navigation & Headers
- **Background**: Deep Navy (#0F1B3C)
- **Text**: Off-White (#F5F1E8)
- **Active Indicator**: Metallic Gold (#D4AF37)
- **Hover**: Gold Leaf (#C9A961)

### Cards & Containers
- **Background**: Off-White (#F5F1E8)
- **Border**: Gold Leaf (#C9A961) at 40% opacity
- **Shadow**: Deep Navy (#0F1B3C) at 8% opacity
- **Hover Border**: Metallic Gold (#D4AF37)

### Tool Status Indicators
| Status | Color | Usage |
|--------|-------|-------|
| **Free & Active** | Success Green (#10B981) | Open-source, no paywall |
| **Verification Pending** | Warning Orange (#F59E0B) | Recently changed, needs review |
| **Experimental** | Purple (#8B5CF6) | Mashup mode, new feature |
| **Paid / Unavailable** | Critical Red (#EF4444) | Paywall detected, not recommended |

### Button States

```
Primary Button
- Default: Deep Navy background, Off-White text, Gold border
- Hover: Metallic Gold background, Deep Navy text
- Active: Gold Leaf background, Deep Navy text
- Disabled: Mosi-oa-Tunya Mist background, 50% opacity text

Secondary Button
- Default: Transparent, Gold Leaf border, Deep Navy text
- Hover: Metallic Gold background, Deep Navy text
- Active: Metallic Gold background, Deep Navy text
```

---

## COMPONENT DESIGN PATTERNS

### Gold-Leaf Framing (Premium Element)
```
Apply to:
- Project hero images
- Key creative outputs
- Achievement moments
- Cultural landmarks

Pattern:
- 12–16px gold-leaf border
- 24–32px off-white matting
- Deep navy shadow (8px, 15% opacity)
- Subtle glow: Gold at 5% opacity, 4px blur
```

### Spacing System
```
Base Unit: 8px

Spacing Scale:
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px

Rule: Always use multiples of 8px
```

### Elevation / Shadow System
```
Shadow 1 (Cards):
box-shadow: 0 1px 3px rgba(15, 27, 60, 0.12), 
            0 1px 2px rgba(15, 27, 60, 0.24)

Shadow 2 (Elevated):
box-shadow: 0 3px 6px rgba(15, 27, 60, 0.15), 
            0 2px 4px rgba(15, 27, 60, 0.12)

Shadow 3 (Premium/Gold):
box-shadow: 0 10px 25px rgba(212, 175, 55, 0.15),
            0 0 1px rgba(212, 175, 55, 0.3)
```

---

## RESPONSIVE DESIGN

### Breakpoints
```
Mobile:      320px–639px
Tablet:      640px–1023px
Desktop:     1024px–1535px
Wide:        1536px+
```

### Mobile-First Colors
```
On Chromebook/Android:
- Reduce shadow depth (performance)
- Increase contrast (legibility in sunlight)
- Simplify gradients (rendering speed)
- Prioritize off-white backgrounds (reduce OLED burn-in)
```

---

## ACCESSIBILITY

### Contrast Ratios (WCAG AA+)
```
Deep Navy (#0F1B3C) on Off-White (#F5F1E8): 14.2:1 ✅
Metallic Gold (#D4AF37) on Deep Navy: 6.8:1 ✅
Metallic Gold (#D4AF37) on Off-White: 3.2:1 ⚠️ (Use for accents only)
```

### Color-Blind Safe
- Do not rely on color alone for status
- Always pair with icon/text indicator
- Test with Deuteranopia, Protanopia simulators

---

## CULTURAL VISUAL MOMENTS

### Signature Treatment
```
Whenever representing:
- Livingstone geography
- Cultural moments
- O'BUUMBA identity

Apply:
1. Deep Navy base
2. Gold leaf framing
3. Off-white matting (wide)
4. Subtle Zambezi blue accent
5. Earth tone grounding element
```

### Example: Project Hero
```
Background: Deep Navy gradient to Zambezi Blue
Border: Gold Leaf frame (16px)
Matting: Off-White (32px)
Text: Deep Navy on Off-White
Accent: Metallic Gold highlights
Shadow: Premium shadow with gold tint
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Primary palette defined in CSS custom properties
- [ ] Typography scale locked in design tokens
- [ ] Component states (hover, active, disabled) documented
- [ ] Spacing system enforced in layout grid
- [ ] Shadow system applied consistently
- [ ] Accessibility contrast verified (WCAG AA+)
- [ ] Mobile responsiveness tested
- [ ] Color-blind simulation tested
- [ ] Chromebook/Android rendering verified
- [ ] Gold-leaf framing template created
- [ ] Brand identity guide shipped

---

## DESIGN TOKENS (CSS Custom Properties)

```css
:root {
  /* Primary Colors */
  --color-navy: #0F1B3C;
  --color-gold: #D4AF37;
  --color-gold-leaf: #C9A961;
  --color-cream: #F5F1E8;
  
  /* Secondary */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-experimental: #8B5CF6;
  --color-critical: #EF4444;
  
  /* Extended */
  --color-zambezi: #1E40AF;
  --color-mist: #E5E7EB;
  --color-earth: #92400E;
  --color-green: #065F46;
  
  /* Typography */
  --font-primary: Inter, SF Pro Display, Segoe UI, sans-serif;
  --font-mono: Courier New, monospace;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* Shadows */
  --shadow-1: 0 1px 3px rgba(15, 27, 60, 0.12);
  --shadow-2: 0 3px 6px rgba(15, 27, 60, 0.15);
  --shadow-gold: 0 10px 25px rgba(212, 175, 55, 0.15);
}
```

---

**Tuli pano. L'Stone ku chalo. (O'Buumba Empire)**

This is the visual language of sovereignty, creativity, and cultural pride.
