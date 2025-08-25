// scripts/test-quote-acceptance.js
// Test the quote acceptance API route directly

async function testQuoteAcceptance() {
  console.log('🧪 Testing quote acceptance API route...\n');

  try {
    // Test with a known quote ID from the logs
    const quoteId = 'UiqhzVjPQsxENKwC8HKd';
    const customerId = '3I3re3quyJcnknfxx2oZoaE5ess2';
    const paymentId = 'test_payment_123';

    console.log('📝 Testing with:', { quoteId, customerId, paymentId });

    const response = await fetch(`http://localhost:3000/api/quotes/${quoteId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: customerId,
        paymentId: paymentId,
        paymentStatus: 'confirmed'
      }),
    });

    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Quote acceptance test successful!');
    } else {
      console.log('❌ Quote acceptance test failed!');
    }

  } catch (error) {
    console.error('❌ Error testing quote acceptance:', error);
  }
}

// Run the test
testQuoteAcceptance().then(() => {
  console.log('🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
