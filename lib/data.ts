export interface Role {
  id: string;
  name: string;
  image: string;
  /** Typical hourly rate in DKK, used by the salary suggestion */
  baseRate: number;
}

export const ROLES: Role[] = [
  { id: "carpenter", name: "Carpenter", image: "/roles/carpenter.png", baseRate: 235 },
  { id: "bricklayer", name: "Bricklayer", image: "/roles/bricklayer.png", baseRate: 230 },
  { id: "electrician", name: "Electrician", image: "/roles/electrician.png", baseRate: 255 },
  { id: "plumber", name: "Plumber", image: "/roles/plumber.png", baseRate: 250 },
  { id: "painter", name: "Painter", image: "/roles/painter.png", baseRate: 215 },
  { id: "machine-operator", name: "Machine operator", image: "/roles/machine-operator.png", baseRate: 225 },
  { id: "warehouse-manager", name: "Warehouse & logistics Manager", image: "/roles/warehouse-manager.png", baseRate: 240 },
  { id: "refrigeration-tech", name: "Refrigeration tech", image: "/roles/refrigeration-tech.png", baseRate: 260 },
  { id: "earth-concrete", name: "Earth and Concrete Workers", image: "/roles/earth-concrete.png", baseRate: 220 },
  { id: "blacksmith", name: "Blacksmith", image: "/roles/blacksmith.png", baseRate: 235 },
  { id: "ventilation-technician", name: "Ventilation Technician", image: "/roles/ventilation-technician.png", baseRate: 245 },
  { id: "welder", name: "Welder", image: "/roles/welder.png", baseRate: 240 },
  { id: "landscaping-gardener", name: "Landscaping Gardener", image: "/roles/landscaping-gardener.png", baseRate: 205 },
  { id: "sewer-pipe-layer", name: "Sewer Pipe layer", image: "/roles/sewer-pipe-layer.png", baseRate: 230 },
  { id: "ventilation", name: "Ventilation", image: "/roles/ventilation.png", baseRate: 235 },
  { id: "paver", name: "Paver", image: "/roles/paver.png", baseRate: 225 },
  { id: "industrial-technician", name: "Industrial Technician", image: "/roles/industrial-technician.png", baseRate: 255 },
  { id: "cnc-operator", name: "CNC Operator", image: "/roles/cnc-operator.png", baseRate: 245 },
  { id: "warehouse-employee", name: "Warehouse and Logistics Employee", image: "/roles/warehouse-employee.png", baseRate: 190 },
];

export const TASKS = [
  "Nybyg",
  "Renovering",
  "Tagarbejde",
  "Spjæld & Service",
  "Tilbygninger",
  "Facade & Beklædning",
];

export const MIN_TASKS = 1;
export const MAX_TASKS = 3;

export const ADDRESSES = [
  "Sønder Boulevard 45, 1720 København",
  "Sønder Boulevard 52, 1720 København V, Denmark",
  "Istedgade 98, 1650 København V, Denmark",
  "Matthæusgade 18, 1666 København V, Denmark",
  "Dybbølsgade 41, 1721 København V, Denmark",
  "Natali Carstensgade 12, 1770 København V, Denmark",
  "Vesterbrogade 120, 1620 København V, Denmark",
  "Nørrebrogade 66, 2200 København N, Denmark",
  "Amagerbrogade 150, 2300 København S, Denmark",
  "Østerbrogade 88, 2100 København Ø, Denmark",
];

/** Address returned by the simulated "Use my location" lookup */
export const GEO_ADDRESS = "Sønder Boulevard 52, 1720 København V, Denmark";

export const TRAVEL_MIN = 20;
export const TRAVEL_MAX = 60;

export const REQUIREMENT_LICENSE = [
  { id: "yes", label: "Yes, required" },
  { id: "no", label: "Not required" },
] as const;

export const REQUIREMENT_CAR = [
  { id: "day-one", label: "From day one" },
  { id: "weeks", label: "In a couple of weeks" },
  { id: "long-term", label: "In the long term" },
  { id: "none", label: "No company car" },
] as const;

export const EXPERIENCE_YEARS = Array.from({ length: 20 }, (_, i) => i + 1);

export const MIN_SALARY = 150;

export const COMPANIES = [
  "Enemærke & Petersen ApS",
  "Adserballe & Knudsen AC",
  "Hansson construction Aps",
  "Jorden construction AC",
  "Nordisk Byg ApS",
  "MT Højgaard A/S",
];

export const HELP: Record<string, { title: string; body: string }> = {
  role: {
    title: "Why we ask for a role",
    body: "The role tells us which skills to match. Pick the primary trade you need — you'll refine the exact tasks in the next step.",
  },
  address: {
    title: "Why we ask for an address",
    body: "We use the work address to find workers nearby. Your exact address stays private — workers only see the general area.",
  },
  travel: {
    title: "Maximum travel distance",
    body: "This is the maximum distance the employee will travel to the job. We won't consider any applicant beyond that distance.",
  },
  tasks: {
    title: "Why we ask for tasks",
    body: "Selecting the specific tasks lets us match workers who have done this kind of work before.",
  },
  license: {
    title: "Driving license requirement",
    body: "Turn this on if the worker must hold a valid driver's license — for example to drive between sites or transport materials.",
  },
  car: {
    title: "Company car",
    body: "Tell workers whether a company car is provided, and from when, so expectations are clear up front.",
  },
  experience: {
    title: "Minimum experience",
    body: "The minimum years of relevant experience required. Higher requirements narrow the pool of matched workers.",
  },
  salary: {
    title: "Why set a salary",
    body: "A clear hourly rate attracts the most qualified, best-fit workers. The range is not binding, you finalize the rate with the worker you choose.",
  },
  contact: {
    title: "Why your details?",
    body: "We need your contact details to send your candidate matches directly to you and reach out if we need any additional information.",
  },
};

export const FAQ = [
  {
    q: "Why do you ask for a role?",
    a: "The role lets our algorithm match you with workers who have the right skills for the job.",
  },
  {
    q: "Can I hire more than one role?",
    a: "Yes. Start with one job now — once your profile is created you can add as many roles as you need.",
  },
  {
    q: "What if my role isn't listed?",
    a: "Pick the closest match and chat with us. We'll make sure the right workers are found for your job.",
  },
  {
    q: "Can I change the role later?",
    a: "Of course. You can edit the role and every other detail on the review step before getting matches.",
  },
];

export const HOW_IT_WORKS = [
  { title: "Describe the role", body: "Tell us the role, tasks and requirements you need filled." },
  { title: "Get matched", body: "Our algorithm instantly matches qualified workers — usually within minutes." },
  { title: "Hire with confidence", body: "Review non-binding matches for free and only pay for approved hours." },
];

export const SALARY_STEPS = [
  "Job is analyzed",
  "Estimating the scope of the task...",
  "Comparing with 128k+ jobs...",
  "Finding rates for this role...",
  "Estimating your hourly salary...",
];
