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
        # Define allowed origins for CORS
        # http://localhost and http://127.0.0.1 are for local development
        # https://preview.example.com is the default preview domain
        # The preview domain can be overridden by the PREVIEW_DOMAIN environment variable
        ALLOWED_ORIGINS = {
            "http://localhost",
            "http://127.0.0.1",
            "https://preview.example.com"
        }
        
        preview_domain = os.environ.get("PREVIEW_DOMAIN")
        if preview_domain:
            ALLOWED_ORIGINS.add(preview_domain)

        origin = self.headers.get('Origin')
        if origin and origin in ALLOWED_ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin)
        else:
            # For origins not in ALLOWED_ORIGINS, do not send Access-Control-Allow-Origin header
            # This effectively denies CORS for unlisted origins.
            pass # No header sent

        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_GET(self):
        # Redirect root to pig.html
        if self.path == '/':
            self.path = '/pig.html'
        
        # Prevent serving sensitive files
        # This is a basic check and should be enhanced for production
        if '..' in self.path or self.path.startswith('/..'):
            self.send_error(403, "Forbidden")
            return
        
        # List of allowed file extensions for static serving
        allowed_extensions = ('.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp')
        
        # List of explicitly forbidden files/directories (case-insensitive)
        forbidden_paths = (
            '.env', 'server.py', 'roadmap.md', 'project_tasks.md', '.git', 'config', # Add other sensitive files/dirs as needed
        )

        # Check for path traversal attempts and forbidden paths
        normalized_path = self.path.lower().lstrip('/')
        if '..' in normalized_path or any(forbidden in normalized_path for forbidden in forbidden_paths):
            self.send_error(403, "Forbidden: Access to sensitive files or directories is denied.")
            return
        
        # If the path is not the root and doesn't end with an allowed extension, deny access
        if not any(normalized_path.endswith(ext) for ext in allowed_extensions) and normalized_path != 'pig.html':
            self.send_error(403, "Unsupported file type or sensitive file access denied.")
            return

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
