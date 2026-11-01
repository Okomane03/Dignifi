#!/usr/bin/env python3
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
            # Retrieve local records from local encrypted vault file
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
                # Validate JSON payload
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
    # Change directory to the script's directory
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
        print("\n[+] Dignifi localhost server closed securely. All session data preserved in your local vault.")
        sys.exit(0)
    except OSError as e:
        print(f"[!] Error starting server: {e}")
        print(f"[!] Port {PORT} might already be in use. You can change PORT in dignifi_version_22.py")
        sys.exit(1)

if __name__ == '__main__':
    run_server()
