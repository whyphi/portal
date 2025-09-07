import { Analytics } from "@/types/admin/events";

/**
 * Retrieves the number of registered rushees from the provided analytics data.
 *
 * @param analyticsData - The analytics data containing information about attendees.
 * @returns The number of registered rushees (irrespective of whether they have met the rush threshold).
 */
export const getNumRegisteredRushees = (analyticsData: Analytics) => {
  const attendees = Object.values(analyticsData.rushees);
  return attendees.length;
};

/**
 * Calculates the percentage of rushees who have met the rush threshold.
 *
 * @param analyticsData - The analytics data containing information about attendees.
 * @returns The percentage of rushees who have met the rush threshold, formatted as a string with two decimal places followed by a percent sign.
 */
export const getPercentageRushThresholdMet = (analyticsData: Analytics) => {
  const attendees = analyticsData.rushees;
  const numRushees = Object.keys(attendees).length;
  const rushees = Object.values(attendees);
  const rusheesThreshold = rushees.filter((rushee) => rushee.threshold);
  const percentage = (rusheesThreshold.length / numRushees) * 100;
  return `${percentage.toFixed(2)}%`;
};

/**
 * Retrieves the most popular event from the provided analytics data.
 *
 * @param analyticsData - The analytics data containing information about attendees and the events they attended.
 * @returns The name of the most popular event.
 */
export const getMostPopularEvent = (analyticsData: Analytics) => {
  const eventCounts: { [eventName: string]: number } = {};

  // Iterate over each attendee's events and count occurrences of each event
  Object.values(analyticsData.rushees).forEach((attendee) => {
    attendee.events_attended.forEach((event) => {
      if (eventCounts[event.id]) {
        eventCounts[event.id]++;
      } else {
        eventCounts[event.id] = 1;
      }
    });
  });

  let mostPopularEvent = "";
  let maxCount = 0;

  // Determine the event with the highest count
  for (const [eventId, count] of Object.entries(eventCounts)) {
    if (count > maxCount) {
      mostPopularEvent = analyticsData.events[eventId].name;
      maxCount = count;
    }
  }

  return mostPopularEvent;
};

/**
 * Retrieves the counts of each event from the provided analytics data.
 *
 * @param analyticsData - The analytics data containing information about attendees and the events they attended.
 * @returns A list of objects, each containing the event name and its count.
 */
export const getEventCounts = (analyticsData: Analytics) => {
  return Object.values(analyticsData.events).map((event) => ({
    name: event.name,
    count: event.num_attendees,
  }));
};
