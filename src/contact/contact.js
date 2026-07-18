export const divisions = {
  "prawn-farming": "Prawn farming",
  hydroponics: "Hydroponics",
  trailers: "Trailer building",
  organics: "Vermiculture",
  transport: "Transport company",
  general: "General enquiry",
};

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContact(payload) {
  const values = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
  const contact = {
    name: cleanString(values.name),
    email: cleanString(values.email).toLowerCase(),
    division: cleanString(values.division),
    message: cleanString(values.message),
    website: cleanString(values.website),
  };
  const errors = [];

  if (contact.name.length < 2 || contact.name.length > 100) {
    errors.push("Please enter a name between 2 and 100 characters.");
  }
  if (
    contact.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
  ) {
    errors.push("Please enter a valid email address.");
  }
  if (!Object.hasOwn(divisions, contact.division)) {
    errors.push("Please select an enquiry type.");
  }
  if (contact.message.length < 10 || contact.message.length > 5_000) {
    errors.push("Please enter a message between 10 and 5,000 characters.");
  }

  return { contact, errors };
}
