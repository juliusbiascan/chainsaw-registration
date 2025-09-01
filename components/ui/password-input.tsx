import * as React from "react"

import { Input } from "./input";
import { EyeIcon, EyeOff } from "lucide-react";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: React.ReactNode;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ suffix, className, ...props }, ref) => {

    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative w-full flex items-center">
        <Input
          type={showPassword ? "text" : "password"}
          className={className}
          {...props}
          ref={ref}
        />
        <div className="absolute right-2 flex items-center gap-1">
          {suffix}
          <div className="cursor-pointer">
            {showPassword ? (
              <EyeIcon className="h-4 w-4" onClick={() => setShowPassword(false)} />
            ) : (
              <EyeOff className="h-4 w-4" onClick={() => setShowPassword(true)} />
            )}
          </div>
        </div>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
