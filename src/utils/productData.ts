// Product data to be used across the application
export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  description: string;
  features: string[];
  specifications: {
    height: string;
    weight: string;
    battery: string;
    processor: string;
    memory: string;
    connectivity: string;
    sensors: string;
  };
  stock: number;
  reviews: {
    author: string;
    date: string;
    rating: number;
    comment: string;
  }[];
  image: string;
}

// Sample categories and brands for filters
export const categories = ["Companion", "Utility", "Security", "Education", "Healthcare", "Industrial"];
export const brands = ["RoboTech", "AIMasters", "Synthia", "MechWorks", "QuantumBots"];

// Generate sample product data
export const products: Product[] = [
  {
    id: 1,
    name: "Syntho X-2000 Humanoid Assistant",
    price: 4999.99,
    rating: 4.5,
    brand: "RoboTech",
    category: "Companion",
    description: "The Syntho X-2000 is our most advanced humanoid assistant robot, designed to seamlessly integrate into your home or office environment. With advanced AI capabilities, natural language processing, and fluid movement, the X-2000 can assist with daily tasks, provide companionship, and serve as a personal assistant.",
    features: [
      "Advanced natural language processing",
      "Facial recognition and emotional response",
      "24/7 operation with quick-charging capability",
      "Adaptive learning AI system",
      "Human-like movement and gestures",
      "Voice command recognition from up to 20 feet away",
      "Multi-language support"
    ],
    specifications: {
      height: "5'7\" (170 cm)",
      weight: "165 lbs (75 kg)",
      battery: "Lithium-ion, 16 hours operation",
      processor: "Quantum Neural Processor X12",
      memory: "1 TB solid state",
      connectivity: "Wi-Fi 6, Bluetooth 5.2, 5G",
      sensors: "LiDAR, infrared, temperature, pressure, audio array"
    },
    stock: 12,
    reviews: [
      {
        author: "Alex Johnson",
        date: "April 15, 2025",
        rating: 5,
        comment: "The X-2000 has completely transformed how I manage my home office. The assistance with scheduling and communications alone is worth the investment!"
      },
      {
        author: "Maya Patel",
        date: "March 28, 2025",
        rating: 4,
        comment: "Impressive AI capabilities and very human-like interactions. Battery life could be better, but otherwise it's been a great addition to our family."
      },
      {
        author: "Carlos Rodriguez",
        date: "April 2, 2025",
        rating: 5,
        comment: "My elderly father has found a new companion in the X-2000. The robot has been helping him with medication reminders and keeping him engaged with conversation and games."
      }
    ],
    image: "/robot1.jpg"
  },
  {
    id: 2,
    name: "HomeBot Pro",
    price: 3299.99,
    rating: 4.0,
    brand: "MechWorks",
    category: "Utility",
    description: "Meet HomeBot Pro, your ultimate smart home management system. This compact utility robot integrates with all your smart devices and provides physical assistance around the house, from cleaning to cooking assistance and security monitoring.",
    features: [
      "Complete smart home integration and control",
      "Advanced object recognition and manipulation",
      "Autonomous cleaning and tidying capabilities",
      "Cooking assistance with recipe database",
      "Security monitoring and alerts",
      "Energy usage optimization",
      "Voice-controlled operation"
    ],
    specifications: {
      height: "3'6\" (107 cm)",
      weight: "85 lbs (38.5 kg)",
      battery: "Dual lithium polymer, 20 hours operation",
      processor: "HomeCore H3 Neural Engine",
      memory: "512 GB solid state",
      connectivity: "Wi-Fi 6E, Bluetooth 5.3, Zigbee, Matter",
      sensors: "360° LiDAR, thermal imaging, proximity array, microphone array"
    },
    stock: 8,
    reviews: [
      {
        author: "Sarah Williams",
        date: "April 20, 2025",
        rating: 5,
        comment: "The HomeBot Pro completely transformed our home. It handles cleaning, helps me cook, and manages all our smart devices seamlessly."
      },
      {
        author: "James Peterson",
        date: "April 5, 2025",
        rating: 3,
        rating: 3,
        comment: "Good utility robot overall, but the kitchen assistance features need improvement. Sometimes struggles with identifying ingredients correctly."
      },
      {
        author: "Emma Chen",
        date: "March 30, 2025",
        rating: 4,
        comment: "Very reliable for home management. The security features give me peace of mind when I'm away, and it integrates well with all my existing smart devices."
      }
    ],
    image: "/robot2.jpg"
  },
  {
    id: 3,
    name: "EduMate Teaching Assistant",
    price: 3799.99,
    rating: 4.8,
    brand: "Synthia",
    category: "Education",
    description: "The EduMate Teaching Assistant is designed to revolutionize education with personalized learning experiences. Using advanced AI, it adapts to each student's learning style and pace, providing custom lessons, interactive demonstrations, and real-time feedback.",
    features: [
      "Personalized curriculum development",
      "Interactive holographic displays for 3D demonstrations",
      "Real-time learning assessment and adaptation",
      "Multi-subject expertise from elementary to college level",
      "Language learning with native-level conversation practice",
      "Parent-teacher coordination and progress reporting",
      "Group and individual teaching modes"
    ],
    specifications: {
      height: "4'2\" (127 cm)",
      weight: "90 lbs (41 kg)",
      battery: "Advanced lithium-ion, 12 hours teaching time",
      processor: "Synthia Education Neural Core",
      memory: "2 TB knowledge database",
      connectivity: "Wi-Fi 6, Bluetooth 5.2, NFC, educational network protocols",
      sensors: "360° classroom awareness, emotional response detection, attention tracking"
    },
    stock: 15,
    reviews: [
      {
        author: "Dr. Robert Chen",
        date: "April 22, 2025",
        rating: 5,
        comment: "As an educator for 20 years, I'm impressed by EduMate's ability to adapt to different learning styles. The personalization capabilities are far beyond what a single human teacher can provide."
      },
      {
        author: "Lisa Montgomery",
        date: "April 10, 2025",
        rating: 5,
        comment: "My children have shown remarkable improvement in math and science since we got the EduMate. The way it presents complex concepts visually is incredible."
      },
      {
        author: "Principal Johnson",
        date: "March 25, 2025",
        rating: 4,
        comment: "We've deployed five EduMates in our elementary school. Test scores have improved by 28% on average, and student engagement is noticeably higher. Would give 5 stars but there are occasional connectivity issues."
      }
    ],
    image: "/robot3.jpg"
  },
  {
    id: 4,
    name: "Guardian Security Bot",
    price: 4599.99,
    rating: 4.7,
    brand: "QuantumBots",
    category: "Security",
    description: "The Guardian Security Bot provides enterprise-grade security with 24/7 autonomous patrol, advanced threat detection, and immediate response protocols. Ideal for businesses, large properties, and high-security environments requiring constant vigilance.",
    features: [
      "Autonomous security patrolling with obstacle avoidance",
      "Facial recognition and unauthorized personnel detection",
      "Environmental threat detection (fire, gas, water)",
      "Integration with existing security systems",
      "Two-way communication with security personnel",
      "Non-lethal deterrent capabilities",
      "Tamper-proof design with alert escalation"
    ],
    specifications: {
      height: "5'10\" (178 cm)",
      weight: "220 lbs (100 kg)",
      battery: "Military-grade power cells, 72 hour operation",
      processor: "Quantum Security Processing Unit",
      memory: "1 TB encrypted solid state",
      connectivity: "Secure Wi-Fi, private LTE, satellite backup",
      sensors: "Thermal imaging, night vision, motion detection, audio analytics, chemical sensors"
    },
    stock: 6,
    reviews: [
      {
        author: "Security Director Thomas",
        date: "April 18, 2025",
        rating: 5,
        comment: "Deployed across our corporate campus, the Guardian bots have significantly improved our security posture. The threat detection is impressively accurate with minimal false alarms."
      },
      {
        author: "Warehouse Manager Singh",
        date: "April 8, 2025",
        rating: 4,
        comment: "Excellent perimeter security and the integration with our existing systems was seamless. Only wish it had better battery life for our large facility."
      },
      {
        author: "Estate Manager Richardson",
        date: "March 15, 2025",
        rating: 5,
        comment: "We've implemented three Guardians across our client's 15-acre estate. The coordination between units is impressive, and the mobile app control gives us complete oversight."
      }
    ],
    image: "/robot4.jpg"
  },
  {
    id: 5,
    name: "MediCare Assistance Robot",
    price: 5299.99,
    rating: 4.9,
    brand: "AIMasters",
    category: "Healthcare",
    description: "The MediCare Assistance Robot is designed for healthcare facilities and home care, providing patient monitoring, medication management, mobility assistance, and companionship. Its advanced medical sensors and gentle handling capabilities make it ideal for elderly and recovering patients.",
    features: [
      "Continuous vital signs monitoring",
      "Medication schedule management and reminders",
      "Mobility assistance with adaptive support",
      "Fall detection and emergency response",
      "Remote doctor consultation facilitation",
      "Diet and exercise tracking",
      "Cognitive stimulation activities"
    ],
    specifications: {
      height: "5'4\" (163 cm)",
      weight: "140 lbs (63.5 kg)",
      battery: "Medical-grade power system, 16 hours operation",
      processor: "AIMasters Medical Neural Processor",
      memory: "2 TB medical database and patient records",
      connectivity: "HIPAA-compliant secure networks, emergency services integration",
      sensors: "Medical-grade vitals monitoring, position tracking, environment assessment"
    },
    stock: 9,
    reviews: [
      {
        author: "Dr. Martinez",
        date: "April 25, 2025",
        rating: 5,
        comment: "The MediCare robots have transformed our nursing home. Staff are now able to focus on higher-level care while the robots handle routine monitoring and assistance. Patient satisfaction has increased dramatically."
      },
      {
        author: "Home Care Specialist Wong",
        date: "April 12, 2025",
        rating: 5,
        comment: "I've prescribed MediCare robots to several elderly patients living independently. The combination of medical monitoring and companionship features has allowed many to safely remain in their homes longer."
      },
      {
        author: "Rehabilitation Center Director",
        date: "March 22, 2025",
        rating: 4,
        comment: "Excellent for patient monitoring and consistent therapy reminders. The mobility assistance features are particularly valuable for our recovering stroke patients."
      }
    ],
    image: "/robot5.jpg"
  },
  {
    id: 6,
    name: "IndustriBot Heavy Lifter",
    price: 7999.99,
    rating: 4.6,
    brand: "MechWorks",
    category: "Industrial",
    description: "The IndustriBot Heavy Lifter is engineered for manufacturing, warehousing, and construction environments, capable of safely lifting and transporting up to 2000 lbs while navigating complex workspaces autonomously. Its modular design allows for customization based on specific industrial needs.",
    features: [
      "Safe lifting capacity of up to 2000 lbs (907 kg)",
      "Precision manipulation for delicate assembly tasks",
      "Autonomous navigation in dynamic work environments",
      "Human worker safety protocols with proximity adjustments",
      "Modular attachment system for different tasks",
      "Integration with production management systems",
      "Remote and programmed operation modes"
    ],
    specifications: {
      height: "6'2\" (188 cm) - extendable to 8'",
      weight: "550 lbs (250 kg) base configuration",
      battery: "Industrial power system, hot-swappable for 24/7 operation",
      processor: "MechWorks Industrial Logic Engine",
      memory: "1 TB industrial operations database",
      connectivity: "Industrial IoT protocols, secure facility network integration",
      sensors: "Weight distribution, structural integrity, human presence detection, environmental hazard detection"
    },
    stock: 4,
    reviews: [
      {
        author: "Manufacturing Director Zhang",
        date: "April 16, 2025",
        rating: 5,
        comment: "We've integrated six IndustriBots into our production line and seen a 35% increase in efficiency. The ability to work continuously alongside human workers without safety incidents has been impressive."
      },
      {
        author: "Warehouse Operations Manager",
        date: "April 3, 2025",
        rating: 4,
        comment: "Great for our high-volume warehouse. The autonomous navigation is excellent even in our constantly changing environment. Only drawback is the initial programming complexity."
      },
      {
        author: "Construction Foreman Patel",
        date: "March 18, 2025",
        rating: 5,
        comment: "The IndustriBot has revolutionized how we handle heavy materials on our construction sites. Workplace injuries are down and we're completing projects ahead of schedule."
      }
    ],
    image: "/robot6.jpg"
  }
];

// Function to get product by id
export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}

// Function to get related products (excluding the current product)
export function getRelatedProducts(productId: number, limit: number = 3): Product[] {
  return products
    .filter(product => product.id !== productId)
    .slice(0, limit);
}