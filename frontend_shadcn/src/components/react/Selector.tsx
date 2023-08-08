import React, { ReactElement } from "react";
import styles from "./selector.module.css";
import { ChevronDown } from "lucide-react";

import { useStore } from "@nanostores/react";
import {
  SelectorStates,
  selectorStates,
  setSelectorStates,
} from "@/utils/dataStore";

export type SelectorOption = {
  label?: string;
  value?: string;
};

type MultipleSelectorProps = {
  multiple: true;
  value: SelectorOption[];
  onChange: (value?: SelectorOption[]) => void;
};

type SingleSelectorProps = {
  multiple?: false;
  value: SelectorOption;
  onChange: (value?: SelectorOption) => void;
};

type SelectorProps = {
  keyForState?: string;
  options: SelectorOption[];
  clearable?: boolean;
  placeholder?: SelectorOption | any;
} & (SingleSelectorProps | MultipleSelectorProps);

function Select({
  multiple,
  value,
  onChange,
  options,
  clearable,
  placeholder,
}: SelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCleanable, setIsCleanable] = React.useState(true);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  function clearOptions() {
    const placeholderArr: SelectorOption[] = [placeholder];
    multiple ? onChange(placeholderArr) : onChange(placeholder);
    setIsCleanable(true);
  }

  function selectOption(option: SelectorOption) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
        if (value.length === 1) {
          onChange();
        }
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) {
        onChange(option);
        setIsCleanable(false);
      }
    }
  }

  function isOpenSelected(option: SelectorOption) {
    return multiple ? value.includes(option) : option === value;
  }

  React.useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  return (
    <div
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>
        {multiple && value.length > 1
          ? value.map((v) => {
              if (v.value)
                return (
                  <button
                    key={v.label}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectOption(v);
                    }}
                    className={styles["option-badge"]}
                  >
                    {v.label}{" "}
                    <span className={styles["remove-btn"]}>&times;</span>
                  </button>
                );
            })
          : value.label || value[0].label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className={`${styles["clear-btn"]} ${
          !clearable || isCleanable ? styles.hide : ""
        }`}
      >
        &times;
      </button>
      <ChevronDown className="h-4 w-4 opacity-50" />
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            key={option.label}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={`${styles.option} ${
              isOpenSelected(option) ? styles.selected : ""
            } ${index === highlightedIndex ? styles.highlighted : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Selector({
  options,
  placeholder,
  clearable,
  keyForState,
}: SelectorProps | any): ReactElement {
  const [value, setValue] = React.useState<SelectorOption>({
    label: placeholder?.label,
    value: placeholder?.value,
  });

  const $selectorStates: SelectorStates = useStore(selectorStates);

  return (
    <Select
      options={options}
      value={value}
      onChange={(o) => {
        console.log(o);
        setValue(o);
        setSelectorStates($selectorStates, keyForState, o.value || null);
      }}
      placeholder={{
        label: placeholder?.label,
        value: placeholder?.value,
      }}
      clearable={clearable}
    />
  );
}

export function MultiSelector({
  placeholder,
  clearable,
  options,
  keyForState,
}: SelectorProps | any): ReactElement {
  const [value, setValue] = React.useState<SelectorOption[]>([
    {
      label: placeholder?.label,
      value: placeholder?.value,
    },
  ]);

  const $selectorStates: SelectorStates = useStore(selectorStates);

  React.useEffect(() => {
    if (keyForState === "productOwnerSelection") {
      console.log(
        "value:",
        value.map((v) => v.value)
      );
      console.log(`${keyForState}:`, $selectorStates[keyForState]);
    }
  }, [$selectorStates, value]);

  return (
    <Select
      multiple
      options={options}
      value={value}
      onChange={(o: any) => {
        setValue(o);
        setSelectorStates(
          $selectorStates,
          keyForState,
          o.map((v) => v.value)
        );
        // setSelectorStates(selectorStates.)
      }}
      placeholder={{
        label: placeholder?.label,
        value: placeholder?.value,
      }}
      clearable={clearable}
    />
  );
}
