// Simple Node.js test script for STT endpoint
import fs from 'fs';
import path from 'path';

async function testSTTEndpoint() {
    console.log('Testing STT endpoint with a simple file...');
    
    try {
        // Check if Python backend is running
        const healthCheck = await fetch('http://localhost:8001/');
        const health = await healthCheck.json();
        console.log('✅ Python backend is running:', health.msg);
        
        // Create a simple test "audio" file (just use README.md as dummy data)
        const testFile = fs.readFileSync('README.md');
        
        // Create FormData for the request
        const formData = new FormData();
        const blob = new Blob([testFile], { type: 'audio/webm' });
        formData.append('audio', blob, 'test.webm');
        
        console.log('Sending test file to STT endpoint...');
        const response = await fetch('http://localhost:8001/stt', {
            method: 'POST',
            body: formData
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ STT Response:', result);
            
            if (result.transcript && result.transcript.trim()) {
                console.log('✅ Got transcript:', result.transcript);
            } else {
                console.log('⚠️  Empty transcript - this is expected for non-audio data');
            }
        } else {
            const error = await response.text();
            console.log('❌ STT Error:', error);
        }
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

// Check if we have fetch (Node 18+)
if (typeof fetch === 'undefined') {
    console.log('❌ This test requires Node.js 18+ for fetch support');
    console.log('Your Node version:', process.version);
    process.exit(1);
}

testSTTEndpoint();
