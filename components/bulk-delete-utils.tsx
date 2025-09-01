'use client';

import { Equipment } from '@/constants/data';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { bulkDeleteEquipmentAction } from '@/actions/equipment';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BulkDeleteUtilsProps {
  selectedEquipments: Equipment[];
  onDeleteSuccess?: () => void;
}

export function BulkDeleteUtils({ selectedEquipments, onDeleteSuccess }: BulkDeleteUtilsProps) {
  const handleBulkDelete = async () => {
    try {
      const equipmentIds = selectedEquipments.map(equipment => equipment.id);
      const result = await bulkDeleteEquipmentAction(equipmentIds);

      if (result.success) {
        alert(`Successfully deleted ${result.details.success} equipment records. ${result.details.failed} records failed to delete.`);

        // Call the success callback or refresh the page
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          window.location.reload();
        }
      } else {
        alert(`Delete failed: ${result.message}\n\nErrors:\n${result.details.errors.slice(0, 10).join('\n')}`);
      }
    } catch (error) {
      console.error('Error during bulk delete:', error);
      alert('Error deleting equipment records');
    }
  };

  // Don't render if no items are selected
  if (!selectedEquipments || selectedEquipments.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile View */}
      <div className="sm:hidden">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedEquipments.length})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Confirm Bulk Delete
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedEquipments.length} equipment record{selectedEquipments.length > 1 ? 's' : ''}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete {selectedEquipments.length} Record{selectedEquipments.length > 1 ? 's' : ''}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedEquipments.length})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Confirm Bulk Delete
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedEquipments.length} equipment record{selectedEquipments.length > 1 ? 's' : ''}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete {selectedEquipments.length} Record{selectedEquipments.length > 1 ? 's' : ''}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
