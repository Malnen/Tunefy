export interface Option {
  label: string;
  action?: () => void;
  expandable?: boolean;
  subOptions: Option[];
  showDivider?: boolean;
}
