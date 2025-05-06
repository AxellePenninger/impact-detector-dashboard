export interface CyclistData {
  id: string
  name: string
  number: number
  team: string
}

// Update the CrashData interface to include street and km
export interface CrashData {
  id: string
  cyclist: CyclistData
  team: string
  hic: number
  bric: number
  acceleration: number
  location: string // This will now be the street name
  km: number // Add km marker where crash happened
  race: string // Add race name
  date: string
  // Add acceleration data points for the plot
  accelerationData: {
    time: number // milliseconds
    value: number // g-force
  }[]
}

export interface TeamData {
  id: string
  name: string
  country: string
  cyclists: CyclistData[]
}

// Generate random number between min and max
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Generate random date within the last 30 days
const randomDate = () => {
  const now = new Date()
  const daysAgo = randomNumber(0, 30)
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return date.toISOString()
}

// Generate acceleration data points
const generateAccelerationData = (peakAcceleration: number) => {
  const dataPoints = []
  const numPoints = 100

  // Generate a realistic crash acceleration curve
  for (let i = 0; i < numPoints; i++) {
    const time = i * 10 // 10ms intervals
    let value = 0

    if (i < 20) {
      // Pre-crash normal acceleration
      value = randomNumber(5, 15) + Math.random()
    } else if (i < 30) {
      // Rapid acceleration increase
      const factor = (i - 20) / 10
      value = 15 + factor * peakAcceleration * 0.7 + (randomNumber(-5, 5) + Math.random())
    } else if (i < 40) {
      // Peak acceleration
      value = peakAcceleration * (0.8 + Math.random() * 0.4) + (randomNumber(-10, 10) + Math.random())
    } else if (i < 60) {
      // Rapid deceleration
      const factor = 1 - (i - 40) / 20
      value = peakAcceleration * factor * 0.8 + (randomNumber(-5, 5) + Math.random())
    } else {
      // Post-crash oscillations
      value = 15 + Math.sin(i * 0.2) * 10 + (randomNumber(-3, 3) + Math.random())
    }

    dataPoints.push({ time, value: Math.max(0, value) })
  }

  return dataPoints
}

// Real cycling teams with their actual riders
const realTeamsAndRiders = [
  {
    name: "UAE Team Emirates",
    country: "United Arab Emirates",
    riders: [
      { name: "Tadej Pogačar", number: 1 },
      { name: "João Almeida", number: 21 },
      { name: "Juan Ayuso", number: 22 },
      { name: "Adam Yates", number: 23 },
      { name: "Tim Wellens", number: 24 },
      { name: "Marc Soler", number: 25 },
      { name: "Pavel Sivakov", number: 26 },
      { name: "Brandon McNulty", number: 27 }
    ]
  },
  {
    name: "Visma-Lease a Bike",
    country: "Netherlands",
    riders: [
      { name: "Jonas Vingegaard", number: 11 },
      { name: "Wout van Aert", number: 12 },
      { name: "Sepp Kuss", number: 13 },
      { name: "Christophe Laporte", number: 14 },
      { name: "Tiesj Benoot", number: 15 },
      { name: "Matteo Jorgenson", number: 16 },
      { name: "Dylan van Baarle", number: 17 },
      { name: "Jan Tratnik", number: 18 }
    ]
  },
  {
    name: "Ineos Grenadiers",
    country: "United Kingdom",
    riders: [
      { name: "Tom Pidcock", number: 31 },
      { name: "Geraint Thomas", number: 32 },
      { name: "Egan Bernal", number: 33 },
      { name: "Filippo Ganna", number: 34 },
      { name: "Michał Kwiatkowski", number: 35 },
      { name: "Ethan Hayter", number: 36 },
      { name: "Carlos Rodriguez", number: 37 },
      { name: "Josh Tarling", number: 38 }
    ]
  },
  {
    name: "Soudal Quick-Step",
    country: "Belgium",
    riders: [
      { name: "Remco Evenepoel", number: 41 },
      { name: "Julian Alaphilippe", number: 42 },
      { name: "Kasper Asgreen", number: 43 },
      { name: "Mikel Honoré", number: 44 },
      { name: "Yves Lampaert", number: 45 },
      { name: "Gianni Moscon", number: 46 },
      { name: "Mauri Vansevenant", number: 47 },
      { name: "Tim Merlier", number: 48 }
    ]
  },
  {
    name: "Lidl-Trek",
    country: "United States",
    riders: [
      { name: "Mads Pedersen", number: 51 },
      { name: "Jasper Stuyven", number: 52 },
      { name: "Toms Skujiņš", number: 53 },
      { name: "Giulio Ciccone", number: 54 },
      { name: "Bauke Mollema", number: 55 },
      { name: "Quinn Simmons", number: 56 },
      { name: "Jonathan Milan", number: 57 },
      { name: "Thibau Nys", number: 58 }
    ]
  },
  {
    name: "Alpecin-Deceuninck",
    country: "Belgium",
    riders: [
      { name: "Mathieu van der Poel", number: 61 },
      { name: "Jasper Philipsen", number: 62 },
      { name: "Xandro Meurisse", number: 63 },
      { name: "Silvan Dillier", number: 64 },
      { name: "Gianni Vermeersch", number: 65 },
      { name: "Jonas Rickaert", number: 66 },
      { name: "Søren Kragh Andersen", number: 67 },
      { name: "Kaden Groves", number: 68 }
    ]
  }
];

