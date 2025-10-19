import { useState, useEffect } from 'react';
import { QUESTION_TYPE_LABELS } from '../utils/contract';

export default function SurveyResults({ contract, surveyId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surveyInfo, setSurveyInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [totalResponses, setTotalResponses] = useState(0);

  useEffect(() => {
    if (contract && surveyId !== null) {
      loadResults();
    }
  }, [contract, surveyId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const info = await contract.getSurveyInfo(surveyId);
      setSurveyInfo({
        title: info.title,
        description: info.description,
        isActive: info.isActive,
        deadline: info.deadline,
      });

      // Check if survey is still active
      if (info.isActive) {
        const currentTime = Math.floor(Date.now() / 1000);
        const deadline = Number(info.deadline);
        
        if (currentTime < deadline) {
          setError('This survey is still active. Results will be available after the survey ends.');
          return;
        }
      }

      const questionCount = Number(info.questionCount);
      const qs = [];
      const res = [];

      for (let i = 0; i < questionCount; i++) {
        const q = await contract.getQuestion(surveyId, i);
        
        try {
          const r = await contract.getQuestionResult(surveyId, i);
          qs.push({ id: i, text: q.questionText, type: Number(q.questionType) });
          res.push({ sum: Number(r.sum), count: Number(r.count), average: Number(r.average) });
        } catch (resultError) {
          console.error(`Error getting result for question ${i}:`, resultError);
          
          if (resultError.message.includes('Survey still active')) {
            setError('This survey is still active. Results will be available after the survey ends.');
            return;
          } else {
            // For other errors, still add the question but with empty results
            qs.push({ id: i, text: q.questionText, type: Number(q.questionType) });
            res.push({ sum: 0, count: 0, average: 0 });
          }
        }
      }

      setQuestions(qs);
      setResults(res);
      
      try {
        const total = await contract.getTotalResponses(surveyId);
        setTotalResponses(Number(total));
      } catch (totalError) {
        console.error('Error getting total responses:', totalError);
        setTotalResponses(0);
      }
    } catch (err) {
      console.error('Failed to load results:', err);
      
      if (err.message.includes('Survey still active')) {
        setError('This survey is still active. Results will be available after the survey ends.');
      } else {
        setError('Failed to load results: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => onBack && onBack();

  const getPercentage = (value, max) => {
    return max > 0 ? ((value / max) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px' }}>Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button onClick={handleBackClick} className="btn btn-secondary">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <button onClick={handleBackClick} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      <h2 style={{ color: '#2d3748', marginBottom: '12px' }}>{surveyInfo?.title}</h2>
      <p style={{ color: '#718096', marginBottom: '20px' }}>{surveyInfo?.description}</p>

      <div
        style={{
          background: '#edf2f7',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '32px',
        }}
      >
        <h3 style={{ color: '#2d3748', marginBottom: '12px' }}>Survey Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ color: '#718096', fontSize: '14px' }}>Total responses</div>
            <div style={{ color: '#2d3748', fontSize: '24px', fontWeight: 'bold' }}>
              {totalResponses}
            </div>
          </div>
          <div>
            <div style={{ color: '#718096', fontSize: '14px' }}>Questions</div>
            <div style={{ color: '#2d3748', fontSize: '24px', fontWeight: 'bold' }}>
              {questions.length}
            </div>
          </div>
          <div>
            <div style={{ color: '#718096', fontSize: '14px' }}>Status</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              <span className={`badge ${surveyInfo?.isActive ? 'badge-active' : 'badge-expired'}`}>
                {surveyInfo?.isActive ? 'Active' : 'Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ color: '#2d3748', marginBottom: '20px' }}>Question Results</h3>

      {questions.map((question, index) => {
        const result = results[index];
        const percentage = getPercentage(result.average, 10); // Max 10 for percentage

        return (
          <div
            key={question.id}
            style={{
              background: '#f7fafc',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <h4 style={{ color: '#2d3748', marginBottom: '8px' }}>
              {index + 1}. {question.text}
            </h4>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '16px' }}>
              Type: {QUESTION_TYPE_LABELS[question.type]}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ color: '#718096', fontSize: '14px' }}>Sum</div>
                <div style={{ color: '#2d3748', fontSize: '20px', fontWeight: 'bold' }}>
                  {result.sum}
                </div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: '14px' }}>Count</div>
                <div style={{ color: '#2d3748', fontSize: '20px', fontWeight: 'bold' }}>
                  {result.count}
                </div>
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: '14px' }}>Average</div>
                <div style={{ color: '#667eea', fontSize: '20px', fontWeight: 'bold' }}>
                  {result.average}
                </div>
              </div>
            </div>

            {result.count > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#718096' }}>Average Distribution</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#667eea' }}>
                    {percentage}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {totalResponses === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
          <p>No responses yet</p>
        </div>
      )}
    </div>
  );
}
