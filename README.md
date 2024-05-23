# cuisine connect - AI-Powered Recipe Website

Welcome to cuisine connect, an innovative Chef website powered by AI. With cuisine connect, users can search for recipes based on ingredients, cuisine, preparation time, and more. The AI generates customized recipe suggestions from our database and learns from user interactions to provide an enhanced experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Docker Setup](#docker-setup)
- [Database](#database)
- [Authentication](#authentication)
- [Routing](#routing)
- [AI Chatbot](#ai-chatbot)
- [Server Actions](#server-actions)
- [Contributing](#contributing)
- [License](#license)

## Features

- [x] User Authentication with Clerk - _kinan_
- [x] Browse recipes by ingredients, cuisine, preparation time, and more - _kinan_
- [x] AI-generated recipe suggestions - _kinan_
- [x] Add and manage favorite recipes - _kinan_
- [x] Rate recipes between 0 and 5 - _kinan_
- [x] Personalized AI search incorporating user preferences - _kinan_
- [x] AI chatbot for kitchen-related queries - _kinan_
<!--
- Full-stack TypeScript implementation
- Custom Docker and Docker Compose setup for deployment
- MongoDB with replica set for development
- Prisma ORM integration

-->

## Tech Stack

- **Frontend:** Next.js 13, TypeScript
- **Backend:** Node.js, Next.js server actions
- **Database:** MongoDB, Prisma ORM
- **Authentication:** Clerk
- **AI:** Custom AI integration for recipe generation and chatbot

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/kinaneb/cuisine-connect.git
    cd cuisine-connect
    ```

2.  **Set up environment variables**

    ```bash
    cp cuisine-connect/.env.example cuisine-connect/.env.local
    ```

3.  **Run the development**

    ```bash
    docker compose -f docker-compose.dev.yml up -d
    ```

## Contributors

- Wendy Afrim - _WendyAfrim_
- Kinan Bshara - _kinaneb_
