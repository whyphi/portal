const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetches all event data from the API.
 *
 * This function performs the following steps:
 * 1. Calls the API to get all timeframe IDs.
 * 2. Fetches event data for each timeframe.
 * 3. Extracts events from each timeframe.
 * 4. Fetches detailed event data for each event.
 * 5. Sorts events by `dateCreated` from most recent to latest.
 *
 * @param {any} token - The authorization token to access the API.
 * @returns {Promise<any[]>} A promise that resolves to an array of detailed event data.
 * @throws Will throw an error if the API calls fail.
 */
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

    // Parse the response to JSON
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

    // Wait for all event data to be fetched
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

    // Wait for all detailed event data to be fetched
    const detailedEventsData = await Promise.all(detailedEventPromises);

    // Sort events by dateCreated from most recent to latest
    detailedEventsData.sort((b, a) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
    return detailedEventsData;
  } catch (error) {
    console.error('Error fetching event data:', error);
    throw error;
  }
};

/**
 * Calculates the member participation rate for each event.
 *
 * This function performs the following steps:
 * 1. Iterates over each event.
 * 2. Calculates the participation rate for each event.
 * 3. Calculates the cumulative average participation rate.
 *
 * @param {any[]} events - An array of event data.
 * @param {number} activeMemberCount - The number of active members.
 * @returns {any[]} An array of objects containing event name, participation rate, and average participation rate.
 */
export const calculateMemberParticipationRate = (events: any[], activeMemberCount: number) => {
  let cumulativeSum = 0;
  let eventCount = 0;
  const memberParticipationRateData = events.map((event: any, index: number) => {
    // Calculate the participation rate for the event
    // NOTE: The currentMemberCount is not always available, so we use the activeMemberCount as a fallback
    const participationRate = event.usersAttended.length / (event.currentMemberCount || activeMemberCount);

    // If participationRate is below 0.05, exclude it as an outlier
    if (participationRate < 0.05) {
      return null;
    }
    cumulativeSum += participationRate;
    eventCount += 1;

    // Calculate the average participation rate up to the current event
    const averageParticipationRate = cumulativeSum / eventCount;

    return {
      name: `${event.name} (${new Date(event.dateCreated).toLocaleDateString()})`,
      participationRate: parseFloat(participationRate.toFixed(4)),
      avgParticipationRate: parseFloat(averageParticipationRate.toFixed(4)),
    };
  });

  const filteredMemberParticipationRateData = memberParticipationRateData.filter(data => data !== null);
  return filteredMemberParticipationRateData;
};