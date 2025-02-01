const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllEventData = async (token: any) => {
  try {
    // Call the API to get all timeframe IDs
    const timeframesResponse = await fetch(`${API_BASE_URL}/timeframes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const timeframes = await timeframesResponse.json();

    // Fetch event data for each timeframe
    const eventPromises = timeframes.map((timeframe: { _id: string }) =>
      fetch(`${API_BASE_URL}/timeframes/${timeframe._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(response => response.json())
    );

    const eventsData = await Promise.all(eventPromises);

    // Extract events from each timeframe
    const allEvents = eventsData.flatMap((timeframe: { events: any[] }) => timeframe.events);

    // Fetch detailed event data for each event
    const detailedEventPromises = allEvents.map((event: { _id: string }) =>
      fetch(`${API_BASE_URL}/events/${event._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(response => response.json())
    );

    const detailedEventsData = await Promise.all(detailedEventPromises);

    // Sort events by dateCreated from most recent to latest
    detailedEventsData.sort((b, a) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
    return detailedEventsData;
  } catch (error) {
    console.error('Error fetching event data:', error);
    throw error;
  }
};
export const calculateMemberParticipationRate = (events: any[], activeMemberCount: number) => {
  let cumulativeSum = 0;
  const memberParticipationRateData = events.map((event: any, index: number) => {
    const participationRate = event.usersAttended.length / (event.currentMemberCount || activeMemberCount);
    cumulativeSum += participationRate;
    const averageParticipationRate = cumulativeSum / (index + 1);


    return {
      name: event.name,
      participationRate: participationRate,
      avgParticipationRate: averageParticipationRate,
    };
  });

  return memberParticipationRateData;
};