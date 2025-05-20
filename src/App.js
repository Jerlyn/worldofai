import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Award, Book, Info, Share2, Download, ExternalLink, ArrowLeft, Check, X, Clock, HelpCircle, Star, Zap } from 'lucide-react';

// Color palette based on the book cover
const colors = {
  background: "#f6c425", // Vibrant yellow/gold
  primary: "#1b294b",    // Deep navy blue
  secondary: "#BF4B0B",  // Orange/coral from "CHARLIE"
  accent: "#3EA0C6",     // Light blue from robot
  green: "#427D32",      // Green from landscape
  purple: "#8e4a7f",     // Purple from Charlie's skirt
  white: "#ffffff"
};

// Extract glossary terms from the book and categorize by difficulty
const glossaryTerms = [
  // Easy terms
  {
    term: "Artificial Intelligence (AI)",
    definition: "A computer program that can learn and solve problems like humans do. It's like teaching a computer to think and make decisions on its own.",
    difficulty: "easy",
    image: "/api/placeholder/150/150",
    icon: "🤖"
  },
  {
    term: "Prompt",
    definition: "The instructions or description you give an AI. Think of it like giving directions to a friend—the clearer your prompt, the better the result!",
    difficulty: "easy",
    image: "/api/placeholder/150/150",
    icon: "📝"
  },
  {
    term: "Hallucination",
    definition: "When AI confidently makes up information that sounds real but isn't true. It's not lying on purpose—it's just confused!",
    difficulty: "easy",
    image: "/api/placeholder/150/150",
    icon: "🌈"
  },
  {
    term: "Text Generation",
    definition: "How AI creates written content based on prompts. This can include stories, essays, dialogue, or information.",
    difficulty: "easy",
    image: "/api/placeholder/150/150",
    icon: "📚"
  },
  {
    term: "Image Generation",
    definition: "How AI creates brand new pictures based on descriptions. It's like having an artist who can draw anything you describe!",
    difficulty: "easy",
    image: "/api/placeholder/150/150",
    icon: "🖼️"
  },
  
  // Medium terms
  {
    term: "Algorithm",
    definition: "A step-by-step recipe that tells a computer how to solve a problem. Think of it as the exact instructions you'd follow to bake cookies!",
    difficulty: "medium",
    image: "/api/placeholder/150/150",
    icon: "🍪"
  },
  {
    term: "Generative AI",
    definition: "AI that creates new content like images, stories, or music based on what it's learned. It's like a super-creative assistant who has studied millions of examples.",
    difficulty: "medium",
    image: "/api/placeholder/150/150",
    icon: "✨"
  },
  {
    term: "Machine Learning",
    definition: "A type of AI where computers learn from examples rather than being explicitly programmed. It's like learning to recognize animals by seeing lots of pictures instead of memorizing a list of features.",
    difficulty: "medium",
    image: "/api/placeholder/150/150",
    icon: "🧠"
  },
  {
    term: "Training Data",
    definition: "The collection of examples (like pictures, stories, or songs) that an AI learns from. Think of it as the AI's textbooks and study materials.",
    difficulty: "medium",
    image: "/api/placeholder/150/150",
    icon: "📊"
  },
  {
    term: "Fact-checking",
    definition: "Making sure information is true by checking reliable sources. This is super important when using AI, since it can make mistakes!",
    difficulty: "medium",
    image: "/api/placeholder/150/150",
    icon: "🔍"
  },
  
  // Hard terms
  {
    term: "Neural Network",
    definition: "The technology behind modern AI, inspired by how human brains work. It contains layers of mathematical connections that help the AI recognize patterns and make decisions.",
    difficulty: "hard",
    image: "/api/placeholder/150/150",
    icon: "🧬"
  },
  {
    term: "Parameters",
    definition: "The AI's memory cells that store what it learns. More parameters mean the AI can remember more patterns and create more complex things.",
    difficulty: "hard",
    image: "/api/placeholder/150/150",
    icon: "💾"
  },
  {
    term: "Tokens",
    definition: "The puzzle pieces AI uses to understand text. Some tokens are whole words, others are parts of words like 'un-' or '-ing'.",
    difficulty: "hard",
    image: "/api/placeholder/150/150",
    icon: "🧩"
  },
  {
    term: "Pattern Recognition",
    definition: "The ability to identify regularities or meaningful information in data. This is what enables AI to recognize cats in photos or understand that stories typically have beginnings, middles, and ends.",
    difficulty: "hard",
    image: "/api/placeholder/150/150",
    icon: "👁️"
  },
  {
    term: "Natural Language Processing (NLP)",
    definition: "Technology that helps computers understand and respond to human language. This is what lets you talk to virtual assistants like Siri or Alexa.",
    difficulty: "hard",
    image: "/api/placeholder/150/150",
    icon: "💬"
  }
];

