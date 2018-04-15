/**
 * Structure:
 * [archetype,[rquired],[bonus]]
 */
const ARCHETYPES = [
    [
        "ABC", [
            "ABC-Dragon Buster",
            "A-Assault Core",
            "B-Buster Drake",
            "C-Crush Wyvern"
        ],
        ["Gadget", "Limiter Removal", "Machina Armored Unit", "Iron Call"]
    ],
    ["Assault Mode", [],
        []
    ],
    ["Abyss Actor", [],
        []
    ],
    ["Aesir", [],
        []
    ],
    ["Aether", [],
        []
    ],
    ["Alien", [],
        []
    ],
    ["Alligator", [],
        []
    ],
    ["Allure Queen", [],
        []
    ],
    ["Ally of Justice", [],
        []
    ],
    ["Altergeist", [],
        []
    ],
    ["Amazoness", [],
        []
    ],
    ["Amorphage", [],
        []
    ],
    [
        "Ancient Gear", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp"]
    ],
    ["Angel", [],
        []
    ],
    ["Anti", [],
        []
    ],
    ["Apoqliphort", [],
        []
    ],
    ["Aquaactress", [],
        []
    ],
    ["Arcana Force", [],
        []
    ],
    ["Archfiend", [],
        []
    ],
    ["Armed Dragon", ["Ojama"],
        []
    ],
    ["Aroma", [],
        []
    ],
    [
        "Artifact", [],
        [
            "Honest",
            "Shining Angel",
            "Tethys",
            "Goddess of Light",
            "Celestial Transformation",
            "The Sanctuary in the Sky",
            "The Fountain in the Sky"
        ]
    ],
    ["Assassin", [],
        []
    ],
    ["Assault Blackwing", [],
        []
    ],
    ["Atlantean", [],
        []
    ],
    ["B.E.S.", [],
        []
    ],
    ["Baby", [],
        []
    ],
    ["Bamboo Sword", [],
        []
    ],
    ["Batteryman", [],
        []
    ],
    ["Battleguard", [],
        []
    ],
    ["Battlin' Boxer", [],
        []
    ],
    ["Black Luster Soldier", [],
        []
    ],
    [
        "Blackwing", [],
        ["Quill Pen of Gulldos", "Divine Wind of Mist Valley", "Quiet Life"]
    ],
    ["Blaze Accelerator", [],
        []
    ],
    [
        "Blue-Eyes", [],
        [
            "Return of the Dragon Lords",
            "Silver's Cry",
            "Dragon Shrine",
            "The King of D."
        ]
    ],
    ["Bonding", [],
        []
    ],
    ["Bounzer", [],
        []
    ],
    ["Bujin", [],
        []
    ],
    ["Burning Abyss", [],
        ["Allure of Darkness", "Reckless Greed"]
    ],
    ["Buster Blader", [],
        []
    ],
    ["Butterfly", [],
        []
    ],
    [
        "Celtic Guard", [],
        ["Reinforcement of the Army", "The Warrior Returning Alive"]
    ],
    ["Chaos", [],
        []
    ],
    ["Charmer", [],
        []
    ],
    ["Chemicritter", [],
        []
    ],
    ["Chronomaly", [],
        []
    ],
    ["Chrysalis", [],
        []
    ],
    ["Cipher", [],
        []
    ],
    ["Clear Wing", [],
        []
    ],
    ["Cloudian", [],
        []
    ],
    ["Code Talker", ["Cyberse"],
        []
    ],
    ["Constellar", [],
        []
    ],
    ["Crystal Beast", [],
        []
    ],
    ["Crystron", [],
        []
    ],
    ["Cubic", [],
        []
    ],
    ["CXyz", [],
        []
    ],
    [
        "Cyber Angel", ["Machine Angel Ritual"],
        [
            "Djinn Prognosticator of Rituals",
            "Manju of the Ten Thousand Hands",
            "Senju of the Thousand Hands"
        ]
    ],
    ["Cyber Dragon", ["Polymerization"],
        []
    ],
    ["Cyberdark", [],
        []
    ],
    ["D/D", ["D/D/D", "Polymerization"],
        []
    ],
    ["D/D/D", ["D/D", "Polymerization", "Dark Contract"],
        ["Fusion Sage"]
    ],
    ["Dante", ["Burning Abyss"],
        []
    ],
    ["Dark Contract", ["D/D", "D/D/D", "Polymerization"],
        ["Fusion Sage"]
    ],
    ["Dark Magician", [],
        ["Dark Magician Girl"]
    ],
    ["Dark Magician Girl", [],
        ["Dark Magician"]
    ],
    ["Dark Scorpion", [],
        []
    ],
    ["Dark World", [],
        ["Tour Guide From the Underworld", "Armageddon Knight"]
    ],
    ["Darklord", [],
        []
    ],
    ["Deskbot", [],
        []
    ],
    [
        "Destiny HERO", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    ["Destruction Sword", [],
        ["Buster Blader"]
    ],
    ["Dice", [],
        []
    ],
    [
        "Dinomist", [],
        [
            "Fossil Excavation",
            "Big Evolution Pill",
            "Double Evolution Pill",
            "Ultra Evolution Pill",
            "Fossil Dig",
            "Jurassic World"
        ]
    ],
    ["Dododo", [],
        ["Gagaga", "Zubaba", "Gogogo"]
    ],
    ["Dracoslayer", ["True Draco", "Dracoverlord"],
        ["True King"]
    ],
    ["Dracoverlord", ["True Draco", "Dracoslayer"],
        ["True King"]
    ],
    ["Dragunity", [],
        []
    ],
    ["Duston", [],
        []
    ],
    ["Earthbound", [],
        []
    ],
    [
        "Edge Imp", [
            "Polymerization",
            "Fusion Substitute",
            "Ultra Polymerization",
            "Frightfur"
        ],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Elemental HERO", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    ["Elemental Lord", ["Elementsaber"],
        []
    ],
    ["Elementsaber", ["Elemental Lord"],
        []
    ],
    ["Empowered Warrior", [],
        []
    ],
    [
        "Evolsaur", ["Evoltile", "Evolzar"],
        [
            "Fossil Excavation",
            "Big Evolution Pill",
            "Double Evolution Pill",
            "Ultra Evolution Pill",
            "Fossil Dig",
            "Jurassic World"
        ]
    ],
    [
        "Evoltile", ["Evolzar", "Evolsaur"],
        [
            "Fossil Excavation",
            "Big Evolution Pill",
            "Double Evolution Pill",
            "Ultra Evolution Pill",
            "Fossil Dig",
            "Jurassic World"
        ]
    ],
    [
        "Evolzar", ["Evoltile", "Evolsaur"],
        [
            "Fossil Excavation",
            "Big Evolution Pill",
            "Double Evolution Pill",
            "Ultra Evolution Pill",
            "Fossil Dig",
            "Jurassic World"
        ]
    ],
    [
        "Exodia", ["Forbidden One"],
        [
            "Cup of Ace",
            "Royal Magical Library",
            "One Day of Peace",
            "Jar of Greed",
            "Shard of Greed",
            "Reckless Greed"
        ]
    ],
    [
        "Eyes Restrict", ["Relinquished"],
        [
            "Djinn Prognosticator of Rituals",
            "Manju of the Ten Thousand Hands",
            "Senju of the Thousand Hands"
        ]
    ],
    ["F.A.", [],
        []
    ],
    ["Familiar-Possessed", [],
        []
    ],
    ["Fire Fist", ["Fire Formation"],
        []
    ],
    ["Fire Formation", ["Fire Fist"],
        []
    ],
    ["Fire King", ["Fire King Avatar"],
        []
    ],
    ["Fire King Avatar", ["Fire King"],
        []
    ],
    ["Fishborg", [],
        []
    ],
    ["Flamvell", [],
        []
    ],
    ["Flower Cardian", [],
        []
    ],
    [
        "Fluffal", [
            "Polymerization",
            "Fusion Substitute",
            "Ultra Polymerization",
            "Frightfur",
            "Edge Imp"
        ],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Forbidden One", ["Exodia"],
        [
            "Cup of Ace",
            "Royal Magical Library",
            "One Day of Peace",
            "Jar of Greed",
            "Shard of Greed",
            "Reckless Greed"
        ]
    ],
    ["Fortune Lady", [],
        []
    ],
    [
        "Frightfur", [
            "Polymerization",
            "Fusion Substitute",
            "Ultra Polymerization",
            "Fluffal",
            "Edge Imp"
        ],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Frog", [
            "Polymerization",
            "Fusion Substitute",
            "Ultra Polymerization",
            "T.A.D.P.O.L.E."
        ],
        ["Scapegoat", "Wetlands", "Star Boy", "Mistar Boy"]
    ],
    [
        "Gadget", [],
        [
            "ABC-Dragon Buster",
            "A-Assault Core",
            "B-Buster Drake",
            "C-Crush Wyvern",
            "Limiter Removal",
            "Machina Armored Unit",
            "Iron Call"
        ]
    ],
    ["Gagaga", [],
        ["Dododo", "Zubaba"]
    ],
    [
        "Gaia The Fierce Knight", [
            "Curse of Dragon",
            "Polymerization",
            "Fusion Substitute",
            "Ultra Polymerization"
        ],
        []
    ],
    ["Galaxy-Eyes", [],
        []
    ],
    ["Gandora", [],
        []
    ],
    [
        "Geargia", [],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call", "7 Completed"]
    ],
    [
        "Gem-", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    ["Genex", [],
        []
    ],
    ["Ghostrick", [],
        []
    ],
    ["Gimmick Puppet", [],
        []
    ],
    [
        "Gishki", [],
        [
            "Djinn Prognosticator of Rituals",
            "Manju of the Ten Thousand Hands",
            "Senju of the Thousand Hands"
        ]
    ],
    ["Gladiator Beast", [],
        []
    ],
    ["Gogogo", [],
        ["Gagaga", "Zubaba", "Dododo"]
    ],
    ["Gorgonic", [],
        []
    ],
    ["Gouki", [],
        []
    ],
    ["Gravekeeper's", ["Necrovalley"],
        []
    ],
    ["Graydle", [],
        []
    ],
    ["of Gusto", [],
        []
    ],
    ["Harpie", [],
        []
    ],
    ["Hazy", ["Hazy Flame"],
        []
    ],
    ["Hazy Flame", ["Hazy"],
        []
    ],
    ["Heraldic", ["Heraldic Beast", "Heraldry"],
        []
    ],
    ["Heraldic Beast", ["Heraldic", "Heraldry"],
        []
    ],
    ["Heraldry", ["Heraldic Beast", "Heraldic"],
        []
    ],
    ["Heroic", [],
        []
    ],
    ["Hi-Speedroid", ["Speedroid"],
        []
    ],
    ["Hieratic", [],
        []
    ],
    ["Hole", ["Traptrix"],
        []
    ],
    ["Horus the Black Flame Dragon", [],
        []
    ],
    [
        "Ice Barrier", [],
        [
            "Salvage",
            "Surface",
            "Moray of Greed",
            "Mother Grizzly",
            "Snowman Eater",
            "Torrential Rebirth"
        ]
    ],
    ["Igknight", [],
        []
    ],
    ["Infernity", [],
        []
    ],
    ["Infernoid", [],
        []
    ],
    ["Infestation", ["Evilswarm", "Steelswarm"],
        []
    ],
    [
        "Invoked", [
            "Aleister the Invoker",
            "Aleister the Meltdown Invoker",
            "Magical Meltdown",
            "Invocation"
        ],
        []
    ],
    [
        "Inzektor", [],
        [
            "Cocoon of Ultra Evolution",
            "Parasite Paranoid",
            "Metamorphosed Insect Queen",
            "Worm Bait"
        ]
    ],
    ["Iron Chain", [],
        []
    ],
    ["Jester", [],
        []
    ],
    [
        "Jinzo", [],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call", "7 Completed"]
    ],
    ["Junk", [],
        []
    ],
    [
        "Jurrac", [],
        [
            "Fossil Excavation",
            "Big Evolution Pill",
            "Double Evolution Pill",
            "Ultra Evolution Pill",
            "Fossil Dig",
            "Jurassic World"
        ]
    ],
    ["Kaiju", [],
        ["Owner's Seal"]
    ],
    ["Karakuri", [],
        []
    ],
    ["Koa'ki Meiru", [],
        []
    ],
    [
        "Koala", [
            "Des Kangaroo",
            "Tree Otter",
            "Polymerization",
            "Fusion Substitute",
            "Ultra Polymerization"
        ],
        [
            "Beastking of the Swamps",
            "King of the Swamp",
            "Fusion Sage",
            "The Big March of Animals",
            "Beast Soul Swap",
            "Wild Nature's Release"
        ]
    ],
    ["Kozmo", [],
        ["Allure of Darkness ", "Card of Demise"]
    ],
    [
        "Krawler", [],
        ["Scapegoat", "Book of Moon", "Verdant Sanctuary", "Worm Bait"]
    ],
    [
        "Kuriboh", [],
        [
            "One for One",
            "Mimiclay",
            "Where Arf Thou?",
            "Wolf in Sheep's Clothing"
        ]
    ],
    ["Laval", [],
        []
    ],
    [
        "Legendary Knight", ["The Fang of Critias", "The Claw of Hermos", "The Eye of Timaeus"],
        [
            "Crush Card Virus",
            "Doom Virus Dragon",
            "Ring of Destruction",
            "Destruction Dragon"
        ]
    ],
    [
        "Lightsworn", [],
        [
            "Foolish Burial ",
            " Pot of Desires ",
            "Reinforcement of the Army",
            "That Grass Looks Greener",
            "Soul Charge"
        ]
    ],
    [
        "Lunalight", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Lyrilusc", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Machina", [],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call", "7 Completed"]
    ],
    ["Madolche", [],
        []
    ],
    [
        "Magical Musket", [],
        ["Ties of the Brethren", "Soul Charge", "Double Summon"]
    ],
    [
        "Magician", [
            "Pendulum Effect Monster",
            "Pendulum Normal Monster",
            "Pendulum Tuner Effect Monster",
            "Star Pendulumgraph",
            "Time Pendulumgraph"
        ],
        [
            "Supreme King Z-ARC",
            "Wavering Eyes",
            "Timestar Magician",
            "Heavymetalfoes Electrumite",
            "Pot of Desires",
            "Sky Iris"
        ]
    ],
    [
        "Magician Girl", [],
        [
            "Dark Magician",
            "Secret Village of the Spellcasters",
            "Secret Sanctuary of the Spellcasters"
        ]
    ],
    [
        "Magna Warrior", ["Magnet Warrior"],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call"]
    ],
    [
        "Magnet Warrior", ["Magna Warrior"],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call"]
    ],
    [
        "Majespecter", [],
        ["Secret Village of the Spellcasters", "Ties of the Brethren"]
    ],
    ["Majestic", ["Majestic Dragon"],
        []
    ],
    [
        "Malefic", [
            "Blue-Eyes White Dragon",
            "Cyber End Dragon",
            "Stardust Dragon",
            "Red-Eyes B. Dragon",
            "Rainbow Dragon"
        ],
        []
    ],
    [
        "Masked HERO", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Mecha Phantom Beast", [],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call"]
    ],
    ["Mekk-Knight", [],
        ["Grinder Golem", "Trade-In", "Lava Golem"]
    ],
    ["Meklord", [],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call"]
    ],
    [
        "Melodious", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Mermail", [],
        [
            "Deep Sea Diva",
            "Moray of Greed",
            "One for One",
            "Instant Fusion",
            "Rare Fish",
            " Atlantean Heavy Infantry"
        ]
    ],
    [
        "Metalfoes", [],
        [
            "Archfiend Eccentrick",
            "Majespecter Unicorn - Kirin",
            "Summoner's Art",
            "Painful Decision"
        ]
    ],
    ["Metaphys", [],
        []
    ],
    ["Mist Valley", [],
        ["Quill Pen of Gulldos", "Swallow's Nest,"]
    ],
    ["Monarch", [],
        []
    ],
    [
        "Morphtronic", [],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call", "Jinzo"]
    ],
    ["Mythical BeastN", [],
        []
    ],
    [
        "Naturia", [],
        [
            "Dandylion",
            "Neo-Spacian Grand Mole",
            "Glow-Up Bulb",
            "Spore",
            "Miracle Synchro Fusion"
        ]
    ],
    ["Necrovalley", ["Gravekeeper's"],
        []
    ],
    [
        "Nekroz", [],
        [
            "Djinn Prognosticator of Rituals",
            "Manju of the Ten Thousand Hands",
            "Senju of the Thousand Hands"
        ]
    ],
    [
        "Neo-Spacian", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Nimble", [],
        [
            "Salvage",
            "Surface",
            "Ronintoadin",
            "Dupe Frog",
            "Treeborn Frog",
            "Treeborn Frog"
        ]
    ],
    ["Ninja", ["Ninjitsu Art"],
        []
    ],
    ["Ninjitsu Art", ["Ninja"],
        []
    ],
    ["Noble Arms", ["Noble Knight"],
        []
    ],
    [
        "Noble Knight", ["Noble Arms"],
        [
            "Honest",
            "Summoner Monk",
            "Reinforcement of the Army",
            "The Warrior Returning Alive"
        ]
    ],
    ["Nordic", [],
        []
    ],
    [
        "Odd-Eyes", [],
        [
            "Tuning Magician",
            "Pendulum Call",
            "Duelist Alliance",
            "Draconnection"
        ]
    ],
    ["of Rituals", ["Ritual Monster", "Ritual Effect Monster"],
        []
    ],
    [
        "Ojama", [
            "Armed Dragon",
            "Polymerization",
            "Fusion Substitute",
            "Ultra Polymerization"
        ],
        [
            "United We Stand",
            "Solidarity",
            "Gravity Bind",
            "First of the Dragons"
        ]
    ],
    [
        "Paleozoic", [],
        [
            "Dimensional Barrier",
            "Imperial Iron Wall",
            " Anti-Spell Fragrance",
            "Mistake"
        ]
    ],
    [
        "Parasite", [],
        [
            "Cocoon of Ultra Evolution",
            "Parasite Paranoid",
            "Metamorphosed Insect Queen",
            "Worm Bait"
        ]
    ],
    [
        "Parshath", [],
        [
            "Honest",
            "Shining Angel",
            "Tethys",
            "Goddess of Light",
            "Celestial Transformation",
            "The Sanctuary in the Sky",
            "The Fountain in the Sky"
        ]
    ],
    [
        "Pendulum Dragon", ["Odd-Eyes"],
        [
            "Supreme King Z-ARC",
            "Wavering Eyes",
            "Timestar Magician",
            "Heavymetalfoes Electrumite",
            "Pot of Desires",
            "Sky Iris"
        ]
    ],
    ["Penguin", [],
        ["Umi", "Moray of Greed", "Water Hazard", "Salvage"]
    ],
    ["Performage", ["Performapal"],
        []
    ],
    ["Performapal", ["Performage"],
        []
    ],
    [
        "Phantasm Spiral", [],
        [
            "Megalosmasher X",
            "Rescue Rabbit",
            "Unexpected Dai",
            "Terraforming",
            "Sea Stealth Attack"
        ]
    ],
    [
        "Phantom Knights", [],
        [
            "Dark Requiem Xyz Dragon",
            "Dark Rebellion Xyz Dragon",
            "Decode Talker",
            "Reinforcement of the Army"
        ]
    ],
    ["Photon", [],
        ["Reinforcement of the Army"]
    ],
    [
        "Predap", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Prediction Princess", [],
        [
            "Djinn Prognosticator of Rituals",
            "Manju of the Ten Thousand Hands",
            "Senju of the Thousand Hands"
        ]
    ],
    [
        "Priestess", [],
        ["Secret Village of the Spellcasters", "Ties of the Brethren"]
    ],
    ["Prophecy", [],
        ["Secret Village of the Spellcasters"]
    ],
    [
        "PSY-Frame", [],
        ["Telekinetic Power Well", "Psychic Feel Zone", "Lose 1 Turn"]
    ],
    ["Qli", [],
        []
    ],
    ["Raidraptor", [],
        []
    ],
    [
        "Red-Eyes", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        [
            "Beastking of the Swamps",
            "King of the Swamp",
            "Fusion Sage",
            "Dragon's Mirror",
            "Return of the Dragon Lords"
        ]
    ],
    [
        "Reptilianne", [],
        ["Molting Escape", "Viper's Rebirth", "Attack Pheromones"]
    ],
    ["Resonator", [],
        []
    ],
    [
        "Ritual Beast", ["Spiritual Beast"],
        ["Emergency Teleport", "Book of Moon"]
    ],
    [
        "Roid", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        [
            "Beastking of the Swamps",
            "King of the Swamp",
            "Fusion Sage",
            "Power Bond",
            "Limiter Removal"
        ]
    ],
    ["Rokket", [],
        ["Firewall Dragon", "Evenly Matched", "Scapegoat"]
    ],
    [
        "Rose", [],
        ["Dandylion", "Neo-Spacian Grand Mole", "Glow-Up Bulb", "Spore"]
    ],
    [
        "Secret Six Samurai", ["Six Samurai", "Shien"],
        ["Reinforcement of the Army", "The Warrior Returning Alive"]
    ],
    [
        "Shaddoll", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        ["Beastking of the Swamps", "King of the Swamp", "Fusion Sage"]
    ],
    [
        "Shark", [],
        [
            "A Legendary Ocean",
            "Moray of Greed",
            "Water Hazard",
            "Salvage",
            "Sea Stealth Attack"
        ]
    ],
    [
        "Shiranui", [],
        [
            "Zombie World",
            "Gold Sarcophagus",
            "Jar of Greed",
            "Zombie Master",
            "Tristan",
            "Knight of the Underworld"
        ]
    ],
    [
        "Silent Magician", [],
        [
            "Interdimensional Matter Transporter",
            "Sphere Kuriboh ",
            "Magical Exemplar",
            "Alchemist of Black Spells",
            "Pitch-Black Power Stone"
        ]
    ],
    [
        "Silent Swordsman", [],
        [
            "Command Knight",
            "Marauding Captain",
            "Freed the Matchless General",
            "The Warrior Returning Alive",
            "Reinforcement of the Army"
        ]
    ],
    [
        "Six Samurai", ["Secret Six Samurai", "Shien"],
        ["Reinforcement of the Army", "The Warrior Returning Alive"]
    ],
    [
        "Skyfang Brigade", [],
        ["Reinforcement of the Army", "Back to the Front", "Soul Charge"]
    ],
    [
        "Slime", ["Revival Jam", "Jam Defender", "Jam Breeding Machine", "Wetlands"],
        []
    ],
    ["Speedroid", [],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call"]
    ],
    [
        "Sphinx", [],
        [
            "Triamid Pulse",
            "Triamid Fortress",
            "Foolish Burial",
            "Triamid Sphinx",
            "Triamid Hunter"
        ]
    ],
    ["Spirit Message", ["Destiny Board", "Dark Sanctuary"],
        ["Reckless Greed"]
    ],
    [
        "Spiritual Beast", ["Ritual Beast"],
        ["Emergency Teleport", "Book of Moon"]
    ],
    [
        "SPYRAL", [],
        [
            "Evenly Matched",
            "Ash Blossom & Joyous Spring",
            "Reinforcement of the Army",
            "Tri-gate Wizard"
        ]
    ],
    [
        "Star Seraph", [],
        [
            "Honest",
            "Shining Angel",
            "Tethys",
            "Goddess of Light",
            "Celestial Transformation",
            "The Sanctuary in the Sky",
            "The Fountain in the Sky"
        ]
    ],
    ["Steelswarm", [],
        ["Allure of Darkness,"]
    ],
    [
        "Stellarknight", ["Tellarknight"],
        ["Reinforcement of the Army", "The Warrior Returning Alive"]
    ],
    [
        "Strikeblade", [],
        ["Reinforcement of the Army", "The Warrior Returning Alive"]
    ],
    ["Subterror", [],
        ["Book of Eclipse", "Burst Rebirth"]
    ],
    [
        "Super Defense Robot", ["Orbital 7", "Lillybot"],
        ["Limiter Removal", "Machina Armored Unit", "Iron Call"]
    ],
    ["Super Quant", ["Super Quantal Mech Beast"],
        []
    ],
    ["Super Quantal Mech Beast", ["Super Quant"],
        []
    ],
    [
        "Superheavy", [],
        ["Vylon Tetra", "Limiter Removal", "Machina Armored Unit", "Iron Call"]
    ],
    [
        "Supreme King", [],
        [
            "Supreme King Z-ARC",
            "Wavering Eyes",
            "Timestar Magician",
            "Heavymetalfoes Electrumite",
            "Pot of Desires",
            "Sky Iris"
        ]
    ],
    [
        "Sylvan", [],
        [
            "Wall of Thorns",
            "Seed of Deception",
            "Vile Germs",
            "Black Garden",
            "Sinister Seeds"
        ]
    ],
    [
        "Symphonic Warrior", [],
        ["Vylon Tetra", "Limiter Removal", "Machina Armored Unit", "Iron Call"]
    ],
    ["T.G.", [],
        []
    ],
    [
        "Tellarknight", ["Stellarknight"],
        ["Reinforcement of the Army", "The Warrior Returning Alive"]
    ],
    [
        "The Agent", [],
        [
            "Honest",
            "Shining Angel",
            "Tethys",
            "Goddess of Light",
            "Celestial Transformation",
            "The Sanctuary in the Sky",
            "The Fountain in the Sky"
        ]
    ],
    [
        "The Phantom Knights", ["Phantom Knights"],
        [
            "Dark Requiem Xyz Dragon",
            "Dark Rebellion Xyz Dragon",
            "Decode Talker",
            "Reinforcement of the Army"
        ]
    ],
    [
        "The Weather", [],
        [
            "Honest",
            "Shining Angel",
            "Tethys",
            "Goddess of Light",
            "Celestial Transformation",
            "The Sanctuary in the Sky",
            "The Fountain in the Sky"
        ]
    ],
    [
        "Timelord", [],
        [
            "Honest",
            "Shining Angel",
            "Tethys",
            "Goddess of Light",
            "Celestial Transformation",
            "The Sanctuary in the Sky",
            "The Fountain in the Sky"
        ]
    ],
    ["Tindangle", [],
        ["Book of Eclipse", "Burst Rebirth", "Book of Moon"]
    ],
    ["Toon", ["Toon World"],
        ["Terraforming"]
    ],
    [
        "Traptrix", [
            "Trap Hole",
            "Time-Space Trap Hole",
            "Void Trap Hole",
            "Acid Trap Hole",
            "Bottomless Trap Hole"
        ],
        ["Floodgate Trap Hole"]
    ],
    [
        "Triamid", [],
        [
            "Guardian Sphinx",
            "Hieracosphinx",
            "Chronomaly Winged Sphinx",
            "Exxod",
            "Master of The Guard",
            "Criosphinx"
        ]
    ],
    [
        "Trickstar", [],
        [
            "Honest",
            "Shining Angel",
            "Tethys",
            "Goddess of Light",
            "Celestial Transformation",
            "The Sanctuary in the Sky",
            "The Fountain in the Sky",
            "Terraforming"
        ]
    ],
    ["Troymare", [],
        []
    ],
    ["True Draco", ["Draco"],
        []
    ],
    ["U.A.", [],
        ["Reinforcement of the Army", "The Warrior Returning Alive"]
    ],
    [
        "Umbral Horror", [],
        ["Armageddon Knight", "Summoner Monk", "Allure of Darkness"]
    ],
    ["Utopia", [],
        []
    ],
    [
        "Vampire", [],
        [
            "Book of Life",
            "Zombie Master",
            "Tutan Mask",
            "Call of the Mummy",
            "Zombie World"
        ]
    ],
    [
        "Vendread", ["Revendread Origin"],
        [
            "Djinn Prognosticator of Rituals",
            "Manju of the Ten Thousand Hands",
            "Senju of the Thousand Hands",
            "Book of Life",
            "Zombie Master",
            "Tutan Mask",
            "Call of the Mummy",
            "Zombie World"
        ]
    ],
    [
        "Venom", [],
        [
            "Snake Rain",
            "Damage = Reptile",
            "Limit Reverse",
            "Call of the Haunted"
        ]
    ],
    [
        "Volcanic", [],
        [
            "Watch Dog",
            "Royal Firestorm Guards",
            "Wild Fire",
            "Spiritual Fire Art - Kurenai",
            "Molten Destruction"
        ]
    ],
    [
        "Vylon", [],
        [
            "Honest",
            "Shining Angel",
            "Tethys",
            "Goddess of Light",
            "Celestial Transformation",
            "The Sanctuary in the Sky",
            "The Fountain in the Sky",
            "Limiter Removal"
        ]
    ],
    [
        "Watt", [],
        ["Mahunder", "Brohunder", "Recycling Batteries", "Judgment of Thunder"]
    ],
    [
        "Wind-Up", [],
        [
            "Cyber Dragon",
            "T.G. Warwolf",
            "Mind Control",
            "Stardust Dragon",
            "Starlight Road"
        ]
    ],
    [
        "Windwitch", ["Polymerization", "Fusion Substitute", "Ultra Polymerization"],
        [
            "Beastking of the Swamps",
            "King of the Swamp",
            "Fusion Sage",
            "Secret Village of the Spellcasters"
        ]
    ],
    ["World Chalice", ["World Legacy"],
        []
    ],
    ["World Legacy", ["World Chalice"],
        []
    ],
    ["X-Saber", [],
        []
    ],
    [
        "Yang Zing", [],
        [
            "Celestia",
            "Dracocension",
            "Oasis of Dragon Souls",
            "Waterfall of Dragon Souls"
        ]
    ],
    [
        "Yosenju", [],
        ["Quill Pen of Gulldos", "Divine Wind of Mist Valley", "Quiet Life"]
    ],
    ["Yubel", ["Yubel", "Yubel - Terror Incarnate"],
        []
    ],
    ["Zefra", [],
        []
    ],
    [
        "Zoodiac", [],
        ["Fire Formation - Tenki", "Scapegoat", "Mistake", "Pot of Desires"]
    ]
];

export {
    ARCHETYPES
};
