
import { type FC, type ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../utils/stripe';

interface StripeWrapperProps {
  children: ReactNode;
}

export const StripeWrapper: FC<StripeWrapperProps> = ({ children }) => {
  return (
    <Elements stripe={stripePromise} options={{
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#ef4444',
                colorBackground: '#1a1a1a',
                colorText: '#ffffff',
                colorDanger: '#ef4444',
                fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
        }
    }}>
      {children}
    </Elements>
  );
};
