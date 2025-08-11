# Trading Server Backend

A secure and scalable NestJS backend for a trading application.

## Project Description

This project is a robust backend for a trading analysis platform. Its primary focus is to allow users to develop and backtest trading strategies against real-world historical stock market data.

## Roadmap for further development

- Implement more sophisticated trading strategies.
- Incorporate live market data to generate buy and sell signals on the fly.
- Inform user about buy and sell signals with a push notification system.
- Implement a fully automated trading system with direct API access to a brokerage for live buy/sell order execution.
- Develop a more user-friendly and feature-rich frontend.

## Motivation as a developer

As a developer with a strong focus on quality and security, my motivation was to build a project from the ground up that embodies enterprise-level best practices. This project serves as a blueprint for how I approach building secure and maintainable backend systems.

## Tech Stack

- **Backend**: Node.js, NestJS, TypeScript
- **Database**: TypeORM, MySQL
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Security**: Helmet, Rate-Limiting (Throttler)
- **Testing**: Jest
- **Tooling**: ESLint, Prettier
- **Frontend**: Template engine pug

## Features

- **Security First**: HTTPS, Helmet security headers, and global rate limiting.
- **Secure Authentication**: JWT-based authentication with distinct User and Admin roles.
- **Robust Validation**: DTOs with `class-validator` for all incoming requests.
- **Admin-Protected Endpoints**: Secure endpoints for user management.
- **Analysis**: Backtesting of historical stock market data
- **Data Aggregation**: Module for importing financial data from external APIs.
- **DataProvider**: A dedicated module that processes and provides financial data formatted for easy rendering on the client-side.
- **Notification**: Create events that trigger push notifications.

## Philosophy & Key Architectural Decisions

### Embrace Change

> By maintaining a highly-tested codebase and adhering to Clean Code principles, it becomes a much simpler task to tweak existing features and add new functionality in the future. I believe there is no such thing as "finished" software; change is the only constant.

### Front-Loading

> My overall philosophy is built on the principles of "Shift-Left" and "Front-Loading" quality. By focusing on robust architecture, security, and testing early in the development cycle, this approach ensures lower long-term maintenance costs and higher satisfaction for both the end-user and the developer.

### Tests are the Backbone

> Incorporating a Test-Driven Development (TDD) approach is fundamental to ensuring high code quality. TDD enforces simplicity and best practices like the Single Responsibility Principle, which directly improves code readability and understanding. This leads to higher productivity, long-term stability, and a better user experience due to fewer errors and less downtime. It also makes a developer's life easier by providing the confidence to refactor and add new features without the fear of unintentionally breaking the application.

### Security by Default

> Instead of securing each endpoint individually, I made the deliberate architectural decision to enforce a strict security policy globally in main.ts. By enabling HTTPS, Helmet, and global validation pipes from the very beginning, I ensure that no endpoint can ever be accidentally exposed without these fundamental protections.

### Pipeline Architecture for Extensible Strategies

> To easily add and modify new trading strategies, I implemented a Pipeline Pattern. The data processing is divided into small, encapsulated steps, where each step is responsible for a specific task (e.g., fetching data, calculating an indicator, checking conditions).

> Each step operates on a shared AnalysisContext object, which acts as a data contract throughout the pipeline. A step reads the data it needs from the context and places its results back into it for subsequent steps to use.

> Trade-offs: This design has clear trade-offs. Steps have implicit dependencies, meaning certain steps must run upfront. To manage this complexity, a Builder is used to correctly construct the pipeline and ensure all necessary prerequisite steps are included. A further drawback is that the AnalysisContext class can grow in size and complexity over time, requiring careful management.
