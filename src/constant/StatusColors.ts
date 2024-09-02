export function getStatusColor(status: string) {
  switch (status) {
    case "Offered":
      return "#7F47DD";
    case "Placement":
    case "Extension Placement":
      return "#5E9B2D";
    case "Applied":
    case "Submitted":
    case "Extension Requested":
    case "Extension Offered":
    case "Pending Updated Placement":
    case "Pending Updated Extension Placement":
      return "#DB8F00";
    case "Declined by Professional":
    case "Declined by Facility":
    case "Declined by Gig":
    case "Facility Termination":
    case "Professional Termination":
    case "Gig Termination":
      return "red";
    case "Pending Placement":
      return "#fbae17";
    case "Pending Extension Placement":
      return "#fbae17";
    case "Pending Declination":
      return "red";
    case "Pending Extension Declination":
      return "red";
    default:
      return "#717B9E";
  }
}
