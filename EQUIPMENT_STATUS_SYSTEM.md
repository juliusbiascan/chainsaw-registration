# Equipment Status System

## Overview

The equipment status system implements business rules for determining the validity status of equipment based on whether they are new registrations or renewals, and whether they have expired. The system provides clear visual indicators and descriptive labels to make renewal status immediately recognizable.

## Business Rules

The status system follows these business rules:

1. **New Equipment + Expired** → "inactive" (red badge with X icon)
2. **Renewal Equipment + Expired** → "Needs Renewal" (orange/gray badge with clock icon)  
3. **Any Equipment + Active** → "Active" (green badge with checkmark icon)

## Status Calculation Logic

### Validity Period
- **New Equipment**: 2 years from `dateAcquired`
- **Renewal Equipment**: 2 years from `createdAt`

### Status Determination
```typescript
if (isExpired) {
  return isNew ? 'inactive' : 'renewal';
} else {
  return 'active';
}
```

## Implementation

### Centralized Utility Functions

The status calculation is centralized in `lib/utils.ts`:

```typescript
export function calculateEquipmentStatus(
  isNew: boolean,
  dateAcquired: Date | string,
  createdAt: Date | string
): 'active' | 'inactive' | 'renewal'

export function getStatusBadgeVariant(status: 'active' | 'inactive' | 'renewal'): 'default' | 'secondary' | 'destructive'

export function getStatusLabel(status: 'active' | 'inactive' | 'renewal'): string

export function getStatusDescription(status: 'active' | 'inactive' | 'renewal'): string
```

### Status Display Features

#### Badge Variants
- **Active**: `default` (green badge with ✓ icon)
- **Needs Renewal**: `secondary` (orange/gray badge with ⏰ icon)
- **Inactive**: `destructive` (red badge with ✗ icon)

#### Descriptive Labels
- **active** → "Active"
- **renewal** → "Needs Renewal" (clearly indicates action required)
- **inactive** → "Inactive"

#### Tooltips
Each status badge includes a tooltip with detailed information:
- **Active**: "Equipment is currently valid and active"
- **Needs Renewal**: "Equipment has expired and requires renewal"
- **Inactive**: "Equipment has expired and is no longer active"

#### Visual Icons
- **Active**: CheckCircle2 icon (✓)
- **Needs Renewal**: Clock icon (⏰) - indicates time-sensitive action
- **Inactive**: XCircle icon (✗)

## Files Updated

### Core Implementation
- `lib/utils.ts` - Added centralized utility functions for status display
- `constants/data.ts` - Equipment type definition with status field

### Components Using Enhanced Status System
- `features/equipments/components/equipment-listing.tsx` - Main equipment listing
- `features/equipments/components/equipments-tables/columns.tsx` - Data table columns with tooltips
- `features/equipments/components/equipment-card.tsx` - Mobile equipment cards with enhanced status
- `features/equipments/components/equipments-tables/expandable-owner-info.tsx` - Expandable owner information
- `features/overview/components/recent-equipment.tsx` - Recent equipment overview
- `app/equipments/[equipmentId]/page.tsx` - Public equipment view page

### Data Layer
- `data/equipment-stats.ts` - Equipment statistics with expiry calculations
- `data/equipment.ts` - Equipment data operations

## Usage Examples

### Calculating Status
```typescript
import { calculateEquipmentStatus } from '@/lib/utils';

const status = calculateEquipmentStatus(
  equipment.isNew,
  equipment.dateAcquired,
  equipment.createdAt
);
```

### Displaying Enhanced Status Badge
```typescript
import { getStatusBadgeVariant, getStatusLabel, getStatusDescription } from '@/lib/utils';

<Badge variant={getStatusBadgeVariant(equipment.status)} className='capitalize'>
  {getStatusLabel(equipment.status)}
</Badge>
```

### Status with Tooltip
```typescript
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Badge variant={getStatusBadgeVariant(status)} className='cursor-help'>
        {getStatusLabel(status)}
      </Badge>
    </TooltipTrigger>
    <TooltipContent>
      <p>{getStatusDescription(status)}</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Status Flow

1. **Equipment Creation**: Status starts as 'active'
2. **Time-based Calculation**: Status is recalculated based on current date vs validity period
3. **Enhanced Display**: Status is shown with descriptive labels, icons, and tooltips
4. **Clear Renewal Indication**: "Needs Renewal" status is prominently displayed with clock icon
5. **Statistics**: Equipment stats include counts of expired/expiring equipment

## Benefits

- **Clear Renewal Indication**: "Needs Renewal" label makes it obvious when action is required
- **Visual Clarity**: Icons and colors make status immediately recognizable
- **Detailed Information**: Tooltips provide additional context for each status
- **Consistency**: Centralized logic ensures consistent status display across all components
- **Maintainability**: Single source of truth for status business rules
- **Type Safety**: TypeScript ensures correct status values
- **User Experience**: Clear visual hierarchy helps users quickly identify equipment requiring attention

## Renewal Status Features

### Primary Indicators
- **Label**: "Needs Renewal" instead of just "renewal"
- **Icon**: Clock icon (⏰) indicating time-sensitive action
- **Color**: Orange/gray badge to draw attention
- **Tooltip**: "Equipment has expired and requires renewal"

### Secondary Indicators
- **Registration Type**: Shows "New Registration" vs "Renewal" in expandable details
- **Validity Information**: Displays expiry dates and days until expiry
- **Statistics**: Dashboard shows counts of equipment needing renewal

## Future Enhancements

- Add status filtering capabilities (filter by "Needs Renewal")
- Implement status change notifications
- Add status history tracking
- Create status-based reporting features
- Add bulk renewal functionality
- Implement automatic renewal reminders
