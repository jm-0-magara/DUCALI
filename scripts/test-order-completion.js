// scripts/test-order-completion.js
// Test the order completion functionality

async function testOrderCompletion() {
  console.log('🧪 Testing order completion functionality...\n');

  try {
    const orderId = 'C8xS5GOW2SSpBkMCiU1d';
    const customerId = '3I3re3quyJcnknfxx2oZoaE5ess2';

    console.log('📝 Testing order completion for:', { orderId, customerId });

    // Test order completion API
    const response = await fetch(`http://localhost:3000/api/orders/${orderId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: customerId,
        action: 'approve',
        rating: 5,
        review: 'Excellent work! Very satisfied with the service.',
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order completion successful:');
      console.log('   Status:', result.data.status);
      console.log('   Action:', result.data.action);
      console.log('   Message:', result.message);
    } else {
      console.log('❌ Order completion failed:');
      console.log('   Error:', result.error);
      console.log('   Details:', result.details);
    }

  } catch (error) {
    console.error('❌ Error testing order completion:', error);
  }
}

// Run the test
testOrderCompletion().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
