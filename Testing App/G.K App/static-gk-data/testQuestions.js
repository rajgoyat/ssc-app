const testQuestions1 =  [
  {
    id: "gk-00001",
    question:
      "Consider the following two statements:\n\nStatement 1: Potential difference is measured in volts.\nStatement 2: One volt is equal to one newton per coulomb.\n\nWhich of the following options is correct regarding these statements?",
    options: [
      "Both Statement 1 and Statement 2 are correct",
      "Both Statement 1 and Statement 2 are incorrect",
      "Statement 1 is correct but Statement 2 is incorrect",
      "Statement 1 is incorrect but Statement 2 is correct"
    ],
    answer: 0,
    explanation:
      "| Quantity             | Unit           |\n| -------------------- | -------------- |\n| Potential difference | **Volt (V)**   |\n| Electric field       | **N/C**        |\n| Electric force       | **Newton (N)** |\n\n1 Volt = 1 Joule/Coulomb, NOT 1 Newton/Coulomb."},

  {
    id: "gk-00002",
    question:
      "The functional group which does NOT contain an oxygen hetero atom is:",
    options: ["Ketone", "Alcohol", "Haloalkane", "Carboxylic acid"],
    answer: 2,
    explanation:
      "Haloalkanes contain a halogen atom attached to an alkyl group and do not contain oxygen. Ketones, alcohols and carboxylic acids contain oxygen."
  },

  {
    id: "gk-00003",
    question:
      "Which of the following life processes is important for bringing variation in species?",
    options: [
      "Transportation",
      "Sexual reproduction",
      "Heterotrophic nutrition",
      "Autotrophic nutrition"
    ],
    answer: 1,
    explanation:
      "Sexual reproduction produces genetic variation because genetic material from two parents is combined."
  },

  {
    id: "gk-00004",
    question:
      "With which company did the Gujarat government sign an MoU to explore building a 250 MW green AI-ready data centre?",
    options: [
      "Tata Consultancy Services",
      "Larsen & Toubro",
      "Reliance Jio",
      "Infosys"
    ],
    answer: 1,
    explanation:
      "Company: L&T Vyoma\nProject: 250 MW green AI-ready data centre\nLocation: Dholera SIR, Gujarat\nProposed investment: ₹25,000 crore\nMoU: February 2026\nPurpose: AI infrastructure, cloud computing and sustainable digital infrastructure"},

  {
    id: "gk-00005",
    question:
      "What is the name of the official Aadhaar mascot launched by UIDAI to enhance public engagement and awareness of Aadhaar services?",
    options: ["Aadhaar Mitra", "Aadhaar Seva", "Aadhaar Saathi", "Aadhaar Rakshak"],
    answer: 0,
    explanation:
      "Aadhaar Mitra is the official Aadhaar mascot launched by UIDAI to enhance public engagement and awareness regarding Aadhaar services."
  },

  {
    id: "gk-00006",
    question:
      "In the Union Budget 2026-27, the fiscal deficit has been set at 4.3% of GDP. Which of the following is NOT a component of GDP?",
    options: [
      "Private consumption expenditure",
      "Investment expenditure",
      "Government expenditure",
      "Transfer payments"
    ],
    answer: 3,
    explanation:
      "Transfer payments such as pensions and scholarships are not payments for current production and therefore are not directly included in GDP.\nGDP=C+I+G+X−M\n\t​\n\n🎯 SSC Shortcut\n\nC = Consumption\nI = Investment\nG = Government expenditure\nX−M = Net exports\n\n👉 C + I + G + (X − M) = GDP expenditure approach"},

  {
    id: "gk-00007",
    question:
      "With reference to the Constitution of India and its translation into Indian languages, consider the following statements:\n\n1. The Constitution was originally enacted in English.\n2. Hindi translation of the Constitution was later authorized and published.\n3. The Constitution is available only in the languages listed in the Eighth Schedule.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: 0,
    explanation:
      "Statements 1 and 2 are correct. The Constitution was originally enacted in English, and an authoritative Hindi translation was later published. Statement 3 is incorrect because the Constitution has also been translated into other languages."
  },

  {
    id: "gk-00008",
    question:
      "According to the Henley Passport Index 2026, which country has officially removed visa-free or visa-on-arrival access for ordinary Indian passport holders, requiring them to obtain a pre-approved visa or e-visa before travel?",
    options: ["Iran", "Laos", "Bolivia", "None of these"],
    answer: 2,
    explanation:
      "According to the Henley Passport Index\n2026, which of the following countries\nhas officially removed visa-free or visa-\non-arrival access for ordinary Indian\npassport holders, requiring them to\nobtain a pre-approved visa or e-visa\nbefore travel?\n\na) Iran\n\nb) Laos\n\nc) Bolivia\n\nReports ke according:\n\n🇮🇷 Iran → visa-free access withdrawn\n🇧🇴 Bolivia → advance visa requirement\n🇨🇻 Cape Verde → visa-on-arrival facility changed/suspended\n🇳🇮 Nicaragua → prior travel authorization requirements tightened"},

  {
    id: "gk-00009",
    question:
      "Match List-I with List-II:\n\nList-I (Famous Travellers)\nA) Al-Biruni\nB) Ibn Battuta\nC) Megasthenes\nD) Al-Masudi\n\nList-II (Books)\ni) Indica\nii) Muruj-ul-Zehab\niii) The Travels\niv) Tahqiq-i-Hind\n\nWhich of the following is the correct matching?",
    options: [
      "A-iv, B-iii, C-i, D-ii",
      "A-iii, B-iv, C-ii, D-i",
      "A-ii, B-i, C-iv, D-iii",
      "A-i, B-ii, C-iii, D-iv"
    ],
    answer: 0,
    explanation:
      "| List-I: Traveller  | List-II: Book          | Match       |\n| ------------------ | ---------------------- | ----------- |\n| **A) Al-Biruni**   | **iv) Tahqiq-i-Hind**  | ✅ **A–iv**  |\n| **B) Ibn Battuta** | **iii) The Travels**   | ✅ **B–iii** |\n| **C) Megasthenes** | **i) Indica**          | ✅ **C–i**   |\n| **D) Al-Masudi**   | **ii) Muruj-ul-Zehab** | ✅ **D–ii**  |"},

  {
    id: "gk-00010",
    question:
      "Under which treaty did the East India Company acquire Diwani rights over Bengal, Bihar and Orissa?",
    options: [
      "Treaty of Allahabad, 1765",
      "Treaty of Bassein, 1802",
      "Treaty of Salbai, 1782",
      "Treaty of Seringapatam, 1792"
    ],
    answer: 0,
    explanation:
      "Under the Treaty of Allahabad in 1765, the Mughal Emperor Shah Alam II granted the East India Company the Diwani rights over Bengal, Bihar and Orissa."
  },

  {
    id: "gk-00011",
    question:
      "At which place did Aruna Asaf Ali fearlessly hoist the flag of Indian independence on 9 August 1942 during the Quit India Movement?",
    options: [
      "Gowalia Tank Maidan, Bombay",
      "Red Fort, Delhi",
      "Jallianwala Bagh, Amritsar",
      "India Gate, Delhi"
    ],
    answer: 0,
    explanation:
      "Important awards:\n🏅 International Lenin Peace Prize — 1964\n🏅 Padma Vibhushan — 1992\n🏅 Bharat Ratna — 1997 (posthumously)"},

  {
    id: "gk-00012",
    question:
      "In the Ramcharitmanas, which Kaand comes immediately after the Sundar Kaand?",
    options: ["Lanka Kaand", "Ayodhya Kaand", "Aranya Kaand", "Uttar Kaand"],
    answer: 0,
    explanation:
      "बाल → अयोध्या → अरण्य → किष्किन्धा → सुन्दर → लंका → उत्तर"},

  {
    id: "gk-00013",
    question:
      "On which day of the Hindu calendar is the festival of Holi traditionally celebrated?",
    options: [
      "Chaitra Poornima",
      "Phalguna Purnima",
      "Chaitra Shukla Pratipada",
      "Kartik Purnima"
    ],
    answer: 1,
    explanation:
      "Purnima festivals:\n\nHoli → Phalguna Purnima\nRaksha Bandhan → Shravana Purnima\nBuddha Purnima → Vaishakha Purnima\nGuru Purnima → Ashadha Purnima\n\n🌑 Amavasya:\n\nDiwali → Kartik Amavasya\n\n⭐ Important Krishna Paksha:\n\nJanmashtami → Bhadrapada Krishna Ashtami\nMahashivratri → Phalguna Krishna Chaturdashi",
    },

  {
    id: "gk-00014",
    question:
      "Which characteristic pottery became a hallmark of early Iron Age settlements in northern India?",
    options: [
      "Painted Grey Ware",
      "Northern Black Polished Ware",
      "Black and Red Ware",
      "Ochre Coloured Pottery"
    ],
    answer: 0,
    explanation:
      "| Pottery                                 | Main association                             |\n| --------------------------------------- | -------------------------------------------- |\n| **Harappan pottery**                    | Indus Valley Civilization                    |\n| **Black and Red Ware**                  | Various Chalcolithic/Iron Age contexts       |\n| **Painted Grey Ware (PGW)**             | **Early Iron Age, Northern India**           |\n| **Northern Black Polished Ware (NBPW)** | Later Iron Age / Mahajanapada–Mauryan period |"},

  {
    id: "gk-00015",
    question:
      "Who among the following non-Indians has been awarded the Bharat Ratna?",
    options: [
      "Abraham Lincoln",
      "Nelson Mandela",
      "Khan Abdul Ghaffar Khan",
      "Martin Luther King Jr."
    ],
    answer: 2,
    explanation:
      "Khan Abdul Ghaffar Khan was also called Frontier Gandhi."},

  {
    id: "gk-00016",
    question:
      "Which form of art is particularly celebrated at the Mando festival of Goa?",
    options: [
      "Traditional Goan music and dance",
      "Madhubani painting",
      "Kathakali dance",
      "Pattachitra painting"
    ],
    answer: 0,
    explanation:
      "Goa → Mando → Traditional music & dance\n\nDon't confuse:\n\nMando → Goa's traditional music/dance\nFado → Portuguese musical tradition\nDhalo → Goa's traditional women's folk dance\nFugdi → Goa's popular folk dance"},

  {
    id: "gk-00017",
    question:
      "Who among the following is the first female Indian to win a Grammy Award?",
    options: [
      "Palak Muchhal",
      "Ricky Kej",
      "Tanvi Shah",
      "Anoushka Shankar"
    ],
    answer: 2,
    explanation:
      "Falguni Shah (Falu): Won a Grammy in 2022 for Best Children's Music Album for A Colorful World. She is an Indian-American artist,\n\nWon a Grammy in 2010 at the 52nd Annual Grammy Awards. She won for Best Song Written for Visual Media for the song \"Jai Ho\" from the movie Slumdog Millionair\n\nRicky Kej → Indian composer; Grammy winner\nA.R. Rahman → Grammy winner for Slumdog Millionaire\nZakir Hussain → Grammy-winning tabla maestro\nTanvi Shah → Jai Ho team; Grammy winner"},

  {
    id: "gk-00018",
    question:
      "How many members must be present in the Lok Sabha, including the Speaker, to fulfil the quorum requirement?",
    options: ["55", "50", "46", "25"],
    answer: 0,
    explanation:
      "Article 100(3) — Quorum in either House of Parliament = one-tenth of the total number of members of the House. \n552 member in lok sabha"},

  {
    id: "gk-00019",
    question:
      "Which Article of the Indian Constitution directs the State to prevent the concentration of wealth and means of production?",
    options: ["Article 39(c)", "Article 38", "Article 43", "Article 48"],
    answer: 0,
    explanation:
      "| Clause    | Main idea                                                          |\n| --------- | ------------------------------------------------------------------ |\n| **39(a)** | Men & women → adequate means of livelihood                         |\n| **39(b)** | Material resources → common good ke liye distributed               |\n| **39(c)** | **Wealth & means of production → harmful concentration prevent** ⭐ |\n| **39(d)** | Equal pay for equal work                                           |\n| **39(e)** | Workers' health & strength protected                               |\n| **39(f)** | Children → healthy development & protection                        |"},

  {
    id: "gk-00020",
    question:
      "In which year did the United Nations General Assembly adopt the Declaration of the Rights of the Child?",
    options: ["1959", "1948", "1966", "1989"],
    answer: 0,
    explanation:
      "Child Rights Timeline:\n\n1924 → Geneva Declaration\n1959 → UN Declaration of Rights of the Child ⭐\n1989 → Convention on the Rights of the Child (CRC)\n\n🔥 Most important\n\n20 November 1959 → Declaration of the Rights of the Child\n\nIsi wajah se 20 November ko baad mein World Children's Day ke context mein bhi important date maana gaya."},

  {
    id: "gk-00021",
    question:
      "The Vindhyan Range broadly separates which two major physiographic regions of India?",
    options: [
      "Northern Plains and Peninsular Plateau",
      "Western Ghats and Eastern Ghats",
      "Himalayas and Northern Plains",
      "Deccan Plateau and Coastal Plains"
    ],
    answer: 0,
    explanation:
      "North → Northern Plains\nSouth → Peninsular Platea"},

  {
    id: "gk-00022",
    question:
      "According to Census 2011, which state among the Seven Sisters had the highest literacy rate?",
    options: ["Meghalaya", "Mizoram", "Tripura", "Assam"],
    answer: 1,
    explanation:
      "| State             | Literacy Rate |\n| ----------------- | ------------: |\n| Arunachal Pradesh |        65.38% |\n| Assam             |        72.19% |\n| Manipur           |        79.85% |\n| Meghalaya         |        74.43% |\n| **Mizoram** ⭐     |    **91.58%** |\n| Nagaland          |        79.55% |\n| Tripura           |        87.22% |"},

  {
    id: "gk-00023",
    question:
      "The oceanic crust is mostly composed of basalt. Approximately how thick is the oceanic crust beneath the ocean floor?",
    options: [
      "5–10 km",
      "20–25 km",
      "30–40 km",
      "50–60 km"
    ],
    answer: 0,
    explanation:
      "CONTINENTAL │      │   OCEANIC   │\n│   CRUST     │      │    CRUST    │\n│  ~35 km"},

  {
    id: "gk-00024",
    question:
      "Which of the following forms the largest share of the deficit in the Budget of India?",
    options: [
      "Revenue deficit",
      "Fiscal deficit",
      "Primary deficit",
      "Monetised deficit"
    ],
    answer: 1,
    explanation:
      "Definition: It is the total gap between the government's total expenditure and its total non-borrowed receipts."}
]