// Races
const races = [
  "Paris-Roubaix",
  "Tour de France",
  "Giro d'Italia",
  "Vuelta a España",
  "Milan-San Remo",
  "Liège-Bastogne-Liège",
  "Tour of Flanders",
  "Amstel Gold Race",
  "La Flèche Wallonne",
  "Strade Bianche",
];

// Streets/famous segments from these races
const streets = [
  "Carrefour de l'Arbre", // Paris-Roubaix
  "Trouée d'Arenberg", // Paris-Roubaix
  "Champs-Élysées", // Tour de France
  "Col du Tourmalet", // Tour de France
  "Alpe d'Huez", // Tour de France
  "Mont Ventoux", // Tour de France
  "Passo dello Stelvio", // Giro d'Italia
  "Passo di Gavia", // Giro d'Italia
  "Alto de l'Angliru", // Vuelta
  "Lagos de Covadonga", // Vuelta
  "Poggio di San Remo", // Milan-San Remo
  "Cipressa", // Milan-San Remo
  "Côte de La Redoute", // Liège-Bastogne-Liège
  "Côte de Saint-Nicolas", // Liège-Bastogne-Liège
  "Oude Kwaremont", // Tour of Flanders
  "Paterberg", // Tour of Flanders
  "Muur van Geraardsbergen", // Tour of Flanders
  "Cauberg", // Amstel Gold
  "Mur de Huy", // La Flèche Wallonne
  "Sterrato di Montalcino", // Strade Bianche
];

// Generate dummy data for the dashboard
export const generateDummyData = () => {
  // Generate teams and cyclists based on real data
  const teams: TeamData[] = realTeamsAndRiders.map((teamInfo, index) => {
    const team: TeamData = {
      id: `team-${index + 1}`,
      name: teamInfo.name,
      country: teamInfo.country,
      cyclists: teamInfo.riders.map((rider, riderIndex) => {
        return {
          id: `cyclist-${index + 1}-${riderIndex + 1}`,
          name: rider.name,
          number: rider.number,
          team: teamInfo.name
        };
      })
    };
    return team;
  });

  // Generate crashes
  const crashes: CrashData[] = [];

  // Make sure each team has multiple crashes
  teams.forEach((team) => {
    // Force between 3-6 crashes per team
    const numCrashes = randomNumber(3, 6);
    
    for (let i = 0; i < numCrashes; i++) {
      // Select a random cyclist from this team
      const cyclist = team.cyclists[randomNumber(0, team.cyclists.length - 1)];
      const race = races[randomNumber(0, races.length - 1)];
      
      // Choose an appropriate street for the selected race
      let location;
      if (race === "Paris-Roubaix") {
        location = ["Carrefour de l'Arbre", "Trouée d'Arenberg"][randomNumber(0, 1)];
      } else if (race === "Tour de France") {
        location = ["Champs-Élysées", "Col du Tourmalet", "Alpe d'Huez", "Mont Ventoux"][randomNumber(0, 3)];
      } else if (race === "Giro d'Italia") {
        location = ["Passo dello Stelvio", "Passo di Gavia"][randomNumber(0, 1)];
      } else if (race === "Vuelta a España") {
        location = ["Alto de l'Angliru", "Lagos de Covadonga"][randomNumber(0, 1)];
      } else if (race === "Milan-San Remo") {
        location = ["Poggio di San Remo", "Cipressa"][randomNumber(0, 1)];
      } else if (race === "Liège-Bastogne-Liège") {
        location = ["Côte de La Redoute", "Côte de Saint-Nicolas"][randomNumber(0, 1)];
      } else if (race === "Tour of Flanders") {
        location = ["Oude Kwaremont", "Paterberg", "Muur van Geraardsbergen"][randomNumber(0, 2)];
      } else if (race === "Amstel Gold Race") {
        location = "Cauberg";
      } else if (race === "La Flèche Wallonne") {
        location = "Mur de Huy";
      } else {
        location = "Sterrato di Montalcino"; // Strade Bianche
      }
      
      const acceleration = randomNumber(20, 120) + Math.random();
      
      const crash: CrashData = {
        id: `crash-${crashes.length + 1}`,
        cyclist,
        team: team.name,
        hic: randomNumber(100, 1200),
        bric: randomNumber(50, 500),
        acceleration,
        location,
        km: randomNumber(1, 200) + Math.random(),
        race,
        date: randomDate(),
        accelerationData: generateAccelerationData(acceleration),
      };
      
      crashes.push(crash);
    }
  });

  return { teams, crashes };
}

// Create a stable dataset that persists across renders
let stableDataset: { teams: TeamData[], crashes: CrashData[] } | null = null;

export const getStableData = () => {
  if (!stableDataset) {
    stableDataset = generateDummyData();
  }
  return stableDataset;
}