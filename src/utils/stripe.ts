
import { loadStripe } from '@stripe/stripe-js';

// Use the key from env or fallback (though it should be in env)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51QFKFaGkWmRbs4DUhPPKsyXrrXHbeLgL4pV26LArKGkJQ7GYLlP29GwuWUI6R4MpR1wHfY5PNIFcxcCX44rHJkID00oJTMJ3PL";

export const stripePromise = loadStripe(stripeKey);
