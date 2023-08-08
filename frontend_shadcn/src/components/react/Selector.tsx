import React from "react";
import styles from "./selector.module.css";

type SelectorOption = {
  label: string;
  value: string;
};

type SelectorProps = {
  options: SelectorOption[];
  value?: SelectorOption;
  onChange: (value: SelectorOption | undefined) => void;
  clearable?: boolean;
  placeholder?: SelectorOption;
};

function Select({
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
    onChange(placeholder || undefined);
    setIsCleanable(true);
  }

  function selectOption(option: SelectorOption) {
    if (option !== value) {
      onChange(option);
      setIsCleanable(false);
    }
  }

  function isOpenSelected(option: SelectorOption) {
    return option === value;
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
      <span className={styles.value}>{value?.label}</span>
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

export default function Selector(props: any) {
  const [value, setValue] = React.useState<(typeof options)[0] | undefined>({
    label: props.placeholder.label,
    value: props.placeholder.value,
  });
  return (
    <Select
      options={props.options}
      value={value}
      onChange={(o) => setValue(o)}
      placeholder={{
        label: props.placeholder.label,
        value: props.placeholder.value,
      }}
      clearable={props.clearable}
    />
  );
}
