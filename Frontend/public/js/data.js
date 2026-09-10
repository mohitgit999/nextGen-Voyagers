/* ============================================================
   VOYAGER — Data
   All destination data, enriched with weather, transport,
   local emergency contacts, packing extras, and emojis.
   Also: icons map, constants.
   ============================================================ */

'use strict';

/* ===================== ICONS ===================== */
var ICONS = {
  mountain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 19 8 9l3.5 5L15 8l7 11Z"/></svg>',
  wave:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"/><path d="M2 18.5c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"/></svg>',
  arch:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V11a7 7 0 0 1 14 0v10"/><path d="M4 21h16"/></svg>',
  leaf:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-9.5 6.2-15.4 16-16-1 10-7.2 16-16 16Z"/><path d="M4.5 19.5 15 9"/></svg>',
  island:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18.5c2.2-1.2 4.2-1.2 6.3 0s4.2 1.2 6.3 0 4.2-1.2 6.3 0"/><path d="M11.5 18V10"/><path d="M11.5 10c-1.6-1.6-3.2-1.7-4.2-1M11.5 10c1.6-1.6 3.4-1.7 4.6-1M11.5 10c-.7-2.4-.7-4 0-5.4"/></svg>',
  river:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12 7 4l3 5 3-5 5 8"/><path d="M2 20.5c2-1.4 4-1.4 6 0s4 1.4 6 0 4-1.4 6 0"/></svg>',
  diya:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14.5c2.3-1.1 4.6-1.6 9-1.6s6.7.5 9 1.6"/><path d="M3 14.5c0 3 4 5.2 9 5.2s9-2.2 9-5.2"/><path d="M12 4.2c1.7 2 1.7 3.9 0 5.4-1.7-1.5-1.7-3.4 0-5.4Z"/></svg>',
  shield:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>',
  star:     '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="none"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>',
  wallet:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2"/><path d="M3 7v10a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2Z"/><circle cx="17" cy="13" r="1.1" fill="currentColor" stroke="none"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  check:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg>',
  train:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="14" rx="4"/><path d="M4 11h16"/><path d="M8 17l-2 4M16 17l2 4M8 7h.01M16 7h.01"/></svg>',
  plane:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5Z"/></svg>',
  car:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3v-5l2-5h14l2 5v5h-2M7 17h10M7 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/></svg>',
  phone:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
  map:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>',
  share:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  print:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  backpack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0-6-4-8-8-8S4 4 4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Z"/><path d="M9 2a5 5 0 0 0 6 0M12 12v4"/><circle cx="12" cy="10" r="2"/></svg>',
  sunny:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  rainy:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="23" x2="8" y2="25"/><line x1="12" y1="18" x2="12" y2="20"/><line x1="12" y1="22" x2="12" y2="24"/><line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="23" x2="16" y2="25"/></svg>',
  snow:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 6-8 4-8-4M20 18l-8-4-8 4M4 9l4 2M16 9l4 2M4 15l4-2M16 15l4-2"/></svg>',
  close:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>',
  arrow:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  coffee:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>'
};

function icon(name) { return ICONS[name] || ''; }

function starRow(rating) {
  var full = Math.round(rating);
  var out = '';
  for (var i = 0; i < 5; i++) {
    out += '<span style="opacity:' + (i < full ? 1 : 0.22) + '">' + icon('star') + '</span>';
  }
  return out;
}

/* ===================== CONSTANTS ===================== */
var BUDGET_LABEL = { budget: 'Budget-friendly', mid: 'Mid-range', luxury: 'Luxury' };
var GROUP_LABEL   = { solo: 'solo', couple: 'couple', friends: 'friends', family: 'family' };

var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var BASE_PACKING = {
  documents: ['Government ID / Aadhaar', 'Travel insurance card', 'Hotel booking printout', 'Emergency contact card', 'Vaccination certificate (if needed)'],
  clothing:  ['Comfortable walking shoes', 'Light rain jacket / windcheater', 'Sunglasses', 'Hat or cap', 'Thermal inner wear (hills)'],
  health:    ['Personal medications', 'Basic first-aid kit', 'ORS sachets', 'Sunscreen SPF 50+', 'Insect repellent'],
  tech:      ['Portable power bank', 'Universal travel adapter', 'Offline map (downloaded)', 'Charging cables', 'Earphones'],
  misc:      ['Cash in small denominations', 'Reusable water bottle', 'Snacks for transit', 'Ziplock bags for valuables', 'Whistle / personal safety alarm']
};

