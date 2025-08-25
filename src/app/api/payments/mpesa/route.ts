import { NextRequest, NextResponse } from 'next/server';

// M-Pesa API configuration
const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE!,
  passkey: process.env.MPESA_PASSKEY!,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
};

// Get M-Pesa access token
async function getMpesaAccessToken(): Promise<string> {
  const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');
  
  const url = MPESA_CONFIG.environment === 'live' 
    ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  console.log('🔑 Getting M-Pesa access token from:', url);
  console.log('🔑 Consumer Key:', MPESA_CONFIG.consumerKey);
  console.log('🔑 Environment:', MPESA_CONFIG.environment);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
    },
  });

  console.log('🔑 M-Pesa auth response status:', response.status);
  console.log('🔑 M-Pesa auth response ok:', response.ok);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('🔑 M-Pesa auth error response:', errorText);
    throw new Error(`Failed to get M-Pesa access token: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log('🔑 M-Pesa auth success, access token received');
  return data.access_token;
}

// Initiate STK Push
async function initiateSTKPush(phoneNumber: string, amount: number, reference: string): Promise<any> {
  const accessToken = await getMpesaAccessToken();
  
  const url = MPESA_CONFIG.environment === 'live'
    ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(
    `${MPESA_CONFIG.businessShortCode}${MPESA_CONFIG.passkey}${timestamp}`
  ).toString('base64');

  // Use a valid callback URL for sandbox testing
  const callbackUrl = MPESA_CONFIG.environment === 'live'
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/api/payments/mpesa/callback`
    : 'https://webhook.site/your-unique-url'; // Replace with your webhook URL for testing

  const payload = {
    BusinessShortCode: MPESA_CONFIG.businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(amount),
    PartyA: phoneNumber,
    PartyB: MPESA_CONFIG.businessShortCode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: reference,
    TransactionDesc: 'DUCALI Payment',
  };

  console.log('📱 Initiating STK Push with payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  console.log('📱 STK Push response status:', response.status);
  console.log('📱 STK Push response ok:', response.ok);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('📱 STK Push error response:', errorText);
    
    // Provide more helpful error messages
    if (errorText.includes('Invalid CallBackURL')) {
      throw new Error('M-Pesa sandbox requires a valid public callback URL. Please set up a webhook URL for testing.');
    }
    
    throw new Error(`Failed to initiate M-Pesa payment: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log('📱 STK Push success response:', result);
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, amount, orderId, customerId, artisanId } = body;

    // Validate required fields
    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber, amount, orderId' },
        { status: 400 }
      );
    }

    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development' || MPESA_CONFIG.environment === 'sandbox';
    
    if (isDevelopment) {
      // Mock successful payment for development/testing
      console.log('🧪 Development mode: Mocking M-Pesa payment');
      console.log('📱 Mock payment details:', {
        phoneNumber,
        amount,
        orderId,
        customerId,
        artisanId
      });

      // Simulate a delay to mimic real API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponse = {
        success: true,
        message: 'Payment initiated successfully (Mock)',
        data: {
          CheckoutRequestID: `mock_${Date.now()}`,
          MerchantRequestID: `mock_merchant_${Date.now()}`,
          ResponseCode: '0',
          ResponseDescription: 'Success. Request accepted for processing',
          CustomerMessage: 'Success. Request accepted for processing'
        },
        paymentDetails: {
          phoneNumber,
          amount,
          orderId,
          customerId,
          artisanId,
          timestamp: new Date().toISOString(),
          status: 'pending'
        },
        developmentNote: '💡 This is a mock payment. In production, you would receive an STK push on your phone.'
      };

      console.log('🧪 Mock payment response:', mockResponse);
      return NextResponse.json(mockResponse);
    }

    // Real M-Pesa payment for production
    console.log('🚀 Production mode: Initiating real M-Pesa payment');
    
    const reference = `ORDER_${orderId}`;
    const result = await initiateSTKPush(phoneNumber, amount, reference);

    return NextResponse.json({
      success: true,
      message: 'Payment initiated successfully',
      data: result,
      paymentDetails: {
        phoneNumber,
        amount,
        orderId,
        customerId,
        artisanId,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Error processing M-Pesa payment:', error);
    
    return NextResponse.json(
      { 
        error: 'M-Pesa payment failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    );
  }
}

// M-Pesa callback endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process M-Pesa callback
    const { 
      ResultCode, 
      ResultDesc, 
      CheckoutRequestID, 
      TransactionID,
      Amount,
      MpesaReceiptNumber 
    } = body.Body.stkCallback;

    if (ResultCode === 0) {
      // Payment successful
      return NextResponse.json({
        success: true,
        transactionId: TransactionID,
        receiptNumber: MpesaReceiptNumber,
        amount: Amount,
        message: 'Payment completed successfully',
      });
    } else {
      // Payment failed
      return NextResponse.json({
        success: false,
        error: ResultDesc,
        message: 'Payment failed',
      });
    }

  } catch (error: any) {
    console.error('Error processing M-Pesa callback:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}
