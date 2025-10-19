import { useState, useEffect } from 'react';
import { formatAddress, getTimeRemaining } from '../utils/helpers';

export default function SurveyList({ contract, account, onSelectSurvey, onViewResults }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (contract) {
      loadSurveys();
    }
  }, [contract]);

  const loadSurveys = async () => {
    if (!contract) {
      console.log('Contract not available');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Contract object:', contract);
      console.log('Contract address:', contract.target || contract.address);
      console.log('Loading surveys...');
      
      // 先检查合约连接
      const provider = contract.runner?.provider || contract.provider;
      if (provider) {
        const network = await provider.getNetwork();
        console.log('Connected to network:', network.name, 'Chain ID:', network.chainId);
        
        // 检查合约地址是否有代码
        const code = await provider.getCode(contract.target || contract.address);
        console.log('Contract code length:', code.length);
        if (code === '0x') {
          throw new Error('No contract found at this address');
        }
      }
      
      const count = await contract.surveyCount();
      console.log('Survey count raw result:', count);
      console.log('Survey count as number:', Number(count));
      
      const surveyCountNum = Number(count);
      if (surveyCountNum === 0) {
        console.log('No surveys found');
        setSurveys([]);
        return;
      }
      
      const surveysData = [];

      for (let i = 0; i < surveyCountNum; i++) {
        try {
          console.log(`Loading survey ${i}...`);
          const surveyInfo = await contract.getSurveyInfo(i);
          console.log(`Survey ${i} info:`, surveyInfo);
          
          surveysData.push({
            id: i,
            title: surveyInfo[0],
            description: surveyInfo[1],
            creator: surveyInfo[2],
            createdAt: surveyInfo[3],
            deadline: surveyInfo[4],
            isActive: surveyInfo[5],
            questionCount: surveyInfo[6]
          });
        } catch (error) {
          console.error(`Error loading survey ${i}:`, error);
          // 继续加载其他问卷，不中断整个过程
        }
      }

      setSurveys(surveysData.reverse()); // latest first
    } catch (err) {
      console.error('Failed to load surveys:', err);
      setError(`Failed to load surveys: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px' }}>Loading surveys...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#e53e3e', marginBottom: '16px' }}>{error}</p>
        <button 
          onClick={() => { setError(''); loadSurveys(); }} 
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#718096' }}>No surveys yet — create the first one!</p>
      </div>
    );
  }

  return (
    <div className="survey-grid">
      {surveys.map((survey) => (
        <div key={survey.id} className="survey-card">
          <div style={{ marginBottom: '12px' }}>
            <span className={`badge ${survey.isActive ? 'badge-active' : 'badge-expired'}`}>
              {survey.isActive ? 'Active' : 'Closed'}
            </span>
            {survey.isExpired && <span className="badge badge-expired">Expired</span>}
          </div>

          <h3 style={{ color: '#2d3748', marginBottom: '8px' }}>{survey.title}</h3>
          <p style={{ color: '#718096', fontSize: '14px', marginBottom: '16px' }}>
            {survey.description}
          </p>

          <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '12px' }}>
            <div>Creator: {formatAddress(survey.creator)}</div>
            <div>Questions: {survey.questionCount}</div>
            <div>Responses: {survey.totalResponses}</div>
            <div>
              {survey.isActive
                ? `Time left: ${getTimeRemaining(survey.deadline)}`
                : 'Closed'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {survey.isActive && (
              <button
                onClick={() => {
                  console.log('Take Survey clicked for survey:', survey.id);
                  if (onSelectSurvey) {
                    onSelectSurvey(survey.id);
                  }
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '8px' }}
              >
                Take Survey
              </button>
            )}
            <button
              onClick={() => {
                console.log('View Results clicked for survey:', survey.id);
                if (onViewResults) {
                  onViewResults(survey.id);
                }
              }}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '8px' }}
            >
              View Results
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