/* ===================== DESTINATIONS ===================== */
var DESTINATIONS = [
  {
    id: 'manali', name: 'Manali', state: 'Himachal Pradesh',
    tags: ['mountain', 'adventure', 'snow'], icon: 'mountain', emoji: '🏔️',
    rating: 4.5, reviews: 12400,
    cost: { budget: 1400, mid: 3200, luxury: 7500 },
    bestFor: ['friends', 'couple'],
    blurb: 'Pine forests, river rafting and snow-capped passes above Old Manali\'s cafés.',
    safety: {
      score: 4.4,
      points: [
        'Tourist police post at the main mall road',
        'Offline map pack covers Rohtang & Solang routes',
        'High-altitude sickness advisory for onward Ladakh trips',
        'Verified homestays only, ID-checked hosts'
      ]
    },
    dayThemes: ['Valley walk & local market', 'River rafting on the Beas', 'Solang Valley & cable car', 'Old Manali cafés & nature walk'],
    activities: {
      morning:   ['Walk through Van Vihar pine forest', 'White-water rafting on the Beas river', 'Drive up to Solang Valley', 'Visit the Hidimba Devi temple grove', 'Short trek to Jogini waterfall'],
      afternoon: ['Browse Tibetan market stalls', 'Paragliding taster session at Solang', 'Explore Old Manali\'s café lane', 'Apple orchard walk near Naggar', 'Visit Vashisht hot springs'],
      evening:   ['Bonfire dinner with local trout curry', 'Live music at a riverside café', 'Stargazing from the guesthouse terrace', 'Stroll along the Mall Road', 'Pack for tomorrow over hot chocolate']
    },
    weather: {
      best:  ['Oct', 'Nov', 'Mar', 'Apr', 'May'],
      avoid: ['Jul', 'Aug'],
      temp:  { min: -8, max: 28 },
      note:  'Monsoons close Rohtang Pass Jul–Sep. Snowfall possible Nov–Feb.'
    },
    transport: {
      train: { label: 'Nearest railhead', station: 'Chandigarh / Ambala', note: '~8h drive from Chandigarh' },
      flight: { label: 'Nearest airport', airport: 'Bhuntar (KUU)', note: '50 km south of Manali' },
      road:  { label: 'By road', note: '~14h from Delhi via NH3; Volvo buses available' }
    },
    localEmergency: {
      police:   '01902-252340',
      hospital: 'Zonal Hospital, Manali · 01902-252379',
      tourist:  'HP Tourism: 0177-2625320'
    },
    packingExtras: ['Warm layers (even in summer)', 'Altitude sickness medication (Diamox)', 'Woollen socks & gloves', 'Lip balm & moisturiser', 'Trekking poles']
  },
  {
    id: 'goa', name: 'Goa', state: 'Goa',
    tags: ['beach', 'nightlife', 'coastal'], icon: 'wave', emoji: '🏖️',
    rating: 4.3, reviews: 21800,
    cost: { budget: 1200, mid: 2800, luxury: 7000 },
    bestFor: ['friends', 'solo', 'couple'],
    blurb: 'Palm-lined beaches by day, beach shacks and live music by night.',
    safety: {
      score: 4.1,
      points: [
        'Lifeguard flags posted on major beaches',
        'Tourist helpline booth at Baga & Calangute',
        'Verified water-sports operators only',
        'Well-lit main roads with 24-hour pharmacies'
      ]
    },
    dayThemes: ['North Goa beaches', 'Old Goa heritage & spice farm', 'Water sports & beach shacks', 'South Goa\'s quieter coast'],
    activities: {
      morning:   ['Sunrise walk on Anjuna beach', 'Visit the Basilica of Bom Jesus', 'Parasailing at Baga beach', 'Kayak through the mangroves', 'Cycle to Chapora Fort'],
      afternoon: ['Flea market browsing at Anjuna', 'Spice plantation tour & lunch', 'Beach shack lunch at Vagator', 'Dolphin-spotting boat trip', 'Relax at Palolem beach'],
      evening:   ['Sunset at Chapora Fort', 'Live music at a Baga beach shack', 'Night market at Arpora', 'Candlelight dinner by the shore', 'Casual bar-hopping in Panaji']
    },
    weather: {
      best:  ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      avoid: ['Jun', 'Jul', 'Aug', 'Sep'],
      temp:  { min: 19, max: 35 },
      note:  'Monsoon (Jun–Sep) brings heavy rains; most shacks close. Peak season Nov–Feb.'
    },
    transport: {
      train: { label: 'Direct trains', station: 'Madgaon / Thivim Jn.', note: 'Trains from Mumbai, Delhi, Bengaluru' },
      flight: { label: 'Dabolim Airport (GOI)', airport: 'Goa International Airport', note: '30 km from Panaji' },
      road:  { label: 'By road', note: '~10h from Mumbai; cruise ships also available' }
    },
    localEmergency: {
      police:   '0832-2231400',
      hospital: 'Goa Medical College, Panaji · 0832-2458700',
      tourist:  'Goa Tourism: 0832-2437132'
    },
    packingExtras: ['Reef-safe sunscreen', 'Waterproof phone case', 'Flip-flops & beachwear', 'Lightweight linen clothes', 'Mosquito repellent patches']
  },
  {
    id: 'jaipur', name: 'Jaipur', state: 'Rajasthan',
    tags: ['heritage', 'culture', 'city'], icon: 'arch', emoji: '🏯',
    rating: 4.6, reviews: 18300,
    cost: { budget: 1300, mid: 3000, luxury: 8000 },
    bestFor: ['family', 'couple'],
    blurb: 'The Pink City\'s forts, palaces and bazaars, built for wandering.',
    safety: {
      score: 4.5,
      points: [
        'Tourist police kiosks near Hawa Mahal & City Palace',
        'Government-approved guides only, ID-verified',
        'Offline maps for the walled city\'s narrow lanes',
        '24-hour hospital within 3 km of most hotels'
      ]
    },
    dayThemes: ['Amber Fort & city views', 'Palaces of the Pink City', 'Bazaars & block-print workshops', 'Countryside day trip'],
    activities: {
      morning:   ['Walking tour of Amber Fort', 'Visit the City Palace museum', 'Explore Jantar Mantar observatory', 'Sunrise photo stop at Hawa Mahal', 'Day trip to Abhaneri stepwell'],
      afternoon: ['Shop for textiles in Bapu Bazaar', 'Block-printing workshop in Sanganer', 'Lunch at a rooftop haveli café', 'Visit the Albert Hall Museum', 'Camel ride near Nahargarh'],
      evening:   ['Sunset at Nahargarh Fort', 'Rajasthani folk dance dinner show', 'Stroll through the illuminated City Palace', 'Rooftop dinner overlooking the old city', 'Shopping for lac bangles']
    },
    weather: {
      best:  ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      avoid: ['Jun', 'Jul', 'Aug'],
      temp:  { min: 8, max: 44 },
      note:  'Summers (Apr–Jun) are extremely hot (40°C+). Best Oct–Mar.'
    },
    transport: {
      train: { label: 'Jaipur Junction (JP)', station: 'Direct trains from Delhi, Mumbai', note: '~4.5h from Delhi on Shatabdi' },
      flight: { label: 'Jaipur International Airport', airport: 'JAI', note: '12 km from city centre' },
      road:  { label: 'By road', note: '~5h from Delhi via NH48; AIIMS bypass smooth' }
    },
    localEmergency: {
      police:   '0141-2744000',
      hospital: 'SMS Hospital, Jaipur · 0141-2518888',
      tourist:  'Rajasthan Tourism: 0141-5110595'
    },
    packingExtras: ['Cotton kurtas & light fabrics', 'Sturdy closed-toe shoes', 'Scarf / dupatta for temples', 'Bottled water (avoid tap)', 'Anti-diarrhoeal medication']
  },
  {
    id: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand',
    tags: ['spiritual', 'adventure', 'river'], icon: 'river', emoji: '🧘',
    rating: 4.5, reviews: 9600,
    cost: { budget: 1000, mid: 2400, luxury: 6000 },
    bestFor: ['solo', 'friends'],
    blurb: 'Ganga-side ghats, yoga ashrams and white-water rapids in the foothills.',
    safety: {
      score: 4.3,
      points: [
        'Certified rafting operators with mandatory safety briefings',
        'Life jackets required on all river activities',
        'Tourist police present at Laxman Jhula & Ram Jhula',
        'Offline maps for nearby waterfall treks'
      ]
    },
    dayThemes: ['Ghats & Ganga aarti', 'White-water rafting', 'Yoga, cafés & the Beatles Ashram', 'Waterfall trek & bungee jump'],
    activities: {
      morning:   ['Sunrise yoga by the Ganga', 'Grade II–III white-water rafting', 'Visit the abandoned Beatles Ashram', 'Trek to Neer Garh waterfall', 'Explore Laxman Jhula\'s temples'],
      afternoon: ['Café-hopping along Tapovan', 'Cliff jumping during the raft trip', 'Browse the local handicraft market', 'Bungee jumping at Jumpin Heights', 'Meditation session at an ashram'],
      evening:   ['Ganga aarti at Triveni Ghat', 'Bonfire with river views', 'Rooftop dinner overlooking the river', 'Silent walk across Ram Jhula at dusk', 'Live acoustic music at a café']
    },
    weather: {
      best:  ['Sep', 'Oct', 'Nov', 'Feb', 'Mar', 'Apr'],
      avoid: ['Jul', 'Aug'],
      temp:  { min: 8, max: 38 },
      note:  'Rafting season Sep–Jun. Monsoon brings strong currents; avoid Jul–Aug.'
    },
    transport: {
      train: { label: 'Haridwar Junction', station: 'Haridwar (HW)', note: '24 km away; taxis readily available' },
      flight: { label: 'Jolly Grant Airport (DED)', airport: 'Dehradun Airport', note: '35 km from Rishikesh' },
      road:  { label: 'By road', note: '~6h from Delhi via NH58' }
    },
    localEmergency: {
      police:   '0135-2430900',
      hospital: 'AIIMS Rishikesh · 0135-2462900',
      tourist:  'Uttarakhand Tourism: 0135-2559898'
    },
    packingExtras: ['Quick-dry clothes for rafting', 'River sandals / water shoes', 'Yoga mat (or rent locally)', 'Electrolyte powder', 'Dry bag for electronics']
  },
  {
    id: 'udaipur', name: 'Udaipur', state: 'Rajasthan',
    tags: ['heritage', 'romantic', 'lake'], icon: 'arch', emoji: '🏛️',
    rating: 4.7, reviews: 14200,
    cost: { budget: 1600, mid: 3800, luxury: 9500 },
    bestFor: ['couple', 'family'],
    blurb: 'Palaces reflected in still lake water, best seen from a rooftop at dusk.',
    safety: {
      score: 4.6,
      points: [
        'Tourist police near the City Palace & lake ghats',
        'Boat operators licensed and life-jacket equipped',
        'Well-lit lakefront promenade at night',
        'Verified heritage-hotel partners only'
      ]
    },
    dayThemes: ['City Palace & the lake', 'Boat ride & Jag Mandir', 'Old city bazaars', 'Sajjangarh sunset & gardens'],
    activities: {
      morning:   ['Tour the City Palace complex', 'Boat ride to Jag Mandir island', 'Visit Saheliyon-ki-Bari gardens', 'Explore the Vintage Car Museum', 'Walk through the old city lanes'],
      afternoon: ['Miniature painting workshop', 'Shop for silver jewellery near Jagdish Temple', 'Lunch overlooking Lake Pichola', 'Visit the Bagore ki Haveli museum', 'Relax at a lakeside café'],
      evening:   ['Sunset from Sajjangarh (Monsoon Palace)', 'Rooftop dinner facing the City Palace', 'Cultural dance show at Bagore ki Haveli', 'Boat ride at dusk on Lake Pichola', 'Stroll along the illuminated ghats']
    },
    weather: {
      best:  ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      avoid: ['May', 'Jun'],
      temp:  { min: 10, max: 42 },
      note:  'Monsoon (Jul–Sep) is surprisingly beautiful but some sites may be slippery.'
    },
    transport: {
      train: { label: 'Udaipur City Station', station: 'UDZ', note: 'Trains from Jaipur, Delhi, Mumbai' },
      flight: { label: 'Maharana Pratap Airport', airport: 'UDR', note: '22 km from city; IndiGo, Air India operate here' },
      road:  { label: 'By road', note: '~3h from Jaipur; scenic NH48 route' }
    },
    localEmergency: {
      police:   '0294-2523900',
      hospital: 'Maharana Bhupal Govt. Hospital · 0294-2528811',
      tourist:  'Rajasthan Tourism: 0294-2411535'
    },
    packingExtras: ['Formal-smart outfit for palace visits', 'Sunscreen & wide-brim hat', 'Comfortable sandals for cobblestone lanes', 'Camera & extra memory card', 'Cash for local boat operators']
  },
  {
    id: 'coorg', name: 'Coorg', state: 'Karnataka',
    tags: ['hill', 'nature', 'coffee'], icon: 'leaf', emoji: '☕',
    rating: 4.4, reviews: 8700,
    cost: { budget: 1500, mid: 3200, luxury: 7800 },
    bestFor: ['couple', 'family'],
    blurb: 'Misty coffee estates, waterfalls and Kodava villages in the Western Ghats.',
    safety: {
      score: 4.5,
      points: [
        'Estate homestays vetted for safe road access',
        'Guided treks only, on marked forest trails',
        'Offline maps for estate & waterfall routes',
        'Nearest multi-speciality hospital in Madikeri'
      ]
    },
    dayThemes: ['Coffee estate walk', 'Abbey Falls & Namdroling Monastery', 'Dubare elephant camp', 'Talakaveri & viewpoint drive'],
    activities: {
      morning:   ['Guided coffee plantation walk', 'Visit Abbey Falls', 'Elephant interaction at Dubare camp', 'Drive to Talakaveri, source of the Kaveri', 'Trek to Mandalpatti viewpoint'],
      afternoon: ['Coffee tasting & estate lunch', 'Visit the golden Namdroling Monastery', 'Kayaking on the Kaveri river', 'Spice plantation tour', 'Relax at the homestay veranda'],
      evening:   ['Bonfire with Kodava cuisine', 'Sunset at Raja\'s Seat viewpoint', 'Stargazing away from town lights', 'Traditional Kodava dinner at the homestay', 'Quiet walk through the estate']
    },
    weather: {
      best:  ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      avoid: ['Jun', 'Jul', 'Aug'],
      temp:  { min: 10, max: 28 },
      note:  'Heavy monsoons Jun–Sep make roads difficult. Post-monsoon (Oct) is lush and beautiful.'
    },
    transport: {
      train: { label: 'Nearest station', station: 'Mysuru Junction', note: '95 km; taxis or buses to Madikeri' },
      flight: { label: 'Nearest airport', airport: 'Mangalore / Mysuru airports', note: '~100–120 km; road transfer needed' },
      road:  { label: 'By road', note: '~5h from Bengaluru via Mysuru; excellent NH275' }
    },
    localEmergency: {
      police:   '08272-225900',
      hospital: 'Govt. District Hospital, Madikeri · 08272-228227',
      tourist:  'Karnataka Tourism: 080-22352828'
    },
    packingExtras: ['Rain poncho & waterproof shoes', 'Leech socks for forest walks', 'Light sweater for misty mornings', 'Insect repellent spray', 'Reusable coffee flask']
  },
  {
    id: 'andaman', name: 'Andaman Islands', state: 'Andaman & Nicobar Islands',
    tags: ['island', 'beach', 'diving'], icon: 'island', emoji: '🤿',
    rating: 4.7, reviews: 6200,
    cost: { budget: 2200, mid: 5000, luxury: 12000 },
    bestFor: ['couple', 'family'],
    blurb: 'Turquoise water, coral reefs and quiet beaches far from the mainland.',
    safety: {
      score: 4.4,
      points: [
        'PADI-certified dive operators only',
        'Coast guard rescue posts on major beaches',
        'Ferry schedules and weather advisories in-app',
        'Verified resorts with on-site first aid'
      ]
    },
    dayThemes: ['Port Blair & Cellular Jail', 'Havelock\'s Radhanagar beach', 'Snorkelling at Elephant Beach', 'Neil Island\'s quiet coves'],
    activities: {
      morning:   ['Cellular Jail history tour', 'Ferry to Havelock Island', 'Snorkelling at Elephant Beach', 'Glass-bottom boat at Neil Island', 'Scuba diving taster session'],
      afternoon: ['Relax on Radhanagar Beach', 'Kayaking through mangrove creeks', 'Beach-hop by scooter on Neil Island', 'Sea-walking experience', 'Visit the local fish market'],
      evening:   ['Sunset at Radhanagar Beach', 'Light & Sound show at Cellular Jail', 'Seafood dinner by the harbour', 'Bonfire on a quiet beach', 'Stargazing with no city lights']
    },
    weather: {
      best:  ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      avoid: ['Jun', 'Jul', 'Aug', 'Sep'],
      temp:  { min: 23, max: 33 },
      note:  'Monsoon (Jun–Sep) brings rough seas; ferry services may be suspended.'
    },
    transport: {
      train: { label: 'No rail connection', station: 'Port Blair is island-only', note: 'Fly or take a cruise from Chennai/Kolkata' },
      flight: { label: 'Veer Savarkar Airport', airport: 'IXZ — Port Blair', note: 'Flights from Chennai, Kolkata, Delhi, Bengaluru' },
      road:  { label: 'Inter-island ferry', note: 'Govt. ferries connect Port Blair, Havelock & Neil Island' }
    },
    localEmergency: {
      police:   '03192-232100',
      hospital: 'G B Pant Hospital, Port Blair · 03192-232102',
      tourist:  'A&N Tourism: 03192-232694'
    },
    packingExtras: ['Reef-safe sunscreen (mandatory)', 'Rash guard for snorkelling', 'Waterproof dry bags', 'Sea-sickness tablets', 'Snorkelling gear (or rent)']
  },
  {
    id: 'ladakh', name: 'Ladakh', state: 'Ladakh (UT)',
    tags: ['mountain', 'adventure', 'offbeat'], icon: 'mountain', emoji: '🏔️',
    rating: 4.8, reviews: 7300,
    cost: { budget: 1800, mid: 4200, luxury: 9800 },
    bestFor: ['friends', 'solo'],
    blurb: 'High-altitude desert, cobalt lakes and monasteries above the clouds.',
    safety: {
      score: 4.2,
      points: [
        'Mandatory acclimatisation day before altitude gain',
        'Inner-line permits arranged for restricted areas',
        'Offline maps essential — patchy network beyond Leh',
        'Oxygen and altitude-sickness kits at verified stays'
      ]
    },
    dayThemes: ['Leh acclimatisation & monasteries', 'Nubra Valley & sand dunes', 'Pangong Lake', 'Magnetic Hill & Sangam point'],
    activities: {
      morning:   ['Gentle walk around Leh Palace', 'Drive over Khardung La to Nubra Valley', 'Early drive to Pangong Lake', 'Visit Magnetic Hill', 'Explore Thiksey Monastery'],
      afternoon: ['Rest & hydrate — acclimatisation day', 'Camel ride on Nubra\'s sand dunes', 'Lakeside walk at Pangong', 'Sangam point — Indus & Zanskar confluence', 'Shanti Stupa sunset viewpoint'],
      evening:   ['Early night for acclimatisation', 'Camping under the stars in Nubra', 'Overnight stay in a lakeside camp', 'Local Ladakhi dinner in Leh market', 'Butter tea at a monastery guesthouse']
    },
    weather: {
      best:  ['Jun', 'Jul', 'Aug', 'Sep'],
      avoid: ['Nov', 'Dec', 'Jan', 'Feb'],
      temp:  { min: -28, max: 30 },
      note:  'Manali–Leh highway open Jun–Oct only. Winters are extreme (-30°C). AMS risk above 3500m.'
    },
    transport: {
      train: { label: 'No rail connection', station: 'Nearest station: Jammu Tawi', note: 'Fly from Delhi/Mumbai or drive via Manali (2 days)' },
      flight: { label: 'Kushok Bakula Rimpochee Airport', airport: 'IXL — Leh', note: 'Flights from Delhi, Mumbai, Srinagar (limited seats)' },
      road:  { label: 'Manali–Leh Highway', note: '490 km, ~2 days drive; open Jun–Oct' }
    },
    localEmergency: {
      police:   '01982-252018',
      hospital: 'SNM District Hospital, Leh · 01982-252360',
      tourist:  'J&K Tourism: 01982-252094'
    },
    packingExtras: ['Altitude sickness medication (Diamox)', 'Thermal base layers & down jacket', 'UV-protection glacier glasses', 'Portable oxygen can', 'Inner-line permit documents']
  },
  {
    id: 'munnar', name: 'Munnar', state: 'Kerala',
    tags: ['hill', 'nature', 'tea'], icon: 'leaf', emoji: '🍵',
    rating: 4.5, reviews: 10100,
    cost: { budget: 1300, mid: 2900, luxury: 7200 },
    bestFor: ['family', 'couple'],
    blurb: 'Rolling tea gardens and cool hill air in the Western Ghats.',
    safety: {
      score: 4.5,
      points: [
        'Forest department permits for wildlife sanctuary visits',
        'Marked viewpoints with safety railings',
        'Verified plantation-stay partners',
        'Well-stocked pharmacies in Munnar town'
      ]
    },
    dayThemes: ['Tea gardens & museum', 'Eravikulam National Park', 'Mattupetty & Kundala lakes', 'Top Station sunrise'],
    activities: {
      morning:   ['Walk through the tea estates', 'Visit Eravikulam National Park', 'Boating at Mattupetty Dam', 'Sunrise at Top Station', 'Visit the Tea Museum'],
      afternoon: ['Tea tasting session', 'Spice garden tour', 'Boating at Kundala Lake', 'Photograph the Neelakurinji hills', 'Visit Attukal waterfalls'],
      evening:   ['Sunset from a tea-estate viewpoint', 'Kerala thali dinner at the homestay', 'Bonfire with local music', 'Quiet walk through the plantation', 'Pack up over hot chai']
    },
    weather: {
      best:  ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      avoid: ['Jun', 'Jul', 'Aug'],
      temp:  { min: 5, max: 25 },
      note:  'Cool year-round (5–25°C). Post-monsoon (Sep–Nov) is lush and scenic.'
    },
    transport: {
      train: { label: 'Nearest station', station: 'Ernakulam / Aluva Jn.', note: '110 km; taxis or KSRTC buses to Munnar' },
      flight: { label: 'Cochin International Airport', airport: 'COK', note: '110 km; ~2.5h drive via NH183' },
      road:  { label: 'By road', note: '~4h from Kochi; scenic ghat road via Neriamangalam' }
    },
    localEmergency: {
      police:   '04865-231006',
      hospital: 'Govt. Taluk Hospital, Munnar · 04865-231206',
      tourist:  'Kerala Tourism: 0471-2321132'
    },
    packingExtras: ['Light woollen layers', 'Waterproof trekking shoes', 'Leech socks for forest walks', 'Binoculars for birdwatching', 'Small daypack']
  },
  {
    id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh',
    tags: ['spiritual', 'heritage', 'river'], icon: 'diya', emoji: '🪔',
    rating: 4.4, reviews: 16700,
    cost: { budget: 900, mid: 2200, luxury: 5800 },
    bestFor: ['solo', 'family'],
    blurb: 'Ancient ghats along the Ganges, alive with ritual from dawn to dusk.',
    safety: {
      score: 4.2,
      points: [
        'Tourist police posted along Dashashwamedh Ghat',
        'Licensed boatmen only, life jackets provided',
        'Offline maps for the old city\'s narrow lanes',
        'Verified guides for the Sarnath day trip'
      ]
    },
    dayThemes: ['Ghats & sunrise boat ride', 'Sarnath day trip', 'Old city lanes & temples', 'Evening aarti & markets'],
    activities: {
      morning:   ['Sunrise boat ride along the ghats', 'Day trip to Sarnath\'s Buddhist ruins', 'Visit the Kashi Vishwanath Temple', 'Walk through the old city\'s lanes', 'Visit Banaras Hindu University campus'],
      afternoon: ['Explore silk-weaving workshops', 'Visit the Ramnagar Fort museum', 'Shop for Banarasi silk sarees', 'Relax by the ghats with street food', 'Visit the Bharat Mata Temple'],
      evening:   ['Ganga aarti at Dashashwamedh Ghat', 'Boat ride during the evening aarti', 'Stroll through the illuminated ghats', 'Dinner at a ghat-side rooftop café', 'Explore the night market near Chowk']
    },
    weather: {
      best:  ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      avoid: ['May', 'Jun', 'Jul'],
      temp:  { min: 6, max: 44 },
      note:  'Summers extremely hot (40°C+). Winter mornings cold with fog. Best Nov–Feb.'
    },
    transport: {
      train: { label: 'Varanasi Junction (BSB)', station: 'Multiple trains from Delhi, Mumbai, Kolkata', note: '~8h Vande Bharat from Delhi' },
      flight: { label: 'Lal Bahadur Shastri Airport', airport: 'VNS — Babatpur', note: '26 km from the ghats' },
      road:  { label: 'By road', note: '~8h from Lucknow via NH19' }
    },
    localEmergency: {
      police:   '0542-2507002',
      hospital: 'Sir Sunderlal Hospital, BHU · 0542-2307429',
      tourist:  'UP Tourism: 0542-2501784'
    },
    packingExtras: ['Modest clothing for temples', 'Waterproof sandals for ghats', 'Bottled water at all times', 'Ear plugs (very noisy city)', 'Small tote for ghat walks']
  }
];

