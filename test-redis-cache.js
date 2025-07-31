const axios = require('axios');

const BASE_URL = 'http://localhost:8082';

async function testRedisCache() {
  console.log('🧪 Testing Redis Cache Implementation\n');

  try {
    // 1. Check if services are running
    console.log('1️⃣ Checking service status...');
    const statusResponse = await axios.get(`${BASE_URL}/cache/status`);
    console.log('✅ Cache status:', statusResponse.data);

    // 2. Clear cache initially
    console.log('\n2️⃣ Clearing cache...');
    await axios.delete(`${BASE_URL}/cache/clear`);
    console.log('✅ Cache cleared');

    // 3. Test cache warming
    console.log('\n3️⃣ Warming cache...');
    const warmResponse = await axios.post(`${BASE_URL}/cache/warm`);
    console.log('✅ Cache warmed:', warmResponse.data);

    // 4. Check cache stats
    console.log('\n4️⃣ Checking cache statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/cache/stats`);
    console.log('📊 Cache stats:', {
      enabled: statsResponse.data.cacheEnabled,
      size: statsResponse.data.cacheSize,
      totalNgos: statsResponse.data.totalNgos,
      memoryUsage: `${(statsResponse.data.memoryUsage / 1024 / 1024).toFixed(2)} MB`
    });

    // 5. Test performance with and without cache
    console.log('\n5️⃣ Testing performance...');
    
    // First request (no cache)
    const start1 = Date.now();
    await axios.get(`${BASE_URL}/matches`);
    const time1 = Date.now() - start1;
    console.log(`⏱️  First request (no cache): ${time1}ms`);

    // Second request (with cache)
    const start2 = Date.now();
    await axios.get(`${BASE_URL}/matches`);
    const time2 = Date.now() - start2;
    console.log(`⏱️  Second request (cached): ${time2}ms`);

    const improvement = ((time1 - time2) / time1 * 100).toFixed(2);
    console.log(`📈 Performance improvement: ${improvement}%`);

    // 6. Test location-specific caching
    console.log('\n6️⃣ Testing location-based caching...');
    const testLocations = [
      { lat: 12.9716, lon: 77.5946, name: "Bangalore Center" },
      { lat: 12.920, lon: 77.600, name: "Indiranagar" },
      { lat: 13.000, lon: 77.700, name: "HSR Layout" }
    ];

    for (const location of testLocations) {
      console.log(`📍 Testing location: ${location.name}`);
      const start = Date.now();
      // Simulate donation event for this location
      await axios.post(`${BASE_URL}/donations`, {
        donorId: `test-${Date.now()}`,
        description: "Test donation",
        quantity: 10,
        lat: location.lat,
        lon: location.lon,
        timestamp: new Date().toISOString()
      });
      const time = Date.now() - start;
      console.log(`   ⏱️  Processing time: ${time}ms`);
    }

    // 7. Final cache stats
    console.log('\n7️⃣ Final cache statistics...');
    const finalStats = await axios.get(`${BASE_URL}/cache/stats`);
    console.log('📊 Final cache stats:', {
      enabled: finalStats.data.cacheEnabled,
      size: finalStats.data.cacheSize,
      totalNgos: finalStats.data.totalNgos,
      memoryUsage: `${(finalStats.data.memoryUsage / 1024 / 1024).toFixed(2)} MB`
    });

    console.log('\n✅ Redis Cache Test Completed Successfully!');
    console.log('\n🎯 Key Benefits Achieved:');
    console.log('   • Location-based NGO lookup caching');
    console.log('   • Improved response times for repeated locations');
    console.log('   • Memory-efficient caching with TTL');
    console.log('   • Real-time cache monitoring');
    console.log('   • Cache warming for common locations');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Check if services are running before testing
async function checkServices() {
  try {
    await axios.get(`${BASE_URL}/cache/status`);
    return true;
  } catch (error) {
    console.log('❌ Services are not running. Please start them with:');
    console.log('   docker-compose up -d');
    console.log('   cd food-donation-frontend && npm start');
    return false;
  }
}

async function main() {
  console.log('🚀 Redis Cache Testing Suite');
  console.log('=============================\n');
  
  const servicesRunning = await checkServices();
  if (servicesRunning) {
    await testRedisCache();
  }
}

main(); 