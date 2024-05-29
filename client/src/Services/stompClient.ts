import { Client } from '@stomp/stompjs';
import { WebSocket } from 'ws';

// Assign WebSocket to global object for stompJs compatibility with Node environment
Object.assign(global, { WebSocket });
const URL = import.meta.env.VITE_DEBUGGER_URL || 'http://localhost:8000';

// Create and configure the STOMP client
const client = new Client({
  brokerURL: URL,
  onConnect: () => {
    console.log('Connected to STOMP server');

    // Subscribe to a topic
    client.subscribe('/topic/test01', (message) => {
      console.log(`Received: ${message.body}`);
    });

    // Publish a message to a topic
    client.publish({
      destination: '/topic/test01',
      body: 'First Message',
    });
  },

  onDisconnect: () => {
    console.log('Disconnected from STOMP server');
  },
});

// Activate the client
client.activate();

export { client };
