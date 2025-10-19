// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EncryptedSurveySimplified
 * @dev A simplified confidential survey system for demonstration
 * @notice This is a simplified version that can be deployed without full FHE dependencies
 */
contract EncryptedSurveySimplified {

    // Survey structure
    struct Survey {
        string title;
        string description;
        address creator;
        uint256 createdAt;
        uint256 deadline;
        bool isActive;
        uint8 questionCount;
    }

    // Question structure
    struct Question {
        string questionText;
        uint8 questionType; // 0: Yes/No, 1: Rating (1-5), 2: Rating (1-10), 3: Multiple choice
        uint8 optionCount;
    }

    // Response structure (encrypted hash)
    struct Response {
        bytes32 encryptedAnswer; // Hash of encrypted answer
        bool submitted;
    }

    // Survey counter
    uint256 public surveyCount;

    // Mappings
    mapping(uint256 => Survey) public surveys;
    mapping(uint256 => mapping(uint8 => Question)) public questions;
    mapping(uint256 => mapping(uint8 => uint256)) public responseSums; // Aggregated responses
    mapping(uint256 => uint256) public responseCount;
    mapping(uint256 => mapping(address => mapping(uint8 => Response))) private userResponses;
    mapping(uint256 => mapping(address => bool)) public hasResponded;

    // Events
    event SurveyCreated(uint256 indexed surveyId, address indexed creator, string title);
    event QuestionAdded(uint256 indexed surveyId, uint8 questionId, string questionText);
    event ResponseSubmitted(uint256 indexed surveyId, address indexed respondent, uint8 questionId);
    event SurveyEnded(uint256 indexed surveyId);

    modifier onlyCreator(uint256 _surveyId) {
        require(msg.sender == surveys[_surveyId].creator, "Only creator can perform this action");
        _;
    }

    modifier surveyActive(uint256 _surveyId) {
        require(surveys[_surveyId].isActive, "Survey is not active");
        require(block.timestamp < surveys[_surveyId].deadline, "Survey deadline passed");
        _;
    }

    /**
     * @dev Create a new survey
     */
    function createSurvey(
        string memory _title,
        string memory _description,
        uint256 _duration
    ) external returns (uint256) {
        require(_duration > 0, "Duration must be positive");
        require(bytes(_title).length > 0, "Title cannot be empty");

        uint256 surveyId = surveyCount++;

        surveys[surveyId] = Survey({
            title: _title,
            description: _description,
            creator: msg.sender,
            createdAt: block.timestamp,
            deadline: block.timestamp + _duration,
            isActive: true,
            questionCount: 0
        });

        emit SurveyCreated(surveyId, msg.sender, _title);
        return surveyId;
    }

    /**
     * @dev Add a question to survey
     */
    function addQuestion(
        uint256 _surveyId,
        string memory _questionText,
        uint8 _questionType,
        uint8 _optionCount
    ) external onlyCreator(_surveyId) surveyActive(_surveyId) {
        require(bytes(_questionText).length > 0, "Question text cannot be empty");
        require(_questionType <= 3, "Invalid question type");

        if (_questionType == 3) {
            require(_optionCount >= 2 && _optionCount <= 10, "Invalid option count for multiple choice");
        }

        uint8 questionId = surveys[_surveyId].questionCount++;

        questions[_surveyId][questionId] = Question({
            questionText: _questionText,
            questionType: _questionType,
            optionCount: _optionCount
        });

        emit QuestionAdded(_surveyId, questionId, _questionText);
    }

    /**
     * @dev Submit encrypted response (client-side encryption)
     * @param _encryptedAnswer Client-encrypted answer as bytes32
     */
    function submitResponse(
        uint256 _surveyId,
        uint8 _questionId,
        bytes32 _encryptedAnswer,
        uint8 _plaintextForAggregation // For demo: plaintext value for aggregation
    ) public surveyActive(_surveyId) {
        require(_questionId < surveys[_surveyId].questionCount, "Invalid question ID");
        require(!userResponses[_surveyId][msg.sender][_questionId].submitted, "Already responded");

        Question memory question = questions[_surveyId][_questionId];

        // Validate plaintext value (in production, this would be done in ZK)
        if (question.questionType == 0) {
            require(_plaintextForAggregation <= 1, "Invalid Yes/No answer");
        } else if (question.questionType == 1) {
            require(_plaintextForAggregation >= 1 && _plaintextForAggregation <= 5, "Invalid rating (1-5)");
        } else if (question.questionType == 2) {
            require(_plaintextForAggregation >= 1 && _plaintextForAggregation <= 10, "Invalid rating (1-10)");
        } else if (question.questionType == 3) {
            require(_plaintextForAggregation < question.optionCount, "Invalid option");
        }

        // Store encrypted response
        userResponses[_surveyId][msg.sender][_questionId] = Response({
            encryptedAnswer: _encryptedAnswer,
            submitted: true
        });

        // Update aggregation
        responseSums[_surveyId][_questionId] += _plaintextForAggregation;

        if (!hasResponded[_surveyId][msg.sender]) {
            hasResponded[_surveyId][msg.sender] = true;
            responseCount[_surveyId]++;
        }

        emit ResponseSubmitted(_surveyId, msg.sender, _questionId);
    }

    /**
     * @dev Submit multiple responses at once
     */
    function submitMultipleResponses(
        uint256 _surveyId,
        uint8[] calldata _questionIds,
        bytes32[] calldata _encryptedAnswers,
        uint8[] calldata _plaintextValues
    ) external surveyActive(_surveyId) {
        require(_questionIds.length == _encryptedAnswers.length, "Array length mismatch");
        require(_questionIds.length == _plaintextValues.length, "Array length mismatch");
        require(_questionIds.length > 0, "Empty arrays");

        for (uint256 i = 0; i < _questionIds.length; i++) {
            submitResponse(_surveyId, _questionIds[i], _encryptedAnswers[i], _plaintextValues[i]);
        }
    }

    /**
     * @dev End survey early (only creator)
     */
    function endSurvey(uint256 _surveyId) external onlyCreator(_surveyId) {
        require(surveys[_surveyId].isActive, "Survey already ended");

        surveys[_surveyId].isActive = false;
        emit SurveyEnded(_surveyId);
    }

    /**
     * @dev Get survey info
     */
    function getSurveyInfo(uint256 _surveyId) external view returns (
        string memory title,
        string memory description,
        address creator,
        uint256 createdAt,
        uint256 deadline,
        bool isActive,
        uint8 questionCount
    ) {
        Survey memory survey = surveys[_surveyId];
        return (
            survey.title,
            survey.description,
            survey.creator,
            survey.createdAt,
            survey.deadline,
            survey.isActive,
            survey.questionCount
        );
    }

    /**
     * @dev Get question details
     */
    function getQuestion(uint256 _surveyId, uint8 _questionId) external view returns (
        string memory questionText,
        uint8 questionType,
        uint8 optionCount
    ) {
        require(_questionId < surveys[_surveyId].questionCount, "Invalid question ID");
        Question memory question = questions[_surveyId][_questionId];
        return (question.questionText, question.questionType, question.optionCount);
    }

    /**
     * @dev Get aggregated result for a question (only after survey ends)
     */
    function getQuestionResult(uint256 _surveyId, uint8 _questionId) external view returns (
        uint256 sum,
        uint256 count,
        uint256 average
    ) {
        Survey memory survey = surveys[_surveyId];
        require(!survey.isActive || block.timestamp >= survey.deadline, "Survey still active");
        require(_questionId < survey.questionCount, "Invalid question ID");

        sum = responseSums[_surveyId][_questionId];
        count = responseCount[_surveyId];
        average = count > 0 ? sum / count : 0;

        return (sum, count, average);
    }

    /**
     * @dev Get user's encrypted response
     */
    function getMyResponse(uint256 _surveyId, uint8 _questionId) external view returns (bytes32) {
        require(userResponses[_surveyId][msg.sender][_questionId].submitted, "No response found");
        return userResponses[_surveyId][msg.sender][_questionId].encryptedAnswer;
    }

    /**
     * @dev Check if survey is expired
     */
    function isExpired(uint256 _surveyId) external view returns (bool) {
        return block.timestamp >= surveys[_surveyId].deadline;
    }

    /**
     * @dev Get total response count for a survey
     */
    function getTotalResponses(uint256 _surveyId) external view returns (uint256) {
        return responseCount[_surveyId];
    }

    /**
     * @dev Check if user has responded to survey
     */
    function hasUserResponded(uint256 _surveyId, address _user) external view returns (bool) {
        return hasResponded[_surveyId][_user];
    }
}
