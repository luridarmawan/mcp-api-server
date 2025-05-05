import os
import asyncio
from dotenv import load_dotenv
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent

load_dotenv()  # ← ini penting

async def main():
    async with MultiServerMCPClient(
        {
            "math": {
                "command": "python",
                "args": ["./math_server_stdio.py"],
                "transport": "stdio",
            },
            "weather": {
                "url": "http://localhost:8000/sse",
                "transport": "sse",
            }
        }
    ) as client:
        agent = create_react_agent(
            model="gpt-4",
            tools=client.get_tools(),
            #model_provider="openai"
        )

        math_response = await agent.ainvoke(
            {"messages": [{"role": "user", "content": "berapa (3 + 5) x 12?"}]}
        )
        # print("Math response:", math_response)
        print("Math response:", math_response["messages"][-1].content)

        weather_response = await agent.ainvoke(
            {"messages": [{"role": "user", "content": "bagaimana cuaca di jakarta?"}]}
        )
        # print("Weather response:", weather_response)
        print("Weather response:", weather_response["messages"][-1].content)

if __name__ == "__main__":
    asyncio.run(main())
