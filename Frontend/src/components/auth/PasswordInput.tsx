import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";

function PasswordInput({
  className,

  ...props
}: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        data-slot="input"
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-full px-3 py-1 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={props.value === "" || props.disabled}
      >
        {showPassword ? (
          <EyeNoneIcon className="h-4 w-4" />
        ) : (
          <EyeOpenIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export { PasswordInput };
