import { useState, useEffect } from "react";
import FaPlay from "../../../../../../assets/images/pages/student/header/play-buttton.png";
import Speacker from "../../../../../../assets/images/pages/student/header/speacker_icon.png";
import FaPause from "../../../../../../assets/images/pages/student/header/video-pause-button.png";
import Undo from "../../../../../../assets/images/pages/student/header/undo.png";
import "./style.css";
import { useSelector } from "react-redux";
import { studentSelector } from "../../../../../../redux/slicers/studentSlice";

const TextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [rate, setRate] = useState(1);

  const { question = {}, signleQuestionSecondoryLanguage = "" } =
    useSelector(studentSelector);

  const options = question?.options || [];

  const getFullText = () => {
    if (!question) return "";

    const questionTextIsImg = question.questionText.includes("img");
    const isHindi = signleQuestionSecondoryLanguage === "Hindi";

    let questionText;
    if (questionTextIsImg) {
      questionText =
        signleQuestionSecondoryLanguage === "Hindi"
          ? `Question ${question.serialNo}: प्रश्न को समझने के लिए चित्र देखें`
          : `Question ${question.serialNo}: Refer to the image for context`;
    } else {
      questionText =
        signleQuestionSecondoryLanguage === "Hindi" &&
        question.secondaryQuestionText
          ? `Question ${question.serialNo}: ${question.secondaryQuestionText}`
          : `Question ${question.serialNo}: ${question.questionText}`;
    }

    const optionsText = options
      .map((opt) => {
        const optionHasImage = isHindi && opt.optionImgKey;

        if (optionHasImage) {
          return isHindi
            ? `${opt.optionKey}: विकल्प को समझने के लिए चित्र देखें`
            : `${opt.optionKey}: Refer to the image for the option`;
        }

        const optionText =
          isHindi && opt.secondaryOptionValue
            ? opt.secondaryOptionValue
            : opt.optionValue;

        return `${opt.optionKey}: ${optionText}`;
      })
      .join(", ");

    return `${questionText}. Options: ${optionsText}`;
  };

  useEffect(() => {
    const synth = window.speechSynthesis;

    const handleVoicesChanged = () => {
      const availableVoices = synth.getVoices();
      const filtered = availableVoices.filter(
        (v) =>
          (v.lang === "en-US" && v.name.includes("Google")) ||
          v.lang === "hi-IN"
      );

      setVoices(filtered);

      const defaultVoice =
        filtered.find((v) => v.lang === "en-US") ||
        filtered.find((v) => v.lang === "hi-IN") ||
        filtered[0];

      if (defaultVoice) setVoice(defaultVoice);
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.addEventListener("voiceschanged", handleVoicesChanged);
    }

    handleVoicesChanged();

    return () => {
      synth.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []);

  useEffect(() => {
    if (!voices.length) return;

    if (signleQuestionSecondoryLanguage === "Hindi") {
      const hindiVoice = voices.find((v) => v.lang === "hi-IN");
      if (hindiVoice) setVoice(hindiVoice);
    } else {
      const englishVoice = voices.find((v) => v.lang === "en-US");
      if (englishVoice) setVoice(englishVoice);
    }
  }, [signleQuestionSecondoryLanguage, voices]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(getFullText());

    const selectedVoice =
      signleQuestionSecondoryLanguage === "Hindi"
        ? voices.find((v) => v.lang === "hi-IN")
        : voices.find((v) => v.lang === "en-US");

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    synth.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleVoiceChange = (e) => {
    const selectedVoice = voices.find((v) => v.name === e.target.value);
    if (selectedVoice) {
      setVoice(selectedVoice);
    }
  };

  const handleRateChange = (e) => {
    setRate(parseFloat(e.target.value));
  };

  return (
    <div className="tts-container">
      <div className="tts-controls">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="tts-button"
            aria-label={
              isPaused ? "Resume speech" : "Play question and options"
            }
            disabled={!question}
          >
            {isPaused ? (
              <img src={FaPlay} alt="Resume" height="15px" width="15px" />
            ) : (
              <img src={Speacker} alt="Play" height="20px" width="20px" />
            )}
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="tts-button"
              aria-label="Pause speech"
            >
              <img src={FaPause} alt="Pause" height="20px" width="20px" />
            </button>
            <button
              onClick={handleStop}
              className="tts-button"
              disabled={!isPlaying && !isPaused}
              aria-label="Stop speech"
            >
              <img src={Undo} alt="Stop" height="15px" width="15px" />
            </button>
          </>
        )}

        {voices.length > 0 && (
          <select
            value={voice?.name || ""}
            onChange={handleVoiceChange}
            className="tts-voice-select"
            disabled={isPlaying || isPaused}
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.lang === "en-US" ? "English" : "Hindi"}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;
