import { MenuPlacement } from "react-select";
import { CardProps } from "reactstrap";
import { ButtonProps } from "reactstrap";
import { InputProps } from "reactstrap";
import { JSXElementConstructor, ReactElement } from "react";
import { Permissions } from "./AuthTypes";

export interface CustomButtonProps extends ButtonProps {
  style?: React.CSSProperties;
  className: string;
}

export interface CustomMainCard extends CardProps {
  style?: React.CSSProperties;
}

export interface CheckboxProps {
  label: string;
}

export interface CustomInputProps extends InputProps {
  styles?: React.CSSProperties;
  onClick?: () => void;
}

export interface CommonPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface RadioBtnProps {
  name: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  selected: string;
  disabled?: boolean;
  className?: string;
}
export interface RadioProps {
  name: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  value?: { label: string; value: string };
}
export interface LoaderProps {
  styles?: React.CSSProperties;
}

export interface CustomTextAreaProps extends InputProps {
  styles?: React.CSSProperties;
}

export interface ToggleSwitchProps {
  onToggle?: (value: boolean) => void;
  onStateChange: (value: boolean) => void;
  checked?: boolean;
  allow?: boolean;
}

export interface CustomSelectProps {
  id: string;
  name: string;
  options: { value: number; label: string }[];
  noOptionsMessage: () => string;
  placeholder: string;
  className?: string;
  value?: { value: number; label: string } | null;
  onChange: (selectedOption: { value: number; label: string } | null) => void;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  menuPlacement?: MenuPlacement;
  styles?: {};
}
export interface CustomBooleanSelectProps {
  id: string;
  name: string;
  options: { value: boolean; label: string }[];
  noOptionsMessage: () => string;
  placeholder: string;
  className?: string;
  value?: { value: boolean; label: string } | null;
  onChange: (selectedOption: { value: boolean; label: string } | null) => void;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  menuPlacement?: MenuPlacement;
  styles?: {};
}

export interface CustomDeleteBtnProps {
  onDelete: () => void;
  allow?: boolean;
}

export interface CustomEditBtnProps {
  onEdit: () => void;
  onClick?: () => void;
  allow?: boolean;
  disabled?: boolean;
  id?: string;
  style?: any;
}
export interface CustomArticleBtnProps {
  id?: string;
  title?: string;
  onView: () => void;
  onClick?: () => void;
  allow?: boolean;
  disabled?: boolean;
}
export interface CustomHistoryBtnProps {
  onView: () => void;
  onClick?: () => void;
  allow?: boolean;
  id?: string;
  disabled?: boolean;
}

export interface CustomEyeBtnProps {
  onEye: (data?: any) => void;
}

export interface ACLProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  submodule: string;
  module: string;
  action: Permissions[];
}
export interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => Promise<void>;
  onPageSizeChange: (newSize: number) => void;
  entriesPerPage: number;
}
