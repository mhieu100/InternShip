# Backend Services - Port Reference

This document lists all the ports used by the microservices in this backend application.

## Service Ports

| Service | Port   | Description                        |
|---------|--------|------------------------------------|
| **user-service** | `8081` | User management and authentication |
| **order-service** | `8082` | Order processing and management    |
| **analysis-service** | `8083` | Data analysis and reporting        |
| **camera-service** | `8084` | Camera and media handling          |
| **stream-service** | `8085` | Video/audio streaming              |
| **notification-service** | `8086` | Notifications and messaging        |
| **chatbot-service** | `8087` | Chat with AI - API GEMINI          |
| **product-service** | `8088` | Product Manager                    |
| **chat-service** | `8089` | Chat Realtime User To User         |

## External Dependencies

| Service | Port | Description |
|---------|------|-------------|
| **Redis** | `6379` | Caching and session storage |
| **Kafka** | `9092` | Message broker (default) |
| **Mail Server** | `587` | SMTP for email notifications |