// We're focusing only on the quiz game mode now
const gameMode = { id: "quiz", name: "AI Quiz Challenge", description: "Answer multiple-choice questions about AI" };

// Character assets
const characters = {
  charlie: "./images/charlie.png", // Charlie character
  robot: "./images/robot.png",   // Robot character
  giraffe: "./images/giraffe.png",  // Skateboarding giraffe
  titleImg: "./images/title.png"  //Title image
};

// Character CSS styles for fixed positioning
const characterStyles = {
  giraffeBottom: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    height: '150px',
    width: 'auto',
    zIndex: 10,
    pointerEvents: 'none' // Makes the image ignore mouse events
  },
  robotBottom: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    height: '150px',
    width: 'auto',
    zIndex: 10,
    pointerEvents: 'none'
  },
  charlieBottom: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    height: '150px',
    width: 'auto',
    zIndex: 10,
    pointerEvents: 'none'
  }
};

const App = () => {
  const [gameState, setGameState] = useState('start'); // start, playing, result
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [timer, setTimer] = useState(30); // 30 seconds per question
  const [activeTimer, setActiveTimer] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3); // 3 hints per game
  const [bonusPoints, setBonusPoints] = useState(0);
  const timerRef = useRef(null);

  // Prepare game when starting
  useEffect(() => {
    if (gameState === 'playing') {
      prepareGame();
    }
    
    // Clean up timer when component unmounts or game state changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, difficulty]);
  
  // Handle the timer countdown
  useEffect(() => {
    if (gameState === 'playing' && activeTimer && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && activeTimer) {
      // Time's up! Move to next question
      handleTimeUp();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer, activeTimer, gameState]);

  const prepareGame = () => {
    // Filter terms based on selected difficulty
    const difficultyTerms = glossaryTerms.filter(term => term.difficulty === difficulty);
    
    // If not enough terms for the selected difficulty, add some from adjacent difficulties
    let termsToUse = [...difficultyTerms];
    if (difficultyTerms.length < totalQuestions) {
      const additionalTerms = glossaryTerms
        .filter(term => term.difficulty !== difficulty)
        .sort(() => 0.5 - Math.random())
        .slice(0, totalQuestions - difficultyTerms.length);
      termsToUse = [...difficultyTerms, ...additionalTerms];
    }
    
    // Shuffle and pick terms for the game
    const shuffled = [...termsToUse].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, totalQuestions);
    setGameQuestions(selected);
    setCurrentRound(0);
    setScore(0);
    setBonusPoints(0);
    setHintsUsed(0);
    setHintsRemaining(3);
    prepareQuestion(selected, 0);
  };

  const prepareQuestion = (questions, index) => {
    const current = questions[index];
    setCurrentQuestion(current);
    setShowHint(false);
    
    // Reset timer for the new question
    setTimer(30);
    setActiveTimer(true);
    
    // For quiz, provide multiple choice of terms
    const otherTerms = glossaryTerms
      .filter(item => item.term !== current.term)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(item => item.term);
    
    const allOptions = [...otherTerms, current.term].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const handleAnswer = (answer) => {
    // Pause the timer
    setActiveTimer(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setSelectedAnswer(answer);
    
    const correct = answer === currentQuestion.term;
    setIsCorrect(correct);
    
    if (correct) {
      // Calculate score based on time remaining
      const timeBonus = Math.floor(timer / 3); // Faster answers get more bonus
      setBonusPoints(prevBonus => prevBonus + timeBonus);
      setScore(score + 1);
    }
    
    // Move to next question after 1.5 seconds
    setTimeout(() => {
      if (currentRound + 1 < totalQuestions) {
        setCurrentRound(currentRound + 1);
        prepareQuestion(gameQuestions, currentRound + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // Game over
        setGameState('result');
      }
    }, 1500);
  };
  
  const handleTimeUp = () => {
    setActiveTimer(false);
    
    // If no answer selected, mark it as incorrect
    if (selectedAnswer === null) {
      setSelectedAnswer('timeout');
      setIsCorrect(false);
      
      // Move to next question after 1.5 seconds
      setTimeout(() => {
        if (currentRound + 1 < totalQuestions) {
          setCurrentRound(currentRound + 1);
          prepareQuestion(gameQuestions, currentRound + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        } else {
          // Game over
          setGameState('result');
        }
      }, 1500);
    }
  };
  
  const useHint = () => {
    if (hintsRemaining > 0) {
      setHintsRemaining(hintsRemaining - 1);
      setHintsUsed(hintsUsed + 1);
      setShowHint(true);
    }
  };

  const startNewGame = () => {
    setGameState('playing');
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const backToHome = () => {
    setGameState('start');
  };
  
  const selectDifficulty = (level) => {
    setDifficulty(level);
  };
  
  const getHint = () => {
    // Generate a hint based on the current question
    const term = currentQuestion.term;
    const firstLetter = term.charAt(0);
    
    if (term.includes('(')) {
      // For terms with acronyms like "Artificial Intelligence (AI)"
      return `This term is often abbreviated as ${term.match(/\(([^)]+)\)/)[1]}`;
    } else if (term.length > 10) {
      return `This is a ${term.length}-letter term that starts with "${firstLetter}"`;
    } else {
      return `This term starts with the letter "${firstLetter}"`;
    }
  };

  const shareResult = () => {
    // In a real implementation, this would generate and share an image
    alert(`Sharing your score: ${score}/${totalQuestions} in ${selectedMode} mode!`);
  };

  const downloadCard = () => {
    // In a real implementation, this would generate and download an image
    alert(`Downloading your achievement card!`);
  };

  // The quiz mode is the only mode now
  const selectedMode = "quiz";
  
  // Render different screens based on game state
  const renderGameContent = () => {
    switch (gameState) {
      case 'start':
        return (
          <div className="flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: colors.background }}>
            
            <img 
                src={characters.titleImg} 
                alt="Skateboarding Title" 
                className="h-32 w-auto"
              />
            <br/>
            
            <div className="rounded-lg p-6 mb-6 w-full max-w-md" style={{ backgroundColor: colors.white, borderColor: colors.primary, borderWidth: "3px" }}>
              <div className="flex justify-center gap-6 mb-4">
                <img 
                  src={characters.charlie} 
                  alt="Charlie" 
                  className="h-32 w-auto"
                />
                <img 
                  src={characters.robot} 
                  alt="Robot" 
                  className="h-32 w-auto"
                />
              </div>
              <p className="mb-6" style={{ color: colors.primary }}>
                Join Charlie on an exciting journey to explore the incredible world of AI! 
                Test your knowledge of AI concepts and terms from "The Incredible World of AI with Charlie."
              </p>
              
              <h3 className="font-bold text-lg mb-3" style={{ color: colors.primary }}>Select Difficulty:</h3>
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button 
                  onClick={() => selectDifficulty('easy')} 
                  className={`p-2 rounded-lg ${difficulty === 'easy' ? 'text-white' : 'text-green-700'}`}
                  style={{ 
                    backgroundColor: difficulty === 'easy' ? colors.green : '#e0f0e0',
                    border: `2px solid ${colors.green}`
                  }}
                >
                  <div className="flex justify-center mb-1">
                    <Star size={18} />
                  </div>
                  Easy
                </button>
                <button 
                  onClick={() => selectDifficulty('medium')} 
                  className={`p-2 rounded-lg ${difficulty === 'medium' ? 'text-white' : 'text-yellow-700'}`}
                  style={{ 
                    backgroundColor: difficulty === 'medium' ? colors.secondary : '#fef3d7',
                    border: `2px solid ${colors.secondary}`
                  }}
                >
                  <div className="flex justify-center mb-1">
                    <Star size={18} />
                    <Star size={18} />
                  </div>
                  Medium
                </button>
                <button 
                  onClick={() => selectDifficulty('hard')} 
                  className={`p-2 rounded-lg ${difficulty === 'hard' ? 'text-white' : 'text-purple-700'}`}
                  style={{ 
                    backgroundColor: difficulty === 'hard' ? colors.purple : '#f3e5f5',
                    border: `2px solid ${colors.purple}`
                  }}
                >
                  <div className="flex justify-center mb-1">
                    <Star size={18} />
                    <Star size={18} />
                    <Star size={18} />
                  </div>
                  Hard
                </button>
              </div>
              
              <button 
                onClick={() => setGameState('playing')} 
                className="py-3 px-6 rounded-full flex items-center justify-center w-full"
                style={{ backgroundColor: colors.primary, color: colors.white }}
              >
                Start Quiz Challenge <ChevronRight className="ml-2" size={20} />
              </button>
            </div>
            
            <div className="flex space-x-4 mb-6">
              <button onClick={() => setGameState('about')} className="flex items-center" style={{ color: colors.primary }}>
                <Book size={18} className="mr-1" /> About the Book
              </button>
              <button onClick={() => setGameState('instructions')} className="flex items-center" style={{ color: colors.primary }}>
                <Info size={18} className="mr-1" /> How to Play
              </button>
            </div>
            
            {/* Giraffe - now using fixed positioning */}
            <img 
              src={characters.giraffe} 
              alt="Skateboarding Giraffe" 
              style={characterStyles.giraffeBottom}
            />
          </div>
        );
        
      case 'playing':
        return (
          <div className="p-6" style={{ backgroundColor: colors.background }}>
            <div className="flex justify-between items-center mb-4">
              <button onClick={backToHome} className="flex items-center" style={{ color: colors.primary }}>
                <ArrowLeft size={18} className="mr-1" /> Exit
              </button>
              <div style={{ color: colors.primary }}>
                {currentRound + 1}/{totalQuestions}
              </div>
              <div className="rounded-full py-1 px-3" style={{ backgroundColor: colors.primary, color: colors.white }}>
                Score: {score}
              </div>
            </div>
            
            {/* Timer */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" style={{ color: timer <= 10 ? '#ef4444' : colors.primary }} />
                <div className={`text-sm font-bold ${timer <= 10 ? 'text-red-500' : ''}`} style={{ color: timer <= 10 ? '#ef4444' : colors.primary }}>
                  {timer}s
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm mr-2" style={{ color: colors.secondary }}>Bonus: +{bonusPoints}</div>
                <Zap size={16} style={{ color: colors.secondary }} />
              </div>
              <button 
                onClick={useHint} 
                disabled={hintsRemaining <= 0 || showHint}
                className={`flex items-center px-2 py-1 rounded-full text-sm`}
                style={{ 
                  backgroundColor: hintsRemaining > 0 && !showHint ? colors.accent : '#e5e7eb',
                  color: hintsRemaining > 0 && !showHint ? colors.primary : '#9ca3af'
                }}
              >
                <HelpCircle size={14} className="mr-1" /> 
                Hint ({hintsRemaining})
              </button>
            </div>
            
            <div className="rounded-lg p-6 mb-4 border-2" style={{ backgroundColor: colors.white, borderColor: colors.primary }}>
              {/* Image for the concept */}
              <div className="flex justify-center mb-4">
                <div className="rounded-full h-16 w-16 flex items-center justify-center text-4xl" style={{ backgroundColor: colors.background }}>
                  {currentQuestion?.icon}
                </div>
              </div>
            
              <h3 className="font-bold text-xl mb-4 text-center" style={{ color: colors.primary }}>
                Which term matches this definition?
              </h3>
              
              {/* Hint display */}
              {showHint && (
                <div className="border p-3 rounded-lg mb-4 text-sm" style={{ backgroundColor: "#fffbeb", borderColor: colors.secondary }}>
                  <div className="font-bold flex items-center" style={{ color: colors.secondary }}>
                    <HelpCircle size={14} className="mr-1" /> Hint:
                  </div>
                  <p style={{ color: "#b45309" }}>{getHint()}</p>
                </div>
              )}
              
              <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: "#f0f9ff" }}>
                {currentQuestion?.definition}
              </div>
              
              <div className="space-y-3">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-3 rounded-lg w-full text-left border ${
                      selectedAnswer === option
                        ? isCorrect
                          ? 'border-green-500'
                          : 'border-red-500'
                        : 'border-gray-300 hover:border-indigo-500'
                    }`}
                    style={{ 
                      backgroundColor: selectedAnswer === option 
                        ? isCorrect 
                          ? '#dcfce7' // green light
                          : '#fee2e2' // red light
                        : colors.white,
                      borderColor: selectedAnswer === option
                        ? isCorrect
                          ? '#22c55e' // green
                          : '#ef4444' // red
                        : '#d1d5db' // gray
                    }}
                  >
                    {option}
                    {selectedAnswer === option && (
                      isCorrect ? 
                        <Check className="inline ml-2 text-green-600" size={18} /> : 
                        <X className="inline ml-2 text-red-600" size={18} />
                    )}
                  </button>
                ))}
                
                {/* Time's up indicator */}
                {selectedAnswer === 'timeout' && (
                  <div className="p-3 rounded-lg w-full text-center border" style={{ backgroundColor: "#fee2e2", borderColor: "#ef4444", color: "#b91c1c" }}>
                    Time's up! The correct answer was: <span className="font-bold">{currentQuestion?.term}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Difficulty indicator */}
            <div className="text-center text-sm" style={{ color: colors.primary }}>
              Difficulty: {' '}
              {difficulty === 'easy' && <span style={{ color: colors.green }}>Easy</span>}
              {difficulty === 'medium' && <span style={{ color: colors.secondary }}>Medium</span>}
              {difficulty === 'hard' && <span style={{ color: colors.purple }}>Hard</span>}
            </div>
            
            {/* Robot - now using fixed positioning */}
            <img 
              src={characters.robot} 
              alt="AI Robot" 
              style={characterStyles.robotBottom}
            />
          </div>
        );
        
      case 'result':
        const percentage = Math.round((score / totalQuestions) * 100);
        const totalScore = score + bonusPoints;
        
        let message = "";
        if (percentage >= 80) {
          message = "Amazing! You're an AI expert like Charlie!";
        } else if (percentage >= 60) {
          message = "Great job! You're on your way to becoming an AI expert!";
        } else {
          message = "Good effort! Keep learning about AI with Charlie!";
        }
        
        return (
          <div className="p-6 text-center" style={{ backgroundColor: colors.background }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>Game Complete!</h2>
            <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: colors.white, borderColor: colors.primary, borderWidth: "3px" }}>
              <div style={{ position: "relative" }}>
                <div className="flex justify-center gap-4 mt-4 mb-6">
                  <img src={characters.charlie} alt="Charlie" className="h-24 w-auto" />
                  <img src={characters.robot} alt="Robot" className="h-24 w-auto" />
                </div>
              </div>
              
              <div className="text-5xl font-bold mb-2" style={{ color: colors.primary }}>{score}/{totalQuestions}</div>
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="text-lg font-bold" style={{ color: colors.secondary }}>
                  Total Score: {totalScore}
                </div>
                {bonusPoints > 0 && (
                  <div className="px-2 py-1 rounded-full text-sm flex items-center" style={{ backgroundColor: "#fff7e0", color: colors.secondary }}>
                    <Zap size={14} className="mr-1" /> +{bonusPoints} time bonus
                  </div>
                )}
              </div>
              <p className="text-lg mb-4" style={{ color: colors.primary }}>{message}</p>
              
              {/* Stats */}
              <div className="bg-white rounded-lg p-4 mb-4 border-2" style={{ borderColor: colors.accent, backgroundColor: "#f0f9ff" }}>
                <h3 className="font-bold mb-2" style={{ color: colors.primary }}>Your Performance</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <div className="text-sm" style={{ color: colors.primary }}>Difficulty</div>
                    <div className="font-bold">
                      {difficulty === 'easy' && <span style={{ color: colors.green }}>Easy</span>}
                      {difficulty === 'medium' && <span style={{ color: colors.secondary }}>Medium</span>}
                      {difficulty === 'hard' && <span style={{ color: colors.purple }}>Hard</span>}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <div className="text-sm" style={{ color: colors.primary }}>Hints Used</div>
                    <div className="font-bold" style={{ color: colors.primary }}>{hintsUsed}/3</div>
                  </div>
                </div>
                
                <div className="mb-2 font-bold" style={{ color: colors.primary }}>Share your achievement!</div>
                <div className="flex justify-center space-x-4">
                  <button onClick={shareResult} className="p-2 rounded-full" style={{ backgroundColor: colors.primary, color: colors.white }}>
                    <Share2 size={20} />
                  </button>
                  <button onClick={downloadCard} className="p-2 rounded-full" style={{ backgroundColor: colors.primary, color: colors.white }}>
                    <Download size={20} />
                  </button>
                </div>
              </div>
              
              <a 
                href="#" 
                className="inline-flex items-center font-bold mb-4"
                onClick={(e) => {
                  e.preventDefault();
                  alert("This would link to the book purchase page");
                }}
                style={{ color: colors.primary }}
              >
                Get the full book to learn more! <ExternalLink size={16} className="ml-1" />
              </a>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={startNewGame}
                className="py-2 px-6 rounded-full text-white"
                style={{ backgroundColor: colors.primary }}
              >
                Play Again
              </button>
              <button 
                onClick={backToHome}
                className="border-2 py-2 px-6 rounded-full"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                Change Difficulty
              </button>
            </div>
            
            {/* Giraffe - now using fixed positioning */}
            <img 
              src={characters.giraffe} 
              alt="Skateboarding Giraffe" 
              style={characterStyles.giraffeBottom}
            />
          </div>
        );
        
      case 'about':
        return (
          <div className="p-6" style={{ backgroundColor: colors.background }}>
            <button onClick={backToHome} className="flex items-center mb-4" style={{ color: colors.primary }}>
              <ArrowLeft size={18} className="mr-1" /> Back to Home
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: colors.primary }}>About the Book</h2>
            <div className="rounded-lg p-4 mb-6 border-2" style={{ backgroundColor: colors.white, borderColor: colors.primary }}>
              <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                <img 
                  src="/images/book.png" 
                  alt="The Incredible World of AI with Charlie Book Cover" 
                  className="rounded-lg mb-4 md:mb-0 w-32 h-auto"
                />
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: colors.primary }}>The Incredible World of AI with Charlie</h3>
                  <h4 className="text-sm mb-2" style={{ color: colors.secondary }}>by Jerlyn Thomas</h4>
                  <div style={{ color: colors.primary }}>
                    Meet Charlie, a curious and creative fifth grader who discovers AI (artificial intelligence) when she uses an app that creates images from her imagination.
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: colors.background }}>
                <h4 className="font-bold mb-1" style={{ color: colors.primary }}>What you'll learn:</h4>
                <ul className="list-disc pl-5 space-y-1" style={{ color: colors.primary }}>
                  <li>How AI works and creates</li>
                  <li>Critical thinking about AI information</li>
                  <li>Understanding AI's strengths and limitations</li>
                  <li>Using AI responsibly and safely</li>
                  <li>Preparing for a future with AI</li>
                </ul>
              </div>
              
              <div className="italic mb-4" style={{ color: colors.primary }}>
                "But I just made that up!" she exclaims when she sees a giraffe on a skateboard eating spaghetti appear on her screen.
              </div>
              
              <div className="mb-4" style={{ color: colors.primary }}>
                Join Charlie on an adventure to understand AI—how it works, what it can do, and how to use it responsibly. Through engaging stories and activities, children will develop critical AI literacy skills for a technology-rich future.
              </div>
              
              <a 
                href="#" 
                className="py-2 px-4 rounded-full inline-flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  alert("This would link to the book purchase page");
                }}
                style={{ backgroundColor: colors.primary, color: colors.white }}
              >
                Get the Book <ExternalLink size={16} className="ml-1" />
              </a>
            </div>
            
            <div className="rounded-lg p-4 border-2" style={{ backgroundColor: colors.white, borderColor: colors.primary }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: colors.primary }}>About the Author</h3>
              <p className="mb-2" style={{ color: colors.primary }}>
                Jerlyn O'Donnell née Thomas is a digital polymath passionate about making 
                technology accessible to young readers. With a background in STEAM, she created 
                Charlie to help kids understand and navigate the exciting world of AI.
              </p>
              <p style={{ color: colors.primary }}>
                When not writing, Jerlyn enjoys drawing, running, and exploring new technologies. 
                She lives in The Bronx with her husband and toddler, Mattis.
              </p>
            </div>
            
            {/* Giraffe - now using fixed positioning */}
            <img 
              src={characters.giraffe} 
              alt="Skateboarding Giraffe" 
              style={characterStyles.giraffeBottom}
            />
          </div>
        );
        
      case 'instructions':
        return (
          <div className="p-6" style={{ backgroundColor: colors.background }}>
            <button onClick={backToHome} className="flex items-center mb-4" style={{ color: colors.primary }}>
              <ArrowLeft size={18} className="mr-1" /> Back to Home
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: colors.primary }}>How to Play</h2>
            
            <div className="rounded-lg p-4 mb-4 border-2" style={{ backgroundColor: colors.white, borderColor: colors.primary }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: colors.primary }}>AI Quiz Challenge</h3>
              <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: colors.background }}>
                <p style={{ color: colors.primary }}>Test your AI knowledge! You'll be shown a definition from the book, and you need to select the correct AI term that matches it from four possible options.</p>
              </div>
              
              <h3 className="font-bold text-lg mb-2" style={{ color: colors.primary }}>Game Features</h3>
              <div className="space-y-3 mb-4">
                <div className="flex">
                  <div className="w-10 flex-shrink-0" style={{ color: colors.primary }}>
                    <Star size={18} />
                  </div>
                  <div>
                    <div className="font-bold" style={{ color: colors.primary }}>Difficulty Levels</div>
                    <p className="text-sm" style={{ color: colors.primary }}>Choose from Easy, Medium, or Hard to match your AI knowledge!</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-10 flex-shrink-0" style={{ color: colors.primary }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="font-bold" style={{ color: colors.primary }}>Timer Challenge</div>
                    <p className="text-sm" style={{ color: colors.primary }}>Answer quickly to earn bonus points! Each question has a 30-second time limit.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-10 flex-shrink-0" style={{ color: colors.primary }}>
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <div className="font-bold" style={{ color: colors.primary }}>Hint System</div>
                    <p className="text-sm" style={{ color: colors.primary }}>Stuck on a question? Use up to 3 hints per game to get clues about the correct term.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-10 flex-shrink-0" style={{ color: colors.primary }}>
                    <Share2 size={18} />
                  </div>
                  <div>
                    <div className="font-bold" style={{ color: colors.primary }}>Share Your Score</div>
                    <p className="text-sm" style={{ color: colors.primary }}>Show off your AI knowledge by sharing achievement cards with friends!</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2" style={{ color: colors.primary }}>Game Rules</h3>
              <ul className="list-disc pl-5 space-y-2" style={{ color: colors.primary }}>
                <li>Each game has 5 questions from the book's glossary</li>
                <li>Select the AI term that matches the definition shown</li>
                <li>Get immediate feedback on your answer</li>
                <li>Try to answer quickly for bonus points</li>
                <li>Use hints wisely - you only get 3 per game!</li>
              </ul>
            </div>
            
            <div className="rounded-lg p-4 border-2" style={{ backgroundColor: colors.white, borderColor: colors.primary }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: colors.primary }}>Tips for Success</h3>
              <ul className="list-disc pl-5 space-y-2" style={{ color: colors.primary }}>
                <li>Read the definition carefully before selecting an answer</li>
                <li>Look for key concepts that connect to specific AI terms</li>
                <li>If you're running out of time, make your best guess</li>
                <li>Save hints for the most difficult questions</li>
                <li>Challenge yourself with harder difficulty levels as you improve</li>
                <li>For the full learning experience, check out the complete book!</li>
              </ul>
            </div>
            
            {/* Charlie - now using fixed positioning */}
            <img 
              src={characters.charlie} 
              alt="Charlie" 
              style={characterStyles.charlieBottom}
            />
          </div>
        );
        
      default:
        return <div>Something went wrong</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {renderGameContent()}
      </div>
      <footer className="py-2 text-center text-sm" style={{ backgroundColor: colors.primary, color: colors.white }}>
        © 2025 Jerlyn Thomas | The Incredible World of AI with Charlie
      </footer>
    </div>
  );
};

export default App;
