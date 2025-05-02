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

// Generate dummy data for the dashboard
export const generateDummyData = () => {
  // Team names
  const teamNames = [
    "Team Velocity",
    "Rapid Wheels",
    "Alpine Riders",
    "Coastal Sprinters",
    "Mountain Climbers",
    "Urban Pedalers",
  ]

  // Cyclist first names
  const firstNames = [
    "James",
    "John",
    "Robert",
    "Michael",
    "William",
    "David",
    "Richard",
    "Joseph",
    "Thomas",
    "Charles",
    "Mary",
    "Patricia",
    "Jennifer",
    "Linda",
    "Elizabeth",
    "Barbara",
    "Susan",
    "Jessica",
    "Sarah",
    "Karen",
  ]

  // Cyclist last names
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Hernandez",
    "Moore",
    "Martin",
    "Jackson",
    "Thompson",
    "White",
  ]

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
  ]

  // Streets
  const streets = [
    "Rue de Rivoli",
    "Champs-Élysées",
    "Via Roma",
    "Carrefour de l'Arbre",
    "Oude Kwaremont",
    "Cauberg",
    "Poggio",
    "Col du Tourmalet",
    "Alpe d'Huez",
    "Passo dello Stelvio",
    "Mont Ventoux",
    "Col du Galibier",
    "Muur van Geraardsbergen",
    "Koppenberg",
  ]

  // Countries
  const countries = [
    "Belgium",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Germany",
    "United Kingdom",
    "United States",
    "Australia",
    "Colombia",
  ]

  // Generate teams
  const teams: TeamData[] = teamNames.map((name, index) => {
    return {
      id: `team-${index + 1}`,
      name,
      country: countries[randomNumber(0, countries.length - 1)],
      cyclists: [],
    }
  })

  // Generate cyclists and assign to teams
  let cyclistId = 1
  teams.forEach((team) => {
    const numCyclists = randomNumber(5, 10)

    for (let i = 0; i < numCyclists; i++) {
      const firstName = firstNames[randomNumber(0, firstNames.length - 1)]
      const lastName = lastNames[randomNumber(0, lastNames.length - 1)]

      const cyclist: CyclistData = {
        id: `cyclist-${cyclistId}`,
        name: `${firstName} ${lastName}`,
        number: randomNumber(1, 99),
        team: team.name,
      }

      team.cyclists.push(cyclist)
      cyclistId++
    }
  })

  // Generate crashes
  const crashes: CrashData[] = []

  // Let's make sure each team has multiple crashes
  teams.forEach((team) => {
    // Force between 3-6 crashes per team (adjust these numbers as needed)
    const numCrashes = randomNumber(3, 6)
    
    for (let i = 0; i < numCrashes; i++) {
      // Select a random cyclist from this team
      const cyclist = team.cyclists[randomNumber(0, team.cyclists.length - 1)]
      const race = races[randomNumber(0, races.length - 1)]
      const acceleration = randomNumber(20, 120) + Math.random()
      
      const crash: CrashData = {
        id: `crash-${crashes.length + 1}`,
        cyclist,
        team: team.name, // Ensure team name is correctly used
        hic: randomNumber(100, 1200),
        bric: randomNumber(50, 500),
        acceleration,
        location: streets[randomNumber(0, streets.length - 1)],
        km: randomNumber(1, 200) + Math.random(),
        race,
        date: randomDate(),
        accelerationData: generateAccelerationData(acceleration),
      }
      
      crashes.push(crash)
    }
  })

  return { teams, crashes }
}

// Create a stable dataset that persists across renders
let stableDataset: { teams: TeamData[], crashes: CrashData[] } | null = null;

export const getStableData = () => {
  if (!stableDataset) {
    stableDataset = generateDummyData();
  }
  return stableDataset;
}
