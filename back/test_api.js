const testPostSchedule = async () => {
  try {
    const response = await fetch(
      'http://localhost:8001/api/v2/private/schedules',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test_user',
          title: 'Test Schedule from AI',
          start_date: '2026-02-19T19:00:00',
          end_date: '2026-02-19T20:00:00',
          is_anniversary: false,
          repeat_type: 'none',
          place: 'AI Lab',
          description: 'Testing API deployment',
          attachments: [],
        }),
      },
    );
    const data = await response.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

testPostSchedule();
