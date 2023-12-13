// ShortAnswerEvaluation.tsx
import React, { useState } from 'react';
import { evaluateShortAnswer } from './APIcaller';

interface AIShortAnswerProps {
  question: string;
}

const AIShortAnswer: React.FC<AIShortAnswerProps> = ({ question }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [evaluation, setEvaluation] = useState<{ mark: number; analysis: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    try {
      const response = await evaluateShortAnswer(question, userAnswer);
      setEvaluation(JSON.parse(response));
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error evaluating short answer:', err);
      setError('An error occurred while evaluating the answer.'); // Display an error message to the user
    }
  };

  return (
    <div>
      <label>
        <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
      </label>
      <button onClick={handleEvaluate}>Evaluate</button>
      {error && <p>Error: {error}</p>}
      {evaluation && (
        <div>
          <p>Mark: {evaluation.mark} out of 5</p>
          <p>Analysis: {evaluation.analysis}</p>
        </div>
      )}
    </div>
  );
};

export default AIShortAnswer;
