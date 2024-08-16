// getRushBaseUrl : returns base url of rush application (depending on current environment)
export const getRushBaseUrl = (): string => {
  switch(process.env.NEXT_PUBLIC_API_BASE_URL) {
    // local environment
    case "http://127.0.0.1:8000":
      return "http://localhost:3001/";

    // staging environment
    case "https://o74hteay05.execute-api.us-east-1.amazonaws.com/api":
      return "https://staging--whyphi-rush.netlify.app/";

    // production environment
    case "https://api.why-phi.com":
      return "https://rush.why-phi.com";
    } 

  return "";
}

// getRushBaseUrl : returns base url of portal application (depending on current environment)
export const getPortalBaseUrl = (): string => {
  return window.location.origin;
}