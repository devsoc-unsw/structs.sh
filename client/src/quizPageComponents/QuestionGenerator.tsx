import React, { useState } from 'react';
import { fetchQuestions } from './APIcaller';
import Quiz, { Question } from './Quiz';

interface QuestionGeneratorProps {
  topic: string;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({ topic }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [count, setCount] = useState<number>(3); // default 3 questions
  const [difficulty, setDifficulty] = useState<string>('easy'); // default easy difficulty

  const handleButtonClick = async () => {
    try {
      const fetchedQuestions: Question[] = await fetchQuestions(topic, count, difficulty);
      console.log(fetchedQuestions)
      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  return (
    <div>
      <label>
        Number of Questions:
        <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>

      <label>
        Difficulty:
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>
      </label>

      <button onClick={handleButtonClick}>Generate Questions</button>
      {questions.length > 0 && <Quiz questions={questions} />}
    </div>
  );
};

export default QuestionGenerator;
