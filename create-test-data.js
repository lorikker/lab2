// Simple script to create test membership data
async function createTestData() {
  try {
    // First check what's in the database
    const checkResponse = await fetch('http://localhost:3001/api/admin/test-data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      console.log('Database counts:', checkData.counts);
      
      if (checkData.counts.users === 0) {
        console.log('No users found. Please create some users first.');
        return;
      }
      
      if (checkData.counts.memberships === 0 || checkData.counts.paidMemberships === 0) {
        console.log('Creating test membership data...');
        
        // Create test data
        const createResponse = await fetch('http://localhost:3001/api/admin/test-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (createResponse.ok) {
          const createData = await createResponse.json();
          console.log('Test data created:', createData);
        } else {
          console.error('Failed to create test data:', await createResponse.text());
        }
      } else {
        console.log('Database already has membership data');
      }
    } else {
      console.error('Failed to check database:', await checkResponse.text());
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createTestData();
