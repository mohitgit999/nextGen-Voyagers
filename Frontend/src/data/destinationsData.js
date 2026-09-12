// Frontend/src/data/destinationsData.js
// Comprehensive destination knowledge base: Photos, Culture, Why Visit, Food, Attractions, Safety, Weather, Transport

export const DESTINATIONS_DATA = {
  manali: {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    heroImage: '/img/manali.jpg',
    tagline: 'Gateway to the High Himalayas, Cedar Forests & Alpine Adventures',
    tags: ['mountain', 'adventure', 'snow', 'nature'],
    rating: 4.5,
    reviews: 12400,
    safetyScore: 4.4,
    idealDuration: '4–6 Days',
    budgetPerDay: { budget: '₹1,400', mid: '₹3,200', luxury: '₹7,500' },
    bestSeason: 'Oct – Jun',
    overview: 'Nestled at 2,050 meters along the banks of the roaring Beas River, Manali is a magnetic mountain sanctuary in the Kullu Valley. Once a tranquil Himalayan trade outpost, it has evolved into India’s ultimate hub for high-altitude thrills, pine-scented serenity, bohemian Old Manali cafés, and legendary high mountain passes leading to Spiti and Ladakh.',
    
    gallery: [
      { url: '/img/manali.jpg', caption: 'Snow-clad Pir Panjal peaks rising over the Solang Valley', tag: 'Landscape' },
      { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', caption: 'Ancient wooden architecture of Hidimba Devi Temple amid sacred deodar groves', tag: 'Heritage' },
      { url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80', caption: 'Scenic wooden river chalets and cedar forests of Old Manali', tag: 'Architecture' },
      { url: 'https://images.unsplash.com/photo-1579618218290-24a26f634568?auto=format&fit=crop&w=1200&q=80', caption: 'White-water rapids rushing along the pristine Beas riverbed', tag: 'Adventure' },
      { url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80', caption: 'Rohtang Pass high alpine vistas shrouded in morning mist', tag: 'Panoramas' }
    ],

    whyVisit: [
      {
        title: 'Thrilling Himalayan Adventure',
        description: 'Paragliding 1,000 feet above Solang Valley, Grade-IV white-water rafting on the Beas, downhill mountain biking, and skiing in winter.',
        icon: '🪂'
      },
      {
        title: 'Old Manali Bohemian Vibe',
        description: 'Wander through cobblestone village lanes filled with live acoustic music, artisan bakeries, apple orchard retreats, and vibrant international traveler cafés.',
        icon: '☕'
      },
      {
        title: 'Spectacular High Mountain Passes',
        description: 'Ascend the legendary Rohtang Pass (3,978m) and drive through the engineering marvel of Atal Tunnel into Lahaul’s surreal lunar landscapes.',
        icon: '🏔️'
      },
      {
        title: 'Thermal Springs & Healing Groves',
        description: 'Soak in the natural sulfur hot springs of Vashisht and hike through ancient thousand-year-old deodar sanctuaries at Van Vihar.',
        icon: '♨️'
      }
    ],

    culture: {
      summary: 'Manali boasts a rich blend of ancient Kulluvi folk culture, Vedic mythology, and Tibetan Buddhist traditions that coexist harmoniously in wooden pagoda sanctuaries and mountain hamlets.',
      history: 'Named after the legendary Hindu sage Manu, who is believed to have recreated human life here after a great flood (Manu-Alaya, meaning "Abode of Manu"). The town was historically a crucial trading stop on ancient caravans crossing the Himalayas into Central Asia.',
      traditions: 'Kulluvi women weave world-renowned intricate geometric shawls on traditional wooden handlooms. Villages still govern local affairs through democratic councils headed by local deities (Devtas).',
      festivals: [
        { name: 'Manali Winter Carnival', timing: 'January', description: 'Spectacular 5-day mountain festival with folk dances, street plays, skiing competitions, and local food fairs.' },
        { name: 'Kullu Dussehra', timing: 'October', description: 'World-famous week-long festival where over 200 village deities are brought to the valley in elaborate palanquins.' },
        { name: 'Hadimba Temple Fair (Saroohni)', timing: 'May', description: 'Traditional celebration celebrating Goddess Hadimba with folk instruments, colorful Kulluvi caps, and local dances.' }
      ],
      etiquette: [
        'Dress modestly when visiting temples; remove shoes and leather accessories before stepping into sanctums.',
        'Always obtain an Rohtang Pass permit online in advance through HP tourism portal.',
        'Respect mountain ecology: Himachal has a strict ban on single-use plastic bags and littering.'
      ],
      language: {
        primary: 'Hindi & Kulluvi (Pahari)',
        phrases: [
          { phrase: 'Namaste', meaning: 'Hello / Respectful Greeting' },
          { phrase: 'Kullu kede jaana?', meaning: 'How do I reach Kullu?' },
          { phrase: 'Dhanvaad', meaning: 'Thank you' }
        ]
      }
    },

    cuisine: {
      summary: 'Himachali mountain cuisine is hearty, warming, and crafted with slow-cooked lentils, whole spices, fermented dough, and fresh river catch.',
      signatureDishes: [
        { name: 'Siddu with Ghee', type: 'veg', description: 'Steamed fermented wheat bun stuffed with crushed walnuts, poppy seeds, and local spices, drenched in warm desi ghee.' },
        { name: 'Himachali Dham', type: 'veg', description: 'Traditional festive multi-course feast featuring Madra (chickpeas in yogurt gravy), Sepu Vadi, Khatta, and sweet rice.' },
        { name: 'Tawa Himalayan Trout', type: 'non-veg', description: 'Freshly caught river trout pan-seared with crushed garlic, coriander seeds, lemon, and mountain butter.' },
        { name: 'Babru', type: 'veg', description: 'Deep-fried golden pastry stuffed with soaked black gram dal, comparable to a Himalayan kachori.' }
      ],
      famousFoodSpots: [
        { name: 'Cafe 1947', specialty: 'Italian pasta, wood-fired pizza & river-side craft coffee', location: 'Old Manali near Bridge' },
        { name: 'Chopsticks Restaurant', specialty: 'Steaming Tibetan momos, Thukpa & Gyathuk', location: 'Mall Road' },
        { name: 'Drifter’s Cafe', specialty: 'Mountain breakfasts, homemade waffles & acoustic nights', location: 'Manu Temple Road' }
      ],
      localBeverages: ['Lugdi (traditional fermented rice brew)', 'Spiced Apple Cider', 'Chha Gosht herbal teas', 'Seabuckthorn berry juice']
    },

    attractions: [
      { name: 'Hadimba Devi Temple', category: 'Heritage', description: 'Unique 16th-century four-tiered pagoda temple constructed around a natural cave sanctuary deep in deodar woods.', bestTime: 'Morning 8 AM – 11 AM', insiderTip: 'Visit early to avoid tourist queues and explore the tranquil cedar walking trail behind the temple.' },
      { name: 'Solang Valley', category: 'Adventure', description: 'Spectacular alpine bowl renowned for paragliding, zorbing, ATV quad rides, and winter ski slopes.', bestTime: 'Early morning for best flight thermal winds', insiderTip: 'Book paragliding only with licensed pilots carrying certified tandem equipment.' },
      { name: 'Jogini Waterfalls', category: 'Nature & Trekking', description: 'Enchanting cascade tumbling down granite cliffs into natural pools, reached via a 45-minute pine trail from Vashisht.', bestTime: 'Late afternoon for golden hour photography', insiderTip: 'Wear sturdy grippy sneakers as trail stones near the spray are naturally slippery.' },
      { name: 'Atal Tunnel & Sissu', category: 'Scenic Drive', description: 'The world’s longest highway tunnel above 10,000 feet, opening into Lahaul Valley’s turquoise waterfalls and willow groves.', bestTime: 'Mid-morning day trip', insiderTip: 'Pack warm thermal windbreakers because the Lahaul side is significantly colder and windier than Manali.' },
      { name: 'Old Manali Village & Manu Temple', category: 'Culture', description: 'Atmospheric stone-and-timber village with vibrant street art, live music joints, and the ancient stone shrine of Sage Manu.', bestTime: 'Late afternoon & evening', insiderTip: 'Rent a bicycle or walk on foot as car roads here are extremely narrow.' }
    ],

    weather: {
      overview: 'Manali experiences four crisp mountain seasons, ranging from snowy sub-zero winters to pleasantly refreshing alpine summers.',
      bestMonths: ['Oct', 'Nov', 'Mar', 'Apr', 'May', 'Jun'],
      temperature: { min: -7, max: 28 },
      seasons: [
        { name: 'Summer (Mar – Jun)', months: 'March to June', tempRange: '10°C to 25°C', highlights: 'Blooming apple orchards, open mountain passes, rafting and paragliding in full swing.', advice: 'Light woollens for evenings; ideal for families and trekking.' },
        { name: 'Monsoon (Jul – Sep)', months: 'July to September', tempRange: '15°C to 24°C', highlights: 'Emerald green valleys, dramatic cloud formations, lowest hotel tariffs.', advice: 'Be cautious of heavy rainfall landslides; check highway advisories before travel.' },
        { name: 'Winter & Snow (Oct – Feb)', months: 'October to February', tempRange: '-7°C to 12°C', highlights: 'Snowfall in town from late Dec, skiing in Solang, hot sulfur spring soaks.', advice: 'Heavy thermal parkas, insulated waterproof snow boots, and moisturizers are essential.' }
      ]
    },

    safety: {
      score: 4.4,
      womenTravelerNote: 'Manali has a welcoming, respectful mountain hospitality culture with prominent tourist police outposts and verified homestays across Old Manali and Aleo.',
      tips: [
        'Acclimatize for at least 24 hours before driving up to Rohtang Pass or beyond to prevent altitude sickness (AMS).',
        'Avoid self-driving fast on narrow mountain curves; hire experienced local hill taxi drivers during snow or rains.',
        'Drink only filtered or bottled water; keep hydration high due to dry mountain air.'
      ],
      emergencyContacts: {
        police: '01902-252340 / 112',
        hospital: 'Civil Hospital Manali: 01902-252379',
        touristHelpline: 'HP Tourism Helpdesk: 0177-2625320'
      }
    },

    transport: {
      air: { title: 'Nearest Airport', airport: 'Kullu-Manali Airport, Bhuntar (KUU)', distance: '50 km (~1.5 hours drive)', details: 'Daily Alliance Air flights from Delhi and Chandigarh.' },
      train: { title: 'Nearest Railhead', station: 'Chandigarh / Ambala Cantt', details: '~8 hours scenic drive via Kiratpur-Manali four-lane highway.' },
      road: { title: 'By Highway', highways: 'NH-3 via Mandi & Kullu', details: 'Overnight semi-sleeper luxury Volvo buses depart daily from Delhi ISBT Kashmiri Gate (~12 hours).' },
      localCommute: ['Local government and private auto-rickshaws', 'Self-drive Royal Enfield / scooter rentals (₹800–₹1,500/day)', 'Himachal Road Transport (HRTC) electric mountain buses']
    }
  },

  goa: {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    country: 'India',
    heroImage: '/img/goa.jpg',
    tagline: 'Sun-Soaked Arabian Coastlines, Portuguese Heritage & Laidback Coastal Soul',
    tags: ['beach', 'coastal', 'nightlife', 'heritage'],
    rating: 4.3,
    reviews: 21800,
    safetyScore: 4.1,
    idealDuration: '4–7 Days',
    budgetPerDay: { budget: '₹1,200', mid: '₹2,800', luxury: '₹7,000' },
    bestSeason: 'Nov – Mar',
    overview: 'India’s coastal jewel stretches along 160 kilometers of Arabian Sea shorelines. A captivating fusion of centuries-old Portuguese baroque architecture, swaying coconut groves, electric beach flea markets, tranquil backwater estuaries, and Michelin-worthy seaside dining.',
    
    gallery: [
      { url: '/img/goa.jpg', caption: 'Golden crescent sands of Palolem Beach framed by tropical palms', tag: 'Beach' },
      { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', caption: 'Sunset silhouettes over Vagator cliffs and rocky Arabian tide pools', tag: 'Coast' },
      { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', caption: 'Historic Portuguese colonial facades and pastel villas of Fontainhas, Panaji', tag: 'Heritage' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', caption: 'Crystal turquoise waters and scuba diving reef sites near Grand Island', tag: 'Marine' },
      { url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80', caption: 'Spectacular tiered torrents of Dudhsagar Waterfall crashing through the jungle', tag: 'Nature' }
    ],

    whyVisit: [
      {
        title: 'Two Distinct Worlds: North & South',
        description: 'Enjoy high-energy beach parties, watersports, and beach clubs in the North, or unwind in serene, unspoiled luxury on the quiet white sands of South Goa.',
        icon: '🏖️'
      },
      {
        title: 'UNESCO World Heritage Architecture',
        description: 'Marvel at 450-year-old basilicas in Old Goa, stunning whitewashed churches like Our Lady of the Immaculate Conception, and vibrant Latin quarters in Fontainhas.',
        icon: '⛪'
      },
      {
        title: 'World-Class Coastal Gastronomy',
        description: 'Feast on freshly caught tiger prawns in fiery peri-peri sauce, rich coconut fish curry rice, and artisanal cocktails at cliffside sunset lounges.',
        icon: '🍤'
      },
      {
        title: 'Watersports & Marine Life',
        description: 'Scuba diving at Grand Island, dolphin cruises along the Mandovi river, jet-skiing, kitesurfing, and tranquil backwater mangrove kayaking.',
        icon: '🐬'
      }
    ],

    culture: {
      summary: 'Goan culture is famously defined by "Susegad" — a warm, relaxed attitude toward living well. A unique 450-year confluence of Portuguese maritime heritage and Konkani coastal traditions.',
      history: 'Conquered by Afonso de Albuquerque in 1510, Goa served as the capital of the Portuguese Empire in the East for over four centuries until liberated by India in 1961.',
      traditions: 'Fado singing, brass bands, colorful carnival parades, and the evening "tiatr" theatrical folk musical performances.',
      festivals: [
        { name: 'Goa Carnival', timing: 'February', description: 'Vibrant 4-day pre-Lent celebration featuring King Momo parades, masked dancers, street floats, and live music throughout Panaji and Margao.' },
        { name: 'Shigmo Festival', timing: 'March', description: 'The grand Goan Konkani spring festival showcasing magnificent mythological floats and traditional folk dancers.' },
        { name: 'Feast of St. Francis Xavier', timing: 'December 3', description: 'Massive spiritual pilgrimage to Old Goa honoring the saint with traditional feasts and fairgrounds.' }
      ],
      etiquette: [
        'Dress respectfully when visiting churches and cathedral shrines; shoulders and knees should be covered.',
        'Always heed red lifeguard flags on beaches; Arabian Sea currents can be treacherous during changes in tide.',
        'Wear helmets at all times when riding rented two-wheelers; traffic police strictly monitor coastal highways.'
      ],
      language: {
        primary: 'Konkani, English & Portuguese',
        phrases: [
          { phrase: 'Deu borem korum', meaning: 'May God bless you / Thank you' },
          { phrase: 'Kitem cholta?', meaning: 'What is happening? / What’s up?' },
          { phrase: 'Hau Goenkar', meaning: 'I love Goa / I am Goan' }
        ]
      }
    },

    cuisine: {
      summary: 'Goan cuisine is an aromatic celebration of fresh coconut, tamarind, toddy vinegar, triphala berries, and fiery Kashmiri chillies.',
      signatureDishes: [
        { name: 'Goan Fish Curry Rice', type: 'non-veg', description: 'Kingfish simmered in a golden coconut, coriander, and kokum gravy, served alongside steaming boiled rice.' },
        { name: 'Pork Vindaloo', type: 'non-veg', description: 'Legendary Portuguese-influenced slow-braised curry tenderized in spiced toddy vinegar and roasted garlic.' },
        { name: 'Goan Mushroom Xacuti', type: 'veg', description: 'Complex roasted curry featuring toasted poppy seeds, white coconut, cloves, and star anise.' },
        { name: 'Bebinca', type: 'sweet', description: 'Indulgent traditional 7-to-16-layer Goan dessert baked with coconut milk, egg yolk, flour, and clarified butter.' }
      ],
      famousFoodSpots: [
        { name: 'Vinayak Family Restaurant', specialty: 'Authentic local Goan fish thali and butter garlic calamari', location: 'Assagao' },
        { name: 'Fisherman’s Wharf', specialty: 'Riverside Goan seafood dining with live retro music', location: 'Cavelossim' },
        { name: 'Mum’s Kitchen', specialty: 'Preserved ancestral Hindu & Christian Goan recipes', location: 'Panaji' }
      ],
      localBeverages: ['Cashew Feni', 'Palm Toddy', 'Kokum Sharbat with mint', 'Craft Goan Gin (Stranger & Sons)']
    },

    attractions: [
      { name: 'Basilica of Bom Jesus', category: 'Heritage', description: 'UNESCO World Heritage baroque cathedral housing the sacred mortal remains of St. Francis Xavier.', bestTime: 'Morning 9 AM – 11 AM', insiderTip: 'Visit early to absorb the serene silence and avoid mid-day tour buses.' },
      { name: 'Palolem & Butterfly Beach', category: 'Beaches', description: 'A sheltered semicircle bay of powdered sand in South Goa, perfect for swimming and dolphin spotting by boat.', bestTime: 'Late afternoon through sunset', insiderTip: 'Rent a silent kayak from Palolem to explore the secluded Butterfly Beach cove nearby.' },
      { name: 'Fort Aguada & Lighthouse', category: 'Heritage & Viewpoints', description: '17th-century Portuguese fortress overlooking the vast convergence of Mandovi River and the Arabian Sea.', bestTime: 'Sunset 4:30 PM – 6 PM', insiderTip: 'The lower cliff section provides dramatic wave-crashing photo angles.' },
      { name: 'Fontainhas Latin Quarter', category: 'Culture', description: 'The oldest Latin quarter in Asia, brimming with bright ochre, indigo, and terracotta tiled heritage mansions.', bestTime: 'Early morning 7 AM – 9 AM for peaceful strolls', insiderTip: 'Stop at 31st January Bakery for freshly baked warm pastéis de nata (custard tarts).' },
      { name: 'Dudhsagar Waterfalls', category: 'Adventure', description: 'Spectacular 310-meter four-tiered milky cascade deep inside the Bhagwan Mahavir Wildlife Sanctuary.', bestTime: 'Post-monsoon (Oct – Dec)', insiderTip: 'Book official forest department 4x4 Jeep safaris at Kulem railway station early in the morning.' }
    ],

    weather: {
      overview: 'Goa enjoys a warm tropical maritime climate, peaking in pleasant breezes from November through February.',
      bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      temperature: { min: 19, max: 35 },
      seasons: [
        { name: 'Peak Winter (Nov – Feb)', months: 'November to February', tempRange: '20°C to 31°C', highlights: 'Perfect beach weather, calm blue seas, open beach shacks, Christmas & New Year celebrations.', advice: 'Book hotels and flights well in advance; peak pricing applies.' },
        { name: 'Summer (Mar – May)', months: 'March to May', tempRange: '26°C to 35°C', highlights: 'Warm ocean water, great sunset cocktails, fewer crowds and great boutique hotel deals.', advice: 'Stay hydrated; plan outdoor activities for early mornings and evenings.' },
        { name: 'Monsoon (Jun – Oct)', months: 'June to October', tempRange: '24°C to 30°C', highlights: 'Lush emerald green hinterlands, roaring Dudhsagar waterfall, tranquil romantic retreats.', advice: 'Most beach shacks close; swimming in sea is strictly forbidden due to rough swells.' }
      ]
    },

    safety: {
      score: 4.1,
      womenTravelerNote: 'Goa is widely considered one of India’s most liberal and solo-friendly tourist destinations, with 24-hour tourist police helpdesks at Calangute, Baga, and Colva.',
      tips: [
        'Never drive or ride a two-wheeler after consuming alcohol; checkpoints on coastal roads are frequent.',
        'Use pre-paid taxi booths at Goa Dabolim and Mopa airports or use the GoaMiles government taxi app to avoid inflated fares.',
        'Always swim within flagged patrol zones watched by Drishti Marine lifeguards.'
      ],
      emergencyContacts: {
        police: '0832-2231400 / 112',
        hospital: 'Goa Medical College (Bambolim): 0832-2458700',
        touristHelpline: 'Goa Tourism Helpline: 0832-2437132'
      }
    },

    transport: {
      air: { title: 'Airports', airport: 'Goa Dabolim (GOI) & Manohar Intl Mopa (GOX)', distance: 'North & South coverage', details: 'Extensive direct flights connecting all major Indian and international cities.' },
      train: { title: 'Railways', station: 'Madgaon Junction (MAO) / Thivim (THVM)', details: 'Vande Bharat and Rajdhani express trains connect Mumbai, Delhi, and Bengaluru directly.' },
      road: { title: 'By Road', highways: 'NH-66 via Mumbai / Pune / Bengaluru', details: 'Scenic coastal highway drives and inter-state sleeper buses.' },
      localCommute: ['Self-drive rented scooters (₹350–₹600/day)', 'Open Mahindra Thar and car rentals', 'GoaMiles app cabs and local black-and-yellow pilot motorbike taxis']
    }
  },

  jaipur: {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    heroImage: '/img/jaipur.jpg',
    tagline: 'The Legendary Pink City of Royal Palaces, Fortresses & Vibrant Bazaars',
    tags: ['heritage', 'culture', 'history', 'architecture'],
    rating: 4.6,
    reviews: 18300,
    safetyScore: 4.5,
    idealDuration: '3–5 Days',
    budgetPerDay: { budget: '₹1,300', mid: '₹3,000', luxury: '₹8,000' },
    bestSeason: 'Oct – Mar',
    overview: 'Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is India’s first planned city and a UNESCO World Heritage treasure. Painted in radiant terracotta-pink to symbolize hospitality, the city dazzles travelers with majestic hilltop ramparts, celestial observatories, jewel-encrusted royal courtyards, and bustling artisan bazaars.',
    
    gallery: [
      { url: '/img/jaipur.jpg', caption: 'The honeycomb facade of Hawa Mahal (Palace of Winds) bathed in morning light', tag: 'Architecture' },
      { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', caption: 'Amber Fort’s massive sandstone ramparts reflected in Maota Lake', tag: 'Forts' },
      { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', caption: 'Intricate peacock gate carvings inside the royal courtyards of City Palace', tag: 'Heritage' },
      { url: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1200&q=80', caption: 'Sunset views over the Pink City skyline from the heights of Nahargarh Fort', tag: 'Panoramas' },
      { url: 'https://images.unsplash.com/photo-1600100397608-f402c4cb185b?auto=format&fit=crop&w=1200&q=80', caption: 'Handmade lac bangles and colorful block-print textiles in Johari Bazaar', tag: 'Culture' }
    ],

    whyVisit: [
      {
        title: 'Architectural Wonders of the World',
        description: 'Explore the 953 stone-screened casements of Hawa Mahal, the colossal astronomical instruments of Jantar Mantar, and the mirrored halls of Sheesh Mahal.',
        icon: '🏰'
      },
      {
        title: 'Royal Living Heritage',
        description: 'Walk through the grand City Palace where the current titular Maharaja still resides, surrounded by preserved ceremonial carriages and armor.',
        icon: '👑'
      },
      {
        title: 'Unrivaled Artisan Bazaars',
        description: 'Browse treasures of blue pottery, pure silver jewelry in Johari Bazaar, hand-block Bagru prints, and aromatic camel leather mojris.',
        icon: '🛍️'
      },
      {
        title: 'Palatial Dining & Royal Feasts',
        description: 'Indulge in authentic Dal Baati Churma served with five varieties of lentils and pure ghee in heritage haveli courtyards.',
        icon: '🍲'
      }
    ],

    culture: {
      summary: 'Jaipur radiates the chivalric ethos of Rajputana royalty mixed with rich folk music, Ghoomar dance, puppetry, and centuries-old jewelry crafting guilds.',
      history: 'Engineered in accordance with ancient Vedic principles of Vastu Shastra by architect Vidyadhar Bhattacharya in 1727, Jaipur broke ground as India’s earliest grid-planned urban center.',
      traditions: 'Block printing in Sanganer, enameling (Meenakari), miniature painting on silk, and camel breeding traditions.',
      festivals: [
        { name: 'Jaipur Literature Festival', timing: 'January', description: 'The world’s grandest free literary gathering, hosting Nobel laureates, poets, and thinkers at Diggi Palace.' },
        { name: 'Teej Festival', timing: 'August', description: 'A jubilant royal procession honoring Goddess Parvati with decked palanquins, caparisoned camels, and folk performers.' },
        { name: 'Gangaur', timing: 'March / April', description: 'A colorful post-Holi harvest festival honoring marital fidelity and spring harvest with vibrant community feasts.' }
      ],
      etiquette: [
        'Hire only government-authorized guides wearing official ID cards at Amber Fort and City Palace.',
        'Polite bargaining is customary in open bazaars like Bapu Bazaar and Johari Bazaar.',
        'Always ask permission before taking close-up portraits of traditional village elders or street artisans.'
      ],
      language: {
        primary: 'Hindi, Marwari & English',
        phrases: [
          { phrase: 'Khamma Ghani', meaning: 'Royal Greeting / Hello / Welcome' },
          { phrase: 'Ghani Khamma', meaning: 'Humble response to Khamma Ghani' },
          { phrase: 'Padharo Mhare Desh', meaning: 'Welcome to our royal land' }
        ]
      }
    },

    cuisine: {
      summary: 'Royal Rajasthani gastronomy was shaped by desert resilience, utilizing clarified butter, milk, gram flour, dried berries (Ker Sangri), and slow-roasting pots.',
      signatureDishes: [
        { name: 'Dal Baati Churma', type: 'veg', description: 'Hard baked wheat dough balls crushed into five-lentil curry, accompanied by sweetened powdered wheat churma.' },
        { name: 'Laal Maas', type: 'non-veg', description: 'Fiery royal mutton curry braised with garlic, yogurt, and aromatic Rajasthani Mathania red chillies.' },
        { name: 'Pyaaz Kachori', type: 'veg', description: 'Crispy deep-fried pastry puff filled with a piquant caramelized onion and roasted spice filling.' },
        { name: 'Ghevar', type: 'sweet', description: 'Honeycomb-textured disc dessert soaked in saffron sugar syrup and topped with thick malai rabri and pistachios.' }
      ],
      famousFoodSpots: [
        { name: 'Rawat Mishthan Bhandar', specialty: 'World-famous steaming hot Pyaaz and Mawa Kachoris', location: 'Station Road' },
        { name: 'LMB (Laxmi Mishthan Bhandar)', specialty: 'Grand Rajasthani royal thalis and fresh Ghevar', location: 'Johari Bazaar' },
        { name: '1135 AD', specialty: 'Fine dining inside the historic silver palace of Amber Fort', location: 'Amber Fort' }
      ],
      localBeverages: ['Kulhad Lassi at Lassiwala (since 1944)', 'Kesar Masala Milk', 'Jaljeera with crushed mint', 'Heritage Royal Chandrahas liqueur']
    },

    attractions: [
      { name: 'Amber Fort & Palace', category: 'Heritage', description: 'Vast 16th-century hilltop stronghold showcasing the dazzling Sheesh Mahal (hall of mirrors) and royal gardens.', bestTime: 'Morning 8:30 AM – 11 AM', insiderTip: 'Take the scenic walking ramp or battery-operated car to the top and stay for the evening sound-and-light show.' },
      { name: 'Hawa Mahal (Palace of Winds)', category: 'Architecture', description: 'Five-story pink sandstone palace with 953 ornate lattice jharokhas built for royal women to observe city parades unnoticed.', bestTime: 'Sunrise for stunning front facade lighting', insiderTip: 'Visit the rooftop cafes opposite Hawa Mahal (like Wind View Cafe) for unforgettable panoramic photo angles.' },
      { name: 'Jantar Mantar', category: 'Science & Heritage', description: 'UNESCO-listed astronomical observatory featuring the world’s largest stone sundial, measuring time to 2 seconds precision.', bestTime: 'Mid-day 11 AM – 2 PM when sun shadows are sharpest', insiderTip: 'Hire a certified observatory guide to understand how the medieval stone instruments track planetary positions.' },
      { name: 'Nahargarh Fort Sunset Point', category: 'Viewpoints', description: 'Standing along the sheer ridge of the Aravalli hills, offering majestic sunset panoramas over the entire illuminated Pink City.', bestTime: 'Sunset 5:00 PM – 7:00 PM', insiderTip: 'Have a sunset beverage at Padao restaurant perched directly on the fort’s outer rampart.' },
      { name: 'City Palace & Museum', category: 'Royalty', description: 'Palatial residence of the Jaipur royals featuring courtyards, the Mubarak Mahal costume museum, and silver water urns.', bestTime: 'Afternoon 1:30 PM – 4:30 PM', insiderTip: 'The premium Chandra Mahal private apartment tour grants access to stunning blue fresco salons.' }
    ],

    weather: {
      overview: 'Jaipur experiences semi-arid desert weather with gloriously pleasant winters and scorching dry summers.',
      bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      temperature: { min: 8, max: 44 },
      seasons: [
        { name: 'Winter (Oct – Mar)', months: 'October to March', tempRange: '9°C to 27°C', highlights: 'Crisp sunny days, cool evenings, peak festival season, rooftop dining.', advice: 'Pack light jackets and shawls for evening fort excursions.' },
        { name: 'Summer (Apr – Jun)', months: 'April to June', tempRange: '28°C to 44°C', highlights: 'Fewer tourists, lowest luxury heritage hotel tariffs.', advice: 'Explore monuments strictly between 7 AM and 10 AM; avoid mid-day sun.' },
        { name: 'Monsoon (Jul – Sep)', months: 'July to September', tempRange: '24°C to 34°C', highlights: 'Aravalli hills turn verdant green, pleasant breezes, Teej festival parades.', advice: 'Great time for photography around Amer and Nahargarh.' }
      ]
    },

    safety: {
      score: 4.5,
      womenTravelerNote: 'Jaipur has a specialized Tourist Police Force with kiosks situated outside major monuments. Stick to licensed guides and pre-paid cab services at night.',
      tips: [
        'Buy the composite ticket at your first monument to save hours waiting in separate queues at Hawa Mahal, Jantar Mantar, Amber, and Nahargarh.',
        'Beware of unsolicited street gem or carpet vendors claiming export discounts; shop at state-run Rajasthali emporiums for certified items.',
        'Drink plenty of electrolytes during walking tours of large fort complexes.'
      ],
      emergencyContacts: {
        police: '0141-2744000 / 112',
        hospital: 'SMS Hospital Jaipur: 0141-2518888',
        touristHelpline: 'Rajasthan Tourism Assistance: 0141-5110595'
      }
    },

    transport: {
      air: { title: 'Airport', airport: 'Jaipur International Airport (JAI)', distance: '12 km south of city center', details: 'Direct flights to Delhi, Mumbai, Dubai, Sharjah, Bengaluru, and Kolkata.' },
      train: { title: 'Railway Station', station: 'Jaipur Junction (JP)', details: 'Superfast Vande Bharat Express and Shatabdi link Delhi in under 4 hours.' },
      road: { title: 'Expressway', highways: 'Delhi-Jaipur Expressway (NH-48)', details: 'Smooth 4.5 to 5-hour drive from New Delhi; state luxury Volvo buses run every 30 minutes.' },
      localCommute: ['Jaipur Metro rail connecting Chandpole to Mansarovar', 'App-based Uber / Ola cabs', 'E-rickshaws for walled city bazaar navigation']
    }
  },

  rishikesh: {
    id: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    heroImage: '/img/rishikesh.jpg',
    tagline: 'Yoga Capital of the World, Sacred Ganga River & Himalayan Rapids',
    tags: ['spiritual', 'adventure', 'river', 'nature'],
    rating: 4.5,
    reviews: 9600,
    safetyScore: 4.3,
    idealDuration: '3–5 Days',
    budgetPerDay: { budget: '₹1,000', mid: '₹2,400', luxury: '₹6,000' },
    bestSeason: 'Sep – May',
    overview: 'Where the emerald Ganga leaves the Shivalik Himalayas to touch the northern plains of India, Rishikesh stands as the world capital of Yoga and high-adrenaline thrills. Famed for its suspension footbridges, evening river Aarti fire rituals, white-water rapids, and spiritual ashrams that once hosted The Beatles.',
    
    gallery: [
      { url: '/img/rishikesh.jpg', caption: 'Laxman Jhula suspension bridge over the emerald Ganges at twilight', tag: 'River' },
      { url: 'https://images.unsplash.com/photo-1599827552599-eeddd3065a6e?auto=format&fit=crop&w=1200&q=80', caption: 'Mesmerizing evening Ganga Aarti ceremony at Parmarth Niketan Ghat', tag: 'Spiritual' },
      { url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80', caption: 'Thrilling white-water rafting through the rapids of Shivpuri', tag: 'Adventure' },
      { url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80', caption: 'Sunrise meditation session overlooking the misty Shivalik mountain ridges', tag: 'Yoga' },
      { url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80', caption: 'Graffiti-covered meditation domes at the Beatles Ashram (Chaurasi Kutia)', tag: 'Heritage' }
    ],

    whyVisit: [
      {
        title: 'Authentic Yoga & Meditation Ashrams',
        description: 'Practice ancient Hatha, Ashtanga, and Sound Healing beneath the guidance of revered yogis in the spiritual birthplace of global mindfulness.',
        icon: '🧘'
      },
      {
        title: 'India’s Premier White-Water Rafting',
        description: 'Navigate legendary Grade-III & IV rapids like The Wall, Roller Coaster, and Golf Course on the pristine waters of the holy Ganga.',
        icon: '🚣'
      },
      {
        title: 'Electrifying Ganga Aarti',
        description: 'Witness thousands gather as priests chant Sanskrit hymns, blow conch shells, and lift massive brass fire chalices at Triveni and Parmarth Ghats.',
        icon: '🪔'
      },
      {
        title: 'Extreme Adrenaline Sports',
        description: 'Leap from India’s highest fixed platform bungee jump (83m), ride Asia’s longest flying fox, and cliff jump into turquoise mountain eddies.',
        icon: '🧗'
      }
    ],

    culture: {
      summary: 'A sacred sanctuary free of alcohol and non-vegetarian food by law, Rishikesh’s culture is rooted in ancient Vedic ascetism, ashram discipline, and devotional music.',
      history: 'According to scriptures, Lord Rama performed penance here after slaying Ravana, while Lord Shiva held the world-poison Halahala in his throat at Nilkanth Mahadev above the town.',
      traditions: 'Daily dawn and dusk river ablutions, Ayurvedic detoxification retreats, Kirtan singing circles, and sadhu monasticism.',
      festivals: [
        { name: 'International Yoga Festival', timing: 'March 1 – 7', description: 'Global gathering uniting world-renowned spiritual masters, wellness doctors, and practitioners from 90+ nations.' },
        { name: 'Ganga Dussehra', timing: 'May / June', description: 'A massive sacred celebration celebrating the descent of River Ganga from the heavens, adorned with floating oil lamps.' },
        { name: 'Maha Shivratri', timing: 'February / March', description: 'Thousands of pilgrims trek to the mountaintop Neelkanth Mahadev Temple amid night-long devotional chants.' }
      ],
      etiquette: [
        'Non-vegetarian food, alcohol, and eggs are strictly prohibited throughout the sacred municipality of Rishikesh.',
        'Always remove footwear before stepping onto the bathing ghats and into ashram sanctums.',
        'Wear life jackets at all times when boating or boarding river rafts; currents are deceptive and powerful.'
      ],
      language: {
        primary: 'Hindi, Garhwali & English',
        phrases: [
          { phrase: 'Hari Om', meaning: 'Sacred universal greeting / Hello' },
          { phrase: 'Ganga Maiya ki Jai', meaning: 'Victory to Mother Ganga' },
          { phrase: 'Dhanyawad', meaning: 'Thank you' }
        ]
      }
    },

    cuisine: {
      summary: 'Wholesome, pure-vegetarian sattvic and international traveler food, famous for organic grain bowls, cold-pressed juices, and herbal Himalayan concoctions.',
      signatureDishes: [
        { name: 'Garhwali Kafuli', type: 'veg', description: 'Nutritious thick green curry cooked from organic spinach and fenugreek leaves, simmered with rice paste.' },
        { name: 'Chainsoo', type: 'veg', description: 'A roasted black gram dal preparation bursting with robust smoky mountain spices and hing.' },
        { name: 'Aloo ke Gutke', type: 'veg', description: 'Spicy Pahadi roasted mountain potatoes seasoned with local jambu herbs and red mustard.' },
        { name: 'Fresh Wood-Fired Neapolitan Pizza', type: 'veg', description: 'Artisanal sourdough crusts topped with Himalayan smoked cheese and organic basil.' }
      ],
      famousFoodSpots: [
        { name: 'Chotiwala', specialty: 'Traditional North Indian thalis and Garhwali sweets since 1958', location: 'Swarg Ashram' },
        { name: 'The Little Buddha Cafe', specialty: 'Rooftop river views, falafel platters & herbal teas', location: 'Near Laxman Jhula' },
        { name: 'Beatles Cafe (Cafe Delmar)', specialty: 'Vegan gluten-free burgers, smoothie bowls and 60s vinyl music', location: 'Tapovan' }
      ],
      localBeverages: ['Ayurvedic Tulsi Ginger Lemon Honey Tea', 'Fresh Himalayan Rhododendron Juice (Buransh)', 'Lassi in earthen clay cups', 'Masala Golden Turmeric Milk']
    },

    attractions: [
      { name: 'Triveni Ghat Evening Aarti', category: 'Spiritual', description: 'The grandest prayer ghat in Rishikesh where priests swing multi-tiered flaming brass lamps as floating diyas drift down the holy river.', bestTime: 'Evening 6:00 PM – 7:15 PM', insiderTip: 'Arrive by 5:15 PM to sit on the steps right in front of the primary priests.' },
      { name: 'The Beatles Ashram (Chaurasi Kutia)', category: 'Heritage & Art', description: 'The Maharishi Mahesh Yogi ashram where The Beatles composed the White Album in 1968, now featuring mural-covered meditation domes.', bestTime: 'Morning 9 AM – 12 PM', insiderTip: 'Walk inside the stone meditation caves and check the Cathedral hall covered in vibrant psychedelic paintings.' },
      { name: 'White-Water Rafting from Shivpuri / Marine Drive', category: 'Adventure', description: '16 km or 24 km exhilarating river runs through churning Himalayan rapids and scenic cliff gorges.', bestTime: 'Morning 8:30 AM or 1:00 PM', insiderTip: 'Book early morning slots when river traffic is lowest and water is glassy and clear.' },
      { name: 'Jumpin Heights Bungee Jump', category: 'Extreme Sports', description: 'India’s most trusted extreme sports center featuring an 83-meter bungee platform built over the Hall River gorge at Mohan Chatti.', bestTime: 'Advance booking required', insiderTip: 'Purchase the video package with high-frame-rate cameras documenting your leap.' },
      { name: 'Neer Garh Waterfalls', category: 'Nature', description: 'Two-tier jade-green mountain cascade hidden in the jungle canopy, reached via a short uphill forest trail.', bestTime: 'Early morning for quiet natural pools', insiderTip: 'Wear walking shoes with good tread; small trailside stalls serve mountain chai and maggi.' }
    ],

    weather: {
      overview: 'Rishikesh has a subtropical highland climate with cool refreshing winters, warm summers, and torrential monsoon river surges.',
      bestMonths: ['Sep', 'Oct', 'Nov', 'Feb', 'Mar', 'Apr', 'May'],
      temperature: { min: 7, max: 39 },
      seasons: [
        { name: 'Autumn & Spring (Sep – Nov / Feb – Apr)', months: 'September to November & February to April', tempRange: '14°C to 30°C', highlights: 'Prime white-water rafting season, perfect weather for yoga and river camping.', advice: 'Peak travel window; reserve camps and instructors ahead.' },
        { name: 'Winter (Dec – Jan)', months: 'December to January', tempRange: '7°C to 20°C', highlights: 'Crisp blue skies, morning river mist, peaceful uncrowded ghats.', advice: 'Heavy woollens needed for chilly evenings and early morning yoga.' },
        { name: 'Monsoon (Jul – Aug)', months: 'July to August', tempRange: '23°C to 32°C', highlights: 'Lush green mountain forests; spiritual Kanwar Yatra pilgrim season.', advice: 'River rafting is strictly closed by law during peak monsoon.' }
      ]
    },

    safety: {
      score: 4.3,
      womenTravelerNote: 'Rishikesh is one of the safest destinations in India for solo female travelers, with a community of international yogis, well-lit pedestrian suspension bridges, and respectful locals.',
      tips: [
        'Only choose rafting operators holding valid licenses issued by the Uttarakhand Tourism Development Board.',
        'Never swim in the Ganges without a life jacket; underwater currents and sudden drop-offs are perilous.',
        'Beware of mischievous rhesus monkeys on Ram Jhula and Laxman Jhula bridges; do not hold visible food bags.'
      ],
      emergencyContacts: {
        police: '0135-2430900 / 112',
        hospital: 'AIIMS Rishikesh (Super Speciality): 0135-2462900',
        touristHelpline: 'Uttarakhand Tourism Helpline: 0135-2559898'
      }
    },

    transport: {
      air: { title: 'Nearest Airport', airport: 'Dehradun Jolly Grant Airport (DED)', distance: '21 km (~35 minutes drive)', details: 'Frequent direct flights from Delhi, Mumbai, Bengaluru, and Ahmedabad.' },
      train: { title: 'Railway Station', station: 'Yog Nagari Rishikesh (YNRK) / Haridwar Jn (HW)', details: 'New Yog Nagari station connects directly to Delhi and major metros.' },
      road: { title: 'Highway', highways: 'Delhi-Dehradun Expressway / NH-58', details: '~5.5 hours drive from Delhi via Meerut and Haridwar.' },
      localCommute: ['Electric Vikram auto-rickshaws between Tapovan and Triveni Ghat', 'Scooter and bike rentals (₹400–₹800/day)', 'Scenic footpaths crossing Ram and Janki Jhula']
    }
  },

  udaipur: {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    heroImage: '/img/udaipur.jpg',
    tagline: 'City of Lakes, Floating Marble Palaces & Timeless Royal Romance',
    tags: ['heritage', 'romantic', 'lake', 'architecture'],
    rating: 4.7,
    reviews: 14200,
    safetyScore: 4.6,
    idealDuration: '3–4 Days',
    budgetPerDay: { budget: '₹1,600', mid: '₹3,800', luxury: '₹9,500' },
    bestSeason: 'Sep – Mar',
    overview: 'Surrounded by the velvet Aravalli mountains and glistening cobalt lakes, Udaipur is acclaimed as the most romantic city in India. Founded in 1559 by Maharana Udai Singh II as the capital of Mewar, it showcases floating island palaces, whitewashed havelis, and sunset boat cruises that mirror the grandeur of a bygone royal kingdom.',
    
    gallery: [
      { url: '/img/udaipur.jpg', caption: 'The majestic City Palace complex towering over the waters of Lake Pichola', tag: 'Architecture' },
      { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', caption: 'Taj Lake Palace illuminated like a floating pearl on Lake Pichola at dusk', tag: 'Heritage' },
      { url: 'https://images.unsplash.com/photo-1609137144822-0d1275bb27d4?auto=format&fit=crop&w=1200&q=80', caption: 'Classic Mewari carved marble balconies overlooking the lake ghats', tag: 'Details' },
      { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', caption: 'Sunset view from the Monsoon Palace (Sajjangarh) across the Aravallis', tag: 'Sunset' },
      { url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80', caption: 'Folk dancers spinning with brass fire pots at Bagore ki Haveli cultural show', tag: 'Culture' }
    ],

    whyVisit: [
      {
        title: 'Iconic Lake Pichola Boat Rides',
        description: 'Glide across mirror-still waters at golden hour, taking in views of the Lake Palace, Jag Mandir island, and the illuminated City Palace facade.',
        icon: '⛵'
      },
      {
        title: 'Largest Palace Complex in Rajasthan',
        description: 'Explore four centuries of royal history inside City Palace, containing labyrinthine halls, peacock mosaics, and priceless Mewar weaponry.',
        icon: '🏰'
      },
      {
        title: 'Atmospheric Rooftop Haveli Dining',
        description: 'Dine under fairy lights on lake-facing terraces with candlelit views of shimmering waters and live Santoor music.',
        icon: '🕯️'
      },
      {
        title: 'Mewar Art & Miniature Painting',
        description: 'Watch master artists create intricate miniature paintings with single-hair squirrel brushes using stone and gold leaf pigments.',
        icon: '🎨'
      }
    ],

    culture: {
      summary: 'Udaipur stands as the proud bastion of Mewar, a Rajput kingdom that fiercely maintained independence for centuries. Its living culture thrives in traditional puppet theater, folk dance, and royal equestrian pride.',
      history: 'Founded by Maharana Udai Singh II after the siege of Chittorgarh, the city was strategically chosen for its protective ring of hills and natural lake basins.',
      traditions: 'Phad scroll paintings, Mewari turban tying, Mewar miniature art, and silver jewelry craftsmanship.',
      festivals: [
        { name: 'Mewar Festival', timing: 'March / April', description: 'Spectacular welcome to spring with colorful processions, deity immersions in Lake Pichola, and grand lakeside fireworks.' },
        { name: 'Shilpgram Crafts Fair', timing: 'Late December', description: 'A massive 10-day artisan festival celebrating traditional rural arts, crafts, and tribal performances from across India.' },
        { name: 'World Music Festival', timing: 'February', description: 'International artists performing classical, folk, and jazz music at heritage lakefront stages.' }
      ],
      etiquette: [
        'Dress modestly when visiting active shrines like the 1651 Jagdish Temple.',
        'Book government or hotel-approved boats equipped with life jackets for Lake Pichola trips.',
        'Support local artisans directly by buying miniature artwork from verified artist cooperatives near Lal Ghat.'
      ],
      language: {
        primary: 'Mewari & Hindi',
        phrases: [
          { phrase: 'Jai Mewar', meaning: 'Salute to the spirit of Mewar' },
          { phrase: 'Aap kikar ho?', meaning: 'How are you?' },
          { phrase: 'Ghani Mehrbaani', meaning: 'Thank you very much' }
        ]
      }
    },

    cuisine: {
      summary: 'Mewari cuisine is celebrated for rich, spicy curries, fire-roasted meats, corn-based flatbreads, and fragrant sweet dishes.',
      signatureDishes: [
        { name: 'Mewari Gatta Curry', type: 'veg', description: 'Spiced gram flour dumplings simmered in a tangy yogurt and fenugreek gravy.' },
        { name: 'Safed Maas', type: 'non-veg', description: 'Delicate royal meat curry prepared in a rich sauce of cashew nuts, poppy seeds, fresh cream, and cardamom.' },
        { name: 'Makki ki Raab', type: 'veg', description: 'Warm comforting soup made from fermented corn flour, buttermilk, and roasted cumin seeds.' },
        { name: 'Malpua with Rabri', type: 'sweet', description: 'Fluffy deep-fried saffron pancakes dipped in sugar syrup and smothered in thick clotted cream.' }
      ],
      famousFoodSpots: [
        { name: 'Ambrai Restaurant', specialty: 'Fine dining right at the water’s edge facing the illuminated City Palace', location: 'Amet Haveli, Hanuman Ghat' },
        { name: 'Jheel’s Ginger Cafe', specialty: 'Artisanal coffee, freshly baked pies & lakefront balcony seats', location: 'Gangaur Ghat' },
        { name: 'Natraj Dining Hall', specialty: 'Unlimited traditional Rajasthani and Gujarati thali', location: 'Near Railway Station' }
      ],
      localBeverages: ['Rose petal Sharbat', 'Kesar Rabri Milk', 'Chikoo Shake', 'Traditional Mewari Khada Masala Chai']
    },

    attractions: [
      { name: 'City Palace Complex', category: 'Heritage', description: 'A colossal granite and marble palace complex perched on Lake Pichola’s east bank with balconies, cupolas, and courtyards.', bestTime: 'Morning 9:00 AM – 11:30 AM', insiderTip: 'Don’t miss the crystal gallery showcasing the world’s single largest private collection of crystal.' },
      { name: 'Jag Mandir Island Palace', category: 'Romantic & Lake', description: 'Exquisite 17th-century island sanctuary featuring life-sized marble elephants and tranquil garden courtyards.', bestTime: 'Late afternoon boat excursion', insiderTip: 'Take the sunset ferry from the City Palace jetty to watch twilight envelope the surrounding hills.' },
      { name: 'Bagore ki Haveli', category: 'Culture', description: 'Historic 18th-century mansion at Gangaur Ghat hosting the famous Dharohar folk dance show with puppet artists and fire dancers.', bestTime: 'Evening show 7 PM – 8 PM', insiderTip: 'Book tickets at the counter by 5:30 PM as seats sell out every evening.' },
      { name: 'Sajjangarh (Monsoon Palace)', category: 'Viewpoints', description: 'White marble hilltop castle built high on Bansdara peak to watch monsoon clouds gather over the Mewar kingdom.', bestTime: 'Sunset 4:45 PM – 6:30 PM', insiderTip: 'Catch the shared electric vans from the sanctuary gate to reach the mountain summit.' },
      { name: 'Saheliyon-ki-Bari', category: 'Gardens', description: 'Delightful 18th-century royal gardens featuring marble elephant fountains, lotus pools, and shaded pavilions.', bestTime: 'Morning 8:00 AM – 10:30 AM', insiderTip: 'The unique fountains operate purely on gravity water pressure from Fateh Sagar Lake.' }
    ],

    weather: {
      overview: 'Udaipur features a tropical desert climate tempered by its surrounding lakes and highlands.',
      bestMonths: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      temperature: { min: 10, max: 42 },
      seasons: [
        { name: 'Winter (Oct – Mar)', months: 'October to March', tempRange: '11°C to 28°C', highlights: 'Ideal sightseeing weather, calm lake waters, rooftop dining under the stars.', advice: 'Light woollens for evening boat rides.' },
        { name: 'Monsoon (Jul – Sep)', months: 'July to September', tempRange: '23°C to 33°C', highlights: 'Lakes fill to capacity, waterfalls flow, Sajjangarh is enveloped in romantic mist.', advice: 'Considered by locals to be the most magical time to visit.' },
        { name: 'Summer (Apr – Jun)', months: 'April to June', tempRange: '27°C to 42°C', highlights: 'Uncrowded palaces and significant discounts on luxury heritage hotels.', advice: 'Sightsee early morning and enjoy indoor museums during midday heat.' }
      ]
    },

    safety: {
      score: 4.6,
      womenTravelerNote: 'Udaipur is widely ranked among the safest and most hospitable tourist cities in India with low crime rates and friendly, heritage-proud residents.',
      tips: [
        'Be mindful of slippery ghat steps after rain or algae buildup along the lakeshore.',
        'Choose licensed lake cruise boats equipped with certified life jackets.',
        'Use pre-paid autorickshaw stands or app cabs to prevent overpaying in congested old city alleys.'
      ],
      emergencyContacts: {
        police: '0294-2523900 / 112',
        hospital: 'Maharana Bhupal General Hospital: 0294-2528811',
        touristHelpline: 'Rajasthan Tourism Bureau: 0294-2411535'
      }
    },

    transport: {
      air: { title: 'Airport', airport: 'Maharana Pratap Airport (UDR)', distance: '22 km east of the city', details: 'Direct flights to Delhi, Mumbai, Bengaluru, Hyderabad, and Jaipur.' },
      train: { title: 'Railway Station', station: 'Udaipur City Station (UDZ)', details: 'Superfast overnight trains from Delhi, Mumbai, and Jaipur.' },
      road: { title: 'Highway', highways: 'NH-48 / Golden Quadrilateral', details: 'Scenic 3-hour drive from Mount Abu or 6 hours from Ahmedabad.' },
      localCommute: ['Auto-rickshaws suited for narrow haveli lanes', 'Bicycle and scooter rentals', 'Scenic walking along Gangaur and Ambrai ghats']
    }
  },

  ladakh: {
    id: 'ladakh',
    name: 'Ladakh',
    state: 'Ladakh (UT)',
    country: 'India',
    heroImage: '/img/ladakh.jpg',
    tagline: 'Land of High Passes, Ancient Tibetan Monasteries & Cobalt Lakes',
    tags: ['mountain', 'adventure', 'offbeat', 'nature'],
    rating: 4.8,
    reviews: 11100,
    safetyScore: 4.7,
    idealDuration: '6–9 Days',
    budgetPerDay: { budget: '₹1,800', mid: '₹4,000', luxury: '₹10,500' },
    bestSeason: 'May – Sep',
    overview: 'A high-altitude desert plateau situated above 3,000 meters between the Karakoram and Great Himalaya ranges. Ladakh is a realm of lunar landscapes, fluttering Tibetan prayer flags, centuries-old cliffside monasteries, and the shimmering high-altitude saline waters of Pangong Tso.',
    
    gallery: [
      { url: '/img/ladakh.jpg', caption: 'The shifting turquoise and cobalt hues of Pangong Tso lake at 4,350m', tag: 'Lake' },
      { url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80', caption: 'Thiksey Monastery perched majestically on a hill like a mini Potala Palace', tag: 'Monastery' },
      { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', caption: 'Double-humped Bactrian camels grazing on the white sand dunes of Nubra Valley', tag: 'Desert' },
      { url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80', caption: 'Dramatic winding roads crossing Khardung La, one of the highest motorable passes', tag: 'Pass' },
      { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', caption: 'Stupa prayer flags fluttering against the deep indigo Himalayan sky', tag: 'Culture' }
    ],

    whyVisit: [
      {
        title: 'Otherworldly High-Altitude Landscapes',
        description: 'Drive along barren moonscapes, across mountain passes over 17,500 feet, and beside surreal salt lakes reflecting snow peaks.',
        icon: '🌌'
      },
      {
        title: 'Living Tibetan Buddhist Culture',
        description: 'Listen to monks chant at dawn in ancient monasteries like Thiksey, Hemis, and Diskit with giant golden Buddha statues.',
        icon: '☸️'
      },
      {
        title: 'Epic Motorbiking & Road Trips',
        description: 'Embark on the bucket-list trans-Himalayan road expedition across Khardung La, Chang La, and through the Nubra sand dunes.',
        icon: '🏍️'
      },
      {
        title: 'World-Class Stargazing',
        description: 'Experience pollution-free dark skies at Hanle Dark Sky Reserve and Pangong, where the Milky Way is visible to the naked eye.',
        icon: '✨'
      }
    ],

    culture: {
      summary: 'Ladakhi culture is deeply entwined with Vajrayana Buddhism, sustainable mountain self-reliance, and warm community solidarity.',
      history: 'Once an independent Himalayan kingdom, Ladakh stood at the crossroads of vital silk route trading paths connecting India, Tibet, China, and Central Asia.',
      traditions: 'Masked sacred Cham dances by lamas, traditional Goncha wool robes, Losar new year rituals, and communal dry-toilet conservation architecture.',
      festivals: [
        { name: 'Hemis Festival', timing: 'June / July', description: 'World-famous 2-day festival celebrating Guru Padmasambhava with vibrant masked Cham dances in the courtyard of Hemis Monastery.' },
        { name: 'Ladakh Festival', timing: 'September', description: 'Spectacular cultural showcase through Leh featuring traditional archery, polo tournaments, and mask dances.' },
        { name: 'Losar (Ladakhi New Year)', timing: 'December', description: 'Warm family festival marked by lighting butter lamps on rooftops and offering prayers for prosperity.' }
      ],
      etiquette: [
        'MANDATORY: Spend your first 48 hours in Leh resting to acclimatize to high altitude (3,500m); do not exert yourself.',
        'Walk around stupas and monastery shrines in a clockwise direction.',
        'Carry reusable water bottles; refill at filtered water stations to eliminate single-use plastic in the fragile ecosystem.'
      ],
      language: {
        primary: 'Ladakhi (Bhoti), Hindi & English',
        phrases: [
          { phrase: 'Julley!', meaning: 'Hello / Welcome / Thank you / Goodbye (All-in-one)' },
          { phrase: 'Khamzang?', meaning: 'Are you doing well?' },
          { phrase: 'O-le', meaning: 'Yes / Alright' }
        ]
      }
    },

    cuisine: {
      summary: 'Hearty high-altitude comfort food designed to provide endurance in freezing mountain climates, emphasizing barley, yak dairy, root vegetables, and hot broth.',
      signatureDishes: [
        { name: 'Thukpa', type: 'veg', description: 'Steaming bowl of hand-pulled noodles, local vegetables, and aromatic ginger broth.' },
        { name: 'Momos with Chutney', type: 'non-veg', description: 'Juicy steamed dumplings stuffed with mountain mutton or vegetables, paired with spicy red chilli sauce.' },
        { name: 'Skyu', type: 'veg', description: 'Traditional Ladakhi stew made with thumb-sized wheat pasta nuggets, root turnips, potatoes, and meat or lentils.' },
        { name: 'Tsampa with Butter Tea', type: 'veg', description: 'Nutritious roasted barley flour mixed with warm salted butter tea (Gur Gur Chai).' }
      ],
      famousFoodSpots: [
        { name: 'The Tibetan Kitchen', specialty: 'Authentic Skyu, Shaphalay and hot Thukpa', location: 'Fort Road, Leh' },
        { name: 'Bon Appetit', specialty: 'Wood-fired pizzas and Ladakhi fusion with mountain views', location: 'Changspa, Leh' },
        { name: 'Gesmo Restaurant', specialty: 'Yak cheese sandwiches, freshly baked apple crumble & breakfast', location: 'Main Bazaar, Leh' }
      ],
      localBeverages: ['Gur Gur Chai (Salted Butter Tea)', 'Seabuckthorn Warm Nectar', 'Chhang (fermented barley beer)', 'Apricot Juice']
    },

    attractions: [
      { name: 'Pangong Tso Lake', category: 'Nature & Landscape', description: 'Breathtaking 134-km long endorheic lake at 4,350m, famous for changing color from turquoise to indigo throughout the day.', bestTime: 'Late afternoon and early morning sunrise', insiderTip: 'Temperatures drop below freezing at night; dress in four warm layers even in mid-summer.' },
      { name: 'Thiksey Monastery', category: 'Monastery', description: 'Magnificent 12-story hilltop complex resembling Lhasa’s Potala Palace, housing a 15-meter statue of Maitreya Buddha.', bestTime: 'Dawn 6:00 AM for morning monk prayer chants', insiderTip: 'Sit quietly along the prayer hall wall during morning puja to experience deeply moving reverberating horn chants.' },
      { name: 'Nubra Valley & Hunder Sand Dunes', category: 'Desert & Oasis', description: 'High-altitude cold desert where rare double-humped Bactrian camels roam white sand dunes flanked by snow peaks.', bestTime: 'Late afternoon 4:00 PM – 6:30 PM', insiderTip: 'Stay in the organic village of Turtuk, one of the northernmost settlements in India near the LoC.' },
      { name: 'Khardung La Pass', category: 'High Pass', description: 'Legendary mountain pass at 5,359 meters (17,582 ft), offering staggering views across the Indus Valley to the Zanskar Range.', bestTime: 'Morning before winds pick up', insiderTip: 'Do not stay at the pass summit for more than 20 minutes due to low oxygen levels.' },
      { name: 'Shanti Stupa', category: 'Viewpoints', description: 'White-domed Buddhist stupa built by Japanese and Ladakhi monks atop a steep hill overlooking the city of Leh.', bestTime: 'Sunset for spectacular golden panoramic photography', insiderTip: 'Climb the 500 stairs only after acclimatizing, or hire a taxi up the paved back road.' }
    ],

    weather: {
      overview: 'Extreme high-altitude cold desert climate with sub-zero freezing winters and sunny, dry summer days.',
      bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
      temperature: { min: -25, max: 25 },
      seasons: [
        { name: 'Summer (May – Sep)', months: 'May to September', tempRange: '10°C to 25°C', highlights: 'All mountain passes open, shimmering lakes, festivals, optimal road trip conditions.', advice: 'Strong UV index; carry SPF 50+ sunscreen, polarized sunglasses, and lip balm.' },
        { name: 'Shoulder Autumn (Oct)', months: 'October', tempRange: '-5°C to 15°C', highlights: 'Golden poplar trees, zero crowds, crystal clear night skies.', advice: 'Early snow can close high passes; flights remain the most reliable entry.' },
        { name: 'Winter (Nov – Apr)', months: 'November to April', tempRange: '-25°C to 5°C', highlights: 'Frozen Zanskar River Chadar Trek, snow leopard spotting expeditions.', advice: 'Extreme survival conditions; specialized thermal gear and guides mandatory.' }
      ]
    },

    safety: {
      score: 4.7,
      womenTravelerNote: 'Ladakh has exceptionally low crime rates and is considered one of the safest regions on earth for solo female travelers, respected by monks and local communities.',
      tips: [
        'CRITICAL: Acute Mountain Sickness (AMS) can be fatal. Take Diamox if prescribed, drink 4L of water daily, and rest the entire first 2 days in Leh.',
        'Obtain an Inner Line Permit (ILP) online or in Leh for visiting Pangong, Nubra, Tso Moriri, and Hanle.',
        'Cellular connectivity outside Leh is mostly limited to postpaid Jio and BSNL SIM cards.'
      ],
      emergencyContacts: {
        police: '01982-252283 / 112',
        hospital: 'SNM Hospital Leh: 01982-252014',
        touristHelpline: 'Ladakh Tourism Information Centre: 01982-252297'
      }
    },

    transport: {
      air: { title: 'Airport', airport: 'Kushok Bakula Rimpochee Airport (IXL), Leh', distance: 'In Leh town', details: 'Morning flights from Delhi, Mumbai, Chandigarh, and Srinagar.' },
      train: { title: 'Nearest Railway', station: 'Jammu Tawi (700 km) / Chandigarh', details: 'No rail connectivity directly in Ladakh; entry via air or highway.' },
      road: { title: 'Highways', highways: 'Manali-Leh Highway & Srinagar-Leh Highway', details: 'Iconic 2-day trans-Himalayan road trip open June through October.' },
      localCommute: ['Leh Taxi Union 4x4 vehicles (regulated fixed rates)', 'Rented Royal Enfield / Himalayan motorbikes', 'Bicycle rentals in Leh bazaar']
    }
  },

  andaman: {
    id: 'andaman',
    name: 'Andaman',
    state: 'A&N Islands',
    country: 'India',
    heroImage: '/img/andaman.jpg',
    tagline: 'Untouched Coral Atolls, Turquoise Waters & Historic Island Sanctuary',
    tags: ['island', 'diving', 'beach', 'nature'],
    rating: 4.7,
    reviews: 8400,
    safetyScore: 4.8,
    idealDuration: '5–7 Days',
    budgetPerDay: { budget: '₹2,000', mid: '₹4,500', luxury: '₹11,000' },
    bestSeason: 'Oct – May',
    overview: 'An emerald archipelago of over 500 tropical islands in the Bay of Bengal. Andaman is an exotic tropical paradise of luminescent bioluminescent beaches, world-renowned scuba diving among vibrant coral gardens, dense mangrove rain forests, and poignant freedom-struggle heritage at Cellular Jail.',
    
    gallery: [
      { url: '/img/andaman.jpg', caption: 'White silica sands and turquoise waters of Radhanagar Beach on Havelock Island', tag: 'Beach' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', caption: 'Scuba diver exploring kaleidoscopic coral reefs at Elephant Beach', tag: 'Diving' },
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', caption: 'Natural limestone bridge formation sculpted by ocean tides on Neil Island', tag: 'Geology' },
      { url: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=1200&q=80', caption: 'Historical wings of Cellular Jail (Kala Pani) standing in solemn memory', tag: 'Heritage' },
      { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', caption: 'Tropical sunset casting pink reflections over Kalapathar Beach driftwood', tag: 'Sunset' }
    ],

    whyVisit: [
      {
        title: 'Asia’s Best Beach: Radhanagar Beach',
        description: 'Repeatedly voted among the top 10 beaches on Earth by Time and TripAdvisor for its blinding white silica sands and gentle azure surf.',
        icon: '🏝️'
      },
      {
        title: 'World-Class Scuba Diving & Snorkeling',
        description: 'Dive alongside sea turtles, manta rays, reef sharks, and clownfish in crystal clear visibility reaching up to 30 meters.',
        icon: '🤿'
      },
      {
        title: 'Bioluminescent Kayaking',
        description: 'Paddle through nocturnal mangrove waterways on Havelock as glowing plankton illuminate your paddle strokes in electric blue light.',
        icon: '✨'
      },
      {
        title: 'Poignant Freedom Heritage',
        description: 'Step inside the historic Cellular Jail in Port Blair, where Indian freedom fighters endured exile, honored in a daily sound-and-light tribute.',
        icon: '🏛️'
      }
    ],

    culture: {
      summary: 'A unique cultural mosaic uniting indigenous tribal histories (Great Andamanese, Sentinelese, Jarawas) with settlers from Bengal, Tamil Nadu, Kerala, and Myanmar.',
      history: 'Used by the British as a penal colony (Kala Pani) from 1858 onward to exile political prisoners fighting for Indian independence.',
      traditions: 'Ocean fishing, island boat building, coconut shell handicrafts, and tribal shell carving.',
      festivals: [
        { name: 'Island Tourism Festival', timing: 'January', description: 'A grand 10-day cultural fiesta in Port Blair featuring music, drama, tribal arts, and water-sport tournaments.' },
        { name: 'Subhash Mela', timing: 'January', description: 'Week-long celebration in Havelock commemorating the hoisting of the tricolor by Netaji Subhash Chandra Bose in 1943.' },
        { name: 'Monsoon Music Festival', timing: 'August', description: 'Celebration of island rains with indie acoustic performances and seafood fairs.' }
      ],
      etiquette: [
        'Interacting with, photographing, or approaching indigenous tribal populations (Jarawas) is strictly illegal under Indian law.',
        'Do not touch or stand on living coral reefs while snorkeling; marine protection laws are rigorously enforced.',
        'Collecting sea shells from beaches without an official forest department receipt is prohibited at airport checkpoints.'
      ],
      language: {
        primary: 'Hindi, Bengali, Tamil, Telugu & English',
        phrases: [
          { phrase: 'Vanakkam', meaning: 'Respectful greeting' },
          { phrase: 'Kemon aachen?', meaning: 'How are you?' },
          { phrase: 'Dhanyavaad', meaning: 'Thank you' }
        ]
      }
    },

    cuisine: {
      summary: 'Freshly hauled oceanic seafood infused with coconut milk, aromatic southern spices, and Burmese and Bengali culinary nuances.',
      signatureDishes: [
        { name: 'Grilled Andaman Red Snapper', type: 'non-veg', description: 'Whole fresh reef fish marinated in lime, garlic, and cracked pepper, grilled on charcoal.' },
        { name: 'Coconut Prawn Curry', type: 'non-veg', description: 'Succulent bay prawns simmered gently with raw mango slices, coconut cream, and curry leaves.' },
        { name: 'Machher Jhol (Island Style)', type: 'non-veg', description: 'Spicy Bengali style fish curry prepared with fresh catch and panch phoran spices.' },
        { name: 'Banana Flower Thor Curry', type: 'veg', description: 'Traditional island vegetarian dish made with tender banana stem, mustard paste, and grated coconut.' }
      ],
      famousFoodSpots: [
        { name: 'Full Moon Cafe', specialty: 'Seafood pasta, fresh grilled fish & beach beanbags', location: 'Dive India, Havelock' },
        { name: 'Something Different - A Beachside Cafe', specialty: 'Artisanal coastal cuisine and wood-fired pizza', location: 'Beach No. 2, Havelock' },
        { name: 'New Lighthouse Restaurant', specialty: 'Lobster, crab, and open-air harbour views', location: 'Port Blair' }
      ],
      localBeverages: ['Fresh King Coconut Water (tender Daab)', 'Sugarcane ginger crush', 'Pineapple lemongrass coolers', 'Island Spiced Rum cocktails']
    },

    attractions: [
      { name: 'Radhanagar Beach (Beach No. 7)', category: 'Beach', description: 'World-renowned 2-km powdery white sand shoreline fringed by tropical rainforest and gentle turquoise waves.', bestTime: 'Afternoon 3:00 PM through golden sunset', insiderTip: 'Walk 10 minutes to the right side of the main entry to discover quiet, empty stretches of sand.' },
      { name: 'Cellular Jail National Memorial', category: 'Heritage', description: 'Historic three-story colonial panopticon prison where Veer Savarkar and freedom fighters were incarcerated.', bestTime: 'Morning museum tour + Evening 6:00 PM Sound & Light show', insiderTip: 'Book Sound & Light show tickets online at least 3 days in advance during peak season.' },
      { name: 'Elephant Beach & Coral Reef', category: 'Marine & Water Sports', description: 'Shallow turquoise bay famous for sea walking, glass-bottom boat excursions, and vibrant reef snorkeling.', bestTime: 'Morning 8:30 AM – 12:30 PM', insiderTip: 'Take the scenic 30-minute nature walk through the jungle trail instead of the boat for a peaceful trek.' },
      { name: 'Neil Island (Shaheed Dweep)', category: 'Relaxation & Nature', description: 'Tranquil laid-back island known for Bharatpur Beach coral, Laxmanpur sunset cliffs, and the natural rock bridge.', bestTime: 'Full-day or overnight trip', insiderTip: 'Rent a bicycle to explore Neil Island at your own relaxed pace.' },
      { name: 'Baratang Island & Limestone Caves', category: 'Adventure', description: 'Speedboat voyage through dense mangrove creeks leading to ancient geological limestone stalactite caverns.', bestTime: 'Early morning day trip from Port Blair', insiderTip: 'Boat convoy departures through the tribal reserve are strictly scheduled; depart Port Blair by 4:00 AM.' }
    ],

    weather: {
      overview: 'Warm tropical maritime climate with balmy sea breezes throughout the year and heavy tropical monsoons.',
      bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
      temperature: { min: 22, max: 32 },
      seasons: [
        { name: 'Peak Season (Oct – May)', months: 'October to May', tempRange: '23°C to 30°C', highlights: 'Glassy calm seas, up to 30m scuba visibility, ferry sailings on time, turtle nesting.', advice: 'Book inter-island high-speed ferries (Makruzz / Nautika) in advance.' },
        { name: 'Monsoon Season (Jun – Sep)', months: 'June to September', tempRange: '24°C to 30°C', highlights: 'Lush tropical forests, uncrowded resorts, romantic storm vistas.', advice: 'High waves can disrupt inter-island catamarans and scuba diving.' }
      ]
    },

    safety: {
      score: 4.8,
      womenTravelerNote: 'Andaman is one of India’s safest union territories with virtually non-existent violent crime, strict police presence, and respectful tourism communities.',
      tips: [
        'Always wear life jackets on inter-island boats and during water activities.',
        'Internet connectivity on islands is reliant on the undersea cable; BSNL and Airtel offer the best 4G coverage.',
        'Never swim in unauthorized coastal creeks marked with Saltwater Crocodile warning signboards.'
      ],
      emergencyContacts: {
        police: '03192-232100 / 112',
        hospital: 'G.B. Pant Hospital Port Blair: 03192-232102',
        touristHelpline: 'Directorate of Tourism: 03192-232694'
      }
    },

    transport: {
      air: { title: 'Airport', airport: 'Veer Savarkar International Airport (IXZ), Port Blair', distance: 'In Port Blair town', details: 'Direct flights from Chennai, Kolkata, Delhi, Bengaluru, and Hyderabad.' },
      train: { title: 'Railways', station: 'None (Island territory)', details: 'Access exclusively by air or multi-day passenger ships from Chennai/Kolkata.' },
      road: { title: 'Inter-Island', highways: 'Andaman Trunk Road (ATR)', details: 'Connects South, Middle, and North Andaman across vehicle ferry creeks.' },
      localCommute: ['Private luxury catamarans (Makruzz, Nautika, Green Ocean)', 'Scooter rentals on Havelock and Neil (₹400–₹600/day)', 'Government inter-island ferries']
    }
  },

  coorg: {
    id: 'coorg',
    name: 'Coorg',
    state: 'Karnataka',
    country: 'India',
    heroImage: '/img/coorg.jpg',
    tagline: 'Scotland of India, Misty Coffee Estates & Valiant Kodava Culture',
    tags: ['hill', 'nature', 'coffee', 'waterfalls'],
    rating: 4.4,
    reviews: 8700,
    safetyScore: 4.5,
    idealDuration: '3–4 Days',
    budgetPerDay: { budget: '₹1,500', mid: '₹3,200', luxury: '₹7,800' },
    bestSeason: 'Oct – Apr',
    overview: 'Perched along the emerald slopes of the Western Ghats at 1,150 meters, Kodagu (Coorg) is celebrated as the "Scotland of India." Renowned for its rolling arabica and robusta coffee plantations, spice trails, roaring waterfalls, elephant sanctuaries, and the proud martial heritage of the Kodava people.',
    
    gallery: [
      { url: '/img/coorg.jpg', caption: 'Lush green mist rolling across coffee plantations in Madikeri', tag: 'Plantations' },
      { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80', caption: 'The gushing torrent of Abbey Falls surrounded by spice groves', tag: 'Waterfalls' },
      { url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80', caption: 'Golden statues inside the majestic Namdroling Tibetan Monastery (Golden Temple)', tag: 'Spiritual' },
      { url: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80', caption: 'Elephants bathing in the sacred Kaveri River at Dubare Elephant Camp', tag: 'Wildlife' },
      { url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80', caption: 'Sunset vistas from Raja’s Seat overlooking the rolling Western Ghat valleys', tag: 'Viewpoints' }
    ],

    whyVisit: [
      {
        title: 'Authentic Coffee & Spice Estates',
        description: 'Wake up to birdsong in heritage homestays, tour working coffee plantations, and learn how black pepper, cardamom, and vanilla are harvested.',
        icon: '☕'
      },
      {
        title: 'Namdroling Golden Temple',
        description: 'Discover the largest Tibetan settlement in South India at Bylakuppe, with three 40-foot gilded Buddha statues and thousands of chanting monks.',
        icon: '🏯'
      },
      {
        title: 'Wildlife & Elephant Encounters',
        description: 'Participate in elephant grooming and bathing at Dubare Elephant Camp along the banks of the sacred Kaveri River.',
        icon: '🐘'
      },
      {
        title: 'Epic Western Ghat Treks',
        description: 'Hike to the windy heights of Tadiandamol (highest peak in Coorg) or take a thrilling 4x4 Jeep trail to Mandalpatti viewpoint.',
        icon: '🥾'
      }
    ],

    culture: {
      summary: 'The Kodavas are a unique indigenous martial community celebrated for their bravery, distinct dress (Kupya), reverence for ancestors and nature, and fierce warrior spirit.',
      history: 'Kodagu was an independent kingdom ruled by the Haleri dynasty until annexed by the British in 1834. It holds the proud honor of producing India’s first Commander-in-Chief, Field Marshal K.M. Cariappa.',
      traditions: 'Sacred groves (Devarakadu), Kodava hockey festival (one of the world’s largest family sports tournaments), and traditional sword ceremonies (Peeche Kathi).',
      festivals: [
        { name: 'Kailpodh (Festival of Weapons)', timing: 'September', description: 'Unique harvest and martial festival where agricultural tools and traditional firearms are cleaned, decorated, and worshipped.' },
        { name: 'Kaveri Sankramana', timing: 'October', description: 'Sacred day marking the miraculous gush of water at Talakaveri, the source of the holy River Kaveri.' },
        { name: 'Puttari (Harvest Festival)', timing: 'November / December', description: 'Jubilant harvest festival celebrated with traditional music, festive sheaves of paddy brought home, and feast dancing.' }
      ],
      etiquette: [
        'Homestay hosts take pride in sharing their heritage; respect property boundaries in private coffee estates.',
        'Remove shoes and silence mobile phones inside the Namdroling Golden Temple prayer halls.',
        'Avoid driving on remote estate trails after dark due to roaming wild elephants.'
      ],
      language: {
        primary: 'Kodava Takk, Kannada & English',
        phrases: [
          { phrase: 'Vanakkam / Namaskara', meaning: 'Hello / Greetings' },
          { phrase: 'Channa aathira?', meaning: 'Are you doing well?' },
          { phrase: 'Dhanhyavaada', meaning: 'Thank you' }
        ]
      }
    },

    cuisine: {
      summary: 'Kodava cuisine is distinct from mainland Karnataka, celebrated for its use of wild mushrooms, bamboo shoots, raw jackfruit, and tart Kachampuli vinegar.',
      signatureDishes: [
        { name: 'Pandi Curry (Kodava Pork)', type: 'non-veg', description: 'Legendary dark spicy pork curry stewed with roasted ground spices and tart black Kachampuli vinegar.' },
        { name: 'Kadambuttu with Chutney', type: 'veg', description: 'Steamed round rice dumplings seasoned with grated coconut, traditionally paired with spicy curries.' },
        { name: 'Bamboo Shoot Curry (Bimbale)', type: 'veg', description: 'Tender monsoon bamboo shoots cooked with mustard, coconut, and green chillies.' },
        { name: 'Akki Roti', type: 'veg', description: 'Crisp, wholesome rice flatbread cooked on griddles and served with fresh homemade white butter and honey.' }
      ],
      famousFoodSpots: [
        { name: 'Coorg Cuisine', specialty: 'Authentic Pandi Curry, Kadambuttu and Bamboo Shoot fry', location: 'Main Road, Madikeri' },
        { name: 'Raintree Restaurant', specialty: 'Heritage bungalow dining with South Indian and Kodava specialities', location: 'Opp. Town Hall, Madikeri' },
        { name: 'Taste of Coorg', specialty: 'Homemade pork ribs, local chicken curry, and fresh Kaveri fish', location: 'Stuart Hill, Madikeri' }
      ],
      localBeverages: ['Freshly brewed Estate Filter Coffee', 'Homemade passion fruit wine', 'Bella Kaapi (jaggery coffee)', 'Kachampuli herbal coolers']
    },

    attractions: [
      { name: 'Abbey Falls', category: 'Waterfalls', description: 'Spectacular cascade crashing down a 70-foot rock face into a deep pool, surrounded by dense coffee and spice estates.', bestTime: 'Morning 9:00 AM – 11:30 AM', insiderTip: 'Cross the hanging footbridge opposite the falls for the best spray-free wide-angle photo.' },
      { name: 'Namdroling Monastery (Golden Temple)', category: 'Spiritual', description: 'The magnificent Tibetan monastery at Bylakuppe housing three 40-foot gold-plated Buddha statues surrounded by murals.', bestTime: 'Morning 9 AM or 1:00 PM prayer', insiderTip: 'Visit the monastery shopping arcade for authentic Tibetan silver jewelry, incense, and herbal medicines.' },
      { name: 'Raja’s Seat', category: 'Viewpoints', description: 'Historic seasonal garden pavilion where Kodagu kings enjoyed sweeping sunsets over misty mountain ravines.', bestTime: 'Sunset 5:00 PM – 6:30 PM', insiderTip: 'A musical fountain show begins right after sunset; arrive early to secure a stone bench.' },
      { name: 'Dubare Elephant Camp', category: 'Wildlife', description: 'State eco-tourism camp on the Kaveri River where visitors can observe elephant bathing, feeding, and educational sessions.', bestTime: 'Morning 8:30 AM – 10:30 AM', insiderTip: 'River crossing by boat is required to reach the camp; check morning water levels during monsoon.' },
      { name: 'Mandalpatti Peak', category: 'Adventure & Scenic', description: 'A windswept hilltop ridge at 4,050 feet reached via a thrilling 4x4 Jeep ride over rugged boulders.', bestTime: 'Sunrise 5:30 AM – 7:30 AM', insiderTip: 'Hire only 4WD Jeeps from Madikeri as normal passenger vehicles cannot navigate the final 5 km trail.' }
    ],

    weather: {
      overview: 'Subtropical highland climate with perpetually pleasant weather, mist-draped mornings, and torrential monsoon deluges.',
      bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      temperature: { min: 11, max: 29 },
      seasons: [
        { name: 'Post-Monsoon & Winter (Oct – Mar)', months: 'October to March', tempRange: '12°C to 26°C', highlights: 'Crisp misty mornings, lush green valleys, pleasant daytime temperatures, coffee harvest season.', advice: 'Light jackets or sweaters recommended for evenings and early morning plantation walks.' },
        { name: 'Summer (Apr – May)', months: 'April to May', tempRange: '18°C to 30°C', highlights: 'Coffee blossom season with sweet jasmine-like fragrances filling the entire valley.', advice: 'Much cooler than the southern plains; great family getaway.' },
        { name: 'Monsoon (Jun – Sep)', months: 'June to September', tempRange: '16°C to 24°C', highlights: 'Roaring waterfalls, dense mist, dramatic tropical rains.', advice: 'Leeches are common on plantation walks; carry salt or tobacco powder.' }
      ]
    },

    safety: {
      score: 4.5,
      womenTravelerNote: 'Coorg is one of South India’s most peaceful and hospitable hill retreats with licensed family-run estate homestays offering safe, gated accommodations.',
      tips: [
        'Avoid driving through isolated forest roads after 8 PM; wildlife (elephants and boars) cross highways frequently.',
        'Carry insect repellent and sturdy hiking boots when walking through coffee plantations.',
        'Keep offline maps downloaded as cellular signal can be weak inside dense plantation valleys.'
      ],
      emergencyContacts: {
        police: '08272-225222 / 112',
        hospital: 'District Hospital Madikeri: 08272-228343',
        touristHelpline: 'Karnataka Tourism Information: 080-22352828'
      }
    },

    transport: {
      air: { title: 'Nearest Airports', airport: 'Kannur (CNN: 90 km) & Mangalore (IXE: 135 km)', distance: '~2.5 to 3.5 hours drive', details: 'Direct flights from Mumbai, Delhi, Bengaluru, and Middle East.' },
      train: { title: 'Nearest Railway', station: 'Mysuru Junction (MYS)', distance: '115 km (~2.5 hours drive)', details: 'Frequent Shatabdi and express trains connecting Bengaluru and Chennai.' },
      road: { title: 'Highway', highways: 'NH-275 via Bengaluru & Mysuru', details: 'Scenic 5-hour drive from Bengaluru via the 10-lane expressway to Mysuru.' },
      localCommute: ['Self-drive car and taxi rentals', 'Local private and KSRTC town buses', 'Auto-rickshaws for short distances around Madikeri']
    }
  },

  munnar: {
    id: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    country: 'India',
    heroImage: '/img/munnar.jpg',
    tagline: 'Rolling Emerald Tea Gardens, Shola Forests & Nilgiri Tahr Sanctuaries',
    tags: ['tea', 'nature', 'hills', 'scenic'],
    rating: 4.5,
    reviews: 13500,
    safetyScore: 4.6,
    idealDuration: '3–4 Days',
    budgetPerDay: { budget: '₹1,300', mid: '₹2,900', luxury: '₹7,200' },
    bestSeason: 'Sep – May',
    overview: 'Perched at 1,600 meters at the confluence of three mountain streams (Mudhirapuzha, Nallathanni, and Kundaly), Munnar is the crown jewel of God’s Own Country. Celebrated worldwide for its endlessly rolling manicured tea carpets, colonial estates, endangered Nilgiri Tahr mountain goats, and the rare Neelakurinji flower that blooms once every 12 years.',
    
    gallery: [
      { url: '/img/munnar.jpg', caption: 'Rolling velvet-green tea plantation hills under morning mountain mist', tag: 'Tea' },
      { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', caption: 'The endangered Nilgiri Tahr mountain goat on the granite crags of Eravikulam', tag: 'Wildlife' },
      { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', caption: 'Reflection of mist and pine trees on the still waters of Mattupetty Dam', tag: 'Lakes' },
      { url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80', caption: 'Traditional tea plucker carrying fresh green leaves in woven baskets', tag: 'Culture' },
      { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', caption: 'Sunset silhouettes over Kolukkumalai, the highest organic tea estate in the world', tag: 'Sunset' }
    ],

    whyVisit: [
      {
        title: 'World’s Highest Tea Plantations',
        description: 'Take a thrilling 4x4 Jeep safari up to Kolukkumalai (2,400m), the highest tea estate in the world, renowned for panoramic sunrise cloud inversions.',
        icon: '🍃'
      },
      {
        title: 'Eravikulam & The Nilgiri Tahr',
        description: 'Encounter the endangered wild mountain goats roaming the alpine grasslands of Eravikulam National Park beneath South India’s highest peak, Anamudi (2,695m).',
        icon: '🐐'
      },
      {
        title: 'Spices & Ayurvedic Rejuvenation',
        description: 'Explore aromatic cardamom and cinnamon plantations and rejuvenate with traditional Kerala Ayurvedic Abhyanga massages.',
        icon: '🌿'
      },
      {
        title: 'Lakes, Dams & Echo Point',
        description: 'Enjoy speedboat rides across Mattupetty and Kundala lakes, surrounded by eucalyptus groves and wild elephant corridors.',
        icon: '🚤'
      }
    ],

    culture: {
      summary: 'A tranquil confluence of British colonial planter traditions, Tamil tea workers’ heritage, and Kerala’s ancient indigenous mountain tribes (Mannan and Muthuvan).',
      history: 'Discovered by British planters in the late 19th century who developed the hill station into the headquarters of the Kannan Devan Tea Company.',
      traditions: 'Traditional Orthodox tea processing, Kathakali martial dance performances, and Kalaripayattu ancient martial art displays.',
      festivals: [
        { name: 'Neelakurinji Blooming', timing: 'Once every 12 years', description: 'Phenomenal natural phenomenon turning the entire mountain valley into a purple-blue carpet.' },
        { name: 'Onam', timing: 'August / September', description: 'Kerala’s grand harvest festival celebrated with floral carpets (Pookkalam) and lavish Onam Sadya feasts.' },
        { name: 'Vishu', timing: 'April', description: 'Malayalam New Year marked by auspicious morning viewings (Vishukkani) and gift exchanges.' }
      ],
      etiquette: [
        'Do not pluck tea leaves or walk through private plantation bushes without permission.',
        'Respect wild elephants; never honk, shout, or step out of vehicles if elephants are crossing the forest highway.',
        'Eravikulam National Park closes for calving season (usually February to March) each year.'
      ],
      language: {
        primary: 'Malayalam, Tamil & English',
        phrases: [
          { phrase: 'Namaskaram', meaning: 'Respectful greeting / Hello' },
          { phrase: 'Sukhamano?', meaning: 'Are you doing well?' },
          { phrase: 'Nanni', meaning: 'Thank you' }
        ]
      }
    },

    cuisine: {
      summary: 'Authentic Kerala culinary excellence rich with fresh coconut milk, black pepper, curry leaves, and spicy fish pollichathu.',
      signatureDishes: [
        { name: 'Appam with Vegetable Stew', type: 'veg', description: 'Fluffy fermented rice and coconut hoppers served with a gentle coconut milk stew infused with whole cloves.' },
        { name: 'Kerala Karimeen Pollichathu', type: 'non-veg', description: 'Pearl spot fish smeared with spicy shallot-chilli masala, wrapped in a banana leaf and pan-roasted.' },
        { name: 'Malabar Parotta with Chicken Curry', type: 'non-veg', description: 'Flaky layered spiral flatbread served with aromatic slow-braised pepper chicken curry.' },
        { name: 'Puttu with Kadala Curry', type: 'veg', description: 'Steamed cylinders of ground rice and grated coconut served with black chickpea curry.' }
      ],
      famousFoodSpots: [
        { name: 'Saravana Bhavan', specialty: 'Crispy ghee roast dosas, idlis, and South Indian filter coffee', location: 'Munnar Town' },
        { name: 'Rapsy Restaurant', specialty: 'Legendary Spanish omelettes, beef fry and flaky parottas', location: 'Main Bazaar' },
        { name: 'Hill Spice Restaurant', specialty: 'Traditional Kerala Sadya and fresh river fish curries', location: 'Chinnakanal' }
      ],
      localBeverages: ['Freshly brewed Single-Estate Black Tea', 'Cardamom Spiced Chai', 'Karippu Kaapi (jaggery spiced coffee)', 'Fresh coconut water']
    },

    attractions: [
      { name: 'Eravikulam National Park', category: 'Wildlife & Nature', description: 'Home to the world’s largest surviving population of Nilgiri Tahr and the majestic peak of Anamudi.', bestTime: 'Morning 8:00 AM – 10:30 AM', insiderTip: 'Book entry safari tickets online in advance to skip the long physical queue at the base station.' },
      { name: 'Kolukkumalai Tea Estate Sunrise', category: 'Adventure & Views', description: 'The highest tea plantation on Earth (7,900 ft), reached via a rugged 4x4 Jeep trail to watch clouds part at sunrise.', bestTime: 'Depart hotel by 4:00 AM for sunrise', insiderTip: 'Wear a heavy thermal windbreaker; the summit is freezing before sunrise.' },
      { name: 'Mattupetty Dam & Lake', category: 'Scenic & Boating', description: 'Storage concrete gravity dam surrounded by lush green hills, famous for speedboat rides and wild elephant sightings.', bestTime: 'Late morning 10 AM – 1 PM', insiderTip: 'Combine with a stop at Echo Point, just 15 minutes further along the lake road.' },
      { name: 'Tea Museum (KDHP)', category: 'Heritage & Learning', description: 'Historic tea factory museum showcasing the evolution of Munnar from wild jungle to premier global tea producer.', bestTime: 'Afternoon 1:30 PM – 4:00 PM', insiderTip: 'Attend the tea tasting session to learn how professional blenders distinguish tea flushes.' },
      { name: 'Punarjani Traditional Village', category: 'Culture', description: 'Cultural center offering daily evening performances of Kathakali dramatic dance and Kalaripayattu martial arts.', bestTime: 'Evening shows 5:00 PM – 7:00 PM', insiderTip: 'Arrive 30 minutes early to watch the artists apply their intricate mineral face makeup.' }
    ],

    weather: {
      overview: 'Cool alpine mountain climate year-round, serving as an escape from the tropical heat of the southern plains.',
      bestMonths: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
      temperature: { min: 8, max: 26 },
      seasons: [
        { name: 'Winter (Nov – Feb)', months: 'November to February', tempRange: '9°C to 22°C', highlights: 'Chilly crisp air, mist-covered mornings, clear blue skies, peak tourist season.', advice: 'Light jackets and sweaters necessary for evenings.' },
        { name: 'Summer (Mar – May)', months: 'March to May', tempRange: '15°C to 26°C', highlights: 'Pleasant daytime weather, blooming jacaranda trees, great for trekking.', advice: 'Ideal holiday period for families avoiding summer heat in cities.' },
        { name: 'Monsoon (Jun – Aug)', months: 'June to August', tempRange: '14°C to 20°C', highlights: 'Heavy tropical downpours, roaring waterfalls, misty dreamscapes.', advice: 'Drive carefully on winding ghat roads with potential fog.' }
      ]
    },

    safety: {
      score: 4.6,
      womenTravelerNote: 'Kerala is celebrated for high literacy, social safety, and respect for female travelers, making Munnar one of India’s safest hill stations.',
      tips: [
        'Watch out for thick fog (especially in Chinnakanal and Top Station) when driving in late afternoons.',
        'Never feed or approach wild elephants (popularly known as "Padayappa") spotted on tea estate roads.',
        'Wear shoes with good grip on tea trail walks to prevent slipping on wet clay.'
      ],
      emergencyContacts: {
        police: '04865-230321 / 112',
        hospital: 'Tata Tea General Hospital: 04865-230227',
        touristHelpline: 'Kerala Tourism Help Desk: 1800-425-4747'
      }
    },

    transport: {
      air: { title: 'Nearest Airport', airport: 'Cochin International Airport (COK)', distance: '110 km (~3.5 hours drive)', details: 'Extensive domestic and international flights from all Gulf nations and Indian metros.' },
      train: { title: 'Nearest Railway', station: 'Aluva (AWY) / Ernakulam Jn (ERS)', distance: '115 km (~3.5 hours drive)', details: 'Frequent express trains linking Mumbai, Chennai, Delhi, and Bengaluru.' },
      road: { title: 'Highways', highways: 'Kochi-Dhanushkodi Highway (NH-85)', details: 'A breathtaking winding mountain drive passing Cheeyappara and Valara waterfalls.' },
      localCommute: ['Local auto-rickshaws for short trips', 'Hired private taxis with local hill drivers', 'Rented 4x4 Jeeps for Kolukkumalai']
    }
  },

  varanasi: {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    heroImage: '/img/varanasi.jpg',
    tagline: 'The Eternal Spiritual Capital, Sacred Ghats & Living Antiquity',
    tags: ['spiritual', 'heritage', 'culture', 'history'],
    rating: 4.4,
    reviews: 16800,
    safetyScore: 4.2,
    idealDuration: '3–4 Days',
    budgetPerDay: { budget: '₹1,000', mid: '₹2,500', luxury: '₹6,800' },
    bestSeason: 'Oct – Mar',
    overview: 'Continuously inhabited for over 3,000 years, Varanasi (Kashi / Banaras) is one of the oldest living cities on earth. Revered as the spiritual heart of Hinduism, it is an awe-inspiring spectacle of 84 stone ghats stretching along the crescent bend of the holy Ganges, where birth, life, and eternity intertwine in sacred smoke, Sanskrit chants, and glowing lamps.',
    
    gallery: [
      { url: '/img/varanasi.jpg', caption: 'The grand stone ghats of Varanasi lining the sacred crescent curve of the River Ganges', tag: 'Ghats' },
      { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', caption: 'The mesmerizing Dashashwamedh Ghat Maha Aarti held every evening at twilight', tag: 'Aarti' },
      { url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80', caption: 'Sunrise rowing boat glide along the morning mist of the holy Ganges', tag: 'River' },
      { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', caption: 'Ancient stone alleys and silk weavers of the labyrinthine Old Banaras galis', tag: 'Alleys' },
      { url: 'https://images.unsplash.com/photo-1609137144822-0d1275bb27d4?auto=format&fit=crop&w=1200&q=80', caption: 'The peaceful stupa and deer park of Sarnath where Buddha gave his first sermon', tag: 'Sarnath' }
    ],

    whyVisit: [
      {
        title: 'Maha Ganga Aarti at Dashashwamedh',
        description: 'Experience an unforgettable sensory spectacle of conch shells, incense smoke, and synchronized flaming brass lamps swung by young priests.',
        icon: '🪔'
      },
      {
        title: 'Sunrise Boat Ride on the Ganges',
        description: 'Watch the ancient city wake up at dawn as pilgrims bathe in holy waters, sadhus meditate on stone steps, and gold light floods medieval temples.',
        icon: '🚣'
      },
      {
        title: 'Kashi Vishwanath Temple Corridor',
        description: 'Visit the newly restored grand golden corridor dedicated to Lord Shiva, one of the 12 sacred Jyotirlingas in Hinduism.',
        icon: '🔱'
      },
      {
        title: 'Sarnath: Birthplace of Buddhism',
        description: 'Drive 10 km to Sarnath, where Lord Buddha preached his first sermon after enlightenment under the Bodhi tree in 528 BCE.',
        icon: '☸️'
      }
    ],

    culture: {
      summary: 'Varanasi is the epicenter of classical Indian music (the Benares Gharana of sitar, tabla, and shehnai), Sanskrit scholarship, philosophy, and Banarasi silk weaving.',
      history: 'Mark Twain famously wrote: "Benares is older than history, older than tradition, older even than legend, and looks twice as old as all of them put together."',
      traditions: 'Banarasi silk handloom weaving, evening classical music soirees, river morning baths (Snan), and liberation philosophy (Moksha).',
      festivals: [
        { name: 'Dev Deepawali', timing: 'November (Kartik Poornima)', description: 'The grandest festival in Varanasi when over one million earthen oil lamps (diyas) light up all 84 ghats from end to end.' },
        { name: 'Maha Shivratri', timing: 'February / March', description: 'Electrifying celebration with grand wedding processions of Lord Shiva traversing the ancient alleys to Kashi Vishwanath.' },
        { name: 'Buddha Purnima', timing: 'May', description: 'Sacred commemoration of the birth and enlightenment of Gautama Buddha celebrated with peaceful processions at Sarnath.' }
      ],
      etiquette: [
        'Photography is strictly prohibited at Manikarnika and Harishchandra cremation ghats out of respect for grieving families.',
        'Deposit mobile phones, leather belts, and electronics in official security lockers before entering Kashi Vishwanath Temple.',
        'Agree on boat ride fares beforehand or purchase tickets through the government web portal at Dashashwamedh Ghat.'
      ],
      language: {
        primary: 'Bhojpuri, Hindi & English',
        phrases: [
          { phrase: 'Har Har Mahadev!', meaning: 'Praise to Lord Shiva / Universal Varanasi greeting' },
          { phrase: 'Kaisan baani?', meaning: 'How are you? (Bhojpuri)' },
          { phrase: 'Theek baani', meaning: 'I am doing well' }
        ]
      }
    },

    cuisine: {
      summary: 'Legendary Banarasi street gastronomy is a pure vegetarian celebration of tangy chaats, clay-cup lassis, malaiyo milk froth, and the world-famous Banarasi Paan.',
      signatureDishes: [
        { name: 'Banarasi Tamatar Chaat', type: 'veg', description: 'Warm tangy dish prepared from crushed tomatoes, hing, cumin, ginger, and crispy namak pare in an earthen clay bowl.' },
        { name: 'Kachori Jalebi Breakfast', type: 'veg', description: 'Crispy lentil kachoris served with spicy potato curry, paired with hot crispy saffron jalebis.' },
        { name: 'Malaiyo (Winter Special)', type: 'sweet', description: 'Ephemeral cloud-like dessert whipped from morning dew-exposed milk froth, flavored with saffron, cardamom, and pistachios.' },
        { name: 'Banarasi Meetha Paan', type: 'sweet', description: 'Betel leaf folded with gulkand (rose petal preserve), sweet areca nut, silver foil, and spices, consumed after meals.' }
      ],
      famousFoodSpots: [
        { name: 'Kashi Chaat Bhandar', specialty: 'World-renowned Tamatar Chaat, Dahi Puri and Palak Chaat', location: 'Godowlia Chowk' },
        { name: 'Blue Lassi Shop', specialty: 'Creamy hand-churned lassis topped with pomegranate, mango, and rabri', location: 'Near Manikarnika Ghat' },
        { name: 'Ram Bhandar', specialty: 'Iconic morning Puri Sabzi and piping hot Jalebis', location: 'Thatheri Bazaar' }
      ],
      localBeverages: ['Kulhad Masala Chai with thick malai', 'Bhang Thandai (during festivals)', 'Earthen Cup Peda Lassi', 'Saffron Almond Milk']
    },

    attractions: [
      { name: 'Dashashwamedh Ghat & Evening Aarti', category: 'Spiritual', description: 'The main and liveliest ghat where seven young priests perform the synchronized choreographed Ganga Aarti every evening at twilight.', bestTime: 'Evening 6:15 PM – 7:30 PM', insiderTip: 'Rent a wooden rowing boat on the river facing the ghat for the best unobstructed view away from crowds.' },
      { name: 'Kashi Vishwanath Temple & Corridor', category: 'Heritage & Religion', description: 'One of the holiest shrines in Hinduism dedicated to Lord Shiva, featuring 800 kg of gold plating on its spire.', bestTime: 'Early morning 5:30 AM for Mangala Aarti', insiderTip: 'Carry original government photo ID; check electronic locker facilities outside gate No. 4.' },
      { name: 'Dawn Boat Ride from Assi to Manikarnika', category: 'River Experience', description: 'A timeless 2-hour sunrise rowing boat journey past ancient palaces, wrestling akharas, and river shrines.', bestTime: 'Dawn 5:15 AM – 7:30 AM', insiderTip: 'Choose a traditional wooden hand-rowed boat instead of a motorboat for silent, tranquil photography.' },
      { name: 'Sarnath Archaeological Site & Museum', category: 'Buddhism & History', description: 'The Deer Park where Buddha delivered his first sermon, featuring the massive Dhamek Stupa and the original Lion Capital of Ashoka.', bestTime: 'Morning 9:00 AM – 12:00 PM', insiderTip: 'The archaeological museum contains the original 250 BCE Ashokan Lion Capital that is India’s national emblem.' },
      { name: 'Old City Alleyways (Galas of Kashi)', category: 'Culture & Bazaars', description: 'Medieval maze of narrow winding lanes bustling with wandering sacred cows, brassware craftsmen, and silk weavers.', bestTime: 'Mid-morning or late afternoon', insiderTip: 'Walking is the only way to explore; wear comfortable slip-on walking shoes.' }
    ],

    weather: {
      overview: 'Humid subtropical climate with pleasantly cool winters, scorching dry summers, and heavy monsoon rains along the Ganges.',
      bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      temperature: { min: 8, max: 43 },
      seasons: [
        { name: 'Winter (Oct – Mar)', months: 'October to March', tempRange: '9°C to 28°C', highlights: 'Perfect cool walking weather, morning river mist, Dev Deepawali celebration, Malaiyo sweet in season.', advice: 'A light jacket or shawl is ideal for early dawn boat rides on the water.' },
        { name: 'Summer (Apr – Jun)', months: 'April to June', tempRange: '28°C to 43°C', highlights: 'Uncrowded ghats and temples, mango season.', advice: 'Extreme daytime heat; explore monuments strictly before 9 AM and after sunset.' },
        { name: 'Monsoon (Jul – Sep)', months: 'July to September', tempRange: '25°C to 34°C', highlights: 'The sacred month of Shravan brings thousands of saffron-clad Shiva devotees.', advice: 'High river water levels may submerge lower ghat walkways and boat rides may be restricted.' }
      ]
    },

    safety: {
      score: 4.2,
      womenTravelerNote: 'Varanasi has a warm, spiritual ambiance with dedicated tourist police at major ghats. Keep personal belongings close in crowded temple lanes and bustling bazaars.',
      tips: [
        'Politely decline aggressive self-appointed guides or touts outside temples claiming to skip queues.',
        'Never click photographs of funeral pyres at the burning ghats (Manikarnika and Harishchandra).',
        'Drink only bottled water and eat hot, freshly cooked food from high-turnover busy street food stalls.'
      ],
      emergencyContacts: {
        police: '0542-2508000 / 112',
        hospital: 'BHU Sir Sunderlal Hospital: 0542-2307500',
        touristHelpline: 'UP Tourism Varanasi: 0542-2505030'
      }
    },

    transport: {
      air: { title: 'Airport', airport: 'Lal Bahadur Shastri International Airport (VNS)', distance: '26 km northwest of city', details: 'Direct flights to Delhi, Mumbai, Bengaluru, Hyderabad, Kathmandu, and Sharjah.' },
      train: { title: 'Railways', station: 'Varanasi Junction (BSB) / Pt. Deen Dayal Upadhyaya Jn (DDU)', details: 'Superfast Vande Bharat Express connects New Delhi in just 8 hours.' },
      road: { title: 'Highways', highways: 'NH-19 (Grand Trunk Road)', details: 'Connected smoothly to Prayagraj (2.5 hrs), Lucknow (5 hrs), and Bodh Gaya (5 hrs).' },
      localCommute: ['Battery-operated E-rickshaws for short road trips', 'Traditional hand-rowed wooden boats along the ghats', 'Walking on foot inside the historic walled Old City']
    }
  }
};
