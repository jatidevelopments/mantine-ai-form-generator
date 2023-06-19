'use client';
import Joi from '@hapi/joi';
import { Box, Button, Col, Grid, Transition } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { COMPONENTS_MAP, DEFAULT_ERROR_MESSAGE } from './constants';
import { useLocalStorage } from './hooks';
import {
  FieldValue,
  FormField,
  FormGeneratorProps,
  HandleInputChange,
  ValidationErrors,
} from './types';
import { getFormValuesId } from '~/pages';

export const FormGenerator: React.FC<FormGeneratorProps> = ({
  id,
  formJson,
  role,
}) => {
  const formValuesId = getFormValuesId(id);
  const [formValues, setFormValues] = useLocalStorage(formValuesId, {});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const handleInputChange: HandleInputChange = (fieldName, event) => {
    console.info(
      'handleInputChange on fieldName ' +
        fieldName +
        ' with event ' +
        event?.target?.value,
      event,
    );

    const value = (event?.target as HTMLInputElement)?.value ?? event;

    setFormValues((prevState: any) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const validateField = (field: FormField): Joi.ValidationError | undefined => {
    if (!field.validation) return undefined;

    const validations = field.validation.split('|');

    const schema = Joi.object({
      [field.fieldName]: validations.map((validation) => {
        const [rule, ...args] = validation.split(':');
        // Convert args to number if it's a number
        const numArgs = args.map((arg) =>
          isNaN(Number(arg)) ? arg : Number(arg),
        );

        // Check if Joi has such a rule
        // @ts-ignore
        if (typeof Joi.string()[rule] !== 'function') {
          console.warn(`Invalid Joi validation rule: ${rule}`);
          return null;
        }

        // @ts-ignore
        return Joi.string()[rule](...numArgs);
      }),
    });

    const { error } = schema.validate({
      [field.fieldName]: (formValues as any)[field.fieldName],
    });

    return error;
  };

  const validateForm = (): boolean => {
    let isFormValid = true;

    formJson.fields.forEach((field) => {
      const error = validateField(field);
      if (error) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field.fieldName]: field.errorMessage || DEFAULT_ERROR_MESSAGE,
        }));
        isFormValid = false;
      }
    });

    return isFormValid;
  };

  const handleBlur = (field: FormField) => {
    const error = validateField(field);
    if (error) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [field.fieldName]: error.details[0]!.message,
      }));
    }
  };

  const renderField = (field: FormField) => {
    const { type, fieldName, placeholder, label, data, errorMessage, ...rest } =
      field;
    const Component: React.FC<any> = COMPONENTS_MAP[type];

    const formattedData =
      data && Array.isArray(data)
        ? data.map((datum) =>
            typeof datum === 'string' ? { value: datum } : datum,
          )
        : [];

    if (Component) {
      return (
        <Grid.Col span={12}>
          <Transition
            transition="fade"
            duration={500}
            timingFunction="ease"
            mounted={true}
          >
            {(styles) => (
              <div style={styles}>
                <Component
                  sx={{
                    margin: '0 !important',
                    padding: '0 !important',
                  }}
                  my="sm"
                  key={fieldName}
                  label={label}
                  placeholder={placeholder}
                  onChange={(value: FieldValue) =>
                    handleInputChange(fieldName, value)
                  }
                  value={(formValues as any)[fieldName] || ''}
                  required={field.validation?.includes('required')}
                  data={formattedData}
                  searchValue={(formValues as any)[fieldName] || ''}
                  error={
                    validationErrors[fieldName]
                      ? errorMessage || DEFAULT_ERROR_MESSAGE
                      : undefined
                  }
                  onBlur={() => handleBlur(field)}
                  {...rest}
                />
              </div>
            )}
          </Transition>
        </Grid.Col>
      );
    }

    return null;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      console.info('Form is valid', formValues);
    } else {
      console.info('Form is invalid', formValues);
    }
  };

  useEffect(() => {
    console.info(
      'formValues changed with id ' + id + ' and role ' + role,
      formValues,
    );
  }, [formValues]);

  return (
    <Box pos="relative" mb="lg">
      <form>
        <Grid>
          {formJson.fields
            // .filter((field) => field.role === role)
            .map((field) => renderField(field))}
        </Grid>
        <Button
          type="submit"
          my="md"
          onClick={handleSubmit}
          fullWidth
          variant="gradient"
          gradient={{ from: 'blue', to: 'red', deg: 120 + 180 }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};
