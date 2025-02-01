import { Analytics } from "@/types/admin/events";
import { isRushThresholdMetAnalytics } from "@/utils/getRushThreshold";

/**
 * Retrieves the number of registered rushees from the provided analytics data.
 *
 * @param analyticsData - The analytics data containing information about attendees.
 * @returns The number of registered rushees (irrespective of whether they have met the rush threshold).
 */
export const getNumRegisteredRushees = (analyticsData: Analytics) => {
    const attendees = Object.values(analyticsData.attendees);
    return attendees.length;
}

/**
 * Calculates the percentage of rushees who have met the rush threshold.
 *
 * @param analyticsData - The analytics data containing information about attendees.
 * @returns The percentage of rushees who have met the rush threshold, formatted as a string with two decimal places followed by a percent sign.
 */
export const getPercentageRushThresholdMet = (analyticsData: Analytics) => {
    const attendees = analyticsData.attendees;
    const numRushees = Object.keys(attendees).length;
    const rushees = Object.values(attendees);
    const rusheesAttended = rushees.filter((rushee) => isRushThresholdMetAnalytics(rushee.eventsAttended));
    const percentage = (rusheesAttended.length / numRushees) * 100;
    return `${percentage.toFixed(2)}%`;
}

/**
 * Retrieves the most popular event from the provided analytics data.
 *
 * @param analyticsData - The analytics data containing information about attendees and the events they attended.
 * @returns The name of the most popular event.
 */
export const getMostPopularEvent = (analyticsData: Analytics) => {
    const eventCounts: { [eventName: string]: number } = {};

    // Iterate over each attendee's events and count occurrences of each event
    Object.values(analyticsData.attendees).forEach(attendee => {
        attendee.eventsAttended.forEach(event => {
            if (eventCounts[event.eventName]) {
                eventCounts[event.eventName]++;
            } else {
                eventCounts[event.eventName] = 1;
            }
        });
    });

    let mostPopularEvent = "";
    let maxCount = 0;

    // Determine the event with the highest count
    for (const [eventName, count] of Object.entries(eventCounts)) {
        if (count > maxCount) {
            mostPopularEvent = eventName;
            maxCount = count;
        }
    }

    return mostPopularEvent;
}

/**
 * Retrieves the counts of each event from the provided analytics data.
 *
 * @param analyticsData - The analytics data containing information about attendees and the events they attended.
 * @returns A list of objects, each containing the event name and its count.
 */
export const getEventCounts = (analyticsData: Analytics) => {
    const eventCounts: { [eventName: string]: number } = {};

    // Iterate over each attendee's events and count occurrences of each event
    Object.values(analyticsData.attendees).forEach(attendee => {
        attendee.eventsAttended.forEach(event => {
            if (eventCounts[event.eventName]) {
                eventCounts[event.eventName]++;
            } else {
                eventCounts[event.eventName] = 1;
            }
        });
    });

    // Convert the eventCounts object to a list of objects with "name" and "count"
    return Object.entries(eventCounts).map(([name, count]) => ({ name, count }));
}