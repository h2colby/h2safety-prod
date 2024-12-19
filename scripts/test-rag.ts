// scripts/test-rag.ts
import fetch from 'node-fetch';

// Define the expected response type
interface RagResponse {
  final_response: string;
  error?: string;
}

async function testRagConnection() {
  const RAG_URL = 'http://34.28.61.219:5002/ask';
  
  try {
    console.log('Sending request to RAG service...');
    const response = await fetch(RAG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'What are the main safety considerations for hydrogen storage?'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as RagResponse;
    
    console.log('\nRAG Service Response:');
    console.log('-------------------');
    console.log(data.final_response);
    console.log('-------------------\n');
  } catch (error) {
    console.error('Error testing RAG service:', error);
  }
}

testRagConnection();