import { AnalyticsEvent } from "@/types/admin/events";

const mandatoryEvents = ["Info Session 1", "Info Session 2"];
const remainingEvents = ["Professional Panel", "Resume Night", "Social Event"];
const minimumRemainingEvents = 2;

export const isRushThresholdMet = (events: { [key: string]: boolean }) => {
  // Check if at least one mandatory event was attended
  const hasAttendedMandatoryEvent = mandatoryEvents.some(
    (event) => events[event]
  );

  // Count how many remaining events were attended
  const attendedRemaining = remainingEvents.filter(
    (event) => events[event]
  ).length;

  // Check if the rush threshold is met: at least 1 mandatory event and 2 other events
  return (
    hasAttendedMandatoryEvent && attendedRemaining >= minimumRemainingEvents
  );
};
