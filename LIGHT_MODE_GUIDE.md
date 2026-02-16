# Complete Light Mode Conversion Guide

## ✅ COMPLETED PAGES
1. TaxCalendar.tsx
2. Sidebar.tsx  
3. Vault.tsx

## 🔄 APPLY TO ALL REMAINING PAGES

### Universal Replacements

Replace ALL instances across ALL pages:

```
bg-black dark:bg-black → bg-white dark:bg-black
text-white dark:text-white → text-black dark:text-white
text-gray-500 dark:text-gray-500 → text-gray-600 dark:text-gray-500
border-gray-800 dark:border-gray-800 → border-gray-200 dark:border-gray-800
bg-gray-900 dark:bg-gray-900 → bg-gray-100 dark:bg-gray-900
hover:bg-gray-900 dark:hover:bg-gray-900 → hover:bg-gray-50 dark:hover:bg-gray-900
text-yellow-400 dark:text-yellow-400 → text-yellow-500 dark:text-yellow-400
text-green-400 dark:text-green-400 → text-green-600 dark:text-green-400
text-red-400 dark:text-red-400 → text-red-600 dark:text-red-400
text-cyan-400 dark:text-cyan-400 → text-cyan-600 dark:text-cyan-400
```

### Button Patterns

**Inactive buttons:**
```tsx
className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-2 border-gray-300 dark:border-gray-800"
```

**Active buttons:**
```tsx
className="bg-yellow-400 text-black"
```

### Card/Box Patterns

**Main containers:**
```tsx
className="bg-white dark:bg-black border-l-4 border-cyan-500 p-4 shadow-lg"
```

**Nested containers:**
```tsx
className="bg-gray-50 dark:bg-gray-900"
```

### Text Patterns

**Headings:**
```tsx
className="text-black dark:text-white"
```

**Labels:**
```tsx
className="text-gray-600 dark:text-gray-500"
```

**Body text:**
```tsx
className="text-gray-700 dark:text-gray-400"
```

## 📋 FILES TO UPDATE

### Priority 1 (User-facing pages)
- [ ] Notifications.tsx
- [ ] Settings.tsx
- [ ] Dashboard.tsx
- [ ] Transactions.tsx
- [ ] Expenses.tsx

### Priority 2 (Secondary pages)
- [ ] Invoices.tsx
- [ ] BankAccounts.tsx
- [ ] SmartTaxVault.tsx
- [ ] Insights.tsx
- [ ] Help.tsx
- [ ] TaxManagement.tsx

### Priority 3 (Components)
- [ ] Dashboard/Stats.tsx
- [ ] Dashboard/Chart.tsx
- [ ] Dashboard/QuickActions.tsx
- [ ] Transactions/TransactionModal.tsx
- [ ] Transactions/Filters.tsx
- [ ] Transactions/TransactionList.tsx

## 🎨 Color Reference

### Light Mode
- Background: `#FFFFFF` (white)
- Surface: `#F5F5F5` (gray-50)
- Border: `#E5E7EB` (gray-200)
- Text Primary: `#000000` (black)
- Text Secondary: `#4B5563` (gray-600)
- Hover: `#F9FAFB` (gray-50)

### Dark Mode  
- Background: `#000000` (black)
- Surface: `#111827` (gray-900)
- Border: `#1F2937` (gray-800)
- Text Primary: `#FFFFFF` (white)
- Text Secondary: `#6B7280` (gray-500)
- Hover: `#111827` (gray-900)

### Accent Colors (Same for both modes)
- Yellow: `#FBBF24` (yellow-400)
- Cyan: `#06B6D4` (cyan-500)
- Green: `#10B981` (green-500)
- Red: `#EF4444` (red-500)

## 🚀 Quick Implementation

For each page, follow this pattern:

1. **Header section** - White bg, black text
2. **Stats cards** - White bg, colored borders
3. **Buttons** - Gray-100 inactive, yellow-400 active
4. **Content cards** - White bg with gray-50 nested
5. **Text** - Black primary, gray-600 secondary
6. **Icons** - Darker shades for light mode

## ✨ Testing Checklist

- [ ] All text readable in light mode
- [ ] All buttons visible and clickable
- [ ] Cards have proper contrast
- [ ] Borders visible but not harsh
- [ ] Icons properly colored
- [ ] Hover states work
- [ ] No pure black text on white (use gray-900)
- [ ] No pure white backgrounds (use off-white if needed)
