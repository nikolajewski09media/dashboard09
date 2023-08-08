import React from "react";
import styles from "./selector.module.css";

type SelectorOption = {
  label: string | undefined;
  value: string | undefined;
};

type MultipleSelectorProps = {
  multiple: true;
  value: SelectorOption[];
  onChange: (value: SelectorOption[]) => void;
};

type SingleSelectorProps = {
  multiple?: false;
  value?: SelectorOption;
  onChange: (value: SelectorOption | undefined) => void;
};

type SelectorProps = {
  options: SelectorOption[];
  clearable?: boolean | boolean;
  placeholder?: SelectorOption;
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
    multiple ? onChange([placeholder]) : onChange(placeholder);
    setIsCleanable(true);
  }

  function selectOption(option: SelectorOption) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
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
          : value?.label || value[0].label}
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
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
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

export function Selector({ placeholder, clearable, options }: SelectorProps) {
  const [value, setValue] = React.useState<SelectorOption | undefined>({
    label: placeholder?.label,
    value: placeholder?.value,
  });
  return (
    <Select
      options={options}
      value={value}
      onChange={(o) => setValue(o)}
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
}: SelectorProps) {
  const [value, setValue] = React.useState<SelectorOption[]>([
    {
      label: placeholder?.label,
      value: placeholder?.value,
    },
  ]);
  return (
    <Select
      multiple
      options={options}
      value={value}
      onChange={(o) => setValue(o)}
      placeholder={{
        label: placeholder?.label,
        value: placeholder?.value,
      }}
      clearable={clearable}
    />
  );
}