/* ===================== ENRICHMENT DATA ===================== */
/* Coordinates, culture, hidden gems, and crowd patterns for maps & AI features */
var DEST_ENRICHMENT = {
  manali: {
    coordinates: { lat: 32.2396, lon: 77.1887 },
    culture: {
      customs: ['Remove shoes before entering temples', 'Respect local Kullu cap tradition', 'Avoid loud music near monasteries'],
      festivals: ['Kullu Dussehra (Oct)', 'Hadimba Devi Fair (May)', 'Winter Carnival (Jan)'],
      heritage: ['Hadimba Temple (1553 AD)', 'Manu Temple', 'Naggar Castle', 'Great Himalayan National Park']
    },
    hiddenGems: [
      { name: 'Sethan Village', description: 'Tiny hamlet at 2700m with igloo camping in winter', bestFor: 'adventure', lat: 32.28, lon: 77.14 },
      { name: 'Jana Waterfall', description: 'Hidden waterfall only locals know, no crowds', bestFor: 'photography', lat: 32.18, lon: 77.16 },
      { name: 'Hampta Pass basecamp', description: 'Overnight camping with Milky Way views', bestFor: 'stargazing', lat: 32.31, lon: 77.20 }
    ],
    nearbyAttractions: [
      { name: 'Solang Valley', lat: 32.3137, lon: 77.1566, type: 'adventure' },
      { name: 'Rohtang Pass', lat: 32.3716, lon: 77.2481, type: 'scenic' },
      { name: 'Old Manali', lat: 32.2526, lon: 77.1895, type: 'culture' },
      { name: 'Vashisht Hot Springs', lat: 32.2563, lon: 77.1798, type: 'nature' }
    ]
  },
  goa: {
    coordinates: { lat: 15.2993, lon: 74.1240 },
    culture: {
      customs: ['Respect church dress codes', 'Bargain politely at flea markets', 'No nudity on public beaches'],
      festivals: ['Carnival (Feb)', 'Shigmo (Mar)', 'Feast of St. Francis Xavier (Dec)'],
      heritage: ['Basilica of Bom Jesus (UNESCO)', 'Se Cathedral', 'Fort Aguada', 'Church of St. Cajetan']
    },
    hiddenGems: [
      { name: 'Butterfly Beach', description: 'Only reachable by boat from Palolem, pristine and empty', bestFor: 'peace', lat: 15.01, lon: 73.95 },
      { name: 'Divar Island', description: 'Untouched island with Portuguese mansions and no tourists', bestFor: 'culture', lat: 15.51, lon: 73.88 },
      { name: 'Tambdi Surla Temple', description: '12th-century Kadamba temple deep in the jungle', bestFor: 'heritage', lat: 15.46, lon: 74.24 }
    ],
    nearbyAttractions: [
      { name: 'Baga Beach', lat: 15.5558, lon: 73.7516, type: 'beach' },
      { name: 'Basilica of Bom Jesus', lat: 15.5009, lon: 73.9116, type: 'heritage' },
      { name: 'Dudhsagar Falls', lat: 15.3144, lon: 74.3143, type: 'nature' },
      { name: 'Chapora Fort', lat: 15.6103, lon: 73.7394, type: 'scenic' }
    ]
  },
  jaipur: {
    coordinates: { lat: 26.9124, lon: 75.7873 },
    culture: {
      customs: ['Cover shoulders in temples', 'Ask permission before photographing locals', 'Remove footwear at religious sites'],
      festivals: ['Jaipur Literature Festival (Jan)', 'Teej (Aug)', 'Gangaur (Mar-Apr)', 'Elephant Festival (Mar)'],
      heritage: ['Amber Fort (16th century)', 'Hawa Mahal (1799)', 'City Palace', 'Jantar Mantar (UNESCO)']
    },
    hiddenGems: [
      { name: 'Panna Meena ka Kund', description: 'Geometric stepwell rarely visited by tourists, incredible photos', bestFor: 'photography', lat: 26.98, lon: 75.85 },
      { name: 'Anokhi Museum', description: 'Hand block-printing museum in a restored haveli', bestFor: 'culture', lat: 26.98, lon: 75.86 },
      { name: 'Galtaji Monkey Temple', description: 'Hidden temple complex in the hills, sacred water tanks', bestFor: 'spiritual', lat: 26.92, lon: 75.85 }
    ],
    nearbyAttractions: [
      { name: 'Amber Fort', lat: 26.9855, lon: 75.8513, type: 'heritage' },
      { name: 'Hawa Mahal', lat: 26.9239, lon: 75.8267, type: 'heritage' },
      { name: 'Nahargarh Fort', lat: 26.9376, lon: 75.8156, type: 'scenic' },
      { name: 'Albert Hall Museum', lat: 26.9116, lon: 75.8077, type: 'culture' }
    ]
  },
  rishikesh: {
    coordinates: { lat: 30.0869, lon: 78.2676 },
    culture: {
      customs: ['No alcohol or non-veg food in many areas', 'Dress modestly at ashrams', 'Maintain silence during yoga sessions'],
      festivals: ['International Yoga Festival (Mar)', 'Ganga Dussehra (Jun)', 'Maha Shivaratri (Feb-Mar)'],
      heritage: ['Beatles Ashram (1968)', 'Laxman Jhula (1929)', 'Ram Jhula', 'Triveni Ghat']
    },
    hiddenGems: [
      { name: 'Neer Garh Waterfall', description: 'Multi-tiered waterfall with natural pools, short trek', bestFor: 'nature', lat: 30.12, lon: 78.30 },
      { name: 'Kunjapuri Temple', description: 'Hilltop temple with stunning sunrise views of the Himalayas', bestFor: 'spiritual', lat: 30.18, lon: 78.37 },
      { name: 'Rajaji National Park', description: 'Tiger reserve and elephant corridors, rarely crowded', bestFor: 'wildlife', lat: 30.25, lon: 78.10 }
    ],
    nearbyAttractions: [
      { name: 'Laxman Jhula', lat: 30.1243, lon: 78.3210, type: 'landmark' },
      { name: 'Triveni Ghat', lat: 30.1050, lon: 78.2650, type: 'spiritual' },
      { name: 'Beatles Ashram', lat: 30.1150, lon: 78.3320, type: 'heritage' },
      { name: 'Jumpin Heights Bungee', lat: 30.1600, lon: 78.3300, type: 'adventure' }
    ]
  },
  udaipur: {
    coordinates: { lat: 24.5854, lon: 73.7125 },
    culture: {
      customs: ['Dress modestly at palace complexes', 'Tip boat operators fairly', 'Respect photography restrictions inside palaces'],
      festivals: ['Mewar Festival (Mar-Apr)', 'Shilpgram Fair (Dec)', 'Gangaur (Apr)'],
      heritage: ['City Palace (1559 AD)', 'Jag Mandir (1551 AD)', 'Jagdish Temple (1651)', 'Kumbhalgarh Fort (nearby)']
    },
    hiddenGems: [
      { name: 'Badi Lake', description: 'Serene lake with zero tourists, perfect picnic spot', bestFor: 'peace', lat: 24.63, lon: 73.66 },
      { name: 'Ambrai Ghat', description: 'Best free view of City Palace across the lake at sunset', bestFor: 'photography', lat: 24.58, lon: 73.68 },
      { name: 'Shilpgram', description: 'Living museum of artisan village replicas from 5 states', bestFor: 'culture', lat: 24.57, lon: 73.65 }
    ],
    nearbyAttractions: [
      { name: 'City Palace', lat: 24.5764, lon: 73.6845, type: 'heritage' },
      { name: 'Lake Pichola', lat: 24.5733, lon: 73.6812, type: 'scenic' },
      { name: 'Sajjangarh Palace', lat: 24.5802, lon: 73.6458, type: 'scenic' },
      { name: 'Jag Mandir', lat: 24.5700, lon: 73.6800, type: 'heritage' }
    ]
  },
  coorg: {
    coordinates: { lat: 12.4244, lon: 75.7382 },
    culture: {
      customs: ['Respect Kodava martial traditions', 'Ask before entering private coffee estates', 'Try local Kodava cuisine — pandi curry'],
      festivals: ['Kodava Hockey Festival (Apr)', 'Cauvery Changrandi (Oct)', 'Kailpodh (Sep)'],
      heritage: ['Madikeri Fort', 'Omkareshwara Temple', 'Raja\'s Seat', 'Namdroling Monastery (nearby)']
    },
    hiddenGems: [
      { name: 'Chelavara Falls', description: 'Hidden waterfall in dense forest, only locals visit', bestFor: 'nature', lat: 12.32, lon: 75.80 },
      { name: 'Nishani Motte Trek', description: 'Dense jungle trek to a peak with views of Karnataka & Kerala', bestFor: 'adventure', lat: 12.40, lon: 75.72 },
      { name: 'Iruppu Falls', description: 'Sacred waterfall near Brahmagiri Wildlife Sanctuary', bestFor: 'spiritual', lat: 12.10, lon: 75.95 }
    ],
    nearbyAttractions: [
      { name: 'Abbey Falls', lat: 12.4571, lon: 75.7186, type: 'nature' },
      { name: 'Dubare Elephant Camp', lat: 12.4833, lon: 75.8000, type: 'wildlife' },
      { name: 'Raja\'s Seat', lat: 12.4234, lon: 75.7341, type: 'scenic' },
      { name: 'Talakaveri', lat: 12.3215, lon: 75.4920, type: 'spiritual' }
    ]
  },
  andaman: {
    coordinates: { lat: 11.6234, lon: 92.7265 },
    culture: {
      customs: ['Do not collect coral or shells', 'Respect tribal zones (no entry)', 'Use reef-safe sunscreen only'],
      festivals: ['Island Tourism Festival (Jan)', 'Subhash Mela (Jan)', 'Beach Festival (Feb)'],
      heritage: ['Cellular Jail (1906)', 'Ross Island ruins', 'Japanese WWII bunkers', 'Anthropological Museum']
    },
    hiddenGems: [
      { name: 'Long Island', description: 'Untouched beaches with no resorts, pristine jungle', bestFor: 'adventure', lat: 12.40, lon: 92.95 },
      { name: 'North Passage Island', description: 'Secret snorkelling spot with manta rays', bestFor: 'diving', lat: 12.65, lon: 92.72 },
      { name: 'Chidiya Tapu', description: 'Sunset point with bioluminescent plankton at night', bestFor: 'photography', lat: 11.51, lon: 92.71 }
    ],
    nearbyAttractions: [
      { name: 'Cellular Jail', lat: 11.6937, lon: 92.7470, type: 'heritage' },
      { name: 'Radhanagar Beach', lat: 11.9827, lon: 93.0100, type: 'beach' },
      { name: 'Elephant Beach', lat: 12.0150, lon: 93.0300, type: 'nature' },
      { name: 'Neil Island', lat: 11.8300, lon: 93.0500, type: 'island' }
    ]
  },
  ladakh: {
    coordinates: { lat: 34.1526, lon: 77.5771 },
    culture: {
      customs: ['Carry inner-line permits at all times', 'Do not disturb prayer wheels', 'Accept butter tea graciously — it\'s hospitality'],
      festivals: ['Hemis Festival (Jun-Jul)', 'Ladakh Festival (Sep)', 'Losar New Year (Dec-Jan)'],
      heritage: ['Hemis Monastery (1672)', 'Leh Palace (17th century)', 'Shanti Stupa', 'Thiksey Monastery']
    },
    hiddenGems: [
      { name: 'Tso Kar Lake', description: 'Salt lake at 4500m with wild kiangs and zero tourists', bestFor: 'photography', lat: 33.30, lon: 77.98 },
      { name: 'Liker Monastery', description: 'Ancient monastery with a giant Maitreya Buddha, rarely visited', bestFor: 'spiritual', lat: 34.07, lon: 77.36 },
      { name: 'Hanle Village', description: 'Darkest skies in India — Indian Astronomical Observatory here', bestFor: 'stargazing', lat: 32.78, lon: 78.97 }
    ],
    nearbyAttractions: [
      { name: 'Pangong Lake', lat: 33.7595, lon: 78.6567, type: 'scenic' },
      { name: 'Nubra Valley', lat: 34.6942, lon: 77.5706, type: 'adventure' },
      { name: 'Khardung La', lat: 34.2818, lon: 77.6026, type: 'scenic' },
      { name: 'Magnetic Hill', lat: 34.1650, lon: 77.4700, type: 'curiosity' }
    ]
  },
  munnar: {
    coordinates: { lat: 10.0889, lon: 77.0595 },
    culture: {
      customs: ['Ask permission before photographing tea workers', 'Respect forest department rules on treks', 'Buy tea directly from estates to support workers'],
      festivals: ['Neelakurinji Bloom (once in 12 years)', 'Onam (Aug-Sep)', 'Christmas markets (Dec)'],
      heritage: ['Kanan Devan Hills Tea Museum', 'Christ Church (1910)', 'Lock Heart Gap viewpoint', 'Eravikulam National Park']
    },
    hiddenGems: [
      { name: 'Kolukkumalai Tea Estate', description: 'World\'s highest tea plantation, reachable only by jeep', bestFor: 'adventure', lat: 10.08, lon: 77.18 },
      { name: 'Chinnakanal Waterfall', description: 'Also called Power House Falls, misty and secluded', bestFor: 'nature', lat: 10.03, lon: 77.08 },
      { name: 'Meesapulimala', description: 'Second highest peak in Western Ghats, epic sunrise trek', bestFor: 'trekking', lat: 10.10, lon: 77.12 }
    ],
    nearbyAttractions: [
      { name: 'Eravikulam National Park', lat: 10.1700, lon: 77.0600, type: 'wildlife' },
      { name: 'Mattupetty Dam', lat: 10.1200, lon: 77.1300, type: 'scenic' },
      { name: 'Top Station', lat: 10.1300, lon: 77.2300, type: 'scenic' },
      { name: 'Attukal Waterfall', lat: 10.0500, lon: 77.0600, type: 'nature' }
    ]
  },
  varanasi: {
    coordinates: { lat: 25.3176, lon: 83.0068 },
    culture: {
      customs: ['Ask permission before photographing cremation ghats', 'Dress modestly — this is India\'s holiest city', 'Don\'t point feet at temples or deities'],
      festivals: ['Dev Deepawali (Nov)', 'Mahashivratri (Feb-Mar)', 'Ganga Mahotsav (Nov)', 'Holi (Mar)'],
      heritage: ['Kashi Vishwanath Temple', 'Dashashwamedh Ghat', 'Sarnath (Buddhist site)', 'Ramnagar Fort (17th century)']
    },
    hiddenGems: [
      { name: 'Tulsi Ghat', description: 'Quiet ghat where the Ramcharitmanas was written, no tourists', bestFor: 'peace', lat: 25.29, lon: 83.00 },
      { name: 'Chunar Fort', description: '10th-century fort 40 km away, overlooking the Ganges', bestFor: 'history', lat: 25.13, lon: 82.88 },
      { name: 'Blue Lassi Shop', description: 'Legendary tiny shop making lassi for 70+ years', bestFor: 'food', lat: 25.31, lon: 83.01 }
    ],
    nearbyAttractions: [
      { name: 'Dashashwamedh Ghat', lat: 25.3048, lon: 83.0106, type: 'spiritual' },
      { name: 'Sarnath', lat: 25.3814, lon: 83.0253, type: 'heritage' },
      { name: 'Kashi Vishwanath Temple', lat: 25.3109, lon: 83.0107, type: 'spiritual' },
      { name: 'Ramnagar Fort', lat: 25.2849, lon: 83.0327, type: 'heritage' }
    ]
  }
};

/* ── Apply enrichment data to each destination ── */
DESTINATIONS.forEach(function(d) {
  var extra = DEST_ENRICHMENT[d.id];
  if (extra) {
    d.coordinates      = extra.coordinates;
    d.culture          = extra.culture;
    d.hiddenGems       = extra.hiddenGems;
    d.nearbyAttractions = extra.nearbyAttractions;
  }
});
