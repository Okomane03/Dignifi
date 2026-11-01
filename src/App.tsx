/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { DocumentWizard } from './components/DocumentWizard';
import { OrganiseVault } from './components/OrganiseVault';
import { ManageDossier } from './components/ManageDossier';
import { ReflectAnalyzer } from './components/ReflectAnalyzer';
import { DecidePathways } from './components/DecidePathways';
import { HrOrganisationalPortal } from './components/HrOrganisationalPortal';
import { OfflineDeploymentModal } from './components/OfflineDeploymentModal';
import { IntegrationsModal } from './components/IntegrationsModal';
import { QuickExitScreen } from './components/QuickExitScreen';
import { LoginDashboard } from './components/LoginDashboard';
import { IncidentRecord } from './types/incident';
import { INITIAL_MOCK_INCIDENTS } from './data/mockIncidents';
import { generateTrackingToken } from './utils/crypto';
import { getActiveSession, clearSession, seedDemoUserIfEmpty, AuthSession } from './utils/auth';
import { Bell, CheckCircle2, ShieldAlert, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dignifi_workplace_vault_v22';

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(() => getActiveSession());
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  const [records, setRecords] = useState<IncidentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasKk8g = parsed.some(
            (r: IncidentRecord) =>
              r.id === 'DIG-KK8G-N5A9' || r.hrCaseDetails?.trackingToken === 'DIG-KK8G-N5A9'
          );
          if (!hasKk8g && INITIAL_MOCK_INCIDENTS[0]?.id === 'DIG-KK8G-N5A9') {
            return [INITIAL_MOCK_INCIDENTS[0], ...parsed];
          }
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_MOCK_INCIDENTS;
  });

  const [userRole, setUserRole] = useState<'employee' | 'hr'>(() => {
    const s = getActiveSession();
    return s?.role === 'hr' ? 'hr' : 'employee';
  });

  const [activeTab, setActiveTab] = useState<'document' | 'organise' | 'manage' | 'reflect' | 'decide' | 'hr'>(() => {
    const s = getActiveSession();
    return s?.role === 'hr' ? 'hr' : 'document';
  });
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isQuickExitActive, setIsQuickExitActive] = useState<boolean>(false);
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState<boolean>(false);
  
  // Real-time encrypted notification alert for HR
  const [hrNotificationBanner, setHrNotificationBanner] = useState<{
    caseId: string;
    token: string;
    title: string;
    urgency: string;
  } | null>(null);

  // Initialize demo user if empty
  useEffect(() => {
    seedDemoUserIfEmpty();
  }, []);

  // Inactivity session timer & activity tracker
  useEffect(() => {
    const handleActivity = () => {
      if (session) {
        getActiveSession(); // Refreshes lastActive
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    const interval = setInterval(() => {
      if (session) {
        const current = getActiveSession();
        if (!current) {
          setSession(null);
          setSessionNotice('Your session has timed out due to 30 minutes of inactivity to protect your workplace records.');
        }
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearInterval(interval);
    };
  }, [session]);

  const handleSignOut = () => {
    clearSession();
    setSession(null);
    setSessionNotice(null);
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }, [records]);

  // Global ESC shortcut listener for Quick Safe Exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQuickExitActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveNewRecord = (newRecord: IncidentRecord) => {
    setRecords(prev => [newRecord, ...prev]);
    setSelectedRecordId(newRecord.id);
    setActiveTab('manage');
  };

  const handleUpdateRecord = (updated: IncidentRecord) => {
    setRecords(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    if (selectedRecordId === id) {
      setSelectedRecordId(null);
      setActiveTab('organise');
    }
  };

  const handleSubmitToHr = (
    record: IncidentRecord,
    isAnonymous: boolean = false,
    urgency: 'routine' | 'elevated' | 'critical_safety' = 'elevated'
  ) => {
    const token =
      record.hrCaseDetails?.trackingToken ||
      (record.id.startsWith('DIG-') ? record.id : generateTrackingToken());
    const updatedRecord: IncidentRecord = {
      ...record,
      status: 'submitted_to_hr',
      updatedAt: new Date().toISOString(),
      hrCaseDetails: {
        submittedAt: record.hrCaseDetails?.submittedAt || new Date().toISOString(),
        isAnonymous,
        trackingToken: token,
        assignedOfficer: 'Thandiwe Khumalo (Senior Employee Relations)',
        urgency,
        hrStatus: 'received',
        hrActionLogs: [
          {
            timestamp: new Date().toISOString(),
            actionBy: 'Dignifi Encrypted Bridge',
            actionDescription: `Encrypted report registered in HR Case Portal (${isAnonymous ? 'Anonymous' : 'Named'}).`,
            isSharedWithEmployee: true
          }
        ],
        secureNotesToEmployee: [
          {
            timestamp: new Date().toISOString(),
            officer: 'HR Employee Relations Officer',
            message: `Your report has been securely registered (Tracking Token: ${token}). A case officer has been notified for preliminary review under the 2022 Harassment Code.`
          }
        ]
      }
    };

    handleUpdateRecord(updatedRecord);

    // Trigger instant encrypted HR notification alert
    setHrNotificationBanner({
      caseId: record.id,
      token,
      title: record.title,
      urgency
    });
  };

  const hrUnreadCount = records.filter(
    r => r.status === 'submitted_to_hr' && r.hrCaseDetails?.hrStatus === 'received'
  ).length;

  const currentSelectedRecord = records.find(r => r.id === selectedRecordId) || records[0];

  if (isQuickExitActive) {
    return <QuickExitScreen onResume={() => setIsQuickExitActive(false)} />;
  }

  if (!session) {
    return (
      <div>
        {sessionNotice && (
          <div className="bg-[#FEF3C7] border-b border-[#F59E0B] text-[#92400E] px-4 py-2.5 text-xs text-center font-medium">
            {sessionNotice}
          </div>
        )}
        <LoginDashboard
          onLoginSuccess={newSession => {
            setSession(newSession);
            setSessionNotice(null);
            if (newSession.role === 'hr') {
              setUserRole('hr');
              setActiveTab('hr');
            } else {
              setUserRole('employee');
              setActiveTab('document');
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1C261E] flex flex-col font-sans selection:bg-[#2D4335]/20 selection:text-[#1C261E]">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          if (tab === 'hr') setUserRole('hr');
        }}
        userRole={userRole}
        setUserRole={setUserRole}
        onQuickExit={() => setIsQuickExitActive(true)}
        onOpenOfflineModal={() => setShowOfflineModal(true)}
        hrUnreadCount={hrUnreadCount}
        currentUser={session}
        onSignOut={handleSignOut}
      />

      {/* Real-Time Encrypted HR Notification Banner (Alerts HR when employee submits) */}
      {hrNotificationBanner && (
        <div className="bg-[#233529] text-white px-4 py-3 shadow-md border-b border-[#354D3C] animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C] shrink-0" />
              <p>
                <strong>Immediate Encrypted Notification:</strong> New Incident Submitted (Ref: <span className="font-mono">{hrNotificationBanner.token}</span>). Triage Urgency: <span className="uppercase font-semibold">{hrNotificationBanner.urgency}</span>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setUserRole('hr');
                  setActiveTab('hr');
                  setHrNotificationBanner(null);
                }}
                className="px-3 py-1 bg-white text-[#2D4335] text-xs font-bold rounded-lg hover:bg-[#F2F6EF] cursor-pointer"
              >
                Review in HR Portal
              </button>
              <button
                onClick={() => setHrNotificationBanner(null)}
                className="p-1 text-[#BACBBF] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Content */}
      <main className="flex-1">
        
        {/* HR Organisational Insights & Report Management Portal */}
        {userRole === 'hr' || activeTab === 'hr' ? (
          <HrOrganisationalPortal
            records={records}
            onUpdateRecord={handleUpdateRecord}
            onOpenOfflineModal={() => setShowOfflineModal(true)}
            onOpenIntegrationsModal={() => setShowIntegrationsModal(true)}
          />
        ) : (
          <>
            {/* Render Hero Banner on Organise */}
            {activeTab === 'organise' && (
              <HeroBanner
                records={records}
                onStartDocumentation={() => setActiveTab('document')}
                onOpenVault={() => {
                  const el = document.getElementById('vault-content-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenOfflineModal={() => setShowOfflineModal(true)}
                onOpenIntegrationsModal={() => setShowIntegrationsModal(true)}
              />
            )}

            {/* Tab 1: Document - Guided Incident Reporting */}
            {activeTab === 'document' && (
              <DocumentWizard
                onSaveRecord={handleSaveNewRecord}
                onCancel={() => setActiveTab('organise')}
              />
            )}

            {/* Tab 2: Organise - My Report Log */}
            {activeTab === 'organise' && (
              <div id="vault-content-section">
                <OrganiseVault
                  records={records}
                  onSelectRecord={record => {
                    setSelectedRecordId(record.id);
                    setActiveTab('manage');
                  }}
                  onNewIncident={() => setActiveTab('document')}
                  onSubmitToHr={record => {
                    setSelectedRecordId(record.id);
                    setActiveTab('manage');
                  }}
                  onOpenOfflineModal={() => setShowOfflineModal(true)}
                />
              </div>
            )}

            {/* Tab 3: Manage & Export */}
            {activeTab === 'manage' && (
              <div>
                {currentSelectedRecord ? (
                  <ManageDossier
                    record={currentSelectedRecord}
                    onUpdateRecord={handleUpdateRecord}
                    onDeleteRecord={handleDeleteRecord}
                    onBack={() => setActiveTab('organise')}
                    onSubmitToHr={handleSubmitToHr}
                  />
                ) : (
                  <div className="max-w-4xl mx-auto py-16 text-center">
                    <p className="text-sm text-[#5C6E5F] mb-4">No record selected to inspect.</p>
                    <button
                      onClick={() => setActiveTab('organise')}
                      className="px-4 py-2 bg-[#2D4335] text-white text-xs font-semibold rounded-lg"
                    >
                      Return to Report Log
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Reflect */}
            {activeTab === 'reflect' && (
              <ReflectAnalyzer
                records={records}
                onStartDocumentation={() => setActiveTab('document')}
              />
            )}

            {/* Tab 5: Decide */}
            {activeTab === 'decide' && (
              <DecidePathways
                onOpenVault={() => setActiveTab('organise')}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#DFE7DB] bg-white py-6 px-4 lg:px-8 text-xs text-[#5D6F60]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-[#1C261E]">Dignifi</span>
            <span aria-hidden="true">·</span>
            <span>Version 22 Localhost Sandbox</span>
            <span aria-hidden="true">·</span>
            <span>South African Labour Framework & Records Integrity</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowIntegrationsModal(true)}
              className="hover:text-[#1C261E] transition-colors cursor-pointer"
            >
              Surveillance Exclusion Architecture
            </button>
            <button
              onClick={() => setShowOfflineModal(true)}
              className="hover:text-[#1C261E] transition-colors cursor-pointer font-semibold text-[#2D4335]"
            >
              Offline Deployment Suite
            </button>
            <button
              onClick={() => setIsQuickExitActive(true)}
              className="text-[#8B3A2B] hover:text-[#702E22] transition-colors cursor-pointer"
            >
              Disguise Screen (ESC)
            </button>
          </div>
        </div>
      </footer>

      {/* Offline Deployment Suite Modal */}
      {showOfflineModal && (
        <OfflineDeploymentModal onClose={() => setShowOfflineModal(false)} />
      )}

      {/* Integrations & Surveillance Exclusion Modal */}
      {showIntegrationsModal && (
        <IntegrationsModal onClose={() => setShowIntegrationsModal(false)} />
      )}

    </div>
  );
}