// Test Questions - two separate test sets
// Each question has mainCategory, testSet and category for filtering.
const testQuestions2 = [

  { id: 'static-history-001', mainCategory: "Test Questions", testSet: "Test 2", category: 'Mughal Empire', question: 'What was the Mahzar of 1579 during Akbar\'s reign?', options: ['A military reform', 'A land revenue settlement', 'A declaration strengthening Akbar\'s authority in religious disputes', 'A treaty with the Rajputs'], answer: 2, explanation: "Meerut → 10 May 1857 → Delhi → Bahadur Shah Zafar\n\nKanpur → Nana Sahib\nJhansi → Rani Lakshmibai\nBihar → Kunwar Singh\nLucknow → Begum Hazrat Mahal"},

  { id: 'static-chemistry-001', mainCategory: "Test Questions", testSet: "Test 2", category: 'Chemistry', question: 'Which statement best explains the Law of Constant Proportions?', options: ['A chemical compound always contains the same elements in the same proportion by mass.', 'Atoms can be divided into smaller particles during a reaction.', 'Elements are always found in random ratios in a compound.', 'Mass can neither be created nor destroyed in a chemical reaction.'], answer: 0, explanation: 'The Law of Constant Proportions states that a given chemical compound always contains the same elements combined in the same fixed proportion by mass.' },

  { id: 'static-chemistry-002', mainCategory: "Test Questions", testSet: "Test 2", category: 'Chemistry', question: 'Which of the following metals belongs to the middle of the activity series and is generally extracted by reduction of its oxide?', options: ['Iron', 'Potassium', 'Sodium', 'Gold'], answer: 0, explanation: 'Iron is a moderately reactive metal found in the middle of the activity series. Such metals are generally extracted by reducing their oxides.' },

  { id: 'static-biology-001', mainCategory: "Test Questions", testSet: "Test 2", category: 'Biology', question: 'Which plant tissue performs photosynthesis?', options: ['Chlorenchyma', 'Sclerenchyma', 'Phloem', 'Xylem'], answer: 0, explanation: "| Group            | पहचान                                       | Example          |\n| ---------------- | ------------------------------------------- | ---------------- |\n| **Thallophyta**  | Root, stem, leaves differentiated नहीं      | Algae            |\n| **Bryophyta**    | Non-vascular; “Amphibians of plant kingdom” | Moss, Marchantia |\n| **Pteridophyta** | Vascular; seeds नहीं                        | Fern             |\n| **Gymnosperms**  | Naked seeds                                 | Pinus, Cycas     |\n| **Angiosperms**  | Flower + enclosed seeds                     | Mango, Wheat     |\n"},

  { id: 'static-history-002', mainCategory: "Test Questions", testSet: "Test 2", category: 'Modern History', question: "With reference to Ishwar Chandra Vidyasagar, which statements are correct? 1. He protested against child marriage and polygamy. 2. His efforts contributed to the Hindu Widows' Remarriage Act, 1856. 3. He was primarily known for his scholarship in Persian.", options: ['I, II and III', 'I and II only', 'I and III only', 'II and III only'], answer: 1, explanation: " He was not known for Persian. Instead, he was a legendary scholar of Sanskrit and Bengali. In fact, his profound knowledge earned him the title \"Vidyasagar\" (meaning Ocean of Knowledge) from the Sanskrit College, and he is widely celebrated as the \"Father of Bengali Prose\" for modernizing the Bengali alphabet."},

  { id: 'static-history-003', mainCategory: "Test Questions", testSet: "Test 2", category: 'Modern History', question: 'In which country did Mahatma Gandhi, along with other Indians, establish the Natal Indian Congress to fight racial discrimination?', options: ['South Africa', 'India', 'England', 'France'], answer: 0, explanation: 'Gandhi helped establish the Natal Indian Congress in South Africa to organize the Indian community against racial discrimination.' },

  { id: 'static-history-004', mainCategory: "Test Questions", testSet: "Test 2", category: 'Ancient History', question: 'Which among the following was NOT one of the three broad sections of Rigvedic society mentioned in the given classification?', options: ['Craftsmen', 'Priests', 'Ordinary people', 'Warriors'], answer: 0, explanation: 'The three broad sections in the given classification were priests, warriors and ordinary people. Craftsmen were not listed as a separate section.' },

  { id: 'static-polity-001', mainCategory: "Test Questions", testSet: "Test 2", category: 'Polity', question: 'Which of the following is NOT an Indian institution responsible for investigating or addressing complaints concerning human rights or specific vulnerable groups?', options: ['International Human Rights Commission', 'National Commission for Scheduled Castes', 'National Commission for Women', 'National Human Rights Commission of India'], answer: 0, explanation: 'The International Human Rights Commission is not one of the Indian national statutory or constitutional commissions listed here.' },

  { id: 'static-polity-002', mainCategory: "Test Questions", testSet: "Test 2", category: 'Polity', question: 'Which term was added to the description of India in the Preamble by the 42nd Constitutional Amendment Act, 1976?', options: ['Aristocratic', 'Oligarchic', 'Capitalist', 'Secular'], answer: 3, explanation: "9 Dec 1946 → First meeting\n11 Dec 1946 → Rajendra Prasad became President\n13 Dec 1946 → Nehru moved Objectives Resolution"},

  { id: 'static-polity-003', mainCategory: "Test Questions", testSet: "Test 2", category: 'Polity', question: 'With reference to the Inter-State Council, consider the following statements: I. It is established under Article 263. II. It is a permanent constitutional body. III. The Prime Minister is its Chairman. IV. It discusses and recommends policies for coordination between the Centre and States. Which statements are correct?', options: ['I and II only', 'I, III and IV only', 'II, III and IV only', 'I, II, III and IV'], answer: 2, explanation: 'Statements I, III and IV are correct. Article 263 provides for the establishment of an Inter-State Council, the Prime Minister chairs it, and it facilitates Centre-State coordination. It is not a permanent constitutional body.' },

  { id: 'static-geography-001', mainCategory: "Test Questions", testSet: "Test 2", category: 'Geography', question: 'Which type of rock is formed through processes involving weathering, erosion, deposition and lithification?', options: ['Igneous rocks', 'Sedimentary rocks', 'Sub-metamorphic rocks', 'Metamorphic rocks'], answer: 1, explanation: 'Sedimentary rocks are formed when sediments produced through processes such as weathering and erosion are deposited and subsequently compacted and cemented through lithification.' },

  { id: 'static-economy-001', mainCategory: "Test Questions", testSet: "Test 2", category: 'Economy', question: 'Which of the following is NOT considered a component of India\'s foreign exchange reserves?', options: ['Gold reserves held by the RBI', 'Foreign Currency Assets', 'Government securities held by the RBI', 'Special Drawing Rights'], answer: 2, explanation: 'India\'s forex reserves include Foreign Currency Assets, gold, SDRs and the reserve position in the IMF. Government securities held by the RBI are not separately classified as a component of forex reserves.' },

  { id: 'static-polity-004', mainCategory: "Test Questions", testSet: "Test 2", category: 'Polity', question: 'Which Article of the Constitution deals with the vacation, resignation and removal of the Speaker and Deputy Speaker of the Lok Sabha?', options: ['Article 123', 'Article 360', 'Article 110', 'Article 94'], answer: 3, explanation: 'Article 94 deals with the vacation, resignation and removal of the Speaker and Deputy Speaker of the Lok Sabha.' },

  { id: 'static-sports-001', mainCategory: "Test Questions", testSet: "Test 2", category: 'Sports', question: 'The inaugural Khelo India Tribal Games (KITG) mentioned in the given data were scheduled to be held in which state in March 2026?', options: ['Jharkhand', 'Odisha', 'Chhattisgarh', 'Madhya Pradesh'], answer: 2, explanation: 'According to the given question data, the inaugural Khelo India Tribal Games were associated with Chhattisgarh.' },

  { id: 'static-sports-002', mainCategory: "Test Questions", testSet: "Test 2", category: 'Sports', question: 'Which of the following is/are historical names associated with table tennis? I. Gossima II. Whiff-Whaff III. Ping-Pong', options: ['I only', 'I and II only', 'II and III only', 'I, II and III'], answer: 3, explanation: 'Gossima, Whiff-Whaff and Ping-Pong are all historical names associated with the development of table tennis.' },

  { id: 'static-culture-001', mainCategory: "Test Questions", testSet: "Test 2", category: 'Art & Culture', question: 'Who among the following is NOT associated with Kathakali?', options: ['Kalamandalam Gopi', 'Kelucharan Mohapatra', 'Ramankutty Nair', 'Kalamandalam Rajan'], answer: 1, explanation: 'Kelucharan Mohapatra was a legendary exponent of Odissi dance, while the other names are associated with Kathakali.' },

  { id: 'static-culture-002', mainCategory: "Test Questions", testSet: "Test 2", category: 'Art & Culture', question: 'Kummi, a folk dance commonly performed during harvest festivals and Navratri, is primarily associated with which state?', options: ['Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh'], answer: 1, explanation: 'Kummi is a traditional folk dance particularly associated with Tamil Nadu and is commonly performed by women during festivals and celebrations.' },

  { id: 'static-culture-003', mainCategory: "Test Questions", testSet: "Test 2", category: 'Art & Culture', question: 'Which Maharana of Mewar composed the work on music known as Sangeet Raj?', options: ['Maharana Sanga', 'Maharana Pratap', 'Maharana Kumbha', 'Maharana Udai Singh'], answer: 2, explanation: 'Maharana Kumbha of Mewar was a noted patron and scholar of music and is associated with the composition Sangeet Raj.' },

  { id: 'static-culture-004', mainCategory: "Test Questions", testSet: "Test 2", category: 'Art & Culture', question: 'Barash, a festival compared with the Hindu festival of Diwali, is celebrated by which tribal communities?', options: ['Munda', 'Santhal', 'Warli and Kokna', 'Gond and Bhil'], answer: 2, explanation: 'Barash is associated with the Warli and Kokna tribal communities and is compared with the festival of Diwali.' },

  { id: 'static-culture-005', mainCategory: "Test Questions", testSet: "Test 2", category: 'Art & Culture', question: 'Which harvest festival of western Odisha welcomes the new rice of the season and is celebrated during the month of Bhadrab?', options: ['Gangaur', 'Nuakhai', 'Hornbill Festival', 'Chhath Puja'], answer: 1, explanation: 'Nuakhai is an important harvest festival of western Odisha. It celebrates the arrival and consumption of the new rice crop.' }

];

