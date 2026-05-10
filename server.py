import http.server
import socketserver
import json
import time
import os

try:
    from groq import Groq
    HAS_GROQ = True
    api_key = os.environ.get("GROQ_API_KEY", "")
    client = Groq(api_key=api_key)
except ImportError:
    HAS_GROQ = False

PORT = 8000

class QuantXHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/news':
            news_data = [
                {
                    "id": 1,
                    "title": "S&P 500 Surges Past 6,500 Milestone as 'Agentic AI' Productivity Hits Bottom Lines",
                    "snippet": "Major indices hit fresh records as Q1 2026 earnings demonstrate a 15% reduction in enterprise OpEx due to autonomous AI workflows. The integration of Agentic AI is transforming the corporate landscape.",
                    "category": "S&P",
                    "sentiment_score": 0.85
                },
                {
                    "id": 2,
                    "title": "Global Energy Markets Pivot as AI Data Centers Demand Unprecedented Power",
                    "snippet": "The exponential growth of AI infrastructure is reshaping energy demands. Oil and renewable sectors are experiencing significant volatility as providers scramble to secure long-term power contracts.",
                    "category": "Oil",
                    "sentiment_score": -0.6
                },
                {
                    "id": 3,
                    "title": "NVIDIA and ServiceNow Deploy First Global 'AI Factories'",
                    "snippet": "The partnership has reached a critical milestone with the launch of OpenShell secured autonomous desktops. This marks a new era in enterprise software deployments.",
                    "category": "AI",
                    "sentiment_score": 0.9
                },
                {
                    "id": 4,
                    "title": "Fintech Disruptors Leverage Quantum Computing for Algorithmic Trading",
                    "snippet": "Startups are utilizing quantum processing to optimize trading algorithms, achieving unprecedented execution speeds and market prediction accuracy.",
                    "category": "Finance",
                    "sentiment_score": 0.4
                },
                {
                    "id": 5,
                    "title": "Tech Giants Face Regulatory Scrutiny Over AI Monopolies",
                    "snippet": "Global regulators are stepping up their investigations into major tech companies. Concerns over data privacy and market dominance are taking center stage in the latest hearings.",
                    "category": "Tech",
                    "sentiment_score": -0.8
                },
                {
                    "id": 6,
                    "title": "Renewable Energy Subsidies Slashed in European Markets",
                    "snippet": "Policy shifts in key European nations have led to a sudden reduction in renewable energy subsidies, causing a sharp drop in clean energy stocks and impacting the broader energy sector.",
                    "category": "Energy",
                    "sentiment_score": -0.7
                }
            ]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(news_data).encode('utf-8'))
            return
            
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length) if content_length > 0 else b''
            
            try:
                req = json.loads(post_data.decode('utf-8'))
                prompt = req.get('prompt', '')
            except:
                prompt = ''
                
            print(f"[QuantX AI] Received chat prompt: {prompt}")
            
            if HAS_GROQ and prompt:
                try:
                    chat_completion = client.chat.completions.create(
                        messages=[{"role": "user", "content": prompt}],
                        model="llama-3.1-8b-instant",
                    )
                    text = chat_completion.choices[0].message.content
                except Exception as e:
                    text = f"Error generating response: {str(e)}"
            else:
                text = "Groq AI is not configured or prompt is empty. Install groq and set GROQ_API_KEY."

            response_data = {
                "status": "success",
                "text": text
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        # Neural AI Endpoint Mock
        elif self.path == '/api/analyze':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length) if content_length > 0 else b''
            
            try:
                req = json.loads(post_data.decode('utf-8'))
                ticker = req.get('ticker', 'UNKNOWN')
            except:
                ticker = 'UNKNOWN'
                
            print(f"[QuantX AI] Analyzing {ticker}...")
            time.sleep(1.5) # Simulate neural network processing latency
            
            response = {
                "status": "success",
                "analysis": f"AI Neural analysis for {ticker} indicates a strong accumulation phase. MACD divergence suggests bullish momentum is building. RSI has exited oversold territory. \n\nRecommended Action: Scaled entry over the next 48 hours.",
                "confidence": 87.5
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), QuantXHandler) as httpd:
        print("=========================================")
        print(" QuantX AI Server | Terminal Active      ")
        print(f" Serving at: http://localhost:{PORT} ")
        print("=========================================")
        httpd.serve_forever()
