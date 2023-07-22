import { Button, ButtonProps } from "@/app/client-components/Button";
import { Icon } from "@/app/client-components/Icon";
import { ReactNode, forwardRef } from "react";

interface SaveButtonProps extends Omit<ButtonProps, "children" | "icon"> {
  isLoading?: boolean;
  label?: ReactNode;
}

const SaveButton = forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ isLoading, label = "Save", ...otherProps }, ref) => {
    return (
      <Button ref={ref} variant="primary" {...otherProps}>
        <Icon name={isLoading ? "loader" : "floppy-disk"} spin={isLoading} />
        {isLoading ? "Saving..." : label}
      </Button>
    );
  }
);

SaveButton.displayName = "SaveButton";

export { SaveButton };
