import React, { useState } from 'react';
import './quiz.css';
import SAQuestion from './ShortAnswerQuestion';

export interface Question {
  text: string;
  options?: string[]; // Optional for short answer questions
  answerIndex?: number; // Optional for short answer questions
  shortAnswer?: string; // For short answer questions
  type?: 'mcq' | 'short-answer'; // Type of the question
  answerExplanation: string;
}


type MCQuestionProps = {
  question: Question;
  selectedOption: number;
  onOptionSelect: (optionIndex: number) => void;
  submitted: boolean;
};

const MCQuestion: React.FC<MCQuestionProps> = ({ question, selectedOption, onOptionSelect, submitted }) => {
  const handleOptionSelect = (optionIndex: number) => {
    onOptionSelect(optionIndex);
  };

  const getButtonClassName = (optionIndex: number) => {
    if (submitted) {
      if (optionIndex === selectedOption) {
        return optionIndex === question.answerIndex ? 'MCquestion__option--correct' : 'MCquestion__option--incorrect';
      }
    } else {
      return optionIndex === selectedOption ? 'MCquestion__option--selected' : '';
    }
  };

  return (
    <div>
      <h2>{question.text}</h2>
      <div>
        {question.options?.map((option, index) => (
          <div key={index}>
            <label className={`MCquestion__option ${getButtonClassName(index)}`}>
              <input
                type="radio"
                name="option"
                value={index}
                checked={selectedOption === index}
                onChange={() => handleOptionSelect(index)}
                disabled={submitted}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

type QuizProps = {
  questions: Question[];
};

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>(Array(questions.length).fill(-1));
  const [shortAnswers, setShortAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [submitted, setSubmitted] = useState(false);


  const handleShortAnswerChange = (questionIndex: number, answer: string) => {
    setShortAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = answer;
      return newAnswers;
    });
  };



  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[questionIndex] = optionIndex;
      return newOptions;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOptions(Array(questions.length).fill(-1));
    setSubmitted(false);
  };

  const score = questions.reduce((acc, question, idx) => {
    if (question.type === 'short-answer') {
      return acc + (shortAnswers[idx].trim() === question.shortAnswer ? 1 : 0);
    } else { //if type is mcq, or undefined, assumes mcq type
      return acc + (selectedOptions[idx] === question.answerIndex ? 1 : 0);
    }
  }, 0);




  return (
    <div className="quiz">
      {questions.map((question, idx) => {
        if (question.type === 'short-answer') {
          return (
            <SAQuestion
              key={idx}
              question={question}
              userAnswer={shortAnswers[idx]}
              onAnswerChange={(answer) => handleShortAnswerChange(idx, answer)}
              submitted={submitted}
            />
          );
        } else { //assumes question type is mcq if no question.type defined.
          return (
            <MCQuestion
              key={idx}
              question={question}
              selectedOption={selectedOptions[idx]}
              onOptionSelect={(optionIndex) => handleOptionSelect(idx, optionIndex)}
              submitted={submitted}
            />
          );
        }
      })}
      <button onClick={handleSubmit} disabled={submitted}>
        Submit
      </button>
      <button onClick={handleReset} className="reset-button">
        Reset
      </button>
      {submitted && (
        <div className="results">
          <p>your score: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;