const testQuestions3 = [

  {
    id: 'static-geography-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Geography',
    question: "Consider the following Assertion (A) and Reason (R) regarding 'October Heat':\n\nAssertion (A): The month of October is known for 'October Heat' in the Indian subcontinent.\n\nReason (R): During the transition from the rainy season to the winter season, the sky becomes clear and the temperature rises while the land remains moist.",
    options: [
      "Both A and R are true, and R is the correct explanation of A.",
      "Both A and R are true, but R is not the correct explanation of A.",
      "A is true, but R is false.",
      "A is false, but R is true."
    ],
    answer: 0,
    explanation: "Both statements are correct. After the retreat of the southwest monsoon, skies become clear, temperature rises, and the land remains moist. High temperature combined with humidity produces the phenomenon known as 'October Heat'."
  },

  {
    id: 'static-literature-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Literature',
    question: "Match the following authors with their books/works:\n\nA. Bal Gangadhar Tilak\nB. Sarojini Naidu\nC. Shashi Tharoor\nD. Arundhati Roy\n\n1. The Golden Threshold\n2. An Era of Darkness\n3. Gita Rahasya\n4. The Ministry of Utmost Happiness",
    options: [
      "A-4, B-1, C-2, D-3",
      "A-1, B-3, C-4, D-2",
      "A-3, B-2, C-1, D-4",
      "A-3, B-1, C-2, D-4"
    ],
    answer: 3,
    explanation: "Bal Gangadhar Tilak wrote Gita Rahasya, Sarojini Naidu wrote The Golden Threshold, Shashi Tharoor wrote An Era of Darkness, and Arundhati Roy wrote The Ministry of Utmost Happiness. Therefore, A-3, B-1, C-2, D-4."
  },

  {
    id: 'static-polity-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Indian Polity',
    question: "Consider the following statements regarding the Indian Parliament:\n\nStatement I: A Member of Parliament who is not a Minister is referred to as a 'Private Member,' and they can introduce a Bill in the House only on Fridays.\n\nStatement II: The Joint Sitting of both Houses is presided over by the President of India in the absence of the Speaker of the Lok Sabha.\n\nStatement III: The maximum gap between two sessions of Parliament cannot exceed six months.\n\nWhich of the statements given above is/are correct?",
    options: [
      "Only I",
      "Only II",
      "Only III",
      "Only II and III"
    ],
    answer: 2,
    explanation: "Statement I is incorrect because although a non-Minister MP is called a Private Member, Private Members' Bills are not legally restricted to introduction only on Fridays. Statement II is incorrect because a Joint Sitting is presided over by the Speaker of the Lok Sabha, or in their absence, the Deputy Speaker, and then the Deputy Chairman of the Rajya Sabha. The President does not preside over it. Statement III is correct under Article 85, which requires that not more than six months should intervene between two sessions of Parliament."
  },

  {
    id: 'static-history-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Modern History',
    question: "Which of the following is NOT true regarding the Revolt of 1857?",
    options: [
      "Bahadur Shah Zafar was the Mughal emperor during the 1857 revolt in India.",
      "It is known as the First War of Independence.",
      "It was a successful revolt against the British.",
      "It began as a sepoy mutiny and later spread to several regions."
    ],
    answer: 2,
    explanation: "The Revolt of 1857 was ultimately unsuccessful in overthrowing British rule. Bahadur Shah Zafar was declared the symbolic leader, and the revolt began among sepoys before spreading to several parts of northern and central India."
  },

  {
    id: 'static-geography-002',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Geography',
    question: "Which of the following minerals forms about 4% of the Earth's crust, is commonly found in igneous and metamorphic rocks, and is used in electrical instruments?",
    options: [
      "Haematite",
      "Barite",
      "Olivine",
      "Mica"
    ],
    answer: 3,
    explanation: "Mica → Electrical insulation ⚡\nBauxite → Aluminium 🥫\nHematite/Magnetite → Iron 🔩\nLimestone → Cement 🏗️\nManganese → Steel industry\nCopper → Electrical wires 🔌\nGold → Jewellery 💍\n\n🔥 One-line memory\n\n“MICA electricity se bachata hai, Bauxite aluminium deta hai, Limestone cement banata hai.”"},

  {
    id: 'static-geography-003',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Indian Geography',
    question: "Match the following:\n\nA. Highest Population Density State/UT\nB. Lowest Literacy Rate State/UT\nC. Urban Population Share\nD. 2nd Highest Literacy Rate State/UT\nE. Decadal Population Growth\n\n1. 31.16%\n2. Bihar\n3. Dadra and Nagar Haveli\n4. Mizoram\n5. 17.64%",
    options: [
      "A-1, B-2, C-4, D-3, E-5",
      "A-2, B-3, C-4, D-1, E-5",
      "A-3, B-2, C-1, D-4, E-5",
      "A-4, B-2, C-3, D-1, E-5"
    ],
    answer: 2,
    explanation: "According to the given data, the matching is A-1, B-2, C-4, D-3 and E-5. Bihar is associated with the lowest literacy rate among states, while Mizoram has a high urban population share."
  },

  {
    id: 'static-government-scheme-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Government Schemes',
    question: "Which of the following statements about the Pradhan Mantri Suraksha Bima Yojana (PMSBY) is correct?\n\n1. The scheme is available to individuals aged between 18 and 70 years.\n2. The scheme was launched by Prime Minister Narendra Modi on May 9, 2015, as a government initiative.\n3. Under PMSBY, an accidental insurance cover of Rs. 5 lakh is offered for one year.",
    options: [
      "1 and 2",
      "1 only",
      "2 and 3",
      "1, 2 and 3"
    ],
    answer: 0,
    explanation: "PMSBY का accidental cover ₹2 lakh है, ₹5 lakh नहीं।",
    notes: ["Pradhan Mantri Jan Suraksha Yojana"],},

  {
    id: 'static-biology-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Biology',
    question: "Which one of the following is the characteristic feature of Thallophyta?",
    options: [
      "Simple body",
      "Roots present",
      "Flowering plant",
      "Well-developed vascular system"
    ],
    answer: 0,
    explanation: "Thallophytes have a simple plant body called a thallus. They do not have true roots, stems or leaves. Algae are common examples."
  },

  {
    id: 'static-science-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Physics',
    question: "Which of the following statements is NOT true regarding the particles of matter?",
    options: [
      "They are very small.",
      "They are moving constantly.",
      "They do not have spaces in between them.",
      "They attract each other."
    ],
    answer: 2,
    explanation: "Particles of matter have spaces between them. They are extremely small, continuously moving, and attract one another. Therefore, the statement that there are no spaces between particles is incorrect."
  },

  {
    id: 'static-physics-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Physics',
    question: "Which of the following symptoms is related to myopia?",
    options: [
      "A person can see nearby objects clearly but cannot see distant objects distinctly.",
      "A person can see both nearby and distant objects distinctly.",
      "A person cannot see both nearby and distant objects distinctly.",
      "A person can see distant objects clearly but cannot see nearby objects distinctly."
    ],
    answer: 0,
    explanation: "Defect\tProblem\tImage position\tCorrection\nMyopia\tदूर की चीजें blurry\tRetina के आगे\tConcave\nHypermetropia\tपास की चीजें blurry\tRetina के पीछे\tConvex\nPresbyopia\tAge-related near-vision difficulty\tAccommodation-related\tConvex / bifocal depending on vision\nAstigmatism\tDistorted/blurred vision\tUnequal focusing\tCylindrical\nCataract\tCloudy lens\t—\tMedical/surgical treatment"},

  {
    id: 'static-economics-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Economics',
    question: "Under Liberalisation in 1991, several foreign exchange reforms were initiated. In this context, which of the following is true for devaluation of domestic currency?",
    options: [
      "Fixing the domestic currency to all foreign currencies",
      "Lowering the value of foreign currency in relation to domestic currency",
      "Increasing the value of domestic currency in relation to foreign currency",
      "Lowering the value of domestic currency in relation to foreign currency"
    ],
    answer: 3,
    explanation: "Devaluation means an official reduction in the value of a country's domestic currency relative to foreign currencies under a fixed or managed exchange-rate system."
  },

  {
    id: 'static-economics-002',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Economics',
    question: "The closing stock of a firm during a year is equal to:",
    options: [
      "Production of the firm during the year minus sales of the firm",
      "Opening stock plus change in inventories",
      "Opening stock minus change in inventories",
      "Production minus opening stock"
    ],
    answer: 1,
    explanation: "Closing stock = Opening stock + Change in inventories. Therefore, if inventories increase during the year, the closing stock will be greater than the opening stock."
  },

  {
    id: 'static-history-002',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Medieval History',
    question: "Harihara and Bukka established an independent state in Karnataka in 1336 and established its capital at Hampi on the banks of the river:",
    options: [
      "Betwa",
      "Tungabhadra",
      "Mahanadi",
      "Tapi"
    ],
    answer: 1,
    explanation: "Harihara I and Bukka Raya founded the Vijayanagara Empire in 1336. Its capital, Vijayanagara (Hampi), was situated on the banks of the Tungabhadra River."
  },

  {
    id: 'static-polity-002',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Indian Polity',
    question: "The Constituent Assembly of India met for the first time on:",
    options: [
      "12 December 1946",
      "9 December 1946",
      "7 December 1946",
      "15 December 1946"
    ],
    answer: 1,
    explanation: "The Constituent Assembly met for the first time on 9 December 1946. Dr. Sachchidananda Sinha served as the temporary chairman of the first meeting."
  },

  {
    id: 'static-polity-003',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Indian Polity',
    question: "Which commission recommended the division of Bihar and creation of Jharkhand, which was formed as a separate state in 2000?",
    options: [
      "Mandal Commission",
      "Sarkaria Commission",
      "States Reorganisation Commission",
      "None of these"
    ],
    answer: 3,
    explanation: "None of these is the correct answer. Jharkhand was created as a separate state from Bihar on 15 November 2000. The creation of Jharkhand was based on political and regional movements rather than a recommendation by the Mandal, Sarkaria or States Reorganisation Commission."
  },

  {
    id: 'static-sports-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Sports',
    question: "Which Indian university is set to host multiple sporting disciplines for the World Police and Fire Games 2029?",
    options: [
      "Rashtriya Raksha University",
      "Gujarat National Law University",
      "National Defence Academy, Pune",
      "Indian Institute of Sports Management, Mumbai"
    ],
    answer: 0,
    explanation: "Rashtriya Raksha University in Gujarat is associated with hosting sporting disciplines for the World Police and Fire Games 2029."
  },

  {
    id: 'static-sports-002',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Yoga',
    question: "Out of the following events, which event is NOT a part of Competitive Yogasana Sports?",
    options: [
      "Rhythmic Yogasana (Single)",
      "Traditional Yogasana",
      "Artistic Yogasana (Single)",
      "Artistic Yogasana (Pair)"
    ],
    answer: 0,
    explanation: "Traditional Yogasana, Artistic Yogasana and Rhythmic Yogasana are recognized competitive formats. Rhythmic Yogasana is generally performed in pairs or groups, making 'Rhythmic Yogasana (Single)' the incorrect option."
  },

  {
    id: 'static-culture-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Indian Culture',
    question: "Bhavai and Kalbelia, as traditional dance forms, owe their genesis to which Indian state?",
    options: [
      "Assam",
      "Rajasthan",
      "Punjab",
      "Odisha"
    ],
    answer: 1,
    explanation: "Bhavai and Kalbelia are traditional folk dance forms associated with Rajasthan. Kalbelia is traditionally performed by the Kalbelia community."
  },

  {
    id: 'static-music-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Indian Music',
    question: "A distinct 'Dhrupad style' is associated with which gharana?",
    options: [
      "Bishnupur",
      "Jafferkhani",
      "Nathdwara",
      "Ajrada"
    ],
    answer: 0,
    explanation: "The Bishnupur Gharana of West Bengal is particularly associated with Dhrupad traditions and is one of the important classical music gharanas of eastern India."
  },

  {
    id: 'static-culture-002',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Festivals',
    question: "Saga Dawa is a major Buddhist festival celebrated in which Indian state?",
    options: [
      "Tripura",
      "Manipur",
      "Sikkim",
      "Assam"
    ],
    answer: 2,
    explanation: "Saga Dawa is an important Buddhist festival celebrated especially in Sikkim. It commemorates major events in the life of Gautama Buddha, including his birth, enlightenment and Mahaparinirvana."
  },

  {
    id: 'static-environment-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Environment',
    question: "Consider the following statements regarding Project Cheetah and choose the correct one:\n\nStatement I: Project Cheetah was started in 2022, with cheetahs brought from Namibia.\n\nStatement II: In February 2026, nine additional cheetahs were received from Botswana and placed into quarantine at Kuno National Park.\n\nStatement III: The primary site of the introduction of cheetahs is Satpura National Park.\n\nWhich of the statements given above are correct?",
    options: [
      "Only I",
      "Only II and III",
      "Only I and II",
      "All of the above"
    ],
    answer: 2,
    explanation: "They were brought to Kuno National Park, Madhya Pradesh.\nThe project aims to reintroduce the cheetah in India, where the species had become locally extinct."},

  {
    id: 'static-science-tech-001',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Science and Technology',
    question: "India and which country jointly launched the pilot Science and Technology Partnership Dashboard on November 4, 2025?",
    options: [
      "United States",
      "Germany",
      "Japan",
      "United Kingdom"
    ],
    answer: 0,
    explanation: "India and the United States jointly launched the pilot Science and Technology Partnership Dashboard to strengthen cooperation and provide a platform for tracking collaborative science and technology initiatives."
  },

  {
    id: 'static-environment-002',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Environment',
    question: "Which organization officially recognized the Dugong Conservation Reserve recently in 2025?",
    options: [
      "WWF",
      "IUCN",
      "UNEP",
      "UNESCO"
    ],
    answer: 1,
    explanation: "📍 Location: Palk Bay, Tamil Nadu\n\n🇮🇳 India's first Dugong Conservation Reserve\n\n📅 Established: 2022 by Tamil Nadu Government\n\n🌊 Area: about 448.34 km²\n\n🐋 Dugong = “Sea Cow”\n\n🌱 Main habitat: Seagrass meadows\n\n🌍 2025 recognition: IUCN"},

  {
    id: 'static-sports-003',
    mainCategory: "Test Questions",
    testSet: "Test 3",
    category: 'Sports',
    question: "Who was officially knighted by King Charles III at Windsor Castle on November 4, 2025?",
    options: [
      "Wayne Rooney",
      "David Beckham",
      "Steven Gerrard",
      "Harry Kane"
    ],
    answer: 1,
    explanation: "David Beckham was formally knighted by King Charles III at Windsor Castle in recognition of his services to sport and charitable work."
  }

];
const testQuestions4 = [

  {
    id: 'test4-current-affairs-001',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Current Affairs',
    question: "The World Boxing Futures Cup 2026 was held in Bangkok from March 8-15 and also served as a qualifying platform for the Youth Olympic Games Dakar 2026. India won medals across different categories, including a gold medal in the women's 51 kg event. How many total medals did India win in the tournament?",
    options: [
      "3 medals",
      "4 medals",
      "5 medals",
      "6 medals"
    ],
    answer: 2,
    explanation: "Correct Answer → 5 medals\n\n→ India ne World Boxing Futures Cup 2026 me total 5 medals jeete.\n→ Medal tally → 1 Gold + 3 Silver + 1 Bronze.\n→ Chandrika Pujari → Women's 51 kg category me Gold medal.\n→ Gunjan, Joyshree Devi aur Ambekar Meetei → Silver medals.\n→ Radhamani Longjam → Bronze medal.\n\nFinal → 1 + 3 + 1 = 5 medals."
  },

  {
    id: 'test4-literature-002',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Literature',
    question: "With reference to the Sahitya Akademi Awards 2025, which were announced on 16 March 2026, consider the following statements:\n\n1. The awards were announced for literary works in 24 Indian languages.\n2. Sahitya Akademi is an autonomous body under the Ministry of Culture.\n3. The awards are restricted only to poetry and novels.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: 0,
    explanation: "Correct Answer → 1 and 2 only\n\n→ Statement 1 → Correct. Awards 24 Indian languages ke works ke liye announce hue.\n→ Statement 2 → Correct. Sahitya Akademi Ministry of Culture ke under autonomous body hai.\n→ Sahitya Akademi 1954 me establish hui thi.\n→ Statement 3 → Incorrect. Awards sirf poetry aur novels tak limited nahi hain.\n→ Short stories, essays, autobiography aur memoir jaise forms bhi included hote hain.\n\nFinal → Statements 1 and 2 correct hain."
  },

  {
    id: 'test4-current-affairs-003',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Current Affairs',
    question: "Due to regional instability in March 2026, CBSE cancelled Class 12 examinations in several countries of the West Asian Region. The affected region included countries such as Bahrain, Iran, Kuwait, Oman, Qatar, Saudi Arabia and the UAE. Which of the following countries was NOT specifically mentioned in the cancellation order?",
    options: [
      "United Arab Emirates",
      "Saudi Arabia",
      "Jordan",
      "Oman"
    ],
    answer: 2,
    explanation: "Correct Answer → Jordan\n\n→ CBSE cancellation list me Bahrain, Iran, Kuwait, Oman, Qatar, Saudi Arabia aur UAE included the.\n→ Jordan is specified list ka part nahi tha.\n→ Board ne affected students ke result declaration ke liye separate guidelines announce karne ki baat kahi thi.\n\nFinal → Jordan."
  },

  {
    id: 'test4-current-affairs-004',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Current Affairs',
    question: "India's first AI-driven skill census named 'Saksham' was launched by Maharashtra to assess the skills of youth aged 18-40, identify employability gaps and align training with market demand. In which city was this initiative launched?",
    options: [
      "Pune",
      "Mumbai",
      "Hyderabad",
      "Bengaluru"
    ],
    answer: 1,
    explanation: "Correct Answer → Mumbai\n\n→ India's first AI-driven skill census ka naam → Saksham.\n→ Maharashtra ne ise Mumbai me launch kiya.\n→ Initiative youth aged 18-40 ki skills assess karega.\n→ Around 55,000 households in Mumbai's H-West ward cover karne ka target diya gaya hai.\n→ Programme ka aim employability gaps identify karna aur market-demand based training provide karna hai.\n\nFinal → Mumbai."
  },

  {
    id: 'test4-sports-005',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Sports',
    question: "The Badminton World Federation announced that India would host the 2026 Badminton World Championships in August. India had previously hosted the championship in Hyderabad in 2009. Which Indian city was selected to host the 2026 edition?",
    options: [
      "New Delhi",
      "Kolkata",
      "Ahmedabad",
      "Pune"
    ],
    answer: 0,
    explanation: "Correct Answer → New Delhi\n\n→ 2026 Badminton World Championships New Delhi me host honge.\n→ India ne previous time 2009 me Hyderabad me championship host ki thi.\n→ Isliye event around 17 years baad India return karega.\n→ Announcement Badminton World Federation se related tha.\n\nFinal → New Delhi."
  },

  {
    id: 'test4-government-schemes-006',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Government Schemes',
    question: "To improve household access to electricity, the Government of India launched the Pradhan Mantri Sahaj Bijli Har Ghar Yojana in 2017. Which of the following schemes aimed to provide electricity connections to the remaining un-electrified households in rural as well as urban areas?",
    options: [
      "Saubhagya Yojana",
      "Ujjwala Yojana",
      "Swabhimaan Scheme",
      "Pradhan Mantri Gram Sadak Yojana"
    ],
    answer: 0,
    explanation: "Correct Answer → Saubhagya Yojana\n\n→ Saubhagya ka full name → Pradhan Mantri Sahaj Bijli Har Ghar Yojana.\n→ Launch year → 2017.\n→ Main objective → remaining un-electrified households ko electricity connections dena.\n→ Ujjwala Yojana → LPG connections.\n→ Swabhimaan Scheme → financial inclusion/banking services.\n→ PMGSY → rural road connectivity.\n\nFinal → Saubhagya Yojana."
  },

  {
    id: 'test4-sports-007',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Sports',
    question: "Which legendary Indian cricketer, who was also the first captain of the Indian Test cricket team, became the first Indian cricketer to receive the Padma Bhushan award in 1956?",
    options: [
      "CK Nayudu",
      "Sachin Tendulkar",
      "Sunil Gavaskar",
      "Kapil Dev"
    ],
    answer: 0,
    explanation: "Correct Answer → CK Nayudu\n\n→ CK Nayudu India ke first Test captain the.\n→ Unhe 1956 me Padma Bhushan se honour kiya gaya.\n→ Woh Padma Bhushan receive karne wale first Indian cricketer bane.\n→ Sunil Gavaskar → 1980.\n→ Kapil Dev → 1991.\n→ Sachin Tendulkar → 2008.\n\nFinal → CK Nayudu."
  },

  {
    id: 'test4-space-008',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Science & Space',
    question: "India's first satellite was launched on 19 April 1975 and was built by ISRO to conduct experiments in areas such as X-ray astronomy and solar physics. It was launched using a Soviet Kosmos-3M rocket. Which satellite was it?",
    options: [
      "Aryabhatta",
      "Chandrayaan",
      "Gaganyaan",
      "Mars Orbiter Mission"
    ],
    answer: 0,
    explanation: "Correct Answer → Aryabhatta\n\n→ Aryabhatta India ka first satellite tha.\n→ Launch date → 19 April 1975.\n→ Satellite ISRO ne build kiya tha.\n→ Purpose → X-ray astronomy aur solar physics experiments.\n→ Soviet Kosmos-3M rocket se launch kiya gaya tha.\n\nFinal → Aryabhatta."
  },

  {
    id: 'test4-art-culture-009',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Art & Culture',
    question: "The Dhrang Fair is a two-day religious and cultural festival celebrated in honour of Saint Mekran Dada. Devotees gather to pay homage, seek blessings and participate in religious rituals and cultural programmes. In which state is the Dhrang Fair held?",
    options: [
      "Punjab",
      "Haryana",
      "Gujarat",
      "Rajasthan"
    ],
    answer: 2,
    explanation: "Correct Answer → Gujarat\n\n→ Dhrang Fair Gujarat me organise hota hai.\n→ Festival Saint Mekran Dada ke honour me celebrate kiya jata hai.\n→ Devotees religious rituals aur cultural programmes me participate karte hain.\n→ Fair local community me cultural unity aur spiritual connection ko promote karta hai.\n\nFinal → Gujarat."
  },

  {
    id: 'test4-art-culture-010',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Art & Culture',
    question: "Indian classical dances originated in different regions of the country. Which classical dance form, associated with Uttar Pradesh and developed from traditional storytelling practices, represents Northern India?",
    options: [
      "Kathakali",
      "Mohiniyattam",
      "Kathak",
      "Kuchipudi"
    ],
    answer: 2,
    explanation: "Correct Answer → Kathak\n\n→ Kathak Northern India ka classical dance form hai.\n→ Iska origin Uttar Pradesh se associated hai.\n→ Kathak storytelling tradition se evolve hua.\n→ Kathakali → Kerala.\n→ Mohiniyattam → Kerala.\n→ Kuchipudi → Andhra Pradesh.\n\nFinal → Kathak."
  },

  {
    id: 'test4-sports-011',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Sports',
    question: "The first official Paralympic Games were organised in 1960 as an international multi-sport event. Around 400 athletes representing 23 countries participated in the historic Games. Which city hosted the first Paralympic Games?",
    options: [
      "Rome",
      "London",
      "Rio de Janeiro",
      "Paris"
    ],
    answer: 0,
    explanation: "Correct Answer → Rome\n\n→ First Paralympic Games → 1960.\n→ Host city → Rome, Italy.\n→ Around 400 athletes ne participate kiya.\n→ Participants around 23 countries se aaye the.\n→ Is event ne modern Paralympic movement ke development me important role play kiya.\n\nParalympic movement ki roots 1948 se judi hain, jab Dr. Ludwig Guttmann ne Stoke Mandeville Hospital, England mein wheelchair athletes ke liye competition organize kiya."},

  

  {
    id: 'test4-geography-013',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Geography',
    question: "The Congo River is recognised as the deepest river in the world and is also notable for crossing the Equator twice. Its vast river basin supports one of the world's largest tropical rainforests. On which continent is the Congo River located?",
    options: [
      "Europe",
      "Africa",
      "Asia",
      "South America"
    ],
    answer: 1,
    explanation: "Correct Answer → Africa\n\n→ Congo River Africa me located hai.\n→ Ye world's deepest river ke roop me known hai.\n→ Source ke according Africa me Nile ke baad second-longest river hai.\n→ Unique fact → Congo River Equator ko twice cross karti hai.\n→ Iska basin vast Congo rainforest ko support karta hai.\n\nFinal → Africa."
  },

  {
    id: 'test4-demography-014',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Population & Demography',
    question: "Consider the following statements regarding India's demographic trends:\n\n1. Demographic dividend specifically refers to the rise in the proportion of population aged 15-62 years.\n2. According to NFHS-5, India's Total Fertility Rate (TFR) declined to 2.0 children per woman, below the replacement level of 2.1.\n3. According to Demographic Transition Theory, India has already entered Stage IV or the 'Low Stationary' stage.\n\nWhich of the statements given above is/are correct?",
    options: [
      "Only 1 and 2",
      "Only 2",
      "Only 2 and 3",
      "1, 2 and 3"
    ],
    answer: 1,
    explanation: "Correct Answer → Only Statement 2\n\n→ Statement 1 → Incorrect. Source ke according demographic dividend ke context me working-age group 15-64 years hai, 15-62 nahi.\n→ Statement 2 → Correct. NFHS-5 ke according TFR → 2.0 children per woman.\n→ Replacement fertility level → 2.1.\n→ Statement 3 → Incorrect according to given solution.\n→ Source India ko Stage III or Late Expanding stage me place karta hai.\n\nFinal → Only Statement 2."
  },

  {
    id: 'test4-chemistry-015',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Chemistry',
    question: "A compound is formed when two or more different elements chemically combine in a fixed ratio and the resulting substance has properties different from its constituent elements. Which of the following is a compound?",
    options: [
      "Oxygen",
      "Iron",
      "Water",
      "Sulphur"
    ],
    answer: 2,
    explanation: "Correct Answer → Water\n\n→ Water ka chemical formula → H₂O.\n→ Isme Hydrogen aur Oxygen chemically bonded hote hain.\n→ Fixed ratio → 2 Hydrogen atoms : 1 Oxygen atom.\n→ Oxygen → element.\n→ Iron → element.\n→ Sulphur → element.\n\nFinal → Water ek compound hai."
  },

  {
    id: 'test4-physics-016',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Physics',
    question: "For uniformly accelerated motion, equations of motion relate initial velocity (u), final velocity (v), acceleration (a), displacement (s) and time (t). Which of the following equations can be used without knowing the final velocity of the particle?",
    options: [
      "v = u + at",
      "s = ut + (1/2)at²",
      "v² - u² = 2as",
      "v = ut + a"
    ],
    answer: 1,
    explanation: "Correct Answer → s = ut + (1/2)at²\n\n→ Question me final velocity 'v' se independent equation puchhi gayi hai.\n→ s = ut + ½at² me variables → s, u, a aur t.\n→ Is equation me final velocity 'v' present nahi hai.\n→ Isliye displacement calculate karne ke liye final velocity ki zarurat nahi hoti.\n\nFinal → s = ut + (1/2)at²."
  },

  {
    id: 'test4-biology-017',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Biology',
    question: "Sexually transmitted diseases may be caused by bacteria or viruses. Among the following options, which sexually transmitted disease is specifically caused by the bacterium Neisseria gonorrhoeae?",
    options: [
      "Gonorrhoea",
      "HIV-AIDS",
      "Genital Warts",
      "Typhoid"
    ],
    answer: 0,
    explanation: "Correct Answer → Gonorrhoea\n\n→ Gonorrhoea ka causative organism → Neisseria gonorrhoeae.\n→ Ye ek bacterium hai.\n→ HIV-AIDS → Human Immunodeficiency Virus se caused hota hai.\n→ Genital Warts → HPV virus se caused hote hain.\n→ Typhoid → Salmonella typhi bacterium se hota hai, lekin STD nahi hai.\n\nFinal → Gonorrhoea."
  },

  {
    id: 'test4-polity-018',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Indian Polity',
    question: "The 73rd Constitutional Amendment strengthened Panchayati Raj Institutions and introduced provisions to ensure that elected local bodies continue to function democratically. Which provision prevents a dissolved Panchayat from remaining vacant for an extended period?",
    options: [
      "Creation of Lok Adalats at the Panchayat level",
      "Inclusion of Panchayati Raj in the Union List",
      "Elections within six months of dissolution of a Panchayat",
      "Provision for direct funding from the Union Government"
    ],
    answer: 2,
    explanation: "Correct Answer → Elections within six months of dissolution\n\n→ 73rd Constitutional Amendment PRIs ki democratic continuity ensure karta hai.\n→ Agar Panchayat dissolve ho jaye → elections six months ke andar conduct hone chahiye.\n→ Is provision se state governments local bodies ko long period tak vacant nahi rakh sakti.\n→ Lok Adalats aur direct Union funding is specific continuity rule ka part nahi hain.\n\nFinal → Elections within six months of dissolution."
  },

  {
    id: 'test4-polity-019',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Indian Polity',
    question: "After Independence, linguistic reorganisation of states emerged as an important issue. Which commission was appointed by the Government of India to examine the feasibility of reorganising states on a linguistic basis, although it initially gave greater importance to administrative convenience?",
    options: [
      "Swaran Singh Committee",
      "Dhar Commission",
      "Gadgil Commission",
      "Sarkaria Commission"
    ],
    answer: 1,
    explanation: "Correct Answer → Dhar Commission\n\n→ Dhar Commission linguistic basis par states ke reorganisation ke question ko examine karne ke liye appoint hua.\n→ Commission ne initially language ke comparison me administrative convenience ko preference di.\n→ Swaran Singh Committee → Fundamental Duties.\n→ Gadgil Commission → Western Ghats/environment related context.\n→ Sarkaria Commission → Centre-State relations.\n\nFinal → Dhar Commission."
  },

  {
    id: 'test4-polity-020',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Indian Polity',
    question: "Consider the following statements regarding Fundamental Duties under Article 51A of the Indian Constitution:\n\n1. Fundamental Duties were added by the 42nd Constitutional Amendment Act, 1976, based on the recommendations of the Stawant Singh Committee.\n2. Apart from the Fundamental Duties incorporated into the Constitution, three additional recommendations of the committee were not accepted and incorporated.\n3. There were originally 10 Fundamental Duties and, according to the statement, the 11th duty was added by the 86th Constitutional Amendment Act, 2004.\n\nHow many of the above statements are correct according to the given material?",
    options: [
      "Only one statement is correct",
      "Only two statements are correct",
      "All three statements are correct",
      "None of the statements are correct"
    ],
    answer: 0,
    explanation: "Correct Answer → Only one statement is correct\n\n→ Statement 1 → Incorrect. Correct committee name Swaran Singh Committee hai, Stawant Singh Committee nahi.\n→ Statement 2 → Correct according to given material.\n→ Three additional recommendations Constitution me incorporate nahi ki gayi thi.\n→ Statement 3 → Incorrect according to the provided solution.\n\nFinal → Sirf one statement correct hai."
  },

  {
    id: 'test4-economy-021',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Indian Economy',
    question: "India's 1991 economic reform period focused on fiscal stabilisation, industrial de-licensing and opening the economy to greater global trade. According to the given material, which of the following was identified as an important fiscal reform aimed at reducing the cascading effect of taxes?",
    options: [
      "Abolition of Wealth Tax",
      "Introduction of GST",
      "Introduction of Modified Value Added Tax (MODVAT)",
      "Implementation of the FRBM Act"
    ],
    answer: 2,
    explanation: "Correct Answer → Modified Value Added Tax (MODVAT)\n\n→ Given material MODVAT ko important fiscal reform ke roop me identify karta hai.\n→ Main purpose → cascading effect of taxation ko reduce karna.\n→ GST → 2017 me implement hua.\n→ FRBM Act → 2003 se associated hai.\n→ Isliye given options me expected answer MODVAT hai.\n\nFinal → Introduction of MODVAT."
  },

  

  {
    id: 'test4-history-023',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Modern History',
    question: "Match the following leaders with the regions where they were associated with the Swadeshi Movement of 1905-1911:\n\nLeaders:\n1. Bal Gangadhar Tilak\n2. Ajit Singh and Lala Lajpat Rai\n3. Syed Haider Raza\n4. V.O. Chidambaram Pillai\n\nPlaces:\nA. Delhi\nB. Madras\nC. Maharashtra\nD. Punjab",
    options: [
      "1-A, 2-C, 3-D, 4-B",
      "1-B, 2-A, 3-C, 4-D",
      "1-C, 2-D, 3-A, 4-B",
      "1-D, 2-C, 3-B, 4-A"
    ],
    answer: 2,
    explanation: "1905 → Bengal Partition → Swadeshi Movement\n↓\nMovement Bengal se bahar bhi spread hua\n↓\n\n→ Bal Gangadhar Tilak → Maharashtra (C).\n→ Ajit Singh and Lala Lajpat Rai → Punjab (D).\n→ Syed Haider Raza → Delhi (A).\n→ V.O. Chidambaram Pillai → Madras (B).\n\nFinal Matching → 1-C, 2-D, 3-A, 4-B."},

  {
    id: 'test4-history-024',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Ancient History',
    question: "The Indus Valley Civilisation contained several large urban settlements characterised by planned streets, drainage systems and specialised craft workshops. According to the given material, which Harappan site in present-day Haryana is regarded as the largest city of the civilisation after Mohenjo-Daro?",
    options: [
      "Ghatkopar",
      "Mitathal",
      "Rakhigarhi",
      "Bhiwani"
    ],
    answer: 2,
    explanation: "Correct Answer → Rakhigarhi\n\n→ Rakhigarhi Haryana me located major Harappan site hai.\n→ Given material ke according Mohenjo-Daro ke baad largest Indus Valley city batayi gayi hai.\n→ Site approximately 350 hectares tak spread hone ka reference diya gaya hai.\n→ Yahan advanced drainage, streets aur craft workshops ke evidence mile hain.\n→ Mitathal comparatively smaller settlement tha.\n\nFinal → Rakhigarhi."
  },

  {
    id: 'test4-history-025',
    mainCategory: "Test Questions",
    testSet: "Test 4",
    category: 'Medieval History',
    question: "The First Battle of Panipat in 1526 was a major turning point in Indian history. Sultan Ibrahim Lodi was defeated, after which Delhi and Agra were captured and the foundation for Mughal rule in northern India was established. Who defeated Ibrahim Lodi in this battle?",
    options: [
      "Humayun",
      "Akbar",
      "Maharana Pratap",
      "Babur"
    ],
    answer: 3,
    explanation: "Correct Answer → Babur\n\n→ First Battle of Panipat → 1526.\n→ Battle Babur aur Ibrahim Lodi ke beech hui.\n→ Babur ne Ibrahim Lodi ko defeat kiya.\n→ Victory ke baad Babur ne Delhi aur Agra capture kiya.\n→ Is battle ne Delhi Sultanate ke end aur Mughal rule ki beginning ka path open kiya.\n→ Humayun → Babur ka son.\n→ Akbar → Babur ka grandson.\n→ Maharana Pratap → later Akbar ke period se associated the.\n\nBattle\tYear\tBetween\tWinner\nFirst Battle of Panipat\t1526\tBabur vs Ibrahim Lodi\tBabur\nSecond Battle of Panipat\t1556\tAkbar/Bairam Khan vs Hemu\tAkbar's forces\nThird Battle of Panipat\t1761\tAhmad Shah Abdali vs Marathas\tAhmad Shah Abdali"}

];
const testQuestions5 = [

  {
    id: 'test5-polity-001',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Polity',
    question: "With reference to the constitutional identification of Scheduled Tribes in India, which Article of the Indian Constitution empowers the President, after consultation with the Governor of a State, to specify the tribes or tribal communities deemed to be Scheduled Tribes for that State or Union Territory?",
    options: [
      "Article 336",
      "Article 343",
      "Article 340",
      "Article 342"
    ],
    answer: 3,
    explanation: "Correct Answer → Article 342\n\n→ Article 342 President ko, State ke case me Governor se consultation ke baad, Scheduled Tribes specify karne ki power deta hai.\n→ List me baad me inclusion ya exclusion sirf Parliament ke Act se kiya ja sakta hai.\n→ Article 340 → socially aur educationally backward classes ki conditions investigate karne ke liye Commission se related hai.\n→ Article 343 → Union ki official language se related hai.\n\nFinal → Scheduled Tribes specification = Article 342."
  ,
    notes: ["part 16 from article 330 to 242A"],},

  {
    id: 'test5-polity-002',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Polity',
    question: "The States Reorganisation Act, 1956 reorganised the internal boundaries of India largely on linguistic lines and significantly altered several existing States. Which of the following States was NOT formed or reorganised through the States Reorganisation Act, 1956?",
    options: [
      "Rajasthan State",
      "Bombay State",
      "Mysore State",
      "Goa State"
    ],
    answer: 3,
    explanation: "Correct Answer → Goa State\n\n→ Goa 1956 me Portuguese rule ke under tha, isliye States Reorganisation Act, 1956 ke through form nahi hua.\n→ Goa 1961 me India ka part bana, initially Union Territory raha.\n→ Goa ko full statehood 1987 me mila.\n→ Rajasthan, Bombay aur Mysore 1956 reorganisation process se affected/reorganised hue.\n\nFinal → NOT formed through the 1956 Act = Goa State."
  ,
    notes: ["Most important fact: States Reorganisation Act, 1956 came into effect on 1 November 1956 and reorganised India into 14 States and 6 Union Territories."],},

  {
    id: 'test5-polity-003',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Polity',
    question: "The Directive Principles of State Policy contain several provisions reflecting Gandhian ideas about rural development and decentralised economic activity. Which Article directs the State to endeavour to promote cottage industries on an individual or cooperative basis in rural areas?",
    options: [
      "Article 41",
      "Article 43",
      "Article 36",
      "Article 55"
    ],
    answer: 1,
    explanation: "Correct Answer → Article 43\n\n→ Article 43 State ko rural areas me individual ya cooperative basis par cottage industries promote karne ke liye endeavour karne ko kehta hai.\n→ Ye Directive Principles of State Policy ka part hai aur Gandhian ideology reflect karta hai.\n→ Article 41 → right to work, education aur certain cases me public assistance se related hai.\n→ Article 36 → Part IV ke liye 'State' ko define karta hai.\n\nFinal → Cottage industries in rural areas = Article 43."
  },

  {
    id: 'test5-geography-004',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Geography',
    question: "The Indus river system includes several important Himalayan and trans-Himalayan tributaries. Which of the following is a right-bank tributary of the Indus that originates in the Hindu Kush region of Afghanistan and joins the Indus near Attock in Pakistan?",
    options: [
      "Kabul River",
      "Jhelum River",
      "Ravi River",
      "Chenab River"
    ],
    answer: 0,
    explanation: "Correct Answer → Kabul River\n\n→ Kabul River Indus ki major right-bank tributary hai.\n→ Ye Afghanistan ke Hindu Kush mountains se originate hoti hai aur Attock, Pakistan ke near Indus me join karti hai.\n→ Jhelum, Ravi aur Chenab Indus system ki left-bank tributaries hain.\n→ Chenab Chandra aur Bhaga rivers ke confluence se banti hai.\n\nFinal → Right-bank tributary = Kabul River."
  },

  {
    id: 'test5-geography-005',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Geography',
    question: "Earthquakes occur when accumulated energy is suddenly released within the Earth, producing seismic waves that travel through the interior and along the surface. Which of the following statements about an earthquake is INCORRECT?",
    options: [
      "An earthquake is shaking of the Earth.",
      "An earthquake is caused due to release of energy.",
      "An earthquake is a natural event.",
      "An earthquake creates waves that spread in one direction."
    ],
    answer: 3,
    explanation: "Correct Answer → An earthquake creates waves that spread in one direction.\n\n→ Ye statement incorrect hai kyunki seismic waves focus/hypocenter se different directions me spread karti hain.\n→ Earthquake Earth ki shaking hai aur sudden energy release se generate hota hai.\n→ Major seismic waves me P-waves, S-waves aur surface waves include hote hain.\n\nFinal → Seismic waves sirf one direction me nahi spread karti."
  },

  {
    id: 'test5-geography-006',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Geography',
    question: "Peninsular India contains a large triangular plateau lying south of the Narmada River, bounded broadly by the Western Ghats on the west and the Eastern Ghats on the east. Which plateau is being described?",
    options: [
      "Chhota Nagpur Plateau",
      "Deccan Plateau",
      "Meghalaya Plateau",
      "Malwa Plateau"
    ],
    answer: 1,
    explanation: "Correct Answer → Deccan Plateau\n\n→ Deccan Plateau Narmada River ke south me ek large triangular landmass hai.\n→ Ye broadly Western Ghats aur Eastern Ghats ke beech situated hai.\n→ Chhota Nagpur Plateau eastern India ka important mineral region hai.\n→ Malwa Plateau central India me Vindhya Range ke north me located hai.\n\nFinal → Western Ghats + Eastern Ghats ke beech = Deccan Plateau."
  },

  {
    id: 'test5-economics-007',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Economics',
    question: "The Green Revolution transformed Indian agriculture through high-yielding varieties, irrigation, fertilisers and other modern inputs. Which of the following was NOT a disadvantage of the Green Revolution?",
    options: [
      "High use of fertilisers and pesticides resulted in health illnesses.",
      "Most of the crops introduced during the Green Revolution were intensive crops.",
      "It promoted extensive use of chemicals.",
      "It reduced India's import of food grains."
    ],
    answer: 3,
    explanation: "Correct Answer → It reduced India's import of food grains.\n\n→ Food-grain imports reduce hona Green Revolution ka benefit tha, disadvantage nahi.\n→ Higher domestic production, especially wheat aur rice me, India ki self-sufficiency improve hui.\n→ High chemical input aur intensive cultivation se environmental/health concerns associated rahe.\n→ Reduced imports ne foreign exchange conserve karne me bhi help ki.\n\nFinal → NOT a disadvantage = Reduced food-grain imports."
  ,
    notes: ["Father of Green Revolution (World): Dr. Norman Borlaug (Unhe 1970 me Nobel Peace Prize mila tha).Father of Green Revolution (India): Dr. M.S. Swaminathan (Haal hi me unhe Bharat Ratna se nawaaza gaya hai).Term Coined By: 'Green Revolution' shabd sabse pehle William S. Gaud ne diya tha.Timeline & Phase in India (भारत में समय और चरण)Launch Year: Bharat me iski shuruaat 1966-67 (3rd Five-Year Plan ke dauran) hui thi."],},

  {
    id: 'test5-economics-008',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Economics',
    question: "India introduced the New Economic Policy in response to a severe balance-of-payments crisis, with reforms centred on Liberalisation, Privatisation and Globalisation (LPG). In which year did India officially begin this major phase of economic liberalisation?",
    options: [
      "1991",
      "1985",
      "1995",
      "2000"
    ],
    answer: 0,
    explanation: "Correct Answer → 1991\n\n→ India ne severe Balance of Payments crisis ke background me 1991 me major economic liberalisation start ki.\n→ P.V. Narasimha Rao Prime Minister aur Dr. Manmohan Singh Finance Minister the.\n→ LPG model → Liberalisation + Privatisation + Globalisation.\n→ Liberalisation ka focus government restrictions aur licensing ko reduce karna tha.\n\nFinal → Economic liberalisation = 1991."
  },

  {
    id: 'test5-history-009',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'History',
    question: "During the Delhi Sultanate, successive rulers founded new capitals for strategic, administrative and defensive purposes. Arrange the following capitals in the correct chronological order of their foundation:\n\n1. Tughlaqabad\n2. Siri\n3. Firozabad\n4. Jahanpanah",
    options: [
      "2-1-4-3",
      "1-2-3-4",
      "2-4-1-3",
      "1-4-2-3"
    ],
    answer: 0,
    explanation: "Correct Answer → 2-1-4-3\n\n→ Siri → c. 1303 CE, Alauddin Khalji ne establish ki.\n→ Tughlaqabad → c. 1321 CE, Ghiyasuddin Tughlaq se associated.\n→ Jahanpanah → c. 1326 CE, Muhammad bin Tughlaq ne Siri aur Lal Kot ke areas ko connect/unify karne ke purpose se banaya.\n→ Firozabad → c. 1354 CE, Firoz Shah Tughlaq se associated; Firoz Shah Kotla bhi isi se linked hai.\n\nFinal → Siri → Tughlaqabad → Jahanpanah → Firozabad."
  },

  {
    id: 'test5-history-010',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'History',
    question: "Match the following sessions of the Indian National Congress with their respective Presidents:\n\nA. 1885 – Bombay\nB. 1907 – Surat\nC. 1919 – Amritsar\nD. 1929 – Lahore\n\n1. Rash Behari Ghosh\n2. W.C. Bonnerjee\n3. Motilal Nehru\n4. Jawaharlal Nehru",
    options: [
      "A-2, B-1, C-3, D-4",
      "A-1, B-2, C-4, D-3",
      "A-1, B-2, C-3, D-4",
      "A-2, B-3, C-1, D-4"
    ],
    answer: 0,
    explanation: "Correct Answer → A-2, B-1, C-3, D-4\n\n→ 1885 Bombay → W.C. Bonnerjee, first INC session ke President.\n→ 1907 Surat → Rash Behari Ghosh; session Surat Split ke liye famous hai.\n→ 1919 Amritsar → Motilal Nehru.\n→ 1929 Lahore → Jawaharlal Nehru; Purna Swaraj resolution ke liye famous.\n\nFinal → A-2, B-1, C-3, D-4."
  },

  {
    id: 'test5-science-011',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Science',
    question: "Organic compounds generally contain carbon bonded with hydrogen, whereas certain carbon-containing compounds such as carbonates are classified as inorganic. Which of the following is NOT considered an organic compound?",
    options: [
      "Acetic acid (CH3COOH)",
      "Methane (CH4)",
      "Ethanol (C2H5OH)",
      "Sodium carbonate (Na2CO3)"
    ],
    answer: 3,
    explanation: "Correct Answer → Sodium carbonate (Na2CO3)\n\n→ Sodium carbonate ek inorganic carbonate compound hai.\n→ Acetic acid, methane aur ethanol typical organic compounds hain aur inme C-H bonding present hoti hai.\n→ Carbon present hone ka matlab automatically compound organic nahi hota.\n\nFinal → Inorganic option = Sodium carbonate (Na2CO3)."
  },

  {
    id: 'test5-science-012',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Science',
    question: "Lysosomes are membrane-bound cell organelles containing digestive enzymes and are often described as part of the cell's internal cleaning and recycling system. What is their principal role?",
    options: [
      "To digest foreign material",
      "To transport products",
      "To produce ATP",
      "To store proteins"
    ],
    answer: 0,
    explanation: "Correct Answer → To digest foreign material\n\n→ Lysosomes powerful digestive enzymes contain karte hain.\n→ Ye waste material, damaged cell parts aur bacteria jaise foreign substances ko break down karte hain.\n→ Is process se unwanted material remove/recycle hota hai aur cell ki proper functioning maintain hoti hai.\n\nFinal → Lysosomes = intracellular digestion and cellular cleaning."
  },

  

  {
    id: 'test5-environment-014',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Environment',
    question: "The United Nations adopted 17 Sustainable Development Goals (SDGs) in 2015 as a global framework for development up to 2030. Which SDG aims to ensure access to affordable, reliable, sustainable and modern energy for all?",
    options: [
      "Goal 5",
      "Goal 10",
      "Goal 12",
      "Goal 7"
    ],
    answer: 3,
    explanation: "Correct Answer → Goal 7\n\n→ SDG 7 = Affordable and Clean Energy.\n→ Iska objective affordable, reliable, sustainable aur modern energy tak access improve karna hai.\n→ Isme renewable energy ka share increase karna aur energy efficiency improve karna bhi important focus hai.\n→ UN ke total 17 Sustainable Development Goals 2015 me adopted hue.\n\nFinal → Affordable and Clean Energy = SDG 7.\nSDG 1: गरीबी की समाप्ति (No Poverty)\n\nSDG 2: शून्य भूख (Zero Hunger)\n\nSDG 3: अच्छा स्वास्थ्य (Good Health & Well-being)\n\nSDG 4: गुणवत्तापूर्ण शिक्षा (Quality Education)\n\nSDG 7: किफायती और स्वच्छ ऊर्जा (Affordable & Clean Energy)\n\nSDG 13: जलवायु कार्रवाई (Climate Action)"},

  {
    id: 'test5-art-culture-015',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Art & Culture',
    question: "Kashmir has distinct traditions of folk music, classical Sufiana music and dance. Which of the following pairs of Kashmiri music or dance and its description is correctly matched?",
    options: [
      "Chakri — Classical form using Santoor and Hafiz Nagma",
      "Sufiana Music — Folk style sung with Garaha and Rabab",
      "Hafiz Nagma — Dance based on musical notes of Sufiana music",
      "Rouf — Instrumental duet performed with Santoor and Sitar"
    ],
    answer: 2,
    explanation: "Correct Answer → Hafiz Nagma — Dance based on musical notes of Sufiana music\n\n→ Hafiz Nagma Kashmir ki traditional dance form hai jo Sufiana Kalam se closely linked hai.\n→ Chakri actually popular folk music style hai, jisme Garaha, Sarangi aur Rabab jaise instruments use hote hain.\n→ Sufiana Music Kashmir ki classical music tradition hai aur Santoor se associated hai.\n→ Rouf women ka traditional folk dance hai.\n\nFinal → Correct pair = Hafiz Nagma + Sufiana music."
  },

  {
    id: 'test5-art-culture-016',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Art & Culture',
    question: "Sufi traditions have deeply influenced the devotional music of northern India, including Haryana, where a centuries-old musical form is commonly performed at dargahs and religious gatherings. What is this devotional music called?",
    options: [
      "Bhajan",
      "Qawwali",
      "Kirtan",
      "Dhrupad"
    ],
    answer: 1,
    explanation: "Correct Answer → Qawwali\n\n→ Qawwali Sufism se associated devotional music form hai.\n→ Ye Indian subcontinent me centuries se perform ki ja rahi hai.\n→ Traditionally Qawwali Sufi shrines ya dargahs aur religious gatherings me perform hoti hai.\n→ Iska spiritual objective listeners ko divine closeness/ecstasy ki state, 'wajd', ki taraf le jana mana jata hai.\n\nFinal → Sufi devotional music = Qawwali."
  },

  {
    id: 'test5-sports-017',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Sports',
    question: "Handball permits players to intercept passes, dribble before passing or shooting, and use legal body positioning for defence, but certain actions against an opponent in possession are prohibited. Which of the following actions is NOT allowed?",
    options: [
      "Pulling or punching the ball out of an opponent's hands",
      "Intercepting the ball mid-air using both hands",
      "Dribbling the ball before making a pass",
      "Blocking the ball with the torso above the knees"
    ],
    answer: 0,
    explanation: "Correct Answer → Pulling or punching the ball out of an opponent's hands\n\n→ Opponent ke possession me ball ko pull ya punch karke nikalna forbidden action hai.\n→ Mid-air pass ko intercept karna legal defensive skill hai.\n→ Dribbling karke pass/shoot karna rules ke under allowed hai.\n→ Torso ka legal defensive use bhi permitted ho sakta hai.\n\nFinal → NOT allowed = Pulling/punching ball out of opponent's hands."
  },

  {
    id: 'test5-art-culture-018',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Art & Culture',
    question: "Hojagiri is a well-known folk dance in which young women display remarkable balancing skills using bottles and earthen lamps while performing rhythmic movements. It is associated with which tribe and State?",
    options: [
      "Bodo — Assam",
      "Reang — Tripura",
      "Angami — Nagaland",
      "Mishing — Arunachal Pradesh"
    ],
    answer: 1,
    explanation: "Correct Answer → Reang — Tripura\n\n→ Hojagiri Tripura ki Reang (Bru) tribe ka famous folk dance hai.\n→ Young women bottles aur earthen lamps ko balance karte hue rhythmic movements perform karti hain.\n→ Ye Hojagiri festival ya Goddess Lakshmi Puja ke time commonly perform kiya jata hai.\n\nFinal → Hojagiri = Reang (Bru) tribe + Tripura."
  },

  {
    id: 'test5-sports-019',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Sports',
    question: "The Irani Cup was established during the 1959–60 season to mark the silver jubilee of the Ranji Trophy and traditionally features the reigning Ranji Trophy champions against the Rest of India. With which sport is the Irani Cup associated?",
    options: [
      "Football",
      "Hockey",
      "Tennis",
      "Cricket"
    ],
    answer: 3,
    explanation: "Correct Answer → Cricket\n\n→ Irani Cup India ka prestigious first-class cricket competition hai.\n→ Ye 1959–60 season me Ranji Trophy ke silver jubilee ko mark karne ke liye establish hua.\n→ Match traditionally reigning Ranji Trophy champions aur Rest of India ke beech hota hai.\n→ Tournament Z.R. Irani, former BCCI President, ke naam se associated hai.\n\nFinal → Irani Cup = Cricket."
  },

  {
    id: 'test5-current-affairs-020',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Current Affairs',
    question: "Bharat Steel 2026, a two-day international conference and exhibition organised by the Ministry of Steel to discuss sustainable growth, digital transformation and global collaboration in the steel sector, was scheduled for 16–17 April 2026. Which city was selected to host the event?",
    options: [
      "Mumbai",
      "Gandhinagar",
      "Jamshedpur",
      "New Delhi"
    ],
    answer: 3,
    explanation: "Correct Answer → New Delhi\n\n→ Bharat Steel 2026 ko 16–17 April 2026 ke liye New Delhi me schedule kiya gaya.\n→ Event Ministry of Steel organise kar raha tha.\n→ Global industry leaders, policymakers, technology innovators aur investors ko ek platform par lana iska objective tha.\n→ Focus → sustainable growth, digital transformation aur collaboration opportunities.\n\nFinal → Bharat Steel 2026 host city = New Delhi."
  },

  {
    id: 'test5-current-affairs-021',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Current Affairs',
    question: "Børge Brende, a former Norwegian Foreign Minister who had led an international organisation as President and CEO since 2017, announced his resignation in 2026. Which organisation had he been heading?",
    options: [
      "International Monetary Fund (IMF)",
      "World Bank",
      "World Trade Organization (WTO)",
      "World Economic Forum (WEF)"
    ],
    answer: 3,
    explanation: "Correct Answer → World Economic Forum (WEF)\n\n→ Given material ke according Børge Brende World Economic Forum ke President and CEO the.\n→ Unhone 2017 se organisation ki leadership ki thi.\n→ 2026 me unhone apne post se resignation announce kiya.\n\nFinal → Børge Brende = World Economic Forum (WEF)."
  },

  {
    id: 'test5-current-affairs-022',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Current Affairs',
    question: "Ahead of IPL 2026, the BCCI secured a three-year sponsorship agreement worth ₹270 crore with an artificial-intelligence platform, beginning from the 2026 season. Which AI platform signed the deal?",
    options: [
      "Gemini",
      "OpenAI",
      "DeepSeek",
      "Grok"
    ],
    answer: 0,
    explanation: "Correct Answer → Gemini\n\n→ Given material ke according BCCI ne Google's AI platform Gemini ke saath ₹270 crore ka three-year sponsorship deal secure kiya.\n→ Agreement 2026 IPL season se start hona tha.\n→ Material me Tata ko title sponsor aur Apollo Tyres ko jersey rights holder bhi mention kiya gaya hai.\n\nFinal → ₹270 crore BCCI AI sponsorship = Gemini."
  },

  {
    id: 'test5-current-affairs-023',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Current Affairs',
    question: "The Sthree Suraksha Scheme provides monthly financial assistance of ₹1,000 to economically disadvantaged women and trans women aged 35–60 years who are not covered by other social-security programmes. Which State government launched the scheme?",
    options: [
      "Kerala",
      "Karnataka",
      "Tamil Nadu",
      "Telangana"
    ],
    answer: 0,
    explanation: "Correct Answer → Kerala\n\n→ Kerala government ne Sthree Suraksha Scheme launch ki.\n→ Scheme economically disadvantaged women aur trans women aged 35–60 years ke liye hai.\n→ Monthly financial assistance → ₹1,000.\n→ Beneficiaries other social-security programmes se covered nahi hone chahiye.\n→ Given material ke according first instalment direct bank accounts me transfer ki gayi.\n\nFinal → Sthree Suraksha Scheme = Kerala."
  },

  {
    id: 'test5-current-affairs-024',
    mainCategory: "Test Questions",
    testSet: "Test 5",
    category: 'Current Affairs',
    question: "The World Para Athletics Grand Prix 2026 in New Delhi was held from 11–13 March and formed the second leg of the 13th Grand Prix season. India topped the medal tally with 208 medals, including 75 gold medals. At which venue and in which country was the event hosted?",
    options: [
      "Bukit Jalil National Stadium — Malaysia",
      "Jawaharlal Nehru Stadium — India",
      "National Stadium Complex — Thailand",
      "Beijing National Stadium — China"
    ],
    answer: 1,
    explanation: "Correct Answer → Jawaharlal Nehru Stadium — India\n\n→ World Para Athletics Grand Prix 2026 New Delhi me Jawaharlal Nehru Stadium par held hua.\n→ Event 11–13 March tak chala.\n→ India ne medal tally top ki with 208 medals → 75 Gold + 69 Silver + 64 Bronze.\n→ Given material ke according 257 athletes from 8 nations participated.\n\nFinal → Venue = Jawaharlal Nehru Stadium, India.\n2nd russian 35 medals\n",
    notes: ["https://youtube.com/shorts/quJ8vp5-c_8?si=exQB_NBphus7rbiy"],}

];

const testQuestions = [
  ...testQuestions1,
  ...testQuestions2,
  ...testQuestions3,
  ...testQuestions4,
  ...testQuestions5
];
