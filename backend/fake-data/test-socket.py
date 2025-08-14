import websockets
import asyncio

async def test_connection():
    try:
        async with websockets.connect('ws://localhost:8083/data-stream') as ws:
            print("Kết nối WebSocket thành công!")
    except Exception as e:
        print(f"Lỗi kết nối: {e}")

asyncio.get_event_loop().run_until_complete(test_connection())