import { useField } from 'formik';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import React from 'react';

const FormTextField = (props: TextFieldProps) => {
  if (!props.name) {
    throw new Error(
      'FormTextField needs name defined - should be the same as value on validationSchema'
    );
  }
  const [field, meta] = useField(props.name as string);
  return (
    <TextField
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      {...field}
      {...props}
    />
  );
};

export default FormTextField;
