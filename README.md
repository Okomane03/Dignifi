# Dignifi — Workplace Dignity & Incident Documentation OS

> **Privacy-conscious, employee-centred digital workspace designed to document, organise, reflect, and decide on workplace experiences and conduct, with complete user agency, zero employer tracking, and an integrated non-judicial HR case management portal.**

---

## 🌟 Live Working Tool URLs

* **Shared Live Application (Evaluators & Users):**  
  [https://ais-pre-skek5br3oou5qbw4jjmtv4-608278544154.europe-west3.run.app](https://ais-pre-skek5br3oou5qbw4jjmtv4-608278544154.europe-west3.run.app)

* **Development Application:**  
  [https://ais-dev-skek5br3oou5qbw4jjmtv4-608278544154.europe-west3.run.app](https://ais-dev-skek5br3oou5qbw4jjmtv4-608278544154.europe-west3.run.app)

* **Direct Source Code ZIP Download:**  
  [https://ais-pre-skek5br3oou5qbw4jjmtv4-608278544154.europe-west3.run.app/dignifi-source-code.zip](https://ais-pre-skek5br3oou5qbw4jjmtv4-608278544154.europe-west3.run.app/dignifi-source-code.zip)

*(Both live URLs are hosted on Google Cloud Run and will remain live beyond 13 November).*

---

## 📦 What Is Included In This Repository

This repository contains the complete source code for **Dignifi**:

1. **Full React 19 + TypeScript + Tailwind CSS Frontend Application**  
   - Complete multi-step incident documentation wizard (Who, What, When, Where, Impact, Context)
   - Secure personal vault with client-side encrypted storage
   - Reflective questioning engine (neutral non-judgmental prompts)
   - South African legal pathways guidance (CCMA 7.11 form builder, EEA Section 60, 2022 Harassment Code, Labour Relations Act)
   - **HR Organisational Insights & Case Management Portal** with 7-stage non-judicial administrative lifecycle tracker (`DIG-KK8G-N5A9` demonstration case included)
   - Dual-role authentication dashboard with strict password criteria and role-based access

2. **Dignifi Version 22 Offline Suite (Air-Gapped Localhost)**  
   - `public/Dignifi_Version_22.html`: Standalone, self-contained single-file HTML5/JS app that runs in any browser with zero installation.
   - `public/dignifi_version_22.py`: Zero-dependency Python 3 standard library server that serves Dignifi on `http://localhost:8022` and stores records locally in `dignifi_local_vault.json`.

3. **No Hardcoded API Keys or Secrets**  
   - Fully compliant with zero-leakage security.
   - Configuration is handled through `.env.example`.

---

## 🚀 Quick Start: Running the Full Application Locally (Method 1 - Node.js)

### Prerequisites
* **Node.js**: Version 18.x or higher (Node 20+ recommended)
* **npm** (comes with Node.js) or **bun** or **yarn**

### Steps:

1. **Clone or Extract the Repository:**
   ```bash
   # If you downloaded the ZIP file:
   unzip dignifi-source-code.zip
   cd dignifi-source-code
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   ```bash
   cp .env.example .env
   ```
   *Note: Dignifi does not require third-party paid API keys to function; all incident workflows, vaults, CCMA dossier generation, and HR case portals operate 100% out of the box.*

4. **Launch the Local Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Your Browser:**  
   Navigate to:
   ```
   http://localhost:3000
   ```

---

## ⚡ Quick Start: Running the Offline Testing Suite (Method 2 - Python 3 Zero-Dependencies)

If you need a rapid, lightweight, air-gapped deployment with zero `npm` installation:

1. **Ensure Python 3 is Installed:**
   ```bash
   python3 --version
   ```

2. **Run the Version 22 Python Script:**
   ```bash
   cd public
   python3 dignifi_version_22.py
   ```

3. **Automatic Launch:**
   * The script spins up a local HTTP server on `http://localhost:8022` and automatically opens your default browser.
   * Incident records are encrypted and saved directly to `dignifi_local_vault.json` in that directory.

---

## 🌐 Quick Start: Direct Browser Testing (Method 3 - Standalone HTML)

1. Navigate to the `public/` directory.
2. Double-click `Dignifi_Version_22.html`.
3. It opens directly in Chrome, Edge, Safari, or Firefox without any server. Records persist in your browser's private `localStorage`.

---

## 🔐 Authentication & Roles

* **Employee Workspace:**  
  - Document incidents with contemporaneous timestamps, involved parties, and perceived impact.
  - Generate CCMA Form 7.11 dispute summaries and download tamper-evident JSON/PDF dossiers.
  - Submit reports to HR deliberately through authorized encrypted pathways.
  - Track case status anonymously via tracking token (e.g. `DIG-KK8G-N5A9`).

* **HR Organisational Insights Portal:**  
  - Access by clicking **HR Portal** in the navigation bar.
  - Review received reports (only those deliberately submitted by employees).
  - Search by tracking token or filter by stage/urgency.
  - Progress cases through the **7-Stage Case Administrative Lifecycle (Non-Judicial Tracker)** under the 2022 Code of Good Practice on Harassment.
  - Dispatch encrypted official notices back to the employee's tracking token.

---

## 🏛️ Legal & Compliance Framework

Dignifi is specifically calibrated to South African workplace standards:
* **Employment Equity Act (EEA) No. 55 of 1998 (Section 60):** Proactive employer liability and duty to consult/address reported harassment.
* **2022 Code of Good Practice on the Prevention and Elimination of Harassment in the Workplace:** Definitions of bullying, harassment, sexual harassment, intimidation, and hostile work environments.
* **Labour Relations Act (LRA) No. 66 of 1995:** Preserving contemporaneous evidence for CCMA conciliation and arbitration.
* **Protection of Personal Information Act (POPIA) No. 4 of 2013:** Privacy-by-design, data minimisation, and complete employee data sovereignty.

---

## 📄 License & Distribution

Developed for privacy-conscious workplace dignity and dispute resolution. Free for employee protection and organisational compliance testing.
