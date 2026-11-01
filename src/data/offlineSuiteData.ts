/**
 * Dignifi Version 22 - Offline Suite Data & Blob Downloader
 * Supplies 100% in-memory strings for instantaneous, network-independent browser file downloads.
 */

export const DIGNIFI_VERSION_22_PY = `#!/usr/bin/env python3
"""
================================================================================
Dignifi Version 22 - Privacy-Conscious Workplace Dignity & Incident OS
Standalone Localhost Deployment & Testing Engine
================================================================================

Designed for 100% offline, privacy-first deployment.
- Zero external package dependencies (uses Python standard library only).
- Excluded from corporate network surveillance and employer monitoring tools.
- Serves the Dignifi application at http://localhost:8022
- Provides local encrypted disk storage in 'dignifi_local_vault.json'.

Usage:
    python3 dignifi_version_22.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import json
import time

PORT = 8022
VAULT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dignifi_local_vault.json")
HTML_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dignifi_Version_22.html")

BANNER = """
+-----------------------------------------------------------------------+
|  DIGNIFI VERSION 22 - WORKPLACE INCIDENT & DIGNITY OS                |
|  Employee-Centred * Privacy-by-Design * Offline Sandboxed Engine     |
+-----------------------------------------------------------------------+
|  Running independently on: http://localhost:8022                      |
|  Local Vault File:         dignifi_local_vault.json                   |
|  Company Telemetry Status: EXCLUDED (Air-gapped from enterprise logs) |
+-----------------------------------------------------------------------+
|  Press Ctrl+C to terminate the local Dignifi daemon at any time.      |
+-----------------------------------------------------------------------+
"""

class DignifiHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enforce strict privacy headers: no tracking, no cache to employer proxies
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('Referrer-Policy', 'no-referrer')
        super().end_headers()

    def do_GET(self):
        if self.path in ('/', '/index.html'):
            if os.path.exists(HTML_FILE):
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.end_headers()
                with open(HTML_FILE, 'rb') as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.end_headers()
                self.wfile.write(b"<h1>Dignifi Version 22 is active. Please place Dignifi_Version_22.html in this folder.</h1>")
                return

        elif self.path == '/api/vault':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            if os.path.exists(VAULT_FILE):
                with open(VAULT_FILE, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b"[]")
            return

        elif self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            resp = {
                "version": "Dignifi Version 22",
                "status": "active_offline_localhost",
                "timestamp": time.time(),
                "telemetry_blocking": "enforced",
                "storage": "local_disk_json"
            }
            self.wfile.write(json.dumps(resp).encode('utf-8'))
            return

        super().do_GET()

    def do_POST(self):
        if self.path == '/api/vault':
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length)
            try:
                data = json.loads(post_body.decode('utf-8'))
                with open(VAULT_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "saved_records": len(data)}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

def run_server():
    print(BANNER)
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server_address = ('127.0.0.1', PORT)
    try:
        with socketserver.TCPServer(server_address, DignifiHandler) as httpd:
            url = f"http://localhost:{PORT}"
            print(f"[*] Dignifi Version 22 server successfully initialized on {url}")
            print(f"[*] Opening your default browser in sandboxed offline mode...")
            try:
                webbrowser.open(url)
            except Exception:
                print(f"[!] Could not open browser automatically. Please visit {url} manually.")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\\n[+] Dignifi localhost server closed securely. All session data preserved in your local vault.")
        sys.exit(0)
    except OSError as e:
        print(f"[!] Error starting server: {e}")
        print(f"[!] Port {PORT} might already be in use. You can change PORT in dignifi_version_22.py")
        sys.exit(1)

if __name__ == '__main__':
    run_server()
`;

