import React from 'react';
import { ShieldCheck, EyeOff, Lock, UserCheck, HardDriveDownload, LogOut, User } from 'lucide-react';
import { DignifiLogo } from './DignifiLogo';

interface HeaderProps {
  activeTab: 'document' | 'organise' | 'manage' | 'reflect' | 'decide' | 'hr';
  setActiveTab: (tab: 'document' | 'organise' | 'manage' | 'reflect' | 'decide' | 'hr') => void;
  userRole: 'employee' | 'hr';
  setUserRole: (role: 'employee' | 'hr') => void;
  onQuickExit: () => void;
  onOpenOfflineModal: () => void;
  hrUnreadCount: number;
  currentUser?: { username: string; email: string; role?: 'employee' | 'hr' } | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onQuickExit,
  onOpenOfflineModal,
  hrUnreadCount,
  currentUser,
  onSignOut,
}) => {
  const isHrMode = userRole === 'hr';

  return (
    <header className="sticky top-0 z-40 bg-[#F8F9F5]/90 backdrop-blur-md border-b border-[#E2E8DC] px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark with speech bubble dot on the last i */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab(isHrMode ? 'hr' : 'organise')}
            className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer"
          >
            <DignifiLogo size="sm" />
          </button>
          {isHrMode && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAEFE6] text-[#2D4335] border border-[#CCD7C8]">
              <ShieldCheck className="w-3 h-3 text-[#2D4335]" />
              HR Portal
            </span>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[#576458]">
          {!isHrMode ? (
            <>
              <button
                onClick={() => setActiveTab('document')}
                className={`whitespace-nowrap transition-colors py-1 hover:text-[#1C261E] cursor-pointer ${
                  activeTab === 'document' ? 'text-[#1C261E] font-semibold border-b-2 border-[#2D4335]' : ''
                }`}
              >
                1. Report Incident
              </button>
              <button
                onClick={() => setActiveTab('organise')}
                className={`whitespace-nowrap transition-colors py-1 hover:text-[#1C261E] cursor-pointer ${
                  activeTab === 'organise' ? 'text-[#1C261E] font-semibold border-b-2 border-[#2D4335]' : ''
                }`}
              >
                2. My Report Log
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`whitespace-nowrap transition-colors py-1 hover:text-[#1C261E] cursor-pointer ${
                  activeTab === 'manage' ? 'text-[#1C261E] font-semibold border-b-2 border-[#2D4335]' : ''
                }`}
              >
                3. Manage & Export
              </button>
              <button
                onClick={() => setActiveTab('reflect')}
                className={`whitespace-nowrap transition-colors py-1 hover:text-[#1C261E] cursor-pointer ${
                  activeTab === 'reflect' ? 'text-[#1C261E] font-semibold border-b-2 border-[#2D4335]' : ''
                }`}
              >
                4. Reflect
              </button>
              <button
                onClick={() => setActiveTab('decide')}
                className={`whitespace-nowrap transition-colors py-1 hover:text-[#1C261E] cursor-pointer ${
                  activeTab === 'decide' ? 'text-[#1C261E] font-semibold border-b-2 border-[#2D4335]' : ''
                }`}
              >
                5. Decide (SA Law)
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#2D4335] bg-[#EAEFE6] px-3 py-1 rounded-lg">
                Organisational Insights & Report Management Portal
              </span>
            </div>
          )}
        </nav>

        {/* Zone 3: Primary Action & Quick Safe Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenOfflineModal}
            title="Download Dignifi Complete Source Code ZIP, Version 22 HTML & Python Script"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D4335] bg-[#EAEFE6] hover:bg-[#DFE7DA] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer border border-[#CCD7C8]"
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Download / Source Code</span>
          </button>

          <button
            onClick={() => {
              const nextRole = userRole === 'employee' ? 'hr' : 'employee';
              setUserRole(nextRole);
              if (nextRole === 'hr') setActiveTab('hr');
              else if (activeTab === 'hr') setActiveTab('organise');
            }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#D5DFD1] bg-white text-[#2D4335] hover:bg-[#F3F7F0] transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            {userRole === 'employee' ? (
              <>
                <Lock className="w-3.5 h-3.5 text-[#4D6652]" />
                <span className="hidden sm:inline">Switch to</span> HR Portal
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-[#2D4335]" />
                <span className="hidden sm:inline">Switch to</span> Employee Workspace
              </>
            )}
          </button>

          {currentUser && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#EEF2EB] rounded-lg text-xs text-[#2D4335]">
              <User className="w-3.5 h-3.5 text-[#455D4A]" />
              <span className="font-semibold max-w-[110px] truncate">{currentUser.username}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white font-mono uppercase text-[#47604B]">
                {currentUser.role || userRole}
              </span>
            </div>
          )}

          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out of Session"
              className="p-1.5 text-[#5C6E5F] hover:text-[#8B3A2B] rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onQuickExit}
            title="Immediately disguise screen (Keyboard shortcut: ESC)"
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#8B3A2B] hover:bg-[#742F22] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Quick Exit (Esc)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
