import { useState, useEffect } from 'react';
import { encryptAnswer } from '../utils/helpers';
import { QUESTION_TYPES } from '../utils/contract';

export default function TakeSurvey({ contract, account, surveyId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [surveyInfo, setSurveyInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    if (contract && surveyId !== null) {
      loadSurvey();
    }
  }, [contract, surveyId]);

  const loadSurvey = async () => {
    try {
      setLoading(true);

      // Load survey info
      const info = await contract.getSurveyInfo(surveyId);
      setSurveyInfo({
        title: info.title,
        description: info.description,
        questionCount: info.questionCount,
      });

      // Load questions
      const questionsData = [];
      for (let i = 0; i < info.questionCount; i++) {
        const q = await contract.getQuestion(surveyId, i);
        questionsData.push({
          id: i,
          text: q.questionText,
          type: Number(q.questionType),
          optionCount: Number(q.optionCount),
        });
      }
      setQuestions(questionsData);

      // Check if user has responded
      const responded = await contract.hasUserResponded(surveyId, account);
      setHasResponded(responded);
    } catch (err) {
      setError('Failed to load survey');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: Number(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Ensure all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      setError('Please answer all questions');
      return;
    }

    try {
      setSubmitting(true);

      // Submit each answer
      for (const question of questions) {
        const answer = answers[question.id];
        const encrypted = encryptAnswer(answer.toString());

        const tx = await contract.submitResponse(
          surveyId,
          question.id,
          encrypted,
          answer
        );
        await tx.wait();
      }

      setSuccess('Submitted successfully! Thank you for participating.');
      setHasResponded(true);
      setTimeout(() => onBack && onBack(), 2000);
    } catch (err) {
      setError(err.message || 'Submission failed');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px' }}>Loading survey...</p>
      </div>
    );
  }

  if (hasResponded) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3 style={{ color: '#2d3748', marginBottom: '16px' }}>You already responded to this survey</h3>
        <button onClick={onBack} className="btn btn-secondary">
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <button onClick={onBack} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      <h2 style={{ color: '#2d3748', marginBottom: '12px' }}>{surveyInfo?.title}</h2>
      <p style={{ color: '#718096', marginBottom: '32px' }}>{surveyInfo?.description}</p>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div
            key={question.id}
            style={{
              background: '#f7fafc',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <h4 style={{ color: '#2d3748', marginBottom: '16px' }}>
              {index + 1}. {question.text}
            </h4>

            {question.type === QUESTION_TYPES.YES_NO && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value="0"
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    required
                    style={{ marginRight: '8px' }}
                  />
                  No
                </label>
                <label style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value="1"
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    required
                    style={{ marginRight: '8px' }}
                  />
                  Yes
                </label>
              </div>
            )}

            {question.type === QUESTION_TYPES.RATING_1_5 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      value={rating}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      required
                      style={{ marginRight: '4px' }}
                    />
                    {rating}
                  </label>
                ))}
              </div>
            )}

            {question.type === QUESTION_TYPES.RATING_1_10 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[...Array(10)].map((_, i) => (
                  <label key={i + 1} style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      value={i + 1}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      required
                      style={{ marginRight: '4px' }}
                    />
                    {i + 1}
                  </label>
                ))}
              </div>
            )}

            {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
              <div>
                {[...Array(question.optionCount)].map((_, i) => (
                  <label key={i} style={{ display: 'block', marginBottom: '8px' }}>
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      value={i}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      required
                      style={{ marginRight: '8px' }}
                    />
                    Option {i + 1}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{ width: '100%', padding: '12px' }}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
