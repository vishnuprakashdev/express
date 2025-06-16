exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const eventData = JSON.parse(event.body);
    // Process the event (e.g., log it or update a database)
    console.log('Received event:', eventData);
    return {
      statusCode: 200,
      body: 'Event processed',
    };
  }
  return {
    statusCode: 405,
    body: 'Method not allowed',
  };
};