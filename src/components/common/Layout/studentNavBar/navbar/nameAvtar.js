import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../../../redux/slicers/authSlice';

export default function StudentName() {
    const { userInfo = {} } = useSelector(authSelector);
  return (
    <Stack direction="row" spacing={2}>
      <Avatar sx={{ width: 30, height: 30,fontSize:"15px" }} >{userInfo?.name['0']?.toUpperCase()}</Avatar>
    </Stack>
  );
}