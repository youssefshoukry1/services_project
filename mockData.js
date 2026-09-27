export const mockData = {
  categories: [
    { 
      id: "painters", 
      title: "Painting & Decorating", 
      icon: "🖌️" 
    },
    { 
      id: "cleaning", 
      title: "Cleaning Services", 
      icon: "🧹" 
    },
    { 
      id: "auto_repair", 
      title: "Auto Repair & Maintenance", 
      icon: "🚗" 
    }
  ],
  
  companies: [
    // ==========================================
    // 1. Painters (5 Companies)
    // ==========================================
    {
      id: "comp-p1",
      categoryId: "painters",
      name: "ColorPro Painters",
      logo: "/images/logos/colorpro.webp",
      shortDesc: "Expert interior and exterior painting services for residential properties.",
      address: "123 Main St, Giza",
      phone: "+20 101 111 1111",
      email: "contact@colorpro.com",
      website: "https://colorpro.example.com",
      prices: [
        { service: "Interior Wall Painting", price: "$10 / sqm" },
        { service: "Exterior Facade Painting", price: "$15 / sqm" },
        { service: "Wood Staining", price: "$8 / sqm" }
      ]
    },
    {
      id: "comp-p2",
      categoryId: "painters",
      name: "Brush & Roll Studio",
      logo: "/images/logos/brushroll.webp",
      shortDesc: "Modern decorative paints and high-quality wallpaper installation.",
      address: "45 Nile St, Cairo",
      phone: "+20 102 222 2222",
      email: "info@brushroll.com",
      website: "https://brushroll.example.com",
      prices: [
        { service: "Decorative Painting", price: "$20 / sqm" },
        { service: "Wallpaper Installation", price: "$12 / roll" }
      ]
    },
    {
      id: "comp-p3",
      categoryId: "painters",
      name: "Elite Wall Coatings",
      logo: "/images/logos/elitewalls.webp",
      shortDesc: "Premium commercial and industrial painting solutions.",
      address: "78 Maadi, Cairo",
      phone: "+20 103 333 3333",
      email: "sales@elitewalls.com",
      website: "https://elitewalls.example.com",
      prices: [
        { service: "Commercial Office Painting", price: "$12 / sqm" },
        { service: "Industrial Epoxy Coating", price: "$25 / sqm" }
      ]
    },
    {
      id: "comp-p4",
      categoryId: "painters",
      name: "QuickCoat Services",
      logo: "/images/logos/quickcoat.webp",
      shortDesc: "Fast, reliable, and affordable painting services for quick move-ins.",
      address: "90 Dokki, Giza",
      phone: "+20 104 444 4444",
      email: "support@quickcoat.com",
      website: "https://quickcoat.example.com",
      prices: [
        { service: "Basic Repainting", price: "$7 / sqm" },
        { service: "Ceiling Painting", price: "$9 / sqm" }
      ]
    },
    {
      id: "comp-p5",
      categoryId: "painters",
      name: "Artistic Finishes",
      logo: "/images/logos/artistic.webp",
      shortDesc: "Custom wall murals and artistic hand-painted designs for unique spaces.",
      address: "12 Zamalek, Cairo",
      phone: "+20 105 555 5555",
      email: "hello@artisticfinishes.com",
      website: "https://artisticfinishes.example.com",
      prices: [
        { service: "Custom Wall Murals", price: "Starts at $150" },
        { service: "Faux Finishes", price: "$30 / sqm" }
      ]
    },

    // ==========================================
    // 2. Cleaning Services (5 Companies)
    // ==========================================
    {
      id: "comp-c1",
      categoryId: "cleaning",
      name: "Sparkle Cleaners",
      logo: "/images/logos/sparkle.webp",
      shortDesc: "Deep home and office cleaning with a 100% satisfaction guarantee.",
      address: "34 Mohandeseen, Giza",
      phone: "+20 111 111 1111",
      email: "booking@sparkle.com",
      website: "https://sparkle.example.com",
      prices: [
        { service: "Deep Home Cleaning", price: "$50 / visit" },
        { service: "Move-in / Move-out Cleaning", price: "$80 / visit" }
      ]
    },
    {
      id: "comp-c2",
      categoryId: "cleaning",
      name: "Crystal Clear Glass",
      logo: "/images/logos/crystalclear.webp",
      shortDesc: "Professional window and glass facade cleaning experts.",
      address: "55 Heliopolis, Cairo",
      phone: "+20 112 222 2222",
      email: "info@crystalclear.com",
      website: "https://crystalclear.example.com",
      prices: [
        { service: "Residential Window Cleaning", price: "$40 / visit" },
        { service: "Commercial Facade Cleaning", price: "$120 / visit" }
      ]
    },
    {
      id: "comp-c3",
      categoryId: "cleaning",
      name: "EcoClean Homes",
      logo: "/images/logos/ecoclean.webp",
      shortDesc: "Using only environmentally friendly and non-toxic cleaning products.",
      address: "88 Nasr City, Cairo",
      phone: "+20 113 333 3333",
      email: "contact@ecoclean.com",
      website: "https://ecoclean.example.com",
      prices: [
        { service: "Eco-friendly Standard Clean", price: "$60 / visit" },
        { service: "Carpet & Upholstery Wash", price: "$35 / item" }
      ]
    },
    {
      id: "comp-c4",
      categoryId: "cleaning",
      name: "Maid for You",
      logo: "/images/logos/maidforyou.webp",
      shortDesc: "Reliable daily, weekly, and monthly maid services tailored to your needs.",
      address: "21 6th of October, Giza",
      phone: "+20 114 444 4444",
      email: "support@maidforyou.com",
      website: "https://maidforyou.example.com",
      prices: [
        { service: "Weekly Maintenance", price: "$30 / visit" },
        { service: "Monthly Subscription", price: "$100 / month" }
      ]
    },
    {
      id: "comp-c5",
      categoryId: "cleaning",
      name: "Prime Janitorial",
      logo: "/images/logos/primejanitorial.webp",
      shortDesc: "Heavy-duty industrial and post-construction cleaning services.",
      address: "99 Obour City, Cairo",
      phone: "+20 115 555 5555",
      email: "sales@primejanitorial.com",
      website: "https://primejanitorial.example.com",
      prices: [
        { service: "Post-Construction Clean", price: "$150 / visit" },
        { service: "Warehouse Cleaning", price: "$200 / visit" }
      ]
    },

    // ==========================================
    // 3. Auto Repair & Maintenance (5 Companies)
    // ==========================================
    {
      id: "comp-a1",
      categoryId: "auto_repair",
      name: "Speedy Auto Fix",
      logo: "/images/logos/speedyauto.webp",
      shortDesc: "General mechanics, quick oil changes, and regular maintenance.",
      address: "10 Haram St, Giza",
      phone: "+20 121 111 1111",
      email: "info@speedyauto.com",
      website: "https://speedyauto.example.com",
      prices: [
        { service: "Full Oil Change & Filter", price: "$30" },
        { service: "Brake Pad Replacement", price: "$45" }
      ]
    },
    {
      id: "comp-a2",
      categoryId: "auto_repair",
      name: "Gearbox Gurus",
      logo: "/images/logos/gearboxgurus.webp",
      shortDesc: "Specialists in manual and automatic transmission overhauls.",
      address: "20 Faisal St, Giza",
      phone: "+20 122 222 2222",
      email: "support@gearboxgurus.com",
      website: "https://gearboxgurus.example.com",
      prices: [
        { service: "Transmission Diagnostics", price: "$50" },
        { service: "Clutch Replacement", price: "$180" }
      ]
    },
    {
      id: "comp-a3",
      categoryId: "auto_repair",
      name: "Tire & Track",
      logo: "/images/logos/tiretrack.webp",
      shortDesc: "Wheel alignment, balancing, and premium tire replacements.",
      address: "30 New Cairo, Cairo",
      phone: "+20 123 333 3333",
      email: "sales@tiretrack.com",
      website: "https://tiretrack.example.com",
      prices: [
        { service: "Computerized Wheel Alignment", price: "$25" },
        { service: "Tire Rotation & Balancing", price: "$20" }
      ]
    },
    {
      id: "comp-a4",
      categoryId: "auto_repair",
      name: "Auto Body Masters",
      logo: "/images/logos/autobody.webp",
      shortDesc: "Professional dent repair, painting, and collision restoration.",
      address: "40 Sheikh Zayed, Giza",
      phone: "+20 124 444 4444",
      email: "contact@autobodymasters.com",
      website: "https://autobodymasters.example.com",
      prices: [
        { service: "Minor Dent Repair", price: "Starts at $40" },
        { service: "Full Car Painting", price: "Starts at $400" }
      ]
    },
    {
      id: "comp-a5",
      categoryId: "auto_repair",
      name: "ElectroCar Clinic",
      logo: "/images/logos/electrocar.webp",
      shortDesc: "Advanced computer diagnostics and car electrical system repairs.",
      address: "50 Shoubra, Cairo",
      phone: "+20 125 555 5555",
      email: "hello@electrocar.com",
      website: "https://electrocar.example.com",
      prices: [
        { service: "Full System Diagnostics", price: "$35" },
        { service: "Battery & Alternator Check", price: "$15" }
      ]
    }
  ]
};
