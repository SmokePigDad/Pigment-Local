#!/usr/bin/env python3
"""
Simple HTTP Server for Pollinations AI Image Generator
This server eliminates CORS issues by serving the HTML file over HTTP instead of file://

Usage:
    python server.py

Then open: http://localhost:8080
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

API_KEY = "8Y0FENivy7biCblv"
class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        super().__init__(*args, directory=str(Path(__file__).parent), **kwargs)
    
    def end_headers(self):
        # Add CORS headers to allow external requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_GET(self):
        # Redirect root to pig.html
        if self.path == '/':
            self.path = '/pig.html'
        return super().do_GET()

def main():
    PORT = 8088
    
    print("🎨 Pollinations AI Image Generator Server")
    print("=" * 50)
    print(f"Starting server on port {PORT}")
    print(f"Open your browser and go to: http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"Server running at http://localhost:{PORT}/")
            
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print("Browser opened automatically")
            except:
                print("Could not open browser automatically")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use. Try a different port or stop the existing server.")
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    main()
