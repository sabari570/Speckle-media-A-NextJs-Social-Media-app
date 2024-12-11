import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  classname: string;
}

export default function LoadingButton({
  loading,
  disabled,
  classname,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", classname)}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin text-blue-700" />}
      {props.children}
    </Button>
  );
}
