import { useState } from 'react';
import { useWeb3 } from './hooks/useWeb3';
import { formatAddress } from './utils/helpers';
import CreateSurvey from './components/CreateSurvey';
import SurveyList from './components/SurveyList';
import TakeSurvey from './components/TakeSurvey';
import SurveyResults from './components/SurveyResults';

function App() {
  const { contract, account, loading, error, connectWallet, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState('browse'); // browse, create, take, results
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  const handleSurveySelect = (surveyId, mode) => {
    setSelectedSurveyId(surveyId);
    setActiveTab(mode);
  };

  const handleBack = () => {
    setActiveTab('browse');
    setSelectedSurveyId(null);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <header className="header">
        <div className="header-content">
          <h1>🔐 Encrypted Survey dApp</h1>
          <div className="wallet-info">
            {!isConnected ? (
              <button onClick={connectWallet} className="btn btn-primary" disabled={loading}>
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="wallet-address">
                {formatAddress(account)}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container">
        {error && (
          <div className="error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {!isConnected ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ color: '#2d3748', marginBottom: '16px' }}>Welcome to the Encrypted Survey</h2>
            <p style={{ color: '#718096', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              A privacy-preserving survey platform powered by smart contracts. Your responses stay private while results remain verifiable.
            </p>
            <button onClick={connectWallet} className="btn btn-primary" style={{ padding: '12px 32px' }}>
              Connect MetaMask to start
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'browse' && (
              <>
                <div className="nav-tabs">
                  <button
                    className="nav-tab active"
                    onClick={() => setActiveTab('browse')}
                  >
                    Browse
                  </button>
                  <button
                    className="nav-tab"
                    onClick={() => setActiveTab('create')}
                  >
                    Create Survey
                  </button>
                </div>

                <SurveyList
                  contract={contract}
                  account={account}
                  onSelectSurvey={(id) => handleSurveySelect(id, 'take')}
                  onViewResults={(id) => handleSurveySelect(id, 'results')}
                />
              </>
            )}

            {activeTab === 'create' && (
              <>
                <div className="nav-tabs">
                  <button
                    className="nav-tab"
                    onClick={() => setActiveTab('browse')}
                  >
                    Browse
                  </button>
                  <button
                    className="nav-tab active"
                    onClick={() => setActiveTab('create')}
                  >
                    Create Survey
                  </button>
                </div>

                <CreateSurvey
                  contract={contract}
                  account={account}
                  onSuccess={() => setActiveTab('browse')}
                />
              </>
            )}

            {activeTab === 'take' && selectedSurveyId !== null && (
              <TakeSurvey
                contract={contract}
                account={account}
                surveyId={selectedSurveyId}
                onBack={handleBack}
              />
            )}

            {activeTab === 'results' && selectedSurveyId !== null && (
              <SurveyResults
                contract={contract}
                surveyId={selectedSurveyId}
                onBack={handleBack}
              />
            )}
          </>
        )}
      </div>

      <footer style={{ textAlign: 'center', padding: '40px 20px', color: 'white' }}>
        <p>Built with React + Ethers.js + Solidity</p>
        <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>
          Built for Zama Bounty | Privacy-preserving, decentralized
        </p>
      </footer>
    </div>
  );
}

export default App;
