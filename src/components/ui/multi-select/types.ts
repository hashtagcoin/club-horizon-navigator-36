import { VariantProps } from "class-variance-authority";

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  maxCount?: number;
  className?: string;
  showSelectAll?: boolean;
  variant?: "default" | "secondary" | "destructive" | "outline";
  animation?: number;
  modalPopover?: boolean;
  asChild?: boolean;
}

export interface MultiSelectDisplayProps {
  selectedValues: string[];
  options: MultiSelectOption[];
  placeholder: string;
  maxCount?: number;
  variant?: "default" | "secondary" | "destructive" | "outline";
  animation?: number;
  onClear: () => void;
}