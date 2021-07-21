import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@material-ui/core';

import React, { useState } from 'react';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Visibility, VisibilityOff } from '@material-ui/icons';

/**
 * Use this component when you want a password field
 * with hide/show password functionality
 */

const PasswordField = (props: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment variant="filled" position="end">
            <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
              <IconButton
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(prevShow => !prevShow)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
};
export default PasswordField;
