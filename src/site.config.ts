// Site-wide settings. The editable ones live in src/data/site.json ("Site settings" in /admin).
import S from "./data/site.json";

export const SITE = {
  ...S,
  // formEndpoint: where the contact and comment forms send messages (/api/send is the site's own sender).
  // Leave it empty and the forms open the visitor's email app instead.
};

export const MENU = S.menu;

export const STAGES = ["Idea", "Planning", "Prototype", "Making", "Finished"] as const;
