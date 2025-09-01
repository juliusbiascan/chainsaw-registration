# Excel Export Feature

## Overview

The Excel export feature allows users to export equipment data from the DENR Chainsaw Registry to Excel format (.xlsx files). This feature is available in both desktop and mobile views, and supports exporting all equipment data or selected equipment only.

## Features

### Export Options
- **Export All**: Export all equipment data currently displayed in the table
- **Export Selected**: Export only the selected equipment items (when row selection is enabled)

### Data Included in Export
The Excel file includes all equipment information organized in columns:

1. **Equipment ID** - Unique identifier
2. **Owner Information**
   - First Name
   - Last Name
   - Middle Name
   - Address
   - Contact Number
   - Email
   - Preferred Contact Method
3. **Equipment Details**
   - Brand
   - Model
   - Serial Number
   - Guide Bar Length (inches)
   - Horse Power
   - Fuel Type
   - Date Acquired
   - Stencil of Serial Number
   - Other Information
   - Intended Use
   - Is New Equipment (Yes/No)
   - Status
4. **Timestamps**
   - Created At
   - Updated At

### File Format
- **Format**: Excel (.xlsx)
- **Filename**: `equipment-data-YYYY-MM-DD.xlsx` (includes current date)
- **Worksheet**: "Equipment Data"
- **Column Widths**: Optimized for readability

## Usage

### Desktop View
1. Navigate to the Equipment listing page
2. Use the "Export to Excel" button in the toolbar
3. Choose between "Export All" or "Export Selected" (if items are selected)
4. The Excel file will be automatically downloaded

### Mobile View
1. Navigate to the Equipment listing page
2. Tap the three-dot menu (⋮) in the toolbar
3. Select "Export to Excel" from the dropdown menu
4. Choose between "Export All" or "Export Selected" (if items are selected)
5. The Excel file will be automatically downloaded

### Row Selection
- Select individual rows by clicking the checkbox
- Use "Select All" to select all visible equipment
- Export will only include selected items when any are selected
- If no items are selected, all equipment will be exported

## Technical Implementation

### Components
- `ExcelExportUtils` - Standalone component for Excel export functionality
- Integrated into `QRPrintUtils` for unified export options
- Added to equipment table toolbar and mobile actions

### Dependencies
- `xlsx` library for Excel file generation
- `lucide-react` for icons (FileSpreadsheet, Download)

### Key Functions
```typescript
exportToExcel(items: Equipment[]) => void
```
- Transforms equipment data to export format
- Creates Excel workbook with proper formatting
- Sets column widths for optimal readability
- Generates timestamped filename
- Triggers automatic download

## Error Handling
- Graceful error handling with user-friendly alerts
- Console logging for debugging
- Fallback behavior if export fails

## Browser Compatibility
- Works in all modern browsers
- Automatic file download support required
- No server-side processing needed (client-side only)

## Future Enhancements
- Custom column selection
- Multiple worksheet support
- Advanced filtering options
- Export templates
- Batch export scheduling
