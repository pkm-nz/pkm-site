// Site-wide settings. Change these and the whole site follows.
export const SITE = {
  title: "Paul's Project Site",          // placeholder until the real title is chosen
  tagline: "Projects & workshop log",
  description: "Art, objects and digital pieces, shown from the first sketch to the finished thing.",
  logoWord: "paul",                       // spelled in the Coalition Alphabet Collider letters
  owner: "Paul",                          // copyright line, and the name on your own comment replies
  email: "hello@pkm.nz",
  location: "Aotearoa New Zealand",
  // Where the contact and comment forms send messages (a Formspree form URL, for example).
  // Leave empty and the forms open the visitor's email app instead.
  formEndpoint: "",
};

export const STAGES = ["Idea", "Planning", "Prototype", "Making", "Finished"] as const;
