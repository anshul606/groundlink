import { DemoData } from "@/types";

export const demoData: DemoData = {
  sampleReports: [
    "Visited rural village in Kisumu County. Water well broken for 3 weeks. 450 people affected, mostly women and children walking 5km daily for water. Urgent repair needed. Community has basic tools but needs pump parts and technical expertise.",

    "Health clinic in Nairobi slum reports medicine shortage. 200 families affected. Need antibiotics, antimalarials, and basic first aid supplies. Clinic has 2 nurses but no doctor. Situation critical for children under 5.",

    "School in Mombasa damaged by recent floods. 300 students without classrooms. Temporary shelter needed urgently. Community willing to help rebuild but needs materials and construction guidance.",

    "Elderly care center in Nakuru needs volunteers. 45 elderly residents, many bedridden. Need medical checkups, food preparation help, and companionship. Center understaffed with only 3 caregivers.",
  ],

  sampleVolunteers: [
    {
      id: "v1",
      name: "Sarah Kimani",
      skills: ["medical", "nursing", "first aid"],
      location: "Nairobi",
      availability: true,
    },
    {
      id: "v2",
      name: "John Omondi",
      skills: ["construction", "carpentry", "plumbing"],
      location: "Mombasa",
      availability: true,
    },
    {
      id: "v3",
      name: "Grace Wanjiru",
      skills: ["teaching", "childcare", "counseling"],
      location: "Kisumu",
      availability: false,
    },
    {
      id: "v4",
      name: "David Mutua",
      skills: ["water systems", "engineering", "technical repair"],
      location: "Kisumu",
      availability: true,
    },
    {
      id: "v5",
      name: "Mary Achieng",
      skills: ["elderly care", "nursing", "cooking"],
      location: "Nakuru",
      availability: true,
    },
    {
      id: "v6",
      name: "Peter Kamau",
      skills: ["medical", "doctor", "emergency response"],
      location: "Nairobi",
      availability: false,
    },
    {
      id: "v7",
      name: "Lucy Njeri",
      skills: ["construction", "project management", "logistics"],
      location: "Mombasa",
      availability: true,
    },
    {
      id: "v8",
      name: "James Otieno",
      skills: ["teaching", "mentoring", "sports coaching"],
      location: "Nakuru",
      availability: true,
    },
  ],
};
