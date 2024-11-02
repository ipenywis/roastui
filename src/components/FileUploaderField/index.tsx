'use client';

import * as React from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
// import { toast } from 'sonner';

// import { getErrorMessage } from '@/lib/handle-error';
// import { useUploadFile } from '@/hooks/use-upload-file';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FileUploader } from '../FileUploader';

// import { UploadedFilesCard } from './uploaded-files-card';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FileUploaderFieldProps {
  form: UseFormReturn<
    {
      name: string;
      images: File[];
    },
    any,
    undefined
  >;
}

export function FileUploaderField(props: FileUploaderFieldProps) {
  const { form } = props;

  const [loading, setLoading] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <div className="space-y-6 w-full">
          <FormItem className="w-full">
            <FormLabel>Design Image</FormLabel>
            <FormControl>
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                maxFileCount={1}
                maxSize={MAX_FILE_SIZE}
                // progresses={progresses}
                // pass the onUpload function here for direct upload
                // onUpload={uploadFiles}
                // disabled={isUploading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  );
}
