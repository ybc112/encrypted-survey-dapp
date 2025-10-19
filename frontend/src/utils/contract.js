export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || "").trim();

export const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"},
      {"internalType": "string", "name": "_questionText", "type": "string"},
      {"internalType": "uint8", "name": "_questionType", "type": "uint8"},
      {"internalType": "uint8", "name": "_optionCount", "type": "uint8"}
    ],
    "name": "addQuestion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint256", "name": "_duration", "type": "uint256"}
    ],
    "name": "createSurvey",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"}
    ],
    "name": "endSurvey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"},
      {"internalType": "uint8", "name": "_questionId", "type": "uint8"}
    ],
    "name": "getQuestion",
    "outputs": [
      {"internalType": "string", "name": "questionText", "type": "string"},
      {"internalType": "uint8", "name": "questionType", "type": "uint8"},
      {"internalType": "uint8", "name": "optionCount", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"},
      {"internalType": "uint8", "name": "_questionId", "type": "uint8"}
    ],
    "name": "getQuestionResult",
    "outputs": [
      {"internalType": "uint256", "name": "sum", "type": "uint256"},
      {"internalType": "uint256", "name": "count", "type": "uint256"},
      {"internalType": "uint256", "name": "average", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"}
    ],
    "name": "getSurveyInfo",
    "outputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "uint8", "name": "questionCount", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"}
    ],
    "name": "getTotalResponses",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"},
      {"internalType": "address", "name": "_user", "type": "address"}
    ],
    "name": "hasUserResponded",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"}
    ],
    "name": "isExpired",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"},
      {"internalType": "uint8[]", "name": "_questionIds", "type": "uint8[]"},
      {"internalType": "bytes32[]", "name": "_encryptedAnswers", "type": "bytes32[]"},
      {"internalType": "uint8[]", "name": "_plaintextForAggregation", "type": "uint8[]"}
    ],
    "name": "submitMultipleResponses",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_surveyId", "type": "uint256"},
      {"internalType": "uint8", "name": "_questionId", "type": "uint8"},
      {"internalType": "bytes32", "name": "_encryptedAnswer", "type": "bytes32"},
      {"internalType": "uint8", "name": "_plaintextForAggregation", "type": "uint8"}
    ],
    "name": "submitResponse",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "surveyCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "name": "surveys",
    "outputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "uint8", "name": "questionCount", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint8", "name": "questionId", "type": "uint8"},
      {"indexed": false, "internalType": "string", "name": "questionText", "type": "string"}
    ],
    "name": "QuestionAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "surveyId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "respondent", "type": "address"},
      {"indexed": false, "internalType": "uint8", "name": "questionId", "type": "uint8"}
    ],
    "name": "ResponseSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "surveyId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "title", "type": "string"}
    ],
    "name": "SurveyCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "surveyId", "type": "uint256"}
    ],
    "name": "SurveyEnded",
    "type": "event"
  }
];

export const QUESTION_TYPES = {
  YES_NO: 0,
  RATING_1_5: 1,
  RATING_1_10: 2,
  MULTIPLE_CHOICE: 3
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.YES_NO]: "Yes / No",
  [QUESTION_TYPES.RATING_1_5]: "Rating (1-5)",
  [QUESTION_TYPES.RATING_1_10]: "Rating (1-10)",
  [QUESTION_TYPES.MULTIPLE_CHOICE]: "Multiple Choice"
};
