import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import avatarPlaceholder from "../../../assets/avatar-placeholder.png";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateUserProfileMutation } from "./mutations";
import Image, { StaticImageData } from "next/image";
import { Camera } from "lucide-react";
import Resizer from "react-image-file-resizer";
import CropImageDialog from "@/components/CropImageDialog";

interface EditProfieDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfieDialogProps) {
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });
  const mutation = useUpdateUserProfileMutation();

  const onSubmit = (values: UpdateUserProfileValues) => {
    const newAvatarUrl = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;
    mutation.mutate(
      { values, avatar: newAvatarUrl },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <AvatarInput
            onImageCropped={setCroppedAvatar}
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || avatarPlaceholder
            }
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself"
                        className="resize-none"
                        {...field}
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <LoadingButton variant="secondary" loading={mutation.isPending}>
                  Save
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageToCrop, setImageToCrop] = useState<File>();

  const onImageSelected = (imageFile: File | undefined) => {
    if (!imageFile) return;

    // If an image is selected we need to resize it set the imageToCrop and pass it to the CropImageDialog
    Resizer.imageFileResizer(
      imageFile,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  };

  return (
    <>
      <input
        type="file"
        // sr-only means screen reader only - hides an element to all devices except screen readers
        className="sr-only hidden"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => onImageSelected(e.target.files?.[0])}
      />
      <button
        type="button"
        className="group relative overflow-hidden rounded-full"
        // On clicking the button we trigger the file input click through the fileInputRef
        onClick={() => fileInputRef.current?.click()}
      >
        <Image
          src={src}
          alt="user profile avatar"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        {/* In Tailwind CSS, the inset-0 class is a shorthand for setting the top, right, bottom, and left properties of an element to 0 
        This is particularly useful for absolutely positioned elements because it ensures they span the full width and height of their containing block.
        */}
        <span className="absolute inset-0 m-auto flex items-center justify-center bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-20">
          <Camera size={24} />
        </span>
      </button>
      {/* If we have an image to crop set then we must open the CropImageDialog */}
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
