import { useField } from 'formik';
import React from 'react';
import { TextFieldProps } from '@material-ui/core/TextField';
import PasswordField from './PasswordField';

const FormPasswordField = (props: TextFieldProps) => {
  if (!props.name) {
    throw new Error(
      'FormPasswordField needs name defined - should be the same as value on validationSchema'
    );
  }
  const [field, meta] = useField(props.name as string);
  return (
    <PasswordField
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      {...field}
      {...props}
    />
  );
};

export default FormPasswordField;
