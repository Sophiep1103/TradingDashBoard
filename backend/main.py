from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import ccxt
import numpy as np
from datetime import datetime

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TradingBot:
    def __init__(self):
        self.exchange = ccxt.binance({
            'enableRateLimit': True
        })
        self.symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT']  # Added multiple symbols
        self.alerts = []

    async def get_prices(self):
        """Get current prices for multiple symbols"""
        prices = {}
        for symbol in self.symbols:
            ticker = self.exchange.fetch_ticker(symbol)
            prices[symbol] = ticker['last']
        return prices

    def calculate_signals(self, prices):
        """Calculate basic trading signals for each symbol"""
        signals = {}
        for symbol, price_list in prices.items():
            if len(price_list) < 2:
                signals[symbol] = 'neutral'
            else:
                # Adjusted moving average windows for stability
                sma_short = np.mean(price_list[-10:])  # Short window increased to 10
                sma_long = np.mean(price_list[-30:])  # Long window increased to 30
                
                if sma_short > sma_long:
                    signals[symbol] = 'buy'
                else:
                    signals[symbol] = 'sell'
        return signals

    def check_alerts(self, prices):
        """Check if any price alerts are triggered"""
        triggered = []
        remaining = []
        
        for alert in self.alerts:
            if alert['type'] == 'above' and prices[alert['symbol']] > alert['price']:
                triggered.append(alert)
            elif alert['type'] == 'below' and prices[alert['symbol']] < alert['price']:
                triggered.append(alert)
            else:
                remaining.append(alert)
        
        self.alerts = remaining
        return triggered

bot = TradingBot()

@app.get("/")
async def root():
    prices = await bot.get_prices()  # Fetch live prices
    return {"prices": prices}  # Return the latest prices

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    prices = {symbol: [] for symbol in bot.symbols}
    
    try:
        while True:
            # Get current prices
            current_prices = await bot.get_prices()
            for symbol, price in current_prices.items():
                prices[symbol].append(price)
            
            # Calculate trading signals
            signals = bot.calculate_signals(prices)
            
            # Check alerts
            triggered_alerts = bot.check_alerts(current_prices)
            
            # Send data to client
            await websocket.send_json({
                'prices': current_prices,
                'signals': signals,
                'alerts': triggered_alerts
            })
            
            # Increase sleep time for stability
            await asyncio.sleep(2)
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()

@app.post("/alert")
async def set_alert(symbol: str, price: float, alert_type: str):
    """Set a new price alert"""
    bot.alerts.append({
        'symbol': symbol,
        'price': price,
        'type': alert_type,
        'created_at': datetime.now().isoformat()
    })
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
