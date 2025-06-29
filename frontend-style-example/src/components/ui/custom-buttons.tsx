import { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Primary Button - Moroccan gradient style
export const PrimaryButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { loading?: boolean }
>(({ className, loading, children, disabled, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "moroccan-gradient text-white border-0 hover:opacity-90 disabled:opacity-50",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
      )}
      {children}
    </Button>
  );
});
PrimaryButton.displayName = "PrimaryButton";

// Secondary Button - Outline style
export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "border-primary text-primary hover:bg-primary hover:text-white",
          className,
        )}
        {...props}
      />
    );
  },
);
SecondaryButton.displayName = "SecondaryButton";

// Success Button - Green theme
export const SuccessButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-green-600 hover:bg-green-700 text-white border-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SuccessButton.displayName = "SuccessButton";

// Danger Button - Red theme
export const DangerButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-red-600 hover:bg-red-700 text-white border-0",
          className,
        )}
        {...props}
      />
    );
  },
);
DangerButton.displayName = "DangerButton";

// Icon Button - Round button for icons
export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "sm", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size={size}
        className={cn("rounded-full p-2", className)}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";

// Floating Action Button
export const FloatingButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "fixed bottom-6 left-6 w-14 h-14 rounded-full moroccan-gradient text-white border-0 shadow-lg hover:shadow-xl z-50",
          className,
        )}
        {...props}
      />
    );
  },
);
FloatingButton.displayName = "FloatingButton";