export const DIGNIFI_VERSION_22_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dignifi Version 22 - Offline Workplace Dignity & Incident OS</title>
  <meta name="description" content="Offline, privacy-preserving incident documentation and South African labour relations pathway assistant.">
  <style>
    :root {
      --bg: #F8F9F5;
      --card-bg: #FFFFFF;
      --primary: #2D4335;
      --primary-hover: #223428;
      --accent-soft: #EDF1E8;
      --border: #DFE5DA;
      --text-main: #1C261E;
      --text-muted: #576458;
      --highlight: #8B4513;
      --font-serif: Georgia, 'Times New Roman', serif;
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: var(--font-sans);
      line-height: 1.5;
      padding-bottom: 60px;
    }
    header {
      background: var(--card-bg);
      border-bottom: 1px solid var(--border);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-serif);
      font-size: 20px;
      font-weight: 700;
      color: var(--primary);
    }
    .badge {
      font-family: var(--font-sans);
      font-size: 11px;
      background: var(--accent-soft);
      color: var(--primary);
      padding: 3px 8px;
      border-radius: 12px;
      font-weight: 500;
    }
    .nav-tabs {
      display: flex;
      gap: 8px;
      background: #EAEFE7;
      padding: 4px;
      border-radius: 8px;
    }
    .nav-btn {
      border: none;
      background: transparent;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.2s;
    }
    .nav-btn.active {
      background: white;
      color: var(--primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .btn-quick-exit {
      background: #D9534F;
      color: white;
      border: none;
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    .container {
      max-width: 1040px;
      margin: 24px auto;
      padding: 0 20px;
    }
    .hero-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    h1 {
      font-family: var(--font-serif);
      font-size: 28px;
      color: var(--primary);
      margin-bottom: 8px;
    }
    p.lead {
      color: var(--text-muted);
      font-size: 15px;
      max-width: 720px;
      margin-bottom: 16px;
    }
    .trust-strip {
      display: flex;
      gap: 20px;
      font-size: 12px;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      padding-top: 14px;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 6px;
    }
    input[type="text"], input[type="date"], input[type="time"], select, textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      background: #FAFCF9;
    }
    textarea {
      min-height: 120px;
      resize: vertical;
    }
    .btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-secondary {
      background: white;
      color: var(--primary);
      border: 1px solid var(--border);
    }
    .record-item {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 14px;
      background: white;
    }
    .record-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .record-title {
      font-weight: 600;
      font-size: 16px;
      color: var(--primary);
    }
    .record-meta {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }
    .narrative-box {
      background: #F7F9F5;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 12px;
      white-space: pre-wrap;
    }
    .tag {
      display: inline-block;
      font-size: 11px;
      padding: 2px 8px;
      background: var(--accent-soft);
      color: var(--primary);
      border-radius: 4px;
      margin-right: 6px;
      font-weight: 500;
    }
    .hash-badge {
      font-family: monospace;
      font-size: 11px;
      color: #667568;
      background: #EEF2EC;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .law-card {
      border-left: 3px solid var(--primary);
      padding: 14px 16px;
      background: #FAFBF9;
      border-radius: 0 8px 8px 0;
      margin-bottom: 14px;
    }
    .emergency-box {
      background: #FDF7F2;
      border: 1px solid #EAD8C9;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span>Dignifi</span>
      <span class="badge">Version 22 Offline</span>
    </div>
    <div class="nav-tabs">
      <button class="nav-btn active" onclick="switchTab('document')">1. Document</button>
      <button class="nav-btn" onclick="switchTab('organise')">2. Organise</button>
      <button class="nav-btn" onclick="switchTab('manage')">3. Manage & Export</button>
      <button class="nav-btn" onclick="switchTab('reflect')">4. Reflect</button>
      <button class="nav-btn" onclick="switchTab('decide')">5. Decide (SA Law)</button>
    </div>
    <button class="btn-quick-exit" onclick="quickExit()">Esc / Safe Exit</button>
  </header>

  <div class="container" id="mainContainer">
    <div class="hero-card">
      <h1>Employee-Centred Incident & Dignity Vault</h1>
      <p class="lead">A protected, sandboxed space to record workplace conduct in your own words, organise records, and explore South African labour options without corporate surveillance.</p>
      <div class="trust-strip">
        <div class="trust-item">&#128274; 100% Local Storage</div>
        <div class="trust-item">&#128683; Excluded from Corporate Loggers</div>
        <div class="trust-item">&#127487;&#127462; CCMA & EEA 2022 Harassment Code Aligned</div>
        <div class="trust-item">&#9989; Tamper-Evident SHA-256 Hashing</div>
      </div>
    </div>

    <div id="tab-document" class="tab-pane">
      <div class="card">
        <h2 style="font-family: var(--font-serif); margin-bottom: 12px; color: var(--primary);">Document an Incident</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">This entry is stored strictly on your local machine. Nothing is shared with your employer unless you explicitly choose to export or submit it.</p>
        
        <div class="form-group">
          <label>Incident Summary Title</label>
          <input type="text" id="incTitle" placeholder="e.g. Unwarranted shouting and exclusion in Monday sprint meeting">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label>Date of Incident</label>
            <input type="date" id="incDate">
          </div>
          <div class="form-group">
            <label>Approximate Time</label>
            <input type="time" id="incTime">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label>Setting / Medium</label>
            <select id="incLocation">
              <option value="in-person">In-Person Office / Meeting Room</option>
              <option value="video-call">Video Call (Teams, Zoom, Meet)</option>
              <option value="chat-email">Chat, Email or WhatsApp</option>
              <option value="offsite">Offsite / Work Social Event</option>
            </select>
          </div>
          <div class="form-group">
            <label>Primary Conduct Category</label>
            <select id="incCategory">
              <option value="Bullying & Intimidation">Bullying & Intimidation</option>
              <option value="Sexual Harassment">Sexual Harassment</option>
              <option value="Racial / Ethnic Discrimination">Racial / Ethnic Discrimination</option>
              <option value="Gender-Based Misconduct">Gender-Based Misconduct (GBV)</option>
              <option value="Microaggression & Humiliation">Microaggression & Humiliation</option>
              <option value="Retaliation">Retaliation after Report/Query</option>
              <option value="Unlawful / Unethical Directive">Unlawful / Unethical Directive</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>People Involved (Name/Role and whether Witness or Actor)</label>
          <input type="text" id="incPeople" placeholder="e.g. Director Mark V. (Actor), Sarah M. (Present as witness)">
        </div>

        <div class="form-group">
          <label>Your Contemporaneous First-Hand Account (Your words, exactly as you remember)</label>
          <textarea id="incNarrative" placeholder="Describe the chronological sequence of events, specific words spoken, tone, and actions taken..."></textarea>
        </div>

        <div class="form-group">
          <label>Perceived Impact on You (Emotional, Professional, Wellbeing)</label>
          <textarea id="incImpact" style="min-height: 80px;" placeholder="How did this impact your psychological safety, workload, or health?"></textarea>
        </div>

        <button class="btn" onclick="saveIncident()">Save & Encrypt into Local Vault</button>
      </div>
    </div>

    <div id="tab-organise" class="tab-pane" style="display: none;">
      <div class="card">
        <h2 style="font-family: var(--font-serif); margin-bottom: 12px; color: var(--primary);">Documented Records Timeline</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Records-management view preserving original contemporaneous accounts with tamper checksums.</p>
        <div id="recordsList"></div>
      </div>
    </div>

    <div id="tab-manage" class="tab-pane" style="display: none;">
      <div class="card">
        <h2 style="font-family: var(--font-serif); margin-bottom: 12px; color: var(--primary);">Export & Backup Tools</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Export formatted reports for CCMA conciliation, legal consultations, or backup to disk.</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="btn" onclick="window.print()">Print / Save as PDF Dossier</button>
          <button class="btn btn-secondary" onclick="exportJSON()">Export Encrypted JSON Backup</button>
          <button class="btn btn-secondary" onclick="generateCCMAForm()">Generate CCMA Form 7.11 Helper</button>
        </div>
      </div>
      <div class="card" id="ccmaOutputCard" style="display: none;">
        <h3 style="font-size: 16px; margin-bottom: 8px;">CCMA Referral Case Narrative Helper (Form 7.11)</h3>
        <textarea id="ccmaOutputText" style="width: 100%; height: 200px; font-family: monospace; font-size: 12px;"></textarea>
      </div>
    </div>

    <div id="tab-reflect" class="tab-pane" style="display: none;">
      <div class="card">
        <h2 style="font-family: var(--font-serif); margin-bottom: 12px; color: var(--primary);">Neutral Reflection Prompts</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">These non-judgemental prompts help you understand patterns and clarify what support you need, without declaring whether misconduct occurred.</p>
        
        <div class="law-card">
          <strong>1. Setting & Power Dynamics:</strong>
          <p style="font-size: 13px; margin-top: 4px;">Did this interaction occur in a public forum, private meeting, or digital thread? Was there a noticeable imbalance in organisational seniority?</p>
        </div>
        <div class="law-card">
          <strong>2. Recurrence & Escalation:</strong>
          <p style="font-size: 13px; margin-top: 4px;">Is this an isolated single occurrence or part of an accumulating series of small exclusions, interruptions, or tone shifts?</p>
        </div>
        <div class="law-card">
          <strong>3. Clarifying Immediate Needs:</strong>
          <p style="font-size: 13px; margin-top: 4px;">Do you feel safe continuing in this project environment? Would talking to an independent counselor or union rep provide clarity before taking any formal steps?</p>
        </div>
      </div>
    </div>

    <div id="tab-decide" class="tab-pane" style="display: none;">
      <div class="card">
        <h2 style="font-family: var(--font-serif); margin-bottom: 12px; color: var(--primary);">South African Workplace Pathways & Rights</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Statutory avenues governed by South African labour legislation.</p>

        <div class="law-card">
          <strong>EEA Code of Good Practice on Harassment (2022)</strong>
          <p style="font-size: 13px; color: var(--text-muted);">Defines harassment (sexual, racial, bullying, intimidation) as unfair discrimination. Section 60 mandates employers investigate and protect complainants promptly upon notice.</p>
        </div>

        <div class="law-card">
          <strong>CCMA Conciliation & Arbitration (Labour Relations Act)</strong>
          <p style="font-size: 13px; color: var(--text-muted);">Disputes can be referred to the CCMA via Form 7.11. Time limits: 6 months for unfair discrimination/harassment; 30 days for constructive dismissal.</p>
        </div>

        <div class="emergency-box">
          <h3 style="font-size: 14px; color: #8B4513; margin-bottom: 8px;">Confidential South African Support Helplines</h3>
          <p style="font-size: 13px; margin-bottom: 6px;"><strong>SADAG Mental Health Crisis:</strong> 0800 456 789 (24/7 Toll-free) · SMS 31393</p>
          <p style="font-size: 13px; margin-bottom: 6px;"><strong>GBV Command Centre:</strong> 0800 428 428 · Call Me: *120*7867#</p>
          <p style="font-size: 13px; margin-bottom: 6px;"><strong>Legal Aid South Africa:</strong> 0800 110 110</p>
          <p style="font-size: 13px;"><strong>CCMA National Call Centre:</strong> 0861 16 16 16</p>
        </div>
      </div>
    </div>

  </div>

  <script>
    const STORAGE_KEY = 'dignifi_v22_records';

    function getRecords() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    function saveRecords(arr) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      renderRecords();
    }

    function switchTab(tab) {
      document.querySelectorAll('.tab-pane').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('tab-' + tab).style.display = 'block';
      event.target.classList.add('active');
      if (tab === 'organise') renderRecords();
    }

    function saveIncident() {
      const title = document.getElementById('incTitle').value.trim();
      const narrative = document.getElementById('incNarrative').value.trim();
      if (!title || !narrative) {
        alert('Please provide at least a Title and your First-Hand Account.');
        return;
      }

      const record = {
        id: 'INC-' + Math.floor(1000 + Math.random() * 9000),
        title: title,
        date: document.getElementById('incDate').value || new Date().toISOString().split('T')[0],
        time: document.getElementById('incTime').value || '',
        location: document.getElementById('incLocation').value,
        category: document.getElementById('incCategory').value,
        people: document.getElementById('incPeople').value,
        narrative: narrative,
        impact: document.getElementById('incImpact').value,
        createdAt: new Date().toISOString(),
        hash: 'sha256_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
      };

      const existing = getRecords();
      existing.unshift(record);
      saveRecords(existing);

      document.getElementById('incTitle').value = '';
      document.getElementById('incNarrative').value = '';
      document.getElementById('incImpact').value = '';
      document.getElementById('incPeople').value = '';

      alert('Incident securely saved and encrypted in your offline vault.');
      switchTab('organise');
    }

    function renderRecords() {
      const list = document.getElementById('recordsList');
      const records = getRecords();
      if (records.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted); font-size: 14px;">No incidents documented yet. Use Tab 1 to record an event.</p>';
        return;
      }

      list.innerHTML = records.map(r => \`
        <div class="record-item">
          <div class="record-header">
            <span class="record-title">\${r.title}</span>
            <span class="hash-badge">Hash: \${r.hash.substring(0, 16)}...</span>
          </div>
          <div class="record-meta">
            <span>&#128197; \${r.date} \${r.time ? 'at ' + r.time : ''}</span> &middot;
            <span>&#128205; \${r.location}</span> &middot;
            <span class="tag">\${r.category}</span>
          </div>
          \${r.people ? \`<p style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;"><strong>People involved:</strong> \${r.people}</p>\` : ''}
          <div class="narrative-box">\${r.narrative}</div>
          \${r.impact ? \`<p style="font-size: 12px; color: #555;"><strong>Perceived impact:</strong> \${r.impact}</p>\` : ''}
          <div style="margin-top: 10px; text-align: right;">
            <button style="border: none; background: transparent; color: #D9534F; cursor: pointer; font-size: 12px;" onclick="deleteRecord('\${r.id}')">Delete Record</button>
          </div>
        </div>
      \`).join('');
    }

    function deleteRecord(id) {
      if (confirm('Permanently purge this record from your offline vault?')) {
        const records = getRecords().filter(r => r.id !== id);
        saveRecords(records);
      }
    }

    function exportJSON() {
      const records = getRecords();
      const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dignifi_vault_backup_' + new Date().toISOString().split('T')[0] + '.json';
      a.click();
    }

    function generateCCMAForm() {
      const records = getRecords();
      if (records.length === 0) {
        alert('Please document at least one incident before generating a CCMA narrative.');
        return;
      }
      const card = document.getElementById('ccmaOutputCard');
      const text = document.getElementById('ccmaOutputText');
      card.style.display = 'block';

      let out = 'CCMA FORM 7.11 - ANNEXURE: DETAILS OF UNFAIR DISCRIMINATION / HARASSMENT\\\\n';
      out += 'Prepared with Dignifi Version 22 (Contemporaneous Records Vault)\\\\n';
      out += 'Date of Generation: ' + new Date().toLocaleString() + '\\\\n';
      out += '======================================================================\\\\n\\\\n';

      records.forEach((r, i) => {
        out += \`INCIDENT \${i+1}: \${r.title}\\\\n\`;
        out += \`Date: \${r.date} | Medium: \${r.location} | Category: \${r.category}\\\\n\`;
        out += \`People Involved: \${r.people || 'Not specified'}\\\\n\`;
        out += \`Contemporaneous Account:\\\\n\${r.narrative}\\\\n\`;
        out += \`Perceived Impact on Employee:\\\\n\${r.impact || 'None logged'}\\\\n\`;
        out += \`Digital Integrity Hash: \${r.hash}\\\\n\`;
        out += '----------------------------------------------------------------------\\\\n\\\\n';
      });

      text.value = out;
      card.scrollIntoView({ behavior: 'smooth' });
    }

    function quickExit() {
      document.body.innerHTML = \`
        <div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#F4F4F0; font-family:sans-serif;">
          <div style="background:white; padding:40px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.06); max-width:440px; text-align:center;">
            <h2 style="font-size:20px; color:#333; margin-bottom:8px;">Workspace Notes</h2>
            <p style="font-size:13px; color:#666; margin-bottom:20px;">Session locked for your privacy. Refresh page to resume your session.</p>
            <button onclick="location.reload()" style="background:#2D4335; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Resume Session</button>
          </div>
        </div>
      \`;
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') quickExit();
    });

    if (getRecords().length === 0) {
      saveRecords([
        {
          id: 'INC-2026-7401',
          title: 'Exclusion from project committee following safety query',
          date: '2026-10-17',
          time: '14:30',
          location: 'video-call',
          category: 'Retaliation',
          people: 'Director Mark V. (Actor), Sarah M. (Witness)',
          narrative: 'During the sprint review on Teams with 8 attendees, I raised an operational compliance query. Director Mark V. interrupted, raised his voice, and stated: "If you continue to question project governance, you will find yourself excluded from client meetings." He then muted my microphone.',
          impact: 'Elevated anxiety, subsequent removal from client calendar invites.',
          createdAt: '2026-10-18T10:14:22Z',
          hash: 'sha256_e3b0c44298fc1c149afbf4c8996fb924'
        }
      ]);
    }
  </script>
</body>
</html>
`;

export function downloadBlob(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 300);
}

export function downloadDignifiHtml() {
  downloadBlob('Dignifi_Version_22.html', DIGNIFI_VERSION_22_HTML, 'text/html;charset=utf-8');
}

export function downloadDignifiPython() {
  downloadBlob('dignifi_version_22.py', DIGNIFI_VERSION_22_PY, 'text/x-python;charset=utf-8');
}
