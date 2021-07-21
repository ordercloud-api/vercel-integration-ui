import { useFormikContext } from 'formik';
import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import ProgressLoader from './ProgressLoader';

const FormSubmitButton = (props: ButtonProps) => {
  const { isSubmitting, isValid } = useFormikContext();
  return (
    <ProgressLoader loading={isSubmitting}>
      <Button {...props} disabled={isSubmitting || !isValid} type="submit">
        {props.children}
      </Button>
    </ProgressLoader>
  );
};
export default FormSubmitButton;
