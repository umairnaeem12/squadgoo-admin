import { useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
  wrapperClassName?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  labelClassName,
  inputClassName,
  wrapperClassName,
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: false,
      appendTo: document.body,
      position: "auto",
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);


  return (
    <div className={wrapperClassName}>
      {label && (
        <Label htmlFor={id} className={labelClassName}>
          {label}
        </Label>
      )}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className={`h-8 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs 
  placeholder:text-gray-400 
  focus:outline-hidden focus:ring-3 
  dark:bg-gray-900 dark:placeholder:text-white/30 
  bg-transparent border-gray-300  focus:outline-none 
  dark:border-gray-700 dark:focus:border-brand-800 
  ${inputClassName ?? ""}`}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-2 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
