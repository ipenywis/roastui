'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { FileUploaderField } from '../FileUploaderField';

const container = cva('flex flex-col w-full max-w-screen-sm');

const formContainer = cva('flex flex-col w-full items-center space-y-8');

const createFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  images: z.array(z.instanceof(File)),
});

export const updateFormSchema = z.object({
  name: z.string().optional(),
  images: z.array(z.instanceof(File)),
});

export type FormValues = z.infer<typeof createFormSchema>;
export type CreateFormValues = z.infer<typeof createFormSchema>;
export type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface NewDesignFormProps {
  onSubmit: (values: FormValues) => void;
  mode?: 'create' | 'update';
}

export function NewDesignForm(props: NewDesignFormProps) {
  const { onSubmit, mode = 'create' } = props;

  const form = useForm<FormValues>({
    resolver: zodResolver(
      mode === 'create' ? createFormSchema : updateFormSchema,
    ),
    defaultValues: {
      name: '',
      images: [],
    },
  });

  return (
    <div className={container()}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={formContainer()}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Design Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter design name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a name for your new design to roast.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FileUploaderField form={form} />
          <Button type="submit">
            {form.formState.isSubmitting ? 'Roasting 🔥🔥🔥' : 'Roast 🔥'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
