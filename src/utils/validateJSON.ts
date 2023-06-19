import { z } from 'zod';

export const validateJSON = <T>(json: string): T => {
  try {
    const parsed = JSON.parse(json);

    // validate the parsed JSON using zod
    const parsedSchema = z.object({
      fields: z.array(
        z.object({
          type: z.string(),
          role: z.string(),
          label: z.string(),
          data: z.any(),
          fieldName: z.string(),
          placeholder: z.string(),
          validation: z.string(),
          errorMessage: z.string().optional(),
        }),
      ),
    });

    parsedSchema.parse(parsed);

    return parsed;
  } catch (e) {
    throw new Error('Invalid JSON');
  }
};
