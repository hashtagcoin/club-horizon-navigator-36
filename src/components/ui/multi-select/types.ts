import { VariantProps } from "class-variance-authority";

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  modalPopover?: boolean;
  className?: string;
  showSelectAll?: boolean;
  maxCount?: number;
  variant?: "default" | "secondary" | "destructive" | "inverted";
}

export interface MultiSelectDisplayProps {
  selectedValues: string[];
  options: MultiSelectOption[];
  placeholder: string;
  maxCount?: number;
  variant?: "default" | "secondary" | "destructive" | "inverted";
  animation?: number;
  onClear: () => void;
}