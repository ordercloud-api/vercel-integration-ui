import { createStyles, Link, makeStyles, Theme } from '@material-ui/core';
import { Accounts } from '@ordercloud/portal-javascript-sdk';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';
import AuthContainer from '../ordercloud-ui/AuthContainer';
import FormSubmitButton from '../ordercloud-ui/FormSubmitButton';
import FormTextField from '../ordercloud-ui/FormTextField';
import sharedStyles from '../ordercloud-ui/SharedStyles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...sharedStyles(theme),
    backToLogin: {
      display: 'block',
      margin: 10,
    },
  })
);

const ForgotPasswordView = props => {
  const classes = useStyles(props);
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <AuthContainer>
        <h2>Forgot password email sent</h2>
        <p>
          Please check your email for further instructions to reset your
          password
        </p>
        <span className={classes.backToLogin}>
            <Link style={{cursor: "pointer"}} onClick={() => props.setView('LOGIN')}>
              Back to Login
            </Link>
        </span>
      </AuthContainer>
    );
  }
  return (
    <AuthContainer>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={yup.object({
          email: yup
            .string()
            .email('Invalid email address')
            .required('Email is required'),
        })}
        onSubmit={async ({ email }, { setSubmitting }) => {
          try {
            await Accounts.ForgotPassword(
              { Email: email },
              { requestType: 'quiet' }
            );
            setSuccess(true);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <Form>
          <p>Please provide the email associated with your account</p>
          <FormTextField
            name="email"
            label="Email"
            className={classes.textFields}
            autoFocus={true}
          />
          <FormSubmitButton
            className={classes.formButtons}
            variant="contained"
            color="secondary"
            size="large"
          >
            Submit
          </FormSubmitButton>
          <span className={classes.backToLogin}>
            <Link style={{cursor: "pointer"}} onClick={() => props.setView('LOGIN')}>
              Back to Login
            </Link>
          </span>
        </Form>
      </Formik>
    </AuthContainer>
  );
};

export default ForgotPasswordView;
