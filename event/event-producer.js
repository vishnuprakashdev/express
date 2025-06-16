const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Simulate an action, e.g., a user registering
  const eventData = { type: 'user_registered', userId: 123 };

  // Send the event to the event-consumer function
  await fetch('https://your-project.netlify.app/.netlify/functions/event-consumer', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });

  return {
    statusCode: 200,
    body: 'Event sent',
  };
};