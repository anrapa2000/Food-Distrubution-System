const axios = require('axios');

// Test configuration
const TEST_LOCATIONS = [
  { lat: 12.9716, lon: 77.5946, name: "Bangalore Center" },
  { lat: 12.920, lon: 77.600, name: "Indiranagar" },
  { lat: 13.000, lon: 77.700, name: "HSR Layout" },
  { lat: 12.933, lon: 77.610, name: "Koramangala" },
  { lat: 12.950, lon: 77.650, name: "JP Nagar" }
];

const BASE_URL = 'http://localhost:8082';

async function testCachePerformance() {
  console.log('🚀 Starting Cache Performance Test\n');

  // Test 1: Initial NGO lookup (no cache)
  console.log('📊 Test 1: Initial NGO Lookup (No Cache)');
  const initialTimes = [];
  
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    try {
      await axios.post(`${BASE_URL}/donations`, {
        donorId: `test${i}`,
        description: "Test donation",
        quantity: 10,
        lat: TEST_LOCATIONS[i % TEST_LOCATIONS.length].lat,
        lon: TEST_LOCATIONS[i % TEST_LOCATIONS.length].lon,
        timestamp: new Date().toISOString()
      });
      const end = Date.now();
      initialTimes.push(end - start);
      console.log(`  Request ${i + 1}: ${end - start}ms`);
    } catch (error) {
      console.log(`  Request ${i + 1}: Failed`);
    }
  }

  const avgInitialTime = initialTimes.reduce((a, b) => a + b, 0) / initialTimes.length;
  console.log(`  Average: ${avgInitialTime.toFixed(2)}ms\n`);

  // Wait for cache to populate
  console.log('⏳ Waiting for cache to populate...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Cached NGO lookup
  console.log('📊 Test 2: Cached NGO Lookup');
  const cachedTimes = [];
  
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    try {
      await axios.post(`${BASE_URL}/donations`, {
        donorId: `cached${i}`,
        description: "Cached test donation",
        quantity: 10,
        lat: TEST_LOCATIONS[i % TEST_LOCATIONS.length].lat,
        lon: TEST_LOCATIONS[i % TEST_LOCATIONS.length].lon,
        timestamp: new Date().toISOString()
      });
      const end = Date.now();
      cachedTimes.push(end - start);
      console.log(`  Request ${i + 1}: ${end - start}ms`);
    } catch (error) {
      console.log(`  Request ${i + 1}: Failed`);
    }
  }

  const avgCachedTime = cachedTimes.reduce((a, b) => a + b, 0) / cachedTimes.length;
  console.log(`  Average: ${avgCachedTime.toFixed(2)}ms\n`);

  // Calculate improvement
  const improvement = ((avgInitialTime - avgCachedTime) / avgInitialTime) * 100;
  console.log('📈 Performance Results:');
  console.log(`  Initial Average: ${avgInitialTime.toFixed(2)}ms`);
  console.log(`  Cached Average: ${avgCachedTime.toFixed(2)}ms`);
  console.log(`  Improvement: ${improvement.toFixed(2)}% faster\n`);

  // Test 3: Cache statistics
  console.log('📊 Test 3: Cache Statistics');
  try {
    const statsResponse = await axios.get(`${BASE_URL}/cache/stats`);
    const stats = statsResponse.data;
    console.log(`  Cache Enabled: ${stats.cacheEnabled}`);
    console.log(`  Cache Size: ${stats.cacheSize} entries`);
    console.log(`  Total NGOs: ${stats.totalNgos}`);
    console.log(`  Memory Usage: ${(stats.memoryUsage / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.log('  Failed to get cache stats');
  }

  // Test 4: Cache warming
  console.log('\n📊 Test 4: Cache Warming');
  try {
    const warmResponse = await axios.post(`${BASE_URL}/cache/warm`);
    console.log(`  ${warmResponse.data.message}`);
    console.log(`  Locations warmed: ${warmResponse.data.locationsWarmed}`);
  } catch (error) {
    console.log('  Failed to warm cache');
  }

  console.log('\n✅ Cache Performance Test Complete!');
}

async function testCacheEndpoints() {
  console.log('\n🔧 Testing Cache Endpoints\n');

  const endpoints = [
    { method: 'GET', path: '/cache/status', name: 'Cache Status' },
    { method: 'GET', path: '/cache/stats', name: 'Cache Stats' },
    { method: 'POST', path: '/cache/warm', name: 'Warm Cache' },
    { method: 'DELETE', path: '/cache/clear', name: 'Clear Cache' }
  ];

  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      const response = await axios({
        method: endpoint.method,
        url: `${BASE_URL}${endpoint.path}`,
        timeout: 5000
      });
      const end = Date.now();
      console.log(`✅ ${endpoint.name}: ${response.status} (${end - start}ms)`);
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Failed`);
    }
  }
}

// Run tests
async function runTests() {
  try {
    await testCacheEndpoints();
    await testCachePerformance();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if services are running
async function checkServices() {
  console.log('🔍 Checking service availability...\n');
  
  try {
    await axios.get(`${BASE_URL}/cache/status`);
    console.log('✅ Matching service is running');
    return true;
  } catch (error) {
    console.log('❌ Matching service is not running');
    console.log('Please start the services with: docker-compose up -d');
    return false;
  }
}

// Main execution
async function main() {
  const servicesRunning = await checkServices();
  if (servicesRunning) {
    await runTests();
  }
}

main(); 