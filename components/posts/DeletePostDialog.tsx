import { PostData } from "@/lib/types";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  post?: PostData;
  open: boolean;
  onClose: () => void;
}

export default function DeletePostDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            loading={false}
            disabled={false}
            classname=""
          >
            Delete
          </LoadingButton>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
