import React from "react";
import PropTypes from "prop-types";
import { Edit3, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

const OwnerActions = ({
  onEdit,
  onDelete,
  isEditing = false,
  isDeleting = false,
  disabled = false,
  className = "",
}) => {
  const isDisabled = disabled || isEditing || isDeleting;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {/* Edit Button */}
      <Button
        type="button"
        variant="default"
        onClick={onEdit}
        disabled={isDisabled}
        aria-label="Edit property listing"
        className="gap-2 rounded-xl font-semibold shadow-xs transition-all cursor-pointer"
      >
        {isEditing ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          <Edit3 className="w-4 h-4 shrink-0" />
        )}
        <span>{isEditing ? "Editing..." : "Edit Listing"}</span>
      </Button>

      {/* Delete Action with Safety Confirmation Modal */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            disabled={isDisabled}
            aria-label="Delete property listing"
            className="gap-2 rounded-xl font-semibold shadow-xs transition-all cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Trash2 className="w-4 h-4 shrink-0" />
            )}
            <span>{isDeleting ? "Deleting..." : "Delete Listing"}</span>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="rounded-2xl sm:max-w-md border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground font-bold">
              Are you sure you want to delete this listing?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              This action cannot be undone. This will permanently remove the
              property listing and all associated media from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-border cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              Delete Property
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

OwnerActions.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  isDeleting: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default OwnerActions;