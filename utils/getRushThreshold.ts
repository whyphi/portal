const mandatoryEvents = ["Info Session 1", "Info Session 2"]
const remainingEvents = ["Professional Panel", "Resume Night", "Social Event"]

export const getRushThreshold = (events: { [key: string]: boolean }) => {
  // Check if at least one mandatory event was attended
  const attendedMandatory = mandatoryEvents.some((event) => events[event]);

  // Count how many remaining events were attended
  const attendedRemaining = remainingEvents.filter((event) => events[event]).length;

  // Check if the rush threshold is met: at least 1 mandatory event and 2 other events
  return attendedMandatory && attendedRemaining >= 2;
}

// TODO: this is a temporary helper function to get the rush threshold on the Rush analytics page (fix backend and merge this into above function)
export const getRushThresholdAnalytics = () => {

}