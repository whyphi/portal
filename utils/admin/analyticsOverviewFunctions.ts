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

/**
 * Fetches the number of rush applicants for each listing and returns the data sorted by deadline.
 *
 * @param {any} token - The authorization token to access the API.
 * @returns {Promise<Array<{ title: string, applicantCount: number, deadline: string }>>} - A promise that resolves to an array of objects containing the title, applicant count, and deadline for each listing.
 * @throws Will throw an error if the API call fails.
 */
export const getNumRushApplicantsCount = async (token: any) => {
  try {
    // Call the API to get all timeframe IDs
    const listingsResponse = await fetch(`${API_BASE_URL}/listings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Parse the response to JSON
    const listings = await listingsResponse.json();

    // Fetch event data for each timeframe
    const listingPromises = listings.map((listing: { listingId: string, title: string, deadline: string }) =>
      fetch(`${API_BASE_URL}/applicants/${listing.listingId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(response => response.json().then(data => ({
        title: listing.title,
        applicantCount: data.length,
        deadline: listing.deadline
      })))
    );

    // Wait for all listing data to be fetched
    const listingData = await Promise.all(listingPromises);

    // Sort events by dateCreated from most recent to latest
    listingData.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    return listingData;

  } catch (error) {
    console.error('Error fetching event data:', error);
    throw error;
  }
}

/**
 * Fetches the distribution of members by college.
 *
 * This function performs the following steps:
 * 1. Calls the API to get all member data.
 * 2. Extracts the count of members for each college.
 * 3. Formats the data into an array of objects containing college names and their respective member counts.
 *
 * @param {any} token - The authorization token to access the API.
 * @returns {Promise<Array<{ college: string, count: number }>>} A promise that resolves to an array of objects containing college names and their respective member counts.
 * @throws Will throw an error if the API call fails.
 */
export const getMemberCollegeDistributionData = async (token: any) => {
  try {
    // Call the API to get all member data
    const memberDataResponse = await fetch(`${API_BASE_URL}/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Parse the response to JSON
    const members = await memberDataResponse.json();

    // Extract count and college from the data
    const collegeDistribution = members.reduce((acc: { [key: string]: number }, member: any) => {
      if (member.college) {
        acc[member.college] = (acc[member.college] || 0) + 1;
      }
      return acc;
    }, {});

    // Format the data into an array of objects
    const formattedCollegeDistribution = Object.entries(collegeDistribution).map(([college, count]) => ({
      college,
      count,
    }));

    console.log(formattedCollegeDistribution);
    return formattedCollegeDistribution;
  } catch (error) {
    console.error('Error fetching member data:', error);
    throw error;
  }
};