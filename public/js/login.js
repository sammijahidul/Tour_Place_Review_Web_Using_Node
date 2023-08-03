/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if(res.data.status === 'success') {
            showAlert('success', 'Looged in successfully!');
            window.setTimeout(()=> {
                location.assign('/');
            }, 1500);
        }
        console.log(res);  
    } catch (err) {
        showAlert('error', err.response.data.message);
    }    
};

