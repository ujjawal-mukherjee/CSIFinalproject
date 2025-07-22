import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes';
import './App.css';
import eternalLove from './assets/image1.jpg';
import heartstrings from './assets/image2.jpg';
import loveInBloom from './assets/image3.jpg';
import shadowHunter from './assets/image4.jpg';
import silentNight from './assets/image5.jpg';
import darkPursuit from './assets/image6.jpg';
import cosmicAdventure from './assets/image7.jpg';
import galaxyQuest from './assets/image8.jpg';
import timeWarp from './assets/image9.jpg';
import laughOutLoud from './assets/image10.jpg';
import funnyBusiness from './assets/image11.jpg';
import jokeJamboree from './assets/image12.jpg';
import dragonsQuest from './assets/image13.jpg';
import steelStorm from './assets/imag14.jpg';
import blazeOfGlory from './assets/image15.jpg';
const movies = [
  // Romance
  {
    id: 1,
    title: "Eternal Love",
    genre: "Romance",
    rating: 4.8,
    duration: "2h 15m",
    description: "A timeless love story that transcends generations. Follow the journey of two souls destined to find each other across different lifetimes. Set against the backdrop of Paris and New York, this romantic epic explores the power of love that conquers all obstacles.",
    image: eternalLove,
    showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
    price: 12,
    director: "Sofia Williams",
    cast: ["Emma Stone", "Ryan Gosling", "Rachel McAdams"]
  },
  {
    id: 6,
    title: "Heartstrings",
    genre: "Romance",
    rating: 4.6,
    duration: "2h 10m",
    description: "A heartfelt tale of love and redemption set in a small Italian village. Two estranged lovers reunite to uncover a family secret that changes their lives forever.",
    image: heartstrings,
    showtimes: ["10:15 AM", "1:45 PM", "5:15 PM", "8:45 PM"],
    price: 11,
    director: "Paola Rossi",
    cast: ["Keira Knightley", "Orlando Bloom", "Natalie Portman"]
  },
  {
    id: 7,
    title: "Love in Bloom",
    genre: "Romance",
    rating: 4.7,
    duration: "2h 5m",
    description: "A romantic comedy-drama about a florist and a writer who fall in love while working on a book about flowers. Set in a picturesque garden, their story blossoms unexpectedly.",
    image: loveInBloom,
    showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
    price: 12,
    director: "Jane Austen",
    cast: ["Anne Hathaway", "Chris Pine", "Zoe Saldana"]
  },
  // Thriller
  {
    id: 2,
    title: "Shadow Hunter",
    genre: "Thriller",
    rating: 4.6,
    duration: "2h 8m",
    description: "A psychological thriller that will keep you on the edge of your seat. A detective hunts a serial killer who always stays one step ahead. Dark secrets unfold as the hunter becomes the hunted in this gripping tale of suspense.",
    image: shadowHunter, // Imported image
    showtimes: ["11:00 AM", "2:15 PM", "6:00 PM", "9:15 PM"],
    price: 15,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Scarlett Johansson", "Oscar Isaac"]
  },
  {
    id: 8,
    title: "Silent Night",
    genre: "Thriller",
    rating: 4.5,
    duration: "2h 0m",
    description: "A chilling thriller set during a snowy Christmas Eve. A family discovers a sinister presence in their isolated cabin, leading to a night of terror and survival.",
    image: silentNight, // Imported image
    showtimes: ["11:15 AM", "2:30 PM", "6:15 PM", "9:30 PM"],
    price: 14,
    director: "David Fincher",
    cast: ["Tom Hardy", "Charlize Theron", "Michael Fassbender"]
  },
  {
    id: 9,
    title: "Dark Pursuit",
    genre: "Thriller",
    rating: 4.7,
    duration: "2h 12m",
    description: "A relentless cat-and-mouse chase through a dystopian city. A rogue agent tracks a mysterious figure with a deadly secret, unraveling a conspiracy along the way.",
    image: darkPursuit, // Imported image
    showtimes: ["11:30 AM", "2:45 PM", "6:30 PM", "9:45 PM"],
    price: 15,
    director: "Denis Villeneuve",
    cast: ["Christian Bale", "Emily Blunt", "Jake Gyllenhaal"]
  },
  // Sci-Fi
  {
    id: 3,
    title: "Cosmic Adventure",
    genre: "Sci-Fi",
    rating: 4.7,
    duration: "2h 30m",
    description: "An epic space odyssey exploring the mysteries of the universe. Join a crew of astronauts on their journey to save humanity from an impending cosmic threat. Stunning visuals and groundbreaking special effects bring this interstellar adventure to life.",
    image: cosmicAdventure, // Imported image
    showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
    price: 18,
    director: "Denis Villeneuve",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"]
  },
  {
    id: 10,
    title: "Galaxy Quest",
    genre: "Sci-Fi",
    rating: 4.6,
    duration: "2h 20m",
    description: "A thrilling space saga where a team of explorers discovers a parallel universe. Their mission to return home tests their courage and ingenuity against alien forces.",
    image: galaxyQuest, // Imported image
    showtimes: ["10:45 AM", "2:15 PM", "5:45 PM", "9:15 PM"],
    price: 17,
    director: "Ridley Scott",
    cast: ["Chris Pratt", "Zoe Saldana", "Brad Pitt"]
  },
  {
    id: 11,
    title: "Time Warp",
    genre: "Sci-Fi",
    rating: 4.8,
    duration: "2h 25m",
    description: "A mind-bending sci-fi thriller about a scientist who invents a time machine, only to face the consequences of altering the past in unpredictable ways.",
    image: timeWarp, // Imported image
    showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
    price: 18,
    director: "Christopher Nolan",
    cast: ["Robert Downey Jr.", "Scarlett Johansson", "Tom Holland"]
  },
  // Comedy
  {
    id: 4,
    title: "Laugh Out Loud",
    genre: "Comedy",
    rating: 4.4,
    duration: "1h 45m",
    description: "A hilarious comedy that will leave you in stitches. Follow the misadventures of a group of friends on a road trip that goes hilariously wrong. Perfect for a fun night out with friends and family.",
    image: laughOutLoud, // Imported image
    showtimes: ["11:30 AM", "2:45 PM", "6:15 PM", "9:30 PM"],
    price: 10,
    director: "Judd Apatow",
    cast: ["Steve Carell", "Tina Fey", "Will Ferrell"]
  },
  {
    id: 12,
    title: "Funny Business",
    genre: "Comedy",
    rating: 4.5,
    duration: "1h 50m",
    description: "A laugh-out-loud comedy about a struggling comedian who accidentally becomes a viral sensation, leading to chaotic and hilarious consequences.",
    image: funnyBusiness, // Imported image
    showtimes: ["11:45 AM", "3:00 PM", "6:30 PM", "9:45 PM"],
    price: 9,
    director: "Seth Rogen",
    cast: ["Kevin Hart", "Melissa McCarthy", "Paul Rudd"]
  },
  {
    id: 13,
    title: "Joke Jamboree",
    genre: "Comedy",
    rating: 4.6,
    duration: "1h 55m",
    description: "A wild comedy featuring a talent show gone wrong, where a group of misfits turns a disaster into a hilarious spectacle for the audience.",
    image: jokeJamboree, // Imported image
    showtimes: ["12:00 PM", "3:15 PM", "6:45 PM", "10:00 PM"],
    price: 10,
    director: "Adam Sandler",
    cast: ["Jack Black", "Amy Poehler", "Bill Hader"]
  },
  // Action
  {
    id: 5,
    title: "Dragon's Quest",
    genre: "Action",
    rating: 4.9,
    duration: "2h 22m",
    description: "An action-packed adventure in a mystical world. A young warrior embarks on a quest to defeat an ancient dragon and save the kingdom. Epic battles, magical creatures, and breathtaking landscapes await in this fantasy masterpiece.",
    image: dragonsQuest, // Imported image
    showtimes: ["10:15 AM", "1:45 PM", "5:15 PM", "8:45 PM"],
    price: 16,
    director: "Peter Jackson",
    cast: ["Chris Hemsworth", "Gal Gadot", "Tom Holland"]
  },
  {
    id: 14,
    title: "Steel Storm",
    genre: "Action",
    rating: 4.8,
    duration: "2h 15m",
    description: "A high-octane action flick featuring a retired soldier who must stop a terrorist plot. Explosive stunts and intense combat define this adrenaline rush.",
    image: steelStorm, // Imported image
    showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
    price: 15,
    director: "Michael Bay",
    cast: ["Jason Statham", "Margot Robbie", "Dwayne Johnson"]
  },
  {
    id: 15,
    title: "Blaze of Glory",
    genre: "Action",
    rating: 4.7,
    duration: "2h 18m",
    description: "An action-packed saga of a rogue agent turned hero, battling a global crime syndicate. Fast cars, epic fights, and stunning visuals make this a must-watch.",
    image: blazeOfGlory, // Imported image
    showtimes: ["10:45 AM", "2:15 PM", "5:45 PM", "9:15 PM"],
    price: 16,
    director: "Zack Snyder",
    cast: ["Henry Cavill", "Gal Gadot", "Chris Evans"]
  }
];

const TicketBookingApp = () => {
  const [user, setUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState({});
  const [bookingHistory, setBookingHistory] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState('');

  useEffect(() => {
    const initialBookedSeats = {};
    movies.forEach(movie => {
      initialBookedSeats[movie.id] = new Set([5, 12, 23, 34, 45, 56, 67, 78, 89, 90]);
    });
    setBookedSeats(initialBookedSeats);
  }, []);

  const logout = () => {
    setUser(null);
    setSelectedMovie(null);
    setSelectedSeats([]);
    setSelectedShowtime('');
  };

  return (
    <BrowserRouter>
      <div className="font-sans">
        <AppRoutes
          user={user}
          setUser={setUser}
          movies={movies}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          bookedSeats={bookedSeats}
          setBookedSeats={setBookedSeats}
          bookingHistory={bookingHistory}
          setBookingHistory={setBookingHistory}
          selectedShowtime={selectedShowtime}
          setSelectedShowtime={setSelectedShowtime}
          logout={logout}
        />
      </div>
    </BrowserRouter>
  );
};

export default TicketBookingApp;