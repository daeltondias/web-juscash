"use client";

import { useEffectWithoutInitial } from "@/hooks/useEffectWithoutInitial";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@iconify/react";

export type InputProps = React.JSX.IntrinsicElements["input"] & {
  isRequired?: boolean;
  label?: string;
  classNames?: {
    container?: string;
    content?: string;
    label?: string;
    input?: string;
  };
};

export const Input = ({
  label,
  isRequired,
  classNames,
  className,
  ...props
}: InputProps) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isPasswordType] = useState(props.type === "password");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffectWithoutInitial(() => {
    if (isPasswordType && inputRef.current) {
      const input = inputRef.current;
      const { length } = input.value;
      input.focus();
      input.setSelectionRange(length, length);
    }
  }, [secureTextEntry]);

  if (isPasswordType) {
    props.type = secureTextEntry ? "password" : "text";
  }

  return (
    <div className={classNames?.container}>
      {label && (
        <div className={twMerge("label", classNames?.label)}>
          {label} {isRequired && <span className="text-red-500">*</span>}
        </div>
      )}
      <div
        className={twMerge(
          "input flex items-center gap-x-4",
          classNames?.content
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          className={twMerge(
            "outline-none flex-1",
            classNames?.input,
            className
          )}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            className="pressable-opacity"
            onClick={(event) => {
              event.stopPropagation();
              setSecureTextEntry(!secureTextEntry);
            }}
          >
            <Icon
              icon={secureTextEntry ? "mdi:eye-off" : "mdi:eye"}
              className="text-gray-400"
              fontSize={28}
            />
          </button>
        )}
      </div>
    </div>
  );
};
