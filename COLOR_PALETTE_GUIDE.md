# Dacali Color Palette Guide

## 🎨 New Color Palette

Your Dacali marketplace now uses a sophisticated, professional color palette that conveys luxury and craftsmanship:

### Primary Colors
- **Navy Blue**: `#1D2D50` - Main brand color for headers, navigation
- **Wine Red**: `#6E1414` - Accent color for CTAs, important actions
- **Cream**: `#FDF6F0` - Background and text color for warmth
- **Muted Gold**: `#B08D57` - Highlight color for premium elements
- **Charcoal Black**: `#1C1C1C` - Text and dark mode backgrounds

## 💡 Usage Guidelines

### Tailwind Classes Available
You can now use these custom classes in your components:
```css
/* Background Colors */
bg-navy-blue
bg-wine-red
bg-cream
bg-muted-gold
bg-charcoal-black

/* Text Colors */
text-navy-blue
text-wine-red
text-cream
text-muted-gold
text-charcoal-black

/* Border Colors */
border-navy-blue
border-wine-red
border-cream
border-muted-gold
border-charcoal-black
```

### Semantic Color Mapping
The palette is mapped to semantic Tailwind variables:

**Light Mode:**
- `bg-background` → Cream (#FDF6F0)
- `text-foreground` → Charcoal Black (#1C1C1C)
- `bg-primary` → Navy Blue (#1D2D50)
- `bg-secondary` → Muted Gold (#B08D57)
- `bg-accent` → Wine Red (#6E1414)

**Dark Mode:**
- `bg-background` → Charcoal Black (#1C1C1C)
- `text-foreground` → Cream (#FDF6F0)
- `bg-primary` → Lighter Navy (#4A5F8A)
- `bg-secondary` → Muted Gold (#B08D57)
- `bg-accent` → Lighter Wine Red (#A02020)

## 🔄 Color Combinations

### High Contrast Combinations (for text/backgrounds)
- **Navy Blue + Cream** - Primary headers, navigation
- **Wine Red + Cream** - Call-to-action buttons
- **Charcoal Black + Cream** - Body text
- **Muted Gold + Navy Blue** - Accent highlights

### Gradient Suggestions
```css
/* Hero section gradients */
bg-gradient-to-br from-navy-blue via-muted-gold to-wine-red

/* Dark mode gradients */
bg-gradient-to-br from-charcoal-black via-navy-blue to-charcoal-black

/* Subtle overlays */
bg-navy-blue/30 backdrop-blur-sm
```

## 🎯 Component-Specific Usage

### Headers & Navigation
- Background: `bg-navy-blue/95 backdrop-blur-md`
- Text: `text-cream`
- Logo/Brand: `text-muted-gold`

### Buttons
- Primary: `bg-navy-blue text-cream hover:bg-navy-blue/80`
- Secondary: `bg-wine-red text-cream hover:bg-wine-red/80`
- Outline: `border-2 border-muted-gold text-muted-gold hover:bg-muted-gold hover:text-navy-blue`

### Cards & Panels
- Light mode: `bg-cream border border-cream/20`
- Dark mode: `bg-charcoal-black/80 border border-cream/20`

### Forms
- Input backgrounds: `bg-input` (maps to light cream variations)
- Input borders: `border-border` (maps to light gold-tinted borders)
- Focus states: `focus:ring-navy-blue focus:border-navy-blue`

### Status & Feedback
- Success: Use `muted-gold` for positive feedback
- Error/Destructive: Use `wine-red` for errors and warnings
- Info: Use `navy-blue` for informational elements

## 🔧 Implementation Status

### ✅ Updated Files
- `src/app/globals.css` - Core color definitions and theme mapping
- `src/app/page.tsx` - Main page gradient backgrounds
- `src/components/Header.tsx` - Navigation colors
- `src/app/components/HeroSection.tsx` - Hero section styling
- `src/app/components/Categories.tsx` - Category cards

### 🔄 Still Need Updates
Most component files still contain hardcoded `slate-` colors that should be updated to use the new palette. Look for:
- `bg-slate-800`, `bg-slate-700`, etc.
- `text-slate-300`, `text-slate-400`, etc.
- `border-slate-600`, `border-slate-700`, etc.

### Next Steps
1. Replace remaining `slate-` colors in components
2. Update form components to use new input styles
3. Update dashboard components with new sidebar colors
4. Test accessibility and contrast ratios
5. Update any hardcoded hex colors to use the new palette

## 🎨 Design Philosophy

This palette was chosen to:
- **Convey luxury and craftsmanship** through rich, sophisticated colors
- **Maintain excellent accessibility** with high contrast combinations
- **Feel warm and inviting** through the cream and gold tones
- **Suggest trust and professionalism** through the navy blue foundation
- **Add premium touches** with the wine red accents

The colors work together to create a cohesive brand that appeals to both artisans and customers seeking high-quality, bespoke products.

