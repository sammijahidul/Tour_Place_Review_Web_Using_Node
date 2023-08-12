/* eslint-disable */
import axios from "axios";
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51NdBGJCpIynwOtyqBxSX55uW8j7B4auBfplQqPw9l72o1GD7KfYSJm0b5Nmbmyhykl4CQXlBeTBJPN3RJX9UKKBr00m1NHXcCs')

export const bookTour = async tourId => {
    try {
        // Get checkout session from api
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // console.log(session);

        // create checkout form + chnre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
        
    } catch (err) {
        // console.log(err);
        showAlert('error', err)

    }
    
}