export type CarCategory = "truck" | "car";

export interface CarBrand {
  name: string;
  category: CarCategory;
  models: string[];
}

export const CAR_BRANDS: CarBrand[] = [
  // ======= ВАНТАЖНІ / ТЯГАЧІ =======
  {
    name: "Volvo",
    category: "truck",
    models: ["FH", "FH16", "FM", "FMX", "FE", "FL", "VNL", "VNR", "VNX"],
  },
  {
    name: "Scania",
    category: "truck",
    models: ["R Series", "S Series", "P Series", "G Series", "L Series", "XT", "R450", "R500", "R580"],
  },
  {
    name: "Mercedes-Benz (вантажні)",
    category: "truck",
    models: ["Actros", "Arocs", "Atego", "Axor", "Antos", "Actros L", "eActros"],
  },
  {
    name: "MAN",
    category: "truck",
    models: ["TGX", "TGS", "TGM", "TGL", "TGE", "TGA", "F2000", "F90"],
  },
  {
    name: "DAF",
    category: "truck",
    models: ["XF", "XG", "XG+", "CF", "LF", "XF105", "XF95"],
  },
  {
    name: "Iveco",
    category: "truck",
    models: ["Stralis", "S-Way", "Trakker", "Eurocargo", "Daily", "Hi-Way", "AS440"],
  },
  {
    name: "Renault Trucks",
    category: "truck",
    models: ["T", "T High", "C", "K", "D", "D Wide", "Premium", "Magnum"],
  },
  {
    name: "Kenworth",
    category: "truck",
    models: ["T680", "T880", "W900", "T800", "T660", "C500"],
  },
  {
    name: "Peterbilt",
    category: "truck",
    models: ["579", "389", "567", "520", "220", "335"],
  },
  {
    name: "Freightliner",
    category: "truck",
    models: ["Cascadia", "Columbia", "Classic XL", "Coronado", "M2 106", "M2 112"],
  },
  {
    name: "International",
    category: "truck",
    models: ["LT Series", "HX Series", "MV Series", "RH Series", "4700", "4900"],
  },
  {
    name: "Mack",
    category: "truck",
    models: ["Anthem", "Pinnacle", "Granite", "TerraPro", "LR", "MD Series"],
  },
  {
    name: "Western Star",
    category: "truck",
    models: ["49X", "47X", "4900", "5700XE", "6900"],
  },
  {
    name: "Liebherr",
    category: "truck",
    models: ["LTM 1030", "LTM 1050", "LTM 1100"],
  },
  {
    name: "КАМАЗ",
    category: "truck",
    models: ["5490", "65116", "6520", "44108", "65201", "6460", "5350"],
  },
  {
    name: "МАЗ",
    category: "truck",
    models: ["5340", "5440", "6430", "6501", "5516", "631705"],
  },
  {
    name: "КрАЗ",
    category: "truck",
    models: ["6510", "6322", "65053", "260", "255"],
  },
  // ======= НАПІВПРИЧЕПИ / ПРИЧЕПИ =======
  {
    name: "Schmitz Cargobull",
    category: "truck",
    models: ["S.KO", "S.CS", "S.CF", "S.CU", "S.KI", "S.PR", "Gotha"],
  },
  {
    name: "Kögel",
    category: "truck",
    models: ["S.CF", "S.CS", "Cargo", "Overland", "Puris"],
  },
  {
    name: "Krone",
    category: "truck",
    models: ["Profiliner", "Coiliner", "Box Liner", "Cool Liner", "Mega Liner", "Multi Liner"],
  },
  {
    name: "Wielton",
    category: "truck",
    models: ["NS3", "NS34", "NW3", "NW34", "PC"],
  },
  {
    name: "Fliegl",
    category: "truck",
    models: ["SDS", "VPS", "TPS", "ZTS", "AOK"],
  },
  {
    name: "Fruehauf",
    category: "truck",
    models: ["Flatbed", "Curtainsider", "Tipper", "Refrigerated"],
  },
  // ======= ЛЕГКОВІ =======
  {
    name: "Toyota",
    category: "car",
    models: ["Camry", "Corolla", "RAV4", "Land Cruiser", "Prius", "Yaris", "Hilux", "Auris", "Avensis", "C-HR"],
  },
  {
    name: "Volkswagen",
    category: "car",
    models: ["Passat", "Golf", "Tiguan", "Polo", "Touareg", "Jetta", "Caddy", "Transporter", "Crafter", "Arteon"],
  },
  {
    name: "BMW",
    category: "car",
    models: ["3 Series", "5 Series", "7 Series", "X5", "X3", "X6", "1 Series", "M3", "M5", "i3", "i8"],
  },
  {
    name: "Mercedes-Benz (легкові)",
    category: "car",
    models: ["C-Class", "E-Class", "S-Class", "GLE", "GLC", "A-Class", "B-Class", "ML", "GL", "Sprinter"],
  },
  {
    name: "Audi",
    category: "car",
    models: ["A4", "A6", "A8", "Q5", "Q7", "A3", "Q3", "TT", "R8", "e-tron"],
  },
  {
    name: "Ford",
    category: "car",
    models: ["Focus", "Mondeo", "Kuga", "Explorer", "F-150", "Ranger", "Transit", "Puma", "Mustang"],
  },
  {
    name: "Opel",
    category: "car",
    models: ["Astra", "Vectra", "Insignia", "Zafira", "Mokka", "Antara", "Corsa", "Omega"],
  },
  {
    name: "Skoda",
    category: "car",
    models: ["Octavia", "Superb", "Fabia", "Kodiaq", "Karoq", "Rapid", "Yeti", "Roomster"],
  },
  {
    name: "Renault",
    category: "car",
    models: ["Logan", "Sandero", "Megane", "Laguna", "Duster", "Koleos", "Clio", "Captur", "Trafic", "Master"],
  },
  {
    name: "Peugeot",
    category: "car",
    models: ["206", "207", "208", "307", "308", "407", "508", "3008", "5008", "Boxer", "Partner"],
  },
  {
    name: "Citroen",
    category: "car",
    models: ["C3", "C4", "C5", "Berlingo", "Jumpy", "Jumper", "Picasso", "C-Crosser"],
  },
  {
    name: "Honda",
    category: "car",
    models: ["Civic", "Accord", "CR-V", "HR-V", "Jazz", "Pilot", "Odyssey", "Fit"],
  },
  {
    name: "Hyundai",
    category: "car",
    models: ["Accent", "Elantra", "Sonata", "Tucson", "Santa Fe", "i30", "ix35", "Getz", "H-1"],
  },
  {
    name: "Kia",
    category: "car",
    models: ["Cee'd", "Sportage", "Sorento", "Rio", "Optima", "Soul", "Carnival", "Stinger"],
  },
  {
    name: "Nissan",
    category: "car",
    models: ["Qashqai", "X-Trail", "Almera", "Primera", "Patrol", "Note", "Leaf", "Navara", "Pathfinder"],
  },
  {
    name: "Mazda",
    category: "car",
    models: ["3", "6", "CX-5", "CX-7", "CX-9", "2", "MX-5", "RX-8"],
  },
  {
    name: "Mitsubishi",
    category: "car",
    models: ["Outlander", "Pajero", "Galant", "Lancer", "Eclipse Cross", "L200", "ASX"],
  },
  {
    name: "Subaru",
    category: "car",
    models: ["Forester", "Outback", "Impreza", "Legacy", "XV", "WRX", "BRZ"],
  },
  {
    name: "Chevrolet",
    category: "car",
    models: ["Aveo", "Lacetti", "Cruze", "Captiva", "Camaro", "Equinox", "Tahoe", "Silverado"],
  },
  {
    name: "Seat",
    category: "car",
    models: ["Ibiza", "Leon", "Toledo", "Ateca", "Arona", "Alhambra", "Exeo"],
  },
  {
    name: "Fiat",
    category: "car",
    models: ["Punto", "Bravo", "500", "Doblo", "Ducato", "Panda", "Tipo", "Stilo"],
  },
  {
    name: "Volvo (легкові)",
    category: "car",
    models: ["S60", "S80", "S90", "V40", "V60", "V70", "V90", "XC40", "XC60", "XC90"],
  },
  {
    name: "Land Rover",
    category: "car",
    models: ["Discovery", "Range Rover", "Freelander", "Defender", "Discovery Sport", "Range Rover Sport"],
  },
  {
    name: "Jeep",
    category: "car",
    models: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator"],
  },
  {
    name: "Lexus",
    category: "car",
    models: ["RX", "NX", "GX", "LX", "ES", "IS", "GS", "LS", "UX"],
  },
  {
    name: "Infiniti",
    category: "car",
    models: ["Q50", "Q60", "QX50", "QX60", "QX80", "FX", "EX"],
  },
  {
    name: "Tesla",
    category: "car",
    models: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  },
  {
    name: "Lada",
    category: "car",
    models: ["2107", "2109", "2110", "2114", "2115", "Granta", "Priora", "Kalina", "Vesta", "4x4", "Niva"],
  },
  {
    name: "Daewoo",
    category: "car",
    models: ["Lanos", "Nexia", "Nubira", "Matiz", "Sens", "Leganza"],
  },
  {
    name: "ZAZ",
    category: "car",
    models: ["Chance", "Forza", "Vida", "Slavuta", "1103"],
  },
];

export const TRUCK_BRANDS = CAR_BRANDS.filter((b) => b.category === "truck");
export const CAR_BRANDS_ONLY = CAR_BRANDS.filter((b) => b.category === "car");

export function getModels(brandName: string): string[] {
  return CAR_BRANDS.find((b) => b.name === brandName)?.models ?? [];
}
