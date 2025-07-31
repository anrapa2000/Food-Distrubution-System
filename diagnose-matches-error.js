const axios = require('axios');

const BASE_URL = 'http://localhost:8082';

async function diagnoseMatchesError() {
  console.log('🔍 Diagnosing Matches Endpoint Error\n');

  const tests = [
    {
      name: 'Service Health Check',
      url: `${BASE_URL}/actuator/health`,
      method: 'GET'
    },
    {
      name: 'Matches Health Check',
      url: `${BASE_URL}/matches/health`,
      method: 'GET'
    },
    {
      name: 'All Matches',
      url: `${BASE_URL}/matches`,
      method: 'GET'
    },
    {
      name: 'Cache Status',
      url: `${BASE_URL}/cache/status`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n📋 Testing: ${test.name}`);
      console.log(`   URL: ${test.url}`);
      
      const start = Date.now();
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const time = Date.now() - start;
      
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ⏱️  Time: ${time}ms`);
      
      if (response.data) {
        if (typeof response.data === 'object') {
          console.log(`   📊 Response: ${JSON.stringify(response.data, null, 2)}`);
        } else {
          console.log(`   📊 Response: ${response.data}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      
      if (error.response) {
        console.log(`   📊 Status: ${error.response.status}`);
        console.log(`   📊 Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      
      if (error.code === 'ECONNREFUSED') {
        console.log('   💡 Tip: Service might not be running. Try: docker-compose up -d');
      }
      
      if (error.code === 'ENOTFOUND') {
        console.log('   💡 Tip: Check if the service is running on the correct port');
      }
    }
  }

  console.log('\n🔧 Troubleshooting Steps:');
  console.log('1. Check if services are running: docker-compose ps');
  console.log('2. Check service logs: docker-compose logs matchingservice');
  console.log('3. Check database connection: docker-compose logs postgres');
  console.log('4. Restart services: docker-compose restart');
  console.log('5. Check if PostgreSQL is accessible: docker-compose exec postgres psql -U postgres -d matching -c "SELECT 1;"');
}

async function checkServices() {
  console.log('🔍 Checking Service Status...\n');
  
  try {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    
    // Check if Docker containers are running
    const { stdout: containers } = await execAsync('docker-compose ps');
    console.log('📦 Docker Containers:');
    console.log(containers);
    
    // Check if ports are accessible
    const ports = [8082, 5433, 6379, 9092];
    for (const port of ports) {
      try {
        const { stdout } = await execAsync(`lsof -i :${port} || echo "Port ${port} not in use"`);
        console.log(`🔌 Port ${port}: ${stdout.trim()}`);
      } catch (error) {
        console.log(`🔌 Port ${port}: Not accessible`);
      }
    }
    
  } catch (error) {
    console.log('❌ Could not check service status:', error.message);
  }
}

async function main() {
  await checkServices();
  await diagnoseMatchesError();
}

main(); 