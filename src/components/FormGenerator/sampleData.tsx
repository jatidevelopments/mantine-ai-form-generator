import { FormJSON, FieldType } from './types';

export const formJson: FormJSON = {
  fields: [
    {
      type: FieldType.TextInput,
      role: 'admin',
      label: 'Username',
      data: null,
      fieldName: 'username',
      placeholder: 'Enter your username',
      validation: 'required|string|min:3|max:20',
      errorMessage: 'Username is required',
    },
    {
      type: FieldType.Select,
      role: 'admin',
      label: 'Role',
      data: ['admin', 'user'],
      fieldName: 'role',
      placeholder: 'Select your role',
      validation: 'required|string',
    },
    {
      type: FieldType.FileInput,
      role: 'admin',
      label: 'Avatar',
      data: null,
      fieldName: 'avatar',
      placeholder: 'Select your avatar',
      validation: 'required',
    },
    // ...add other field configurations here
  ],
};
