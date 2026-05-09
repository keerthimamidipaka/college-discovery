import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.college.deleteMany();

  const colleges = [
    // IITs
    { name: "IIT Bombay", location: "Mumbai", state: "Maharashtra", fees: 250000, rating: 4.8, courses: ["B.Tech", "M.Tech", "PhD", "MBA"], placement: 28, established: 1958, description: "Premier engineering institute known for cutting-edge research and top placements.", imageUrl: null, jeeRank: 1500, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "IIT Delhi", location: "New Delhi", state: "Delhi", fees: 230000, rating: 4.7, courses: ["B.Tech", "M.Tech", "PhD"], placement: 26, established: 1961, description: "Top-ranked engineering college with strong industry connections in the capital.", imageUrl: null, jeeRank: 2000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "IIT Madras", location: "Chennai", state: "Tamil Nadu", fees: 220000, rating: 4.9, courses: ["B.Tech", "M.Tech", "PhD", "MBA"], placement: 30, established: 1959, description: "Ranked #1 in India for engineering, known for innovation and research output.", imageUrl: null, jeeRank: 1000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "IIT Kanpur", location: "Kanpur", state: "Uttar Pradesh", fees: 220000, rating: 4.7, courses: ["B.Tech", "M.Tech", "PhD"], placement: 25, established: 1959, description: "Known for strong research culture and excellent faculty.", imageUrl: null, jeeRank: 2500, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "IIT Kharagpur", location: "Kharagpur", state: "West Bengal", fees: 210000, rating: 4.6, courses: ["B.Tech", "M.Tech", "PhD", "MBA"], placement: 24, established: 1951, description: "India's oldest IIT with a sprawling campus and diverse programs.", imageUrl: null, jeeRank: 3000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "IIT Roorkee", location: "Roorkee", state: "Uttarakhand", fees: 215000, rating: 4.5, courses: ["B.Tech", "M.Tech", "PhD"], placement: 22, established: 1847, description: "One of the oldest technical institutions in Asia.", imageUrl: null, jeeRank: 4000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "IIT Hyderabad", location: "Hyderabad", state: "Telangana", fees: 215000, rating: 4.4, courses: ["B.Tech", "M.Tech", "PhD"], placement: 22, established: 2008, description: "New-generation IIT with rapid growth in research and startup culture.", imageUrl: null, jeeRank: 8000, eamcetRank: 5000, bitsatScore: null, wbjeeRank: null },
    { name: "IIT Guwahati", location: "Guwahati", state: "Assam", fees: 210000, rating: 4.3, courses: ["B.Tech", "M.Tech", "PhD"], placement: 20, established: 1994, description: "Premier IIT in Northeast India with strong placements.", imageUrl: null, jeeRank: 6000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },

    // NITs
    { name: "NIT Trichy", location: "Tiruchirappalli", state: "Tamil Nadu", fees: 145000, rating: 4.3, courses: ["B.Tech", "M.Tech", "MBA"], placement: 14, established: 1964, description: "One of the best NITs with excellent placements in core engineering sectors.", imageUrl: null, jeeRank: 15000, eamcetRank: 25000, bitsatScore: null, wbjeeRank: null },
    { name: "NIT Warangal", location: "Warangal", state: "Telangana", fees: 140000, rating: 4.2, courses: ["B.Tech", "M.Tech", "MBA"], placement: 13, established: 1959, description: "Top NIT in South India with strong industry connections.", imageUrl: null, jeeRank: 18000, eamcetRank: 15000, bitsatScore: null, wbjeeRank: null },
    { name: "NIT Surathkal", location: "Mangalore", state: "Karnataka", fees: 142000, rating: 4.1, courses: ["B.Tech", "M.Tech"], placement: 12, established: 1960, description: "Premier NIT on the west coast known for IT placements.", imageUrl: null, jeeRank: 20000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "NIT Calicut", location: "Kozhikode", state: "Kerala", fees: 138000, rating: 4.0, courses: ["B.Tech", "M.Tech", "MBA"], placement: 11, established: 1961, description: "Leading NIT in Kerala with strong alumni network.", imageUrl: null, jeeRank: 22000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },

    // BITS
    { name: "BITS Pilani", location: "Pilani", state: "Rajasthan", fees: 520000, rating: 4.5, courses: ["B.Tech", "M.Tech", "MBA", "MCA"], placement: 18, established: 1964, description: "Autonomous institution renowned for its practice school and industry internships.", imageUrl: null, jeeRank: null, eamcetRank: null, bitsatScore: 340, wbjeeRank: null },
    { name: "BITS Hyderabad", location: "Hyderabad", state: "Telangana", fees: 490000, rating: 4.3, courses: ["B.Tech", "M.Tech"], placement: 16, established: 2008, description: "BITS campus in Hyderabad with strong tech placements.", imageUrl: null, jeeRank: null, eamcetRank: 8000, bitsatScore: 320, wbjeeRank: null },
    { name: "BITS Goa", location: "Goa", state: "Goa", fees: 490000, rating: 4.2, courses: ["B.Tech", "M.Tech"], placement: 15, established: 2004, description: "BITS campus in Goa with scenic location and good placements.", imageUrl: null, jeeRank: null, eamcetRank: null, bitsatScore: 315, wbjeeRank: null },

    // Private Universities
    { name: "VIT Vellore", location: "Vellore", state: "Tamil Nadu", fees: 200000, rating: 4.1, courses: ["B.Tech", "M.Tech", "MBA", "MCA"], placement: 12, established: 1984, description: "Large private university known for its diverse student body and IT placements.", imageUrl: null, jeeRank: 50000, eamcetRank: 80000, bitsatScore: 290, wbjeeRank: null },
    { name: "SRM Institute of Science and Technology", location: "Chennai", state: "Tamil Nadu", fees: 300000, rating: 3.9, courses: ["B.Tech", "M.Tech", "MBA", "MCA", "BCA"], placement: 10, established: 1985, description: "Large private engineering university with a vast alumni network.", imageUrl: null, jeeRank: 100000, eamcetRank: 150000, bitsatScore: 260, wbjeeRank: null },
    { name: "Manipal Institute of Technology", location: "Manipal", state: "Karnataka", fees: 420000, rating: 4.0, courses: ["B.Tech", "M.Tech", "MBA"], placement: 13, established: 1957, description: "Reputed private institute known for international collaborations.", imageUrl: null, jeeRank: null, eamcetRank: null, bitsatScore: 300, wbjeeRank: null },
    { name: "Amrita Vishwa Vidyapeetham", location: "Coimbatore", state: "Tamil Nadu", fees: 180000, rating: 3.9, courses: ["B.Tech", "M.Tech", "MBA"], placement: 10, established: 1994, description: "Multi-campus university with strong focus on research.", imageUrl: null, jeeRank: null, eamcetRank: 100000, bitsatScore: null, wbjeeRank: null },
    { name: "Thapar Institute of Engineering", location: "Patiala", state: "Punjab", fees: 350000, rating: 4.0, courses: ["B.Tech", "M.Tech", "MBA"], placement: 12, established: 1956, description: "Deemed university known for engineering excellence in North India.", imageUrl: null, jeeRank: 30000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },

    // State Universities
    { name: "Jadavpur University", location: "Kolkata", state: "West Bengal", fees: 25000, rating: 4.2, courses: ["B.Tech", "M.Tech", "BA", "MA"], placement: 11, established: 1906, description: "Premier state university with strong engineering and arts programs.", imageUrl: null, jeeRank: null, eamcetRank: null, bitsatScore: null, wbjeeRank: 10000 },
    { name: "Delhi Technological University", location: "New Delhi", state: "Delhi", fees: 160000, rating: 4.0, courses: ["B.Tech", "M.Tech", "MBA"], placement: 12, established: 1941, description: "Top state technical university in Delhi with strong industry ties.", imageUrl: null, jeeRank: 25000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "Anna University", location: "Chennai", state: "Tamil Nadu", fees: 50000, rating: 3.9, courses: ["B.Tech", "M.Tech", "MBA", "MCA"], placement: 9, established: 1978, description: "Premier state technical university in Tamil Nadu.", imageUrl: null, jeeRank: null, eamcetRank: 50000, bitsatScore: null, wbjeeRank: null },
    { name: "Osmania University", location: "Hyderabad", state: "Telangana", fees: 30000, rating: 3.7, courses: ["B.Tech", "MBA", "BA", "MA", "MCA"], placement: 8, established: 1918, description: "One of the oldest universities in South India with diverse programs.", imageUrl: null, jeeRank: null, eamcetRank: 80000, bitsatScore: null, wbjeeRank: null },
    { name: "Pune Institute of Computer Technology", location: "Pune", state: "Maharashtra", fees: 120000, rating: 3.8, courses: ["B.Tech", "M.Tech"], placement: 9, established: 1983, description: "Well-known engineering college in Pune with strong IT placements.", imageUrl: null, jeeRank: null, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "PSG College of Technology", location: "Coimbatore", state: "Tamil Nadu", fees: 110000, rating: 3.9, courses: ["B.Tech", "M.Tech", "MBA"], placement: 10, established: 1951, description: "Reputed autonomous college in Tamil Nadu with industry connections.", imageUrl: null, jeeRank: null, eamcetRank: 60000, bitsatScore: null, wbjeeRank: null },
    { name: "College of Engineering Pune", location: "Pune", state: "Maharashtra", fees: 95000, rating: 4.0, courses: ["B.Tech", "M.Tech"], placement: 11, established: 1854, description: "One of the oldest engineering colleges in Asia.", imageUrl: null, jeeRank: null, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "RV College of Engineering", location: "Bangalore", state: "Karnataka", fees: 130000, rating: 3.9, courses: ["B.Tech", "M.Tech", "MBA"], placement: 10, established: 1963, description: "Top private engineering college in Bangalore.", imageUrl: null, jeeRank: null, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "PES University", location: "Bangalore", state: "Karnataka", fees: 280000, rating: 3.8, courses: ["B.Tech", "M.Tech", "MBA"], placement: 11, established: 1972, description: "Leading private university in Bangalore with strong tech placements.", imageUrl: null, jeeRank: null, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
    { name: "Birla Institute of Technology Mesra", location: "Ranchi", state: "Jharkhand", fees: 230000, rating: 3.8, courses: ["B.Tech", "M.Tech", "MBA", "MCA"], placement: 10, established: 1955, description: "Deemed university with strong engineering programs.", imageUrl: null, jeeRank: 40000, eamcetRank: null, bitsatScore: null, wbjeeRank: null },
  ];

  for (const college of colleges) {
    await prisma.college.create({ data: college });
  }

  console.log(`✅ Seeded ${colleges.length} colleges successfully!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());