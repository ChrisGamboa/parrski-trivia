import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 1,
    category: "Science",
    question: "What planet is known as the 'Red Planet'?",
    choices: ["Venus", "Mars", "Jupiter", "Mercury"],
    correctIndex: 1,
    commentary: {
      picklesIntro: "Ooh, this one's out of this WORLD! Get it? *panting intensifies*",
      lucaCorrect: "Obviously Mars. Even I knew that and I sleep 18 hours a day.",
      oliverWrong: "I once knocked a Mars bar off the counter. Does that count as space exploration?",
      bettingLines: {
        oliver: "PLAYER definitely thinks it's Venus. They have that Venus energy. Clueless.",
        luca: "I'm backing PLAYER on this one. They seem like they've read a book before.",
      },
    },
  },
  {
    id: 2,
    category: "Geography",
    question: "What is the capital of Australia?",
    choices: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctIndex: 2,
    commentary: {
      picklesIntro: "Down under we go! This one trips up EVERYONE!",
      lucaCorrect: "Canberra. Not Sydney. I'm embarrassed for anyone who got this wrong.",
      oliverWrong: "I thought it was the place with the big opera house thing. Looks like a giant cat toy.",
      bettingLines: {
        oliver: "PLAYER's gonna say Sydney. Everyone says Sydney. Humans are predictable.",
        luca: "PLAYER might actually know this. I sense geographic competence. Barely.",
      },
    },
  },
  {
    id: 3,
    category: "History",
    question: "In what year did the Titanic sink?",
    choices: ["1905", "1912", "1918", "1923"],
    correctIndex: 1,
    commentary: {
      picklesIntro: "Iceberg right ahead! *spins in circle three times*",
      lucaCorrect: "1912. A terrible tragedy. Almost as bad as when my food bowl is empty.",
      oliverWrong: "Boats are just big bathtubs and I hate ALL of them equally.",
      bettingLines: {
        oliver: "PLAYER probably thinks the Titanic sank yesterday. Zero historical awareness.",
        luca: "PLAYER has Titanic knowledge. I can see it in their eyes. Cold, iceberg-like eyes.",
      },
    },
  },
  {
    id: 4,
    category: "Pop Culture",
    question: "What is the name of the fictional country in 'Black Panther'?",
    choices: ["Zamunda", "Wakanda", "Genovia", "Latveria"],
    correctIndex: 1,
    commentary: {
      picklesIntro: "WAKANDA FOREVER! I mean... no spoilers! *tail wagging*",
      lucaCorrect: "Wakanda. A technologically advanced nation. They probably have amazing cat towers.",
      oliverWrong: "I live in a cardboard box kingdom under the bed. It's basically the same thing.",
      bettingLines: {
        oliver: "PLAYER hasn't seen a Marvel movie since 2012. This is going to be embarrassing.",
        luca: "PLAYER is a pop culture connoisseur. I'd bet my favorite napping spot on it.",
      },
    },
  },
  {
    id: 5,
    category: "Food",
    question: "What fruit is used to make traditional guacamole?",
    choices: ["Tomato", "Mango", "Avocado", "Lime"],
    correctIndex: 2,
    commentary: {
      picklesIntro: "This question is RIPE for the picking! *drools on keyboard*",
      lucaCorrect: "Avocado. Millennials ruined it for everyone. I just want my tuna.",
      oliverWrong: "Is guacamole the green stuff my human eats while ignoring me? Rude.",
      bettingLines: {
        oliver: "PLAYER eats guac with a spoon at 2 AM. They BETTER know this one.",
        luca: "PLAYER has the food knowledge of a golden retriever. I'm not optimistic.",
      },
    },
  },
  {
    id: 6,
    category: "Animals",
    question: "What is a group of flamingos called?",
    choices: ["A flock", "A flamboyance", "A colony", "A parade"],
    correctIndex: 1,
    commentary: {
      picklesIntro: "Pink birds standing on one leg! How do they DO that?! *falls over*",
      lucaCorrect: "A flamboyance. Fitting. Those birds are extra and I respect it.",
      oliverWrong: "A group of anything is just 'targets' in my professional opinion.",
      bettingLines: {
        oliver: "PLAYER's going to say 'flock' like a boring person. I just know it.",
        luca: "PLAYER has that obscure animal trivia energy. I'm cautiously impressed.",
      },
    },
  },
  {
    id: 7,
    category: "Tech",
    question: "What does 'HTTP' stand for?",
    choices: ["HyperText Transfer Protocol", "High Tech Transfer Program", "HyperText Transmission Process", "Home Tool Transfer Protocol"],
    correctIndex: 0,
    commentary: {
      picklesIntro: "Time for some TECH TALK! *chews ethernet cable*",
      lucaCorrect: "HyperText Transfer Protocol. I use it to browse cat videos. For research.",
      oliverWrong: "I thought it stood for 'Humans Touching The Phone' which is what they do instead of petting me.",
      bettingLines: {
        oliver: "PLAYER thinks HTTP stands for 'Hot Tacos Help People'. I guarantee it.",
        luca: "PLAYER is a nerd. They know this. I can smell the tech knowledge from here.",
      },
    },
  },
  {
    id: 8,
    category: "Music",
    question: "Which band released the album 'Abbey Road'?",
    choices: ["The Rolling Stones", "The Beatles", "Led Zeppelin", "The Who"],
    correctIndex: 1,
    commentary: {
      picklesIntro: "Let it BARK! Let it BARK! *howls melodically*",
      lucaCorrect: "The Beatles. Classic. I prefer the sound of a can opener personally.",
      oliverWrong: "I once walked across a piano. Where's MY album deal?",
      bettingLines: {
        oliver: "PLAYER listens to elevator music. No way they know classic rock.",
        luca: "PLAYER has taste. Or at least knows the basics. Betting on PLAYER here.",
      },
    },
  },
  {
    id: 9,
    category: "Literature",
    question: "Who wrote '1984'?",
    choices: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "H.G. Wells"],
    correctIndex: 2,
    commentary: {
      picklesIntro: "Big Brother is watching! And so am I! Through the window! At squirrels!",
      lucaCorrect: "George Orwell. A dystopian classic. Much like my life when the laser pointer runs out of batteries.",
      oliverWrong: "Books are for sitting on, not reading. I am very clear about this.",
      bettingLines: {
        oliver: "PLAYER thinks Orwell is a brand of microwave popcorn. Catastrophic.",
        luca: "PLAYER reads. I can tell by the bags under their eyes. Betting on PLAYER.",
      },
    },
  },
  {
    id: 10,
    category: "Math",
    question: "What is the value of Pi rounded to two decimal places?",
    choices: ["3.12", "3.14", "3.16", "3.41"],
    correctIndex: 1,
    commentary: {
      picklesIntro: "Mmmmm PIE! Wait, different kind of pi? *confused head tilt*",
      lucaCorrect: "3.14. Elementary mathematics. I calculated this while judging you from the shelf.",
      oliverWrong: "I prefer actual pie. Specifically whatever you're eating right now.",
      bettingLines: {
        oliver: "PLAYER dropped out of math in the 5th grade. This won't end well.",
        luca: "Even PLAYER can handle basic math. Probably. I give it 60/40.",
      },
    },
  },
  {
    id: 11,
    category: "Movies",
    question: "What is the highest-grossing film of all time (not adjusted for inflation)?",
    choices: ["Avengers: Endgame", "Avatar", "Titanic", "Star Wars: The Force Awakens"],
    correctIndex: 1,
    commentary: {
      picklesIntro: "LIGHTS! CAMERA! BELLY RUBS! Wait that's not how it goes...",
      lucaCorrect: "Avatar. Blue aliens in a forest. Basically what I see in my dreams after catnip.",
      oliverWrong: "The only film I care about is the one my human watches when I sit on the remote.",
      bettingLines: {
        oliver: "PLAYER's going to say Endgame because they think Marvel is everything. Tragic.",
        luca: "PLAYER knows their box office. I've seen them argue about this online. Betting on PLAYER.",
      },
    },
  },
  {
    id: 12,
    category: "Sports",
    question: "How many players are on a standard soccer/football team on the field?",
    choices: ["9", "10", "11", "12"],
    correctIndex: 2,
    commentary: {
      picklesIntro: "GOOOOOAL! *zoomies around the living room*",
      lucaCorrect: "11 players. Though I could take them all. One at a time. Maybe.",
      oliverWrong: "Sports are just humans chasing a ball. Pathetic. Now if you'll excuse me, I need to chase this ball of yarn.",
      bettingLines: {
        oliver: "PLAYER thinks soccer has 15 players. They're the type to call it 'sportsball'.",
        luca: "PLAYER watches the World Cup. Probably. I'm putting my faith in PLAYER.",
      },
    },
  },
  {
    id: 13,
    category: "Internet",
    question: "What year was the first tweet ever posted on Twitter/X?",
    choices: ["2004", "2005", "2006", "2007"],
    correctIndex: 2,
    commentary: {
      picklesIntro: "TWEET TWEET! That's bird talk! I chase birds! *barks at screen*",
      lucaCorrect: "2006. Jack Dorsey's first tweet. The internet was simpler then. Better, even.",
      oliverWrong: "I don't tweet. I scream at 3 AM. Much more effective communication.",
      bettingLines: {
        oliver: "PLAYER probably still calls it Twitter. Living in the past. They'll get this wrong.",
        luca: "PLAYER is chronically online. They know their internet history. Going with PLAYER.",
      },
    },
  },
  {
    id: 14,
    category: "Science",
    question: "What gas do plants primarily absorb from the atmosphere?",
    choices: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctIndex: 2,
    commentary: {
      picklesIntro: "PLANTS! I love plants! Especially digging them up! *guilty face*",
      lucaCorrect: "Carbon dioxide. Photosynthesis. I learned this while knocking plants off windowsills.",
      oliverWrong: "Plants are for eating and then throwing up on the carpet. Science.",
      bettingLines: {
        oliver: "PLAYER waters their plants with energy drinks. They do NOT know science.",
        luca: "PLAYER paid attention in biology. At least the plant chapter. Backing PLAYER.",
      },
    },
  },
  {
    id: 15,
    category: "Geography",
    question: "Which country has the most time zones?",
    choices: ["Russia", "USA", "China", "France"],
    correctIndex: 3,
    commentary: {
      picklesIntro: "Time zones make my walk schedule SO confusing!",
      lucaCorrect: "France, with its overseas territories. 12 time zones. Impressive for a baguette nation.",
      oliverWrong: "I only recognize two time zones: 'feed me' and 'why haven't you fed me yet.'",
      bettingLines: {
        oliver: "PLAYER's going to say Russia. Classic trap. I'm betting against PLAYER.",
        luca: "PLAYER knows about overseas territories. A scholar. My money's on PLAYER.",
      },
    },
  },
  {
    id: 16,
    category: "History",
    question: "What ancient wonder was located in Alexandria, Egypt?",
    choices: ["Colossus of Rhodes", "Hanging Gardens", "The Great Lighthouse", "Temple of Artemis"],
    correctIndex: 2,
    commentary: {
      picklesIntro: "Ancient history! From before even the OLDEST good boy!",
      lucaCorrect: "The Great Lighthouse, or Pharos. A beacon of knowledge, like myself.",
      oliverWrong: "I knock things off high places too. Where's MY historical landmark?",
      bettingLines: {
        oliver: "PLAYER thinks the Hanging Gardens were in Alexandria. Pure chaos incoming.",
        luca: "PLAYER has ancient world knowledge. Rare. Putting my treats on PLAYER.",
      },
    },
  },
  {
    id: 17,
    category: "Pop Culture",
    question: "What is the name of SpongeBob's pet snail?",
    choices: ["Sheldon", "Patrick", "Gary", "Larry"],
    correctIndex: 2,
    commentary: {
      picklesIntro: "WHO LIVES IN A PINEAPPLE UNDER THE SEA?! *spins*",
      lucaCorrect: "Gary. A snail that meows. An identity crisis I can respect.",
      oliverWrong: "A snail that acts like a cat? That's cultural appropriation and I won't stand for it.",
      bettingLines: {
        oliver: "PLAYER hasn't watched cartoons since they were 12. Doomed.",
        luca: "PLAYER grew up on SpongeBob. This is their moment. Riding with PLAYER.",
      },
    },
  },
  {
    id: 18,
    category: "Food",
    question: "What is the main ingredient in hummus?",
    choices: ["Lentils", "Chickpeas", "Black beans", "Peanuts"],
    correctIndex: 1,
    commentary: {
      picklesIntro: "Hummus! My human dips everything in it! Even things that should NOT be dipped!",
      lucaCorrect: "Chickpeas. Also called garbanzo beans. I contain multitudes of food knowledge.",
      oliverWrong: "I tried hummus once. 0/10. Would not recommend. Give me tuna or give me death.",
      bettingLines: {
        oliver: "PLAYER thinks hummus is made from peanuts. I've lost all hope.",
        luca: "PLAYER is a Mediterranean food enthusiast. I trust PLAYER on this one.",
      },
    },
  },
  {
    id: 19,
    category: "Animals",
    question: "What is the fastest land animal?",
    choices: ["Lion", "Cheetah", "Pronghorn", "Greyhound"],
    correctIndex: 1,
    commentary: {
      picklesIntro: "FAST! ZOOM! I'm fast too when I hear the treat bag! *nyoom*",
      lucaCorrect: "The cheetah. 70 mph. I can do that. I just choose not to. Because dignity.",
      oliverWrong: "I'm the fastest animal in this house at 3 AM. No one can catch me. No one.",
      bettingLines: {
        oliver: "PLAYER thinks lions are the fastest. They watched one too many Disney movies.",
        luca: "PLAYER knows their animal facts. A person of culture. Betting on PLAYER.",
      },
    },
  },
  {
    id: 20,
    category: "Tech",
    question: "What programming language was created by Brendan Eich in just 10 days?",
    choices: ["Python", "Java", "JavaScript", "Ruby"],
    correctIndex: 2,
    commentary: {
      picklesIntro: "CODING! *types random keys with paws* I'm helping!",
      lucaCorrect: "JavaScript. 10 days. And we've been dealing with the consequences ever since.",
      oliverWrong: "10 days? I've spent longer than that ignoring the same toy mouse.",
      bettingLines: {
        oliver: "PLAYER thinks Python was made in 10 days. They write code like I write on furniture.",
        luca: "PLAYER is a developer. They live and breathe this stuff. PLAYER has it.",
      },
    },
  },
];
