// scripts/test-review-form.js
// Test the review form functionality

async function testReviewForm() {
  console.log('🧪 Testing review form functionality...\n');

  try {
    const artisanId = 'ukpqxXeyyxbNMnHWplgijkMTM052';
    const customerId = '3I3re3quyJcnknfxx2oZoaE5ess2';

    console.log('📝 Testing review creation for:', { artisanId, customerId });

    // Test review creation API (if it exists)
    const response = await fetch(`http://localhost:3000/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        artisanId: artisanId,
        customerId: customerId,
        customerName: 'Test Customer',
        // Note: customerImage is intentionally omitted to test the fix
        rating: 5,
        title: 'Great Service!',
        comment: 'Excellent work, very satisfied with the service.',
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Review creation successful:');
      console.log('   Result:', result);
    } else {
      const error = await response.json();
      console.log('❌ Review creation failed:');
      console.log('   Error:', error);
    }

  } catch (error) {
    console.error('❌ Error testing review form:', error);
  }
}

// Run the test
testReviewForm().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
