const axios = require('axios');
require('dotenv').config();

const PAYHERO_API_KEY = process.env.PAYHERO_API_KEY;
const PAYHERO_CHANNEL_ID = process.env.PAYHERO_CHANNEL_ID;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

const initiatePayment = async ({ phone, amount, reference, description }) => {
  // Guard: stop immediately if credentials missing
  if (!PAYHERO_API_KEY || !PAYHERO_CHANNEL_ID) {
    console.error('❌ PayHero credentials missing in .env file');
    return { 
      success: false, 
      error: 'Payment not configured. Please add PAYHERO_API_KEY and PAYHERO_CHANNEL_ID to your .env file.' 
    };
  }

  try {
    let formattedPhone = phone.replace(/\s/g, '').replace(/^0/, '254').replace(/^\+/, '');
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const payload = {
      amount: amount,
      phone_number: formattedPhone,
      channel_id: parseInt(PAYHERO_CHANNEL_ID),
      provider: 'm-pesa',
      external_reference: reference,
      description: description || 'Nexus Academy Course Enrollment',
      callback_url: `${APP_URL}/payment/callback`
    };

    const authString = Buffer.from(PAYHERO_API_KEY).toString('base64');

    const response = await axios.post(
      'https://backend.payhero.co.ke/api/v2/payments',
      payload,
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error('PayHero error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Payment initiation failed. Try again.'
    };
  }
};

const checkPaymentStatus = async (checkoutRequestId) => {
  if (!PAYHERO_API_KEY) {
    return { success: false, error: 'PayHero not configured' };
  }
  try {
    const response = await axios.get(
      `https://backend.payhero.co.ke/api/v2/transaction-status?reference=${checkoutRequestId}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYHERO_API_KEY).toString('base64')}`
        }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

module.exports = { initiatePayment, checkPaymentStatus };