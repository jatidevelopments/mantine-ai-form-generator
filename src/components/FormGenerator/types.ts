export interface FormField {
  type: FieldType;
  role: string;
  label: string;
  data: any;
  fieldName: string;
  placeholder: string;
  validation: string;
  errorMessage?: string;
}

export interface FormJSON {
  fields: FormField[];
}

export interface FormGeneratorProps {
  formJson: FormJSON;
  role: string;
  id: string;
}

export enum FieldType {
  AutoComplete = 'AutoComplete',
  Checkbox = 'Checkbox',
  Chip = 'Chip',
  ColorInput = 'ColorInput',
  ColorPicker = 'ColorPicker',
  FileInput = 'FileInput',
  MultiSelect = 'MultiSelect',
  NativeSelect = 'NativeSelect',
  NumberInput = 'NumberInput',
  PasswordInput = 'PasswordInput',
  PinInput = 'PinInput',
  Radio = 'Radio',
  Rating = 'Rating',
  SegmentedControl = 'SegmentedControl',
  Select = 'Select',
  Slider = 'Slider',
  Switch = 'Switch',
  Textarea = 'Textarea',
  TextInput = 'TextInput',
}

export type FieldValue =
  | string
  | number
  | boolean
  | string[]
  | null
  | undefined;

export type HandleInputChange = (
  fieldName: string,
  value: FieldValue | any,
) => void;

export type FormState = Record<string, string | boolean>;

export type ValidationError = string | undefined;

export type ValidationErrors = Record<string, ValidationError>;
