// Import necessary modules
import { useEffect, useState } from "react"; // useState and useEffect from React
import useSound from "use-sound"; // Custom hook for playing sounds
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // Play and pause icons
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // Skip next and previous icons
import { IconContext } from "react-icons"; // Context for setting icon properties

// Import sound files
import qala from "../assets/qala.mp3"; // Sound file to be played
import joanna from "../assets/joanna.mp3"; // Sound file to be played

const songs = [
  {
    title: "Rubaiyyan",
    artist: "Qala",
    file: qala
  }, 
  {
    title: "Joanna",
    artist: "Joanna",
    file: joanna
  }
]

// Player component
export default function Player() {
  // State to know if the sound is playing or not
  const [isPlaying, setIsPlaying] = useState(false);

  // index of the currently playing song
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // State to store the total duration of the sound in minutes and seconds
  const [time, setTime] = useState({
    min: "",
    sec: ""
  });

  // State to store the current time of the sound being played
  const [currTime, setCurrTime] = useState({
    min: "",
    sec: ""
  });

  // State to store the current seconds of the sound being played
  const [seconds, setSeconds] = useState();

// Use currentSongIndex to select a song from the songs array
const [play, { pause, duration, sound, stop }] = useSound(songs[currentSongIndex].file);

useEffect(() => {
  stop(); // Stop every time a song changes before starting a new one
  setIsPlaying(false); // Reset state isPlaying to false
}, [currentSongIndex, stop]);

  // useEffect hook to set the total duration of the sound
  useEffect(() => {
    // Check if the duration is available
    if (duration) {
      // Convert the duration from milliseconds to seconds
      const sec = duration / 1000;

      // Calculate the minutes and remaining seconds from the total seconds
      const min = Math.floor(sec / 60);
      const secRemain = Math.floor(sec % 60);

      // Update the time state with the calculated minutes and seconds
      setTime({
        min: min,
        sec: secRemain
      });
    }
    // The effect depends on the duration and isPlaying state, 
    // so it will run every time either of them changes
  }, [duration, isPlaying]);

  // useEffect hook to update the current time of the sound being played
  useEffect(() => {
    // Set an interval to update every second
    const interval = setInterval(() => {
      // Check if the sound object exists
      if (sound) {
        // Update the current seconds of the sound being played
        setSeconds(sound.seek([]));
        
        // Calculate the current minute and second of the sound
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        
        // Update the current time state
        setCurrTime({
          min,
          sec
        });
        
        // Check if the sound has finished playing and if it was playing
        if (sound.seek([]) === 0 && isPlaying) {
          // Set isPlaying to false as the sound has finished
          setIsPlaying(false);
          
          // Update the current song index to the next song, or reset to 0 if it was the last song
          setCurrentSongIndex((prevIndex) =>
            prevIndex + 1 < songs.length ? prevIndex + 1 : 0
          );
        }
      }
    }, 1000); // Run the interval every 1000ms (1 second)

    // Clear the interval when the component unmounts or when isPlaying or sound changes
    return () => clearInterval(interval);
  }, [isPlaying, sound]); // Depend on isPlaying and sound so the effect runs when either changes

  // Function to handle play/pause button click
  const playingButton = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
    setIsPlaying(!isPlaying);
  };


  // Function for the next button
  const nextSong = () => {
    stop();
    setCurrentSongIndex((prevIndex) =>
      prevIndex + 1 < songs.length ? prevIndex + 1 : 0
    );
  };

  // Function for the previous button
  const prevSong = () => {
    stop();
    setCurrentSongIndex((prevIndex) =>
      prevIndex - 1 >= 0 ? prevIndex - 1 : songs.length - 1
    );
  };

  // Render the player component
  return (
    <div className="component">
      <h2>Playing Now</h2>
      <img className="musicCover" src="https://picsum.photos/200/200" alt="" />
      <div>
        <h3 className="title">{songs[currentSongIndex].title}</h3>
        <p className="subTitle">{songs[currentSongIndex].artist}</p>
      </div>
      <div>
        <div className="time">
          <p>
            {currTime.min}:{currTime.sec}
          </p>
          <p>
            {time.min}:{time.sec}
          </p>
        </div>
        <input
          type="range"
          min="0"
          max={duration / 1000}
          default="0"
          value={seconds}
          className="timeline"
          onChange={(e) => {
            sound.seek([e.target.value]);
          }}
        />
      </div>
      <div>
      <button className="playButton" onClick={prevSong}>
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipPrevious />
          </IconContext.Provider>
        </button>
        {!isPlaying ? (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPlayCircle />
            </IconContext.Provider>
          </button>
        ) : (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPauseCircle />
            </IconContext.Provider>
          </button>
        )}
        <button className="playButton" onClick={nextSong}>
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipNext />
          </IconContext.Provider>
        </button>
      </div>
    </div>
  );
}