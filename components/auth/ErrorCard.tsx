import React from 'react'
import { Card, CardFooter, CardHeader } from '../ui/card'
import Header from './header'
import BackButton from './BackButton'
import { CardWrapper } from './Card-wrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const ErrorCard = () => {
  return (
    <CardWrapper headerLabel='Something went wrong'
    backButtonHref='/auth/login'
    backButtonLabel='Back to login'>
        <div className='w-full items-center flex justify-center'>
         <ExclamationTriangleIcon className='text-destructive' />
        </div>
    </CardWrapper>
  );
};

export default ErrorCard