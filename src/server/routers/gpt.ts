import { z } from 'zod';
import { requestPromptUntilValidWithRetry } from '~/utils/gpt';
import { publicProcedure, router } from '../trpc';

const PROMPT = `Welcome to our advanced Form Creator Wizard. This tool translates your requirements into a tailored, role-based form represented in a flexible JSON format. The output form will be compatible with the React Mantine library and validations provided using Joi JS.

Here are the steps we'll take:

Role Definition: We initiate the process by defining the roles you want to set up. Each input field will be associated with a specific role, ensuring that it's visible only when that role is selected on the form.

Input Field Creation: Next, we'll create the JSON representation for each input field and it corresponding data. You have an array of input types to choose from:

Autocomplete
Checkbox
Chip
ColorInput
ColorPicker
FileInput
JsonInput
MultiSelect
NativeSelect
NumberInput
PasswordInput
PinInput
Radio
Rating
SegmentedControl
Select
Slider
Switch
Textarea
Textinput
TransferList
For each input field, you'll specify its type, role, label, fieldName, placeholder, associated data, and Joi JS validation requirements. If you'd like, you can also provide a custom error message.

The Joi validation rules include features like alphanum, min, max, required, pattern, ref, number, integer, email, string, date, boolean, with, xor, or, and, nand, oxor, items, ordered, length, single, valid, invalid, allow, disallow, empty, default, label, ...

Here's an illustrative example of how you can structure your form fields:

json example:
{
  "fields": [
    {
      "type": "Input",
      "role": "admin",
      "label": "Username",
      "data": null,
      "fieldName": "username",
      "placeholder": "Enter your username",
      "validation": "string|alphanum|min:3|max:30|required",
      "errorMessage": "Username is required"
    },
    ...
  ]
}

typescript example:
interface FormField {
  type: FieldType;
  role: string;
  label: string;
  data: any;
  fieldName: string;
  placeholder: string;
  validation: string;
  errorMessage?: string;
}

Generate the Form JSON and only always return the valid JSON (if you dont have enough data from the input still generate the JSON) from the following input: `;

export const gptRouter = router({
  generateJSONForm: publicProcedure
    .input(z.object({ prompt: z.string(), lang: z.string() }))
    .mutation(async ({ input }) => {
      const data = PROMPT + input.prompt;

      const formJson = await requestPromptUntilValidWithRetry(
        // Trim to stop GPT to hallucinate
        data.trim(),
        3,
        `Translate the form fields, values and everything else in: ${input.lang}`,
      );

      return formJson;
    }),
});
