import { useState } from 'react';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '../utils/contract';

export default function CreateSurvey({ contract, account, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(7); // days
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: QUESTION_TYPES.YES_NO,
        optionCount: 0,
      },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!contract || !account) {
      setError('Please connect wallet first');
      return;
    }

    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    try {
      setLoading(true);

      // Create survey
      const durationInSeconds = duration * 24 * 60 * 60;
      const tx1 = await contract.createSurvey(title, description, durationInSeconds);
      const receipt1 = await tx1.wait();

      // Get surveyId from event - ethers v6 approach
      let surveyId = null;
      
      console.log('Transaction receipt:', receipt1);
      console.log('Receipt logs:', receipt1.logs);
      
      // Parse logs to find SurveyCreated event
      for (const log of receipt1.logs) {
        try {
          console.log('Parsing log:', log);
          const parsedLog = contract.interface.parseLog(log);
          console.log('Parsed log:', parsedLog);
          
          if (parsedLog && parsedLog.name === 'SurveyCreated') {
            console.log('Found SurveyCreated event:', parsedLog);
            console.log('Event args:', parsedLog.args);
            surveyId = parsedLog.args[0];
            console.log('Extracted surveyId:', surveyId);
            break;
          }
        } catch (e) {
          console.log('Failed to parse log:', e);
          // Skip logs that can't be parsed by this contract
          continue;
        }
      }
      
      console.log('Final surveyId:', surveyId);
      
      if (!surveyId) {
        console.error('No SurveyCreated event found in transaction logs');
        console.error('Available logs:', receipt1.logs.map(log => ({
          address: log.address,
          topics: log.topics,
          data: log.data
        })));
        throw new Error('Failed to get survey ID from transaction');
      }

      // Add questions
      for (const question of questions) {
        const tx2 = await contract.addQuestion(
          surveyId,
          question.text,
          question.type,
          question.optionCount || 0
        );
        await tx2.wait();
      }

      setSuccess(`Survey created successfully! ID: ${surveyId}`);

      // Reset form
      setTitle('');
      setDescription('');
      setDuration(7);
      setQuestions([]);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Creation failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: '#2d3748' }}>Create New Survey</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Survey Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter survey title"
            required
          />
        </div>

        <div className="input-group">
          <label>Survey Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter survey description"
            rows="4"
            required
          />
        </div>

        <div className="input-group">
          <label>Duration (days) *</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            required
          />
        </div>

        <div style={{ marginTop: '32px', marginBottom: '16px' }}>
          <h3 style={{ marginBottom: '16px', color: '#2d3748' }}>Questions</h3>

          {questions.map((question, index) => (
            <div
              key={index}
              style={{
                background: '#f7fafc',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong>Question {index + 1}</strong>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="btn btn-danger"
                  style={{ padding: '4px 12px', fontSize: '14px' }}
                >
                  Remove
                </button>
              </div>

              <div className="input-group">
                <label>Question Text</label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                  placeholder="Enter question text"
                  required
                />
              </div>

              <div className="input-group">
                <label>Question Type</label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(index, 'type', Number(e.target.value))}
                >
                  {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                <div className="input-group">
                  <label>Option count (2-10)</label>
                  <input
                    type="number"
                    value={question.optionCount}
                    onChange={(e) => updateQuestion(index, 'optionCount', Number(e.target.value))}
                    min="2"
                    max="10"
                    required
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            + Add Question
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', marginTop: '24px', padding: '12px' }}
        >
          {loading ? 'Creating...' : 'Create Survey'}
        </button>
      </form>
    </div>
  );
}
