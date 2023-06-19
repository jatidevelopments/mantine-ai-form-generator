import { Box, Button, Divider, Select, Textarea, Title } from '@mantine/core';
import { IconRobot, IconRocket, IconLanguage } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { FormJSON } from '../components/FormGenerator/types';
import { NextPageWithLayout } from './_app';

const FormGenerator = dynamic(
  () => import('../components/FormGenerator').then((mod) => mod.FormGenerator),
  { ssr: false },
);

export const getFormValuesId = (id: string) => `formValues-${id}`;

const Form = () => {
  const [error, setError] = useState<{
    message: string;
    field: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>('test');
  const [targetLanguage, setTargetLanguage] = useState<string>('english');
  const [prompt, setPrompt] = useState<string>('');
  const [formJson, setFormJson] = useState<FormJSON>({
    fields: [],
  });

  const getFormJsonFromGPT = trpc.gpt.generateJSONForm.useMutation();

  const handleGenerateForm = async () => {
    if (!prompt) {
      setError({ message: 'Please enter a prompt!', field: 'prompt' });
      return;
    } else if (!targetLanguage) {
      setError({
        message: 'Please select a target language!',
        field: 'targetLanguage',
      });
      return;
    } else setError(null);

    // Clear form
    setFormJson({ fields: [] });
    localStorage.removeItem(getFormValuesId(id));

    try {
      setIsLoading(true);
      const formJson = await getFormJsonFromGPT.mutateAsync({
        prompt,
        lang: targetLanguage,
      });
      setFormJson(formJson as never as FormJSON);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.info('formJson', formJson);
  }, [formJson]);

  return (
    <div>
      <Box pos="relative">
        <Title
          ta="center"
          my="md"
          variant="gradient"
          gradient={{ from: 'blue', to: 'red', deg: 120 + 180 }}
        >
          <Box>
            <IconRobot size={40} />
          </Box>
          <span>AI Form Generator</span>
        </Title>
        <Select
          icon={<IconLanguage size={20} />}
          disabled={isLoading}
          data={[
            { label: 'English', value: 'english' },
            { label: 'German', value: 'german' },
          ]}
          value={targetLanguage}
          onChange={(val) => val && setTargetLanguage(val)}
          placeholder="Please select a target language..."
          my="md"
          error={error?.field === 'targetLanguage' && error.message}
        />
        <Textarea
          disabled={isLoading}
          value={prompt}
          onChange={(event) => setPrompt(event.currentTarget.value)}
          placeholder="Please describe the form you want to generate..."
          my="md"
          error={error?.field === 'prompt' && error.message}
        />
        <Button
          leftIcon={<IconRocket size={20} />}
          my="md"
          fullWidth
          onClick={handleGenerateForm}
          loading={isLoading}
          variant="gradient"
          gradient={{ from: 'blue', to: 'red', deg: 120 + 180 }}
        >
          Generate Form
        </Button>
      </Box>
      {formJson?.fields?.length > 0 && (
        <Box my="md">
          <Divider my="lg" />
          <Title
            ta="center"
            my="md"
            variant="gradient"
            gradient={{ from: 'blue', to: 'red', deg: 120 + 180 }}
          >
            <span>Generated Form</span>
          </Title>
          <FormGenerator
            id={id}
            formJson={formJson}
            role={formJson.fields[0]!.role}
          />
        </Box>
      )}
    </div>
  );
};

const FormPage: NextPageWithLayout = dynamic(() => Promise.resolve(Form), {
  ssr: false,
});

export default FormPage;
