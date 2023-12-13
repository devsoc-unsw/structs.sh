
//Add your own openAI API key as a string here. pls don't use mine! L.
const APIKey = 69696969

type TestCase = {
  input: any;
  expectedOutput: any;
};


async function fetchQuestions(topic: string, count: number, difficulty: string) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: `give me ${count} ${difficulty} questions about ${topic} in the exact formatting style as the example. Only return the formatted array response. Example: [{"text": "What is the time complexity of accessing an element in an array by its index?", "options": ["O(1)", "O(log n)", "O(n)", "O(n^2)"], "answerIndex": 0, "answerExplanation": "Accessing an element in an array by its index has a time complexity of O(1), because the index can be used to directly access its memory location."}, {"text": "What is the syntax to declare a dynamic array in C++?", "options": ["int array[];", "int array[10];", "int* array;", "int array();"], "answerIndex": 2, "answerExplanation": "The syntax to declare a dynamic array in C++ is int* array;."}]`}],
    temperature: 0.5
  };


  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + APIKey
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log(data)
    const formattedResponse = JSON.parse(data.choices[0].message.content);
    return formattedResponse;
  }

async function evaluateShortAnswer(question: string, userAnswer: string) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const prompt = `:`;

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: `Question: ${question}\nAnswer: ${userAnswer}\n\nEvaluate the answer on a scale of 0 to 5 and provide insights (less than 20 words), in this format: {"mark": Evaluation, "analysis: "insight"}, e.g. {"mark": 2, "analysis": "this is correct since it is a linked list"}. remember that mark is an int.`}],
    temperature: 1.0
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + APIKey
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function testCaseFeedback(question: string, userCode: string, testCases: TestCase[]) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const prompt = `I need to solve this problem using JS: "${question}". \nHowever, not all of these test cases are passing: "${JSON.stringify(testCases)}". \nHere is my code to solve the problem: "${JSON.stringify(userCode)}"\nWhat could the issue be? answer in less than 30 words.`;
  console.log(prompt)
  const payload = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
  };

  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + APIKey
  };

  const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export { fetchQuestions, evaluateShortAnswer, testCaseFeedback };
