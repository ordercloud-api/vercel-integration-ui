import {
    createStyles,
    Theme,
    makeStyles,
    Link,
  } from '@material-ui/core';
import AuthContainer from "../ordercloud-ui/AuthContainer";
import React, { useState } from 'react';
import sharedStyles from '../ordercloud-ui/SharedStyles';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import FormTextField from '../ordercloud-ui/FormTextField';
import FormSubmitButton from '../ordercloud-ui/FormSubmitButton';
import { Alert } from '../ordercloud-ui/AlertContainer';
import { Accounts, Auth } from '@ordercloud/portal-javascript-sdk';
import FormPasswordField from '../ordercloud-ui/FormPasswordField';
import { View } from '../../pages/callback';
import { PortalAuthentication } from '@ordercloud/portal-javascript-sdk/dist/models/PortalAuthentication';


const useVerificationCodeStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...sharedStyles(theme),
    accountButtons: {
      marginTop: theme.spacing(2),
      '& > .MuiButton-root': {
        margin: `0px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
      },
    },
  })
);

// https://github.com/jquense/yup/issues/97#issuecomment-306547261
// make sure to add type annotations to ./types/yup/index.d.ts so that it works with typescript
function equalTo(this: any, ref: any, msg?: string) {
    return this.test({
      name: 'equalTo',
      exclusive: false,
      // eslint-disable-next-line no-template-curly-in-string
      message: msg || '${path} must be the same as ${reference}',
      params: {
        reference: ref.path,
      },
      test: function(value) {
        return value === this.resolve(ref);
      },
    });
  }
  
yup.addMethod(yup.string, 'equalTo', equalTo);

interface GetVerificationCodeProps {
  setEmail: (email: string) => void;
  setView: (view: View) => void;
}
const GetVerificationCode = (props: GetVerificationCodeProps) => {
  const { setView, setEmail } = props;
  const classes = useVerificationCodeStyles(props);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  return (
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
          await Accounts.Register({ Email: email });
          Alert.success('A verification code has been sent to your email. Please check your inbox and enter code below.');
          setEmail(email);
        } catch (e) {
          if (
            e &&
            e.response &&
            e.response.status &&
            e.response.status === 409
          ) {
            Alert.error(
              'A user with that email already exists. If you can\'t remember your password try using the "Forgot Password" feature to reset it'
            );
          } else {
            throw e;
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form>
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
          Register
        </FormSubmitButton>
        <Link color="secondary" style={{cursor: "pointer"}} onClick={() => setView("LOGIN")}>
          Return to Login
        </Link>
      </Form>
    </Formik>
  );
};

const useSignupStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...sharedStyles(theme),
  })
);
interface SignupProps {
  onAuthenticate: (auth: PortalAuthentication) => void;
  email: string;
}
const Signup = (props: SignupProps) => {
  const classes = useSignupStyles(props);
  return (
    <Formik
      initialValues={{
        Code: '',
        Name: '',
        Username: '',
        Password: '',
        ConfirmPassword: '',
      }}
      validationSchema={yup.object({
        Code: yup.string().required('Verification Code is Required'),
        Name: yup.string().required('Please enter your full name'),
        Username: yup.string().required('Please choose a Username'),
        Password: yup
          .string()
          .required(
            'Password must be at least eight characters long and include at least one letter and one number.'
          )
          .matches(
            /(?=.*?[a-zA-z])(?=.*?[0-9]).{8,}$/,
            'Password must be at least eight characters long and include at least one letter and one number.'
          ),
        ConfirmPassword: (yup
          .string()
          .required('Confirm Password must match Password') as any)
          .equalTo(yup.ref('Password'), 'Confirm Password must match Password'),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const verifyRequest = {
            Code: values.Code,
            Email: props.email,
            Name: values.Name,
            Username: values.Username,
            Password: values.Password,
          };
          await Accounts.Verify(verifyRequest);
        } catch (e) {
          Alert.error(e?.response?.data?.Errors[0]?.Message || "Verification Code Incorrect");  
        } finally {
          setSubmitting(false);
        }
        var resp = await Auth.login(values.Username, values.Password);
        props.onAuthenticate(resp);
      }}
    >
      <Form>
        <FormTextField
          name="Code"
          label="Verification Code"
          className={classes.textFields}
          autoFocus={true}
        />
        <FormTextField
          name="Name"
          label="Full Name"
          className={classes.textFields}
        />
        <FormTextField
          name="Username"
          label="Username"
          className={classes.textFields}
        />
        <FormPasswordField
          name="Password"
          label="Password"
          className={classes.textFields}
        />
        <FormPasswordField
          name="ConfirmPassword"
          label="Confirm Password"
          className={classes.textFields}
        />
        <FormSubmitButton
          className={classes.formButtons}
          variant="contained"
          color="secondary"
          size="large"
        >
          Register
        </FormSubmitButton>
      </Form>
    </Formik>
  );
};



const RegisterView = (props) => {
    const { setView, onAuthenticate } = props;
    const [email, setEmail] = useState('');

    return (
      <AuthContainer>
        {email === '' && (
          <GetVerificationCode setView={setView} setEmail={setEmail} />
        )}
        {email !== '' && <Signup email={email} onAuthenticate={onAuthenticate} />}
      </AuthContainer>
    );
  };
  
  export default RegisterView;