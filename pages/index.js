// pages/index.js

import React, { useState } from 'react';
import axios from 'axios';

// 🚨🚨🚨 여기에 Railway에서 생성한 PUBLIC DOMAIN 주소를 붙여넣으세요! 🚨🚨🚨
const BACKEND_URL = "https://final-project-production-fbf1.up.railway.app/"; 

// -------------------------------------------------------------
// AI 자동 기장 시뮬레이션 컴포넌트
// -------------------------------------------------------------
function TransactionUploader() {
    const [file, setFile] = useState(null);
    const [clientId, setClientId] = useState(1); // Mock Client ID
    const [uploadMessage, setUploadMessage] = useState('');
    const [transactions, setTransactions] = useState([]); // AI 분석 결과

    const handleFileUpload = async () => {
        if (!file) {
            alert("CSV 파일을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadMessage('AI가 거래 내역을 분석 중입니다...');
            
            // Backend API 호출: /api/upload/:clientId
            const response = await axios.post(`${BACKEND_URL}/api/upload/${clientId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUploadMessage(`업로드 성공. AI가 ${response.data.transactions.length}건을 자동 분류했습니다.`);
            setTransactions(response.data.transactions);

        } catch (error) {
            setUploadMessage(`업로드 실패: ${error.response?.data || error.message}`);
        }
    };

    const handleConfirm = async (transactionId, suggestedAccount, suggestedDc) => {
        // Mock ID 대신 실제 ID를 사용해야 하지만, 데모를 위해 임시 ID 사용
        const mockTransactionId = 999; 
        
        try {
            // Backend API 호출: /api/transactions/:id/confirm
            await axios.put(`${BACKEND_URL}/api/transactions/${mockTransactionId}/confirm`, {
                confirmed_account: suggestedAccount,
                confirmed_dc: suggestedDc,
            });
            alert(`거래 ID ${transactionId} 확정 완료! (Mock ID ${mockTransactionId}로 DB 전송)`);
        } catch (error) {
            alert(`확정 실패: ${error.response?.data || error.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
            <h3>1. AI 자동 기장 모듈 (CSV 업로드)</h3>
            <input 
                type="file" 
                accept=".csv" 
                onChange={(e) => setFile(e.target.files[0])} 
            />
            <button 
                onClick={handleFileUpload} 
                style={{ marginLeft: '10px', padding: '10px' }}>
                CSV 업로드 및 AI 분석
            </button>
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{uploadMessage}</p>

            {transactions.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>AI 자동 분류 결과 (검토 대기 중)</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>내역</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>금액</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>AI 제안 계정</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>차/대변</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>확정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.description}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.amount}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{t.suggested_account}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.suggested_dc}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <button 
                                            onClick={() => handleConfirm(index + 1, t.suggested_account, t.suggested_dc)}
                                            style={{ background: 'green', color: 'white', border: 'none', padding: '5px 10px' }}>
                                            확정
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// -------------------------------------------------------------
// 재산세 시나리오 비교 컴포넌트
// -------------------------------------------------------------
function TaxScenarioSimulator() {
    const [assetValue, setAssetValue] = useState(100000);
    const [exemption1, setExemption1] = useState(10000);
    const [taxRate1, setTaxRate1] = useState(0.4);
    const [exemption2, setExemption2] = useState(20000);
    const [taxRate2, setTaxRate2] = useState(0.3);
    const [result, setResult] = useState(null);

    const runSimulation = async () => {
        const payload = {
            client_id: 1, // Mock Client ID
            plan1_input: { assetValue, exemption: exemption1, taxRate: taxRate1 },
            plan2_input: { assetValue, exemption: exemption2, taxRate: taxRate2 },
        };

        try {
            // Backend API 호출: /api/tax-scenarios
            const response = await axios.post(`${BACKEND_URL}/api/tax-scenarios`, payload);
            setResult(response.data);
        } catch (error) {
            alert(`시뮬레이션 실패: ${error.response?.data || error.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
            <h3>2. 양도/상속세 시나리오 비교 모듈 (MVP Mock)</h3>
            <div style={{ display: 'flex', gap: '20px' }}>
                
                {/* 시나리오 1 */}
                <div style={{ border: '1px solid #ddd', padding: '15px' }}>
                    <h4>시나리오 1</h4>
                    <p>자산 가치: <input type="number" value={assetValue} onChange={(e) => setAssetValue(e.target.value)} /></p>
                    <p>공제액: <input type="number" value={exemption1} onChange={(e) => setExemption1(e.target.value)} /></p>
                    <p>세율(Mock): <input type="number" step="0.01" value={taxRate1} onChange={(e) => setTaxRate1(e.target.value)} /></p>
                </div>
                
                {/* 시나리오 2 */}
                <div style={{ border: '1px solid #ddd', padding: '15px' }}>
                    <h4>시나리오 2</h4>
                    <p>자산 가치: <input type="number" value={assetValue} disabled /></p>
                    <p>공제액: <input type="number" value={exemption2} onChange={(e) => setExemption2(e.target.value)} /></p>
                    <p>세율(Mock): <input type="number" step="0.01" value={taxRate2} onChange={(e) => setTaxRate2(e.target.value)} /></p>
                </div>
            </div>

            <button 
                onClick={runSimulation} 
                style={{ marginTop: '20px', padding: '10px 20px', background: 'navy', color: 'white', border: 'none' }}>
                시뮬레이션 실행 및 비교
            </button>

            {result && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#e0f7fa' }}>
                    <h4>✅ 시뮬레이션 결과</h4>
                    <p>시나리오 1 예상 세액: <strong>{result.plan1_tax.toLocaleString()}원</strong></p>
                    <p>시나리오 2 예상 세액: <strong>{result.plan2_tax.toLocaleString()}원</strong></p>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>⭐ 최종 추천: {result.recommendation}</p>
                </div>
            )}
        </div>
    );
}


// -------------------------------------------------------------
// 메인 컴포넌트
// -------------------------------------------------------------
export default function Home() {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
            <h1>AI 세무 ERP MVP 대시보드 (Frontend)</h1>
            <p>Backend URL: <strong>{BACKEND_URL}</strong></p>
            <hr style={{ margin: '30px 0' }} />
            
            <TransactionUploader />
            <hr style={{ margin: '30px 0' }} />
            <TaxScenarioSimulator />
        </div>
    );
}
