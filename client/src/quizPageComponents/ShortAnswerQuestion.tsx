import { Question } from './Quiz';

type SAQuestionProps = {
    question: Question;
    userAnswer: string;
    onAnswerChange: (answer: string) => void;
    submitted: boolean;
  };
  
  const SAQuestion: React.FC<SAQuestionProps> = ({ question, userAnswer, onAnswerChange, submitted }) => {
    return (
      <div>
        <h2>{question.text}</h2>
        <input 
          type="text" 
          value={userAnswer} 
          onChange={(e) => onAnswerChange(e.target.value)} 
          disabled={submitted}
        />
        {submitted && (
          <p className="answerExplanation">{question.answerExplanation}</p>
        )}
      </div>
    );
  };
  

export default SAQuestion;