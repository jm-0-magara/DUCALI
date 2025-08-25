const axios = require('axios');

console.log('🧪 M-Pesa Integration Test Suite');
console.log('================================\n');

const BASE_URL = 'http://localhost:3000';

// Test data
const testPayment = {
  orderId: 'test_order_123',
  customerId: 'test_customer_456',
  artisanId: 'test_artisan_789',
  amount: 1000,
  currency: 'KES',
  paymentMethod: 'mpesa',
  paymentType: 'full'
};

const testMpesaRequest = {
  phoneNumber: '254712345678',
  amount: 1000,
  orderId: 'test_order_123',
  customerId: 'test_customer_456',
  artisanId: 'test_artisan_789'
};

async function testEndpoint(url, method = 'GET', data = null, description = '') {
  try {
    console.log(`🔍 Testing: ${description || url}`);
    
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    
    console.log(`✅ SUCCESS: ${response.status} - ${response.statusText}`);
    if (response.data) {
      console.log(`📄 Response:`, JSON.stringify(response.data, null, 2));
    }
    console.log('');
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${error.response?.status || 'Network Error'} - ${error.response?.statusText || error.message}`);
    if (error.response?.data) {
      console.log(`📄 Error Response:`, JSON.stringify(error.response.data, null, 2));
    }
    console.log('');
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting M-Pesa Integration Tests...\n');

  // Test 1: Check if server is running
  console.log('📋 Test 1: Server Health Check');
  await testEndpoint('/', 'GET', null, 'Homepage Load');

  // Test 2: Test M-Pesa test page
  console.log('📋 Test 2: M-Pesa Test Page');
  await testEndpoint('/test-mpesa', 'GET', null, 'M-Pesa Test Page Load');

  // Test 3: Test payment creation endpoint
  console.log('📋 Test 3: Payment Creation');
  await testEndpoint('/api/payments', 'POST', testPayment, 'Create Payment Record');

  // Test 4: Test M-Pesa STK Push endpoint
  console.log('📋 Test 4: M-Pesa STK Push');
  await testEndpoint('/api/payments/mpesa', 'POST', testMpesaRequest, 'Initiate M-Pesa STK Push');

  // Test 5: Test payment retrieval
  console.log('📋 Test 5: Payment Retrieval');
  await testEndpoint('/api/payments?orderId=test_order_123', 'GET', null, 'Get Payments by Order ID');

  // Test 6: Test invalid phone number
  console.log('📋 Test 6: Invalid Phone Number');
  await testEndpoint('/api/payments/mpesa', 'POST', {
    ...testMpesaRequest,
    phoneNumber: 'invalid_phone'
  }, 'Invalid Phone Number Validation');

  // Test 7: Test invalid amount
  console.log('📋 Test 7: Invalid Amount');
  await testEndpoint('/api/payments/mpesa', 'POST', {
    ...testMpesaRequest,
    amount: -100
  }, 'Invalid Amount Validation');

  console.log('🎉 Test Suite Completed!');
  console.log('\n📊 Next Steps:');
  console.log('1. Check the browser at http://localhost:3000/test-mpesa');
  console.log('2. Try the M-Pesa payment flow manually');
  console.log('3. Use a real M-Pesa phone number for actual testing');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint };
