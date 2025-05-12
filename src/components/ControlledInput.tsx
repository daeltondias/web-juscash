/* eslint-disable @typescript-eslint/no-explicit-any */

import { Control, Controller, FieldErrors, FieldError } from "react-hook-form";
import { UnionToIntersection } from "@/types/utils";
import { Input, InputProps } from "./Input";
import { twMerge } from "tailwind-merge";
import _ from "lodash";

type ExtractFields<T> = T extends Control<infer U>
  ? keyof UnionToIntersection<U>
  : never;

type BaseProps = Omit<InputProps, "value" | "onChangeText">;

export type ControlledInputProps<TControl> = BaseProps & {
  name: ExtractFields<TControl>;
  control: TControl;
  errors?: FieldErrors;
};

export const ControlledInput = <TControl extends Control<any>>({
  name,
  control,
  errors,
  ...props
}: ControlledInputProps<TControl>) => {
  const error = _.get(errors, name) as FieldError;
  return (
    <div className="input-wrapper">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            classNames={{ content: twMerge(error && "!border-red-500") }}
            value={value as string}
            onChange={onChange}
            {...props}
          />
        )}
      />
      {error && (
        <div className="text-red-500 text-sm font-medium">{error.message}</div>
      )}
    </div>
  );
};
