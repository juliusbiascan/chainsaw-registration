# Search Functionality Fix

## Problem
The search functionality for brand, model, and serialNumber was not working properly. The data table was configured to use individual column filters, but the backend was expecting a single search parameter.

## Solution
Updated the search functionality to properly handle individual column filters for brand, model, and serialNumber.

## Changes Made

### 1. Updated `lib/searchparams.ts`
- Added individual column search parameters: `brand`, `model`, `serialNumber`
- These parameters are now available in the search params cache

### 2. Updated `data/equipment.ts`
- Modified `getEquipments` function to accept individual column filters
- Added support for `brand`, `model`, and `serialNumber` parameters
- Implemented precise filtering logic:
  - If individual column filters are provided, use AND logic for precise matching
  - If no individual filters, fall back to general search across all fields
  - Each column filter uses case-insensitive contains matching

### 3. Updated `features/equipments/components/equipment-listing.tsx`
- Modified to extract individual column filters from search params
- Updated filters object to pass individual column filters to `getEquipments`
- Removed the logic that combined search terms into a single string

## How It Works

1. **Data Table Configuration**: The columns for brand, model, and serialNumber have `enableColumnFilter: true` and `variant: 'text'`

2. **URL Parameters**: When users type in the search inputs, the `useDataTable` hook automatically updates URL query parameters:
   - `?brand=Stihl` for brand search
   - `?model=MS` for model search  
   - `?serialNumber=ABC123` for serial number search

3. **Backend Processing**: The `getEquipments` function now:
   - Checks for individual column filters first
   - Uses AND logic to combine multiple filters (e.g., brand AND model)
   - Falls back to general search if no individual filters are provided
   - Maintains support for category filters (fuelType, intendedUse)

4. **Search Behavior**:
   - **Individual Search**: Search in specific columns (e.g., only brand)
   - **Combined Search**: Search across multiple columns simultaneously
   - **Case Insensitive**: All searches are case-insensitive
   - **Partial Matching**: Uses contains matching for flexible search

## Example Usage

- Search by brand: `?brand=Stihl`
- Search by model: `?model=MS`
- Search by serial number: `?serialNumber=ABC123`
- Combined search: `?brand=Stihl&model=MS`
- With pagination: `?brand=Stihl&page=1&perPage=10`

## Testing
The search functionality can be tested by:
1. Navigating to `/dashboard/equipments`
2. Using the search inputs in the data table toolbar
3. Checking that the URL updates with the correct parameters
4. Verifying that the results are filtered correctly
