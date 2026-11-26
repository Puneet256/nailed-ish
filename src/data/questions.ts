import type { Question } from "@/types/game";

// Illustrative placeholder content. Fact-check every answer and source before launch.
// Each set contains exactly five questions. Sets cycle until a reviewed schedule is added.
export const questionSets: Question[][] = [
  [
    { id: "demo-1-1", type: "quantity", prompt: "How tall is the Eiffel Tower, including its antennas?", unit: "metres", min: 30, max: 3000, answer: 330, fact: "The tower's height varies slightly with temperature.", source: { name: "Eiffel Tower", url: "https://www.toureiffel.paris/en" }, category: "buildings" },
    { id: "demo-1-2", type: "quantity", prompt: "How many bones are in an adult human body?", unit: "bones", min: 10, max: 3000, answer: 206, fact: "Babies are born with more bones, some of which fuse as they grow.", source: { name: "Cleveland Clinic", url: "https://my.clevelandclinic.org/health/body/251 ಎಲ್ಲಾ" }, category: "science" },
    { id: "demo-1-3", type: "year", prompt: "In what year did the first iPhone go on sale?", unit: "year", min: 1980, max: 2035, answer: 2007, scale: 10, fact: "The first iPhone went on sale in June 2007.", source: { name: "Apple Newsroom", url: "https://www.apple.com/newsroom/" }, category: "technology" },
    { id: "demo-1-4", type: "quantity", prompt: "How long is the River Thames?", unit: "kilometres", min: 10, max: 3000, answer: 346, fact: "The Thames flows through southern England.", source: { name: "Encyclopaedia Britannica", url: "https://www.britannica.com/place/Thames-River" }, category: "geography" },
    { id: "demo-1-5", type: "quantity", prompt: "How many minutes are there in a week?", unit: "minutes", min: 100, max: 200000, answer: 10080, fact: "Seven days contain 10,080 minutes.", source: { name: "Calculation", url: "https://en.wikipedia.org/wiki/Week" }, category: "everyday" }
  ],
  [
    { id: "demo-2-1", type: "quantity", prompt: "How high is Mount Everest above sea level?", unit: "metres", min: 100, max: 30000, answer: 8849, fact: "Its officially recognised elevation is 8,848.86 metres.", source: { name: "National Geographic", url: "https://www.nationalgeographic.com/" }, category: "geography" },
    { id: "demo-2-2", type: "year", prompt: "In what year did the first modern Olympic Games take place?", unit: "year", min: 1800, max: 2025, answer: 1896, scale: 20, fact: "Athens hosted the first modern Olympic Games.", source: { name: "Olympics", url: "https://olympics.com/" }, category: "history" },
    { id: "demo-2-3", type: "quantity", prompt: "How many keys does a standard full-size piano have?", unit: "keys", min: 10, max: 1000, answer: 88, fact: "A standard modern piano has 88 keys.", source: { name: "Yamaha", url: "https://www.yamaha.com/" }, category: "music" },
    { id: "demo-2-4", type: "quantity", prompt: "How far is the Moon from Earth on average?", unit: "kilometres", min: 1000, max: 10000000, answer: 384400, fact: "The Moon's distance varies throughout its orbit.", source: { name: "NASA", url: "https://science.nasa.gov/moon/" }, category: "space" },
    { id: "demo-2-5", type: "year", prompt: "In what year was the first email sent?", unit: "year", min: 1950, max: 2030, answer: 1971, scale: 10, fact: "Ray Tomlinson sent an early network email in 1971.", source: { name: "Computer History Museum", url: "https://www.computerhistory.org/" }, category: "technology" }
  ],
  [
    { id: "demo-3-1", type: "quantity", prompt: "How many litres of blood does an average adult have?", unit: "litres", min: 0.1, max: 100, answer: 5, fact: "Blood volume varies with body size and other factors.", source: { name: "American Society of Hematology", url: "https://www.hematology.org/" }, category: "science" },
    { id: "demo-3-2", type: "quantity", prompt: "How long is a marathon?", unit: "kilometres", min: 1, max: 1000, answer: 42.195, fact: "The official marathon distance is 42.195 kilometres.", source: { name: "World Athletics", url: "https://worldathletics.org/" }, category: "sport" },
    { id: "demo-3-3", type: "year", prompt: "In what year did the Berlin Wall fall?", unit: "year", min: 1900, max: 2030, answer: 1989, scale: 10, fact: "The Berlin Wall opened in November 1989.", source: { name: "Berlin Wall Foundation", url: "https://www.stiftung-berliner-mauer.de/en" }, category: "history" },
    { id: "demo-3-4", type: "quantity", prompt: "How many people can the Colosseum hold?", unit: "people", min: 100, max: 100000, answer: 50000, fact: "Estimates of the Colosseum's capacity vary.", source: { name: "Parco archeologico del Colosseo", url: "https://colosseo.it/en/" }, category: "history" },
    { id: "demo-3-5", type: "quantity", prompt: "What is the speed of sound in air at room temperature?", unit: "metres per second", min: 10, max: 10000, answer: 343, fact: "The speed depends on temperature and the medium.", source: { name: "NASA", url: "https://www.grc.nasa.gov/" }, category: "science" }
  ],
  [
    { id: "demo-4-1", type: "quantity", prompt: "How many strings does a standard violin have?", unit: "strings", min: 1, max: 100, answer: 4, fact: "The four strings are commonly tuned in fifths.", source: { name: "Britannica", url: "https://www.britannica.com/art/violin" }, category: "music" },
    { id: "demo-4-2", type: "year", prompt: "In what year did the first Harry Potter book get published?", unit: "year", min: 1900, max: 2030, answer: 1997, scale: 10, fact: "The first book was published in the UK in 1997.", source: { name: "Bloomsbury", url: "https://www.bloomsbury.com/" }, category: "culture" },
    { id: "demo-4-3", type: "quantity", prompt: "How many kilometres is the Earth's equatorial circumference?", unit: "kilometres", min: 100, max: 100000, answer: 40075, fact: "Earth is slightly wider around the equator than pole to pole.", source: { name: "NASA", url: "https://science.nasa.gov/earth/" }, category: "science" },
    { id: "demo-4-4", type: "quantity", prompt: "How many teeth does a typical adult have, including wisdom teeth?", unit: "teeth", min: 1, max: 100, answer: 32, fact: "Some adults have fewer if wisdom teeth never develop or are removed.", source: { name: "NHS", url: "https://www.nhs.uk/" }, category: "everyday" },
    { id: "demo-4-5", type: "year", prompt: "In what year did the first Star Wars film premiere?", unit: "year", min: 1900, max: 2030, answer: 1977, scale: 10, fact: "The original film premiered in May 1977.", source: { name: "StarWars.com", url: "https://www.starwars.com/" }, category: "culture" }
  ],
  [
    { id: "demo-5-1", type: "quantity", prompt: "How many minutes does light from the Sun take to reach Earth?", unit: "minutes", min: 0.1, max: 100, answer: 8.3, fact: "The exact time varies slightly with Earth's orbital distance.", source: { name: "NASA", url: "https://science.nasa.gov/sun/" }, category: "space" },
    { id: "demo-5-2", type: "quantity", prompt: "How many countries are members of the United Nations?", unit: "countries", min: 1, max: 500, answer: 193, fact: "The UN has 193 member states.", source: { name: "United Nations", url: "https://www.un.org/en/about-us/member-states" }, category: "world" },
    { id: "demo-5-3", type: "year", prompt: "In what year was the first successful powered aeroplane flight?", unit: "year", min: 1800, max: 2030, answer: 1903, scale: 15, fact: "The Wright brothers flew at Kitty Hawk in December 1903.", source: { name: "Smithsonian", url: "https://airandspace.si.edu/" }, category: "history" },
    { id: "demo-5-4", type: "quantity", prompt: "How many litres of water does an Olympic swimming pool hold?", unit: "litres", min: 10000, max: 100000000, answer: 2500000, fact: "An Olympic-size pool is 50 metres long and 25 metres wide.", source: { name: "World Aquatics", url: "https://www.worldaquatics.com/" }, category: "sport" },
    { id: "demo-5-5", type: "quantity", prompt: "How many seconds are there in one day?", unit: "seconds", min: 100, max: 1000000, answer: 86400, fact: "A standard day contains 86,400 seconds.", source: { name: "Calculation", url: "https://en.wikipedia.org/wiki/Day" }, category: "everyday" }
  ]
];
