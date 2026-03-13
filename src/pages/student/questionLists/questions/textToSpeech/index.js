// ✅ Fully Voice-Controlled VoiceExamSystem with Fixes

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import "./style.css";
import {
  getQuestionApi,
  saveSingleQuestionPostUpdateApi,
  submitTestApi,
} from "../../../../../api/studentApi";
import {
  ASSESSMENT_PAGE,
  STUDENT_FEEDBACK_PAGE,
} from "../../../../../config/constants/routePathConstants/student";
import { studentSelector } from "../../../../../redux/slicers/studentSlice";
import MicIcon from "../../../../../assets/images/pages/student/header/undo.png";
import SpeakerIcon from "../../../../../assets/images/pages/student/header/speacker_icon.png";

const VoiceExamSystem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { batchId, candidateId, questionId } = useParams();
  const { questionAll = {}, question = {} } = useSelector(studentSelector);

  const [utterance, setUtterance] = useState(null);
  const [rate, setRate] = useState(1);
  const [stage, setStage] = useState("question");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const recognitionRef = useRef(null);
  const [hindiVoice, setHindiVoice] = useState(null);
  const [englishVoice, setEnglishVoice] = useState(null);

  const bilingualText = {
    loading: { hi: "लोड हो रहा है...", en: "Loading..." },
    notSupported: { hi: "वॉइस सपोर्ट उपलब्ध नहीं है", en: "Voice support not available" },
    speaking: { hi: "सिस्टम बोल रहा है...", en: "System is speaking..." },
    listening: { hi: "आपकी प्रतिक्रिया सुन रहा हूँ...", en: "Listening for your response..." },
    questionXofY: {
      hi: (x, y) => `प्रश्न ${x} / ${y}`,
      en: (x, y) => `Question ${x} of ${y}`
    },
    options: {
      hi: (key) => {
        const map = { OptionA: "विकल्प ए", OptionB: "विकल्प बी", OptionC: "विकल्प सी", OptionD: "विकल्प डी" };
        return map[key] || key;
      },
      en: (key) => key
    },
    commands: {
      next: { hi: "अगला", en: "Next" },
      previous: { hi: "पिछला", en: "Previous" },
      submit: { hi: "जमा", en: "Submit" },
      yes: { hi: "हां", en: "Yes" },
      no: { hi: "नहीं", en: "No" }
    },
    prompts: {
      answer: {
        hi: "कृपया अपना उत्तर बताएं, जैसे विकल्प ए, बी, सी, या डी",
        en: "Please say your answer, like Option A, B, C, or D"
      },
      confirmSelection: {
        hi: (opt) => `आपने ${opt} चुना है। जमा करने के लिए 'हाँ' बोलें या बदलने के लिए 'नहीं' बोलें`,
        en: (opt) => `You selected ${opt}. Say 'Yes' to confirm or 'No' to change`
      },
      notUnderstood: {
        hi: "माफ़ कीजिए, मैं समझ नहीं पाया। कृपया विकल्प ए, बी, सी, या डी बताएं",
        en: "Sorry, I didn't understand. Please say Option A, B, C, or D"
      }
    }
  };

  const questionLists = questionAll?.questionList?.questions || [];
  const currentIndex = questionLists.findIndex(q => q._id === question?._id);
  const currentQuestionSerialNo = question?.serialNo;
  const lastQuestionSerialNo = questionLists[questionLists.length - 1]?.serialNo;

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const u = new SpeechSynthesisUtterance();
    u.onstart = () => setIsSpeaking(true);
    u.onend = u.onerror = () => setIsSpeaking(false);
    setUtterance(u);

    const loadVoices = () => {
      const voices = synth.getVoices();
      setHindiVoice(voices.find(v => v.lang === 'hi-IN') || voices[0]);
      setEnglishVoice(voices.find(v => v.lang === 'en-US') || voices[0]);
    };

    synth.addEventListener('voiceschanged', loadVoices);
    loadVoices();

    return () => synth.removeEventListener('voiceschanged', loadVoices);
  }, []);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      handleVoiceCommand(transcript);
    };
    recognition.onerror = () => setIsListening(false);

    return () => recognition.stop();
  }, [stage, question]);

  useEffect(() => {
    dispatch(getQuestionApi(batchId, candidateId, questionId, setLoading));
  }, [questionId]);

  const speak = (textObj, cb) => {
    const synth = window.speechSynthesis;
    if (!textObj || !hindiVoice || !englishVoice) return;
    synth.cancel();

    const hi = new SpeechSynthesisUtterance(textObj.hi);
    const en = new SpeechSynthesisUtterance(textObj.en);
    hi.voice = hindiVoice;
    en.voice = englishVoice;
    hi.rate = rate;
    en.rate = rate;
    hi.onend = () => synth.speak(en);
    en.onend = cb || (() => {});
    synth.speak(hi);
  };

  const startListening = () => {
    try { recognitionRef.current?.start(); } catch {}
  };

  const handleVoiceCommand = (cmd) => {
    const c = cmd.toLowerCase();

    if (c.includes("अगला") || c.includes("next")) return handleNext();
    if (c.includes("पिछला") || c.includes("previous")) return handlePrevious();
    if (c.includes("जमा") || c.includes("submit")) return handleExamSubmit();

    if (stage === 'question') {
      setStage('answer');
      speak(bilingualText.prompts.answer, startListening);
    } else if (stage === 'answer') {
      const optionKey = getOptionKeyFromTranscript(c);
      if (optionKey) {
        setSelectedOption(optionKey);
        setStage('confirm');
        speak({
          hi: bilingualText.prompts.confirmSelection.hi(bilingualText.options.hi(optionKey)),
          en: bilingualText.prompts.confirmSelection.en(optionKey)
        }, startListening);
      } else speak(bilingualText.prompts.notUnderstood, startListening);
    } else if (stage === 'confirm') {
      if (c.includes("हाँ") || c.includes("yes")) return submitAnswer();
      if (c.includes("नहीं") || c.includes("no")) {
        setStage('question');
        speak({ hi: "ठीक है, फिर से प्रयास करें", en: "Okay, try again" }, readQuestion);
      } else speak({ hi: "कृपया 'हाँ' या 'नहीं' कहें", en: "Please say 'Yes' or 'No'" }, startListening);
    } else if (stage === 'submit-confirm') {
      if (c.includes("हाँ") || c.includes("yes")) submitExam();
      else if (c.includes("नहीं") || c.includes("no")) setStage('question');
    }
  };

  const getOptionKeyFromTranscript = (t) => {
    const map = {
      ए: "OptionA", a: "OptionA",
      बी: "OptionB", b: "OptionB",
      सी: "OptionC", c: "OptionC",
      डी: "OptionD", d: "OptionD"
    };
    return Object.keys(map).find(k => t.includes(k)) ? map[t.match(/(ए|a|बी|b|सी|c|डी|d)/i)?.[0]] : null;
  };

  const submitAnswer = () => {
    if (!selectedOption || !question) return;
    const updatedQuestion = {
      ...question,
      options: question.options.map(opt => ({ ...opt, isSelect: opt.optionKey === selectedOption })),
      questionStatus: { answered: true }
    };
    dispatch(saveSingleQuestionPostUpdateApi(
      updatedQuestion,
      batchId,
      candidateId,
      question._id,
      questionAll,
      setLoading,
      () => {},
      currentQuestionSerialNo,
      null,
      navigate,
      () => {}
    ));
    speak({ hi: "उत्तर सहेजा गया। अगला प्रश्न", en: "Answer saved. Next question" });
    setTimeout(handleNext, 2000);
  };

  const handleNext = () => {
    if (currentIndex < questionLists.length - 1) {
      navigate(`${ASSESSMENT_PAGE}/${batchId}/${candidateId}/${questionLists[currentIndex + 1]._id}`);
    } else speak({ hi: "यह अंतिम प्रश्न है। परीक्षा जमा करें", en: "This is the last question. Please submit." });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`${ASSESSMENT_PAGE}/${batchId}/${candidateId}/${questionLists[currentIndex - 1]._id}`);
    } else speak({ hi: "यह पहला प्रश्न है", en: "This is the first question" });
  };

  const handleExamSubmit = () => {
    setStage('submit-confirm');
    speak({
      hi: "क्या आप वाकई परीक्षा जमा करना चाहते हैं? 'हाँ' या 'नहीं' बोलें",
      en: "Are you sure you want to submit the exam? Say 'Yes' or 'No'"
    }, startListening);
  };

  const submitExam = () => {
    dispatch(submitTestApi(batchId, candidateId, setLoading, navigate, `${STUDENT_FEEDBACK_PAGE}/${batchId}/${candidateId}`));
    speak({ hi: "परीक्षा जमा की जा रही है", en: "Submitting the exam" });
  };

  const readQuestion = () => {
    if (!question) return;
    const questionText = {
      hi: `प्रश्न ${question.serialNo}: ${question.questionText}`,
      en: `Question ${question.serialNo}: ${question.questionText}`
    };
    const optionsText = question.options.map(opt => `${bilingualText.options.hi(opt.optionKey)} / ${opt.optionKey}: ${opt.optionValue}`).join(", ");
    speak({
      hi: `${questionText.hi}. ${optionsText}`,
      en: `${questionText.en}. ${optionsText}`
    });
    setStage('question');
  };

  useEffect(() => {
    if (question && !loading) readQuestion();
  }, [question, loading]);

  return loading ? (
    <div className="loading-container">
      <PulseLoader color="#36d7b7" />
      <p>{bilingualText.loading.hi} / {bilingualText.loading.en}</p>
    </div>
  ) : (
    <div className="voice-exam-container">
      <div className="status-indicator">
        {isSpeaking && <><img src={SpeakerIcon} alt="Speaking" /><span>{bilingualText.speaking.hi} / {bilingualText.speaking.en}</span></>}
        {isListening && <><img src={MicIcon} alt="Listening" /><span>{bilingualText.listening.hi} / {bilingualText.listening.en}</span></>}
      </div>
      <div className="question-info">
        <p>{bilingualText.questionXofY.hi(currentQuestionSerialNo, lastQuestionSerialNo)} / {bilingualText.questionXofY.en(currentQuestionSerialNo, lastQuestionSerialNo)}</p>
      </div>
      <div className="current-stage">
        <p>
          {stage === 'question' ? "प्रश्न / Question" :
           stage === 'answer' ? "उत्तर की प्रतीक्षा / Awaiting answer" :
           stage === 'confirm' ? "पुष्टि की प्रतीक्षा / Confirming" :
           "परीक्षा जमा पुष्टि / Submitting exam confirmation"}
        </p>
        {selectedOption && <p>चुना गया विकल्प / Selected option: {bilingualText.options.hi(selectedOption)} / {selectedOption}</p>}
      </div>
    </div>
  );
};

export default VoiceExamSystem;
