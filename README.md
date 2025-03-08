
# Intelligent Payment Routing System

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
6. [API Endpoints](#api-endpoints)
7. [Example Usage](#example-usage)
8. [Contributing](#contributing)
9. [License](#license)

---

## Overview

The **Intelligent Payment Routing System** is designed to optimize payment transfers between banks by determining the **cheapest path** (based on cost) and the **fastest path** (based on time). This system uses data from `banks.csv` and `links.csv` to calculate the best routes for payments, ensuring minimal cost and time.

This project was developed as part of the **HCL Hackathon**, where the goal was to build a service that connects to a database, processes routing logic, and exposes APIs for optimal payment routing.

---

## Features

- **Cheapest Path Calculation**: Determines the route with the lowest total cost using Dijkstra's algorithm.
- **Fastest Path Calculation**: Determines the route with the shortest total time using Dijkstra's algorithm.
- **Backend API**: Exposes RESTful endpoints for fetching the cheapest and fastest paths.
- **Database Integration**: Imports and queries data from SQLite for efficient processing.
- **Scalable Design**: Modular code structure for easy extension and maintenance.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Algorithms**: Dijkstra's Algorithm
- **Libraries**: `sqlite3`, `csv-parser`, `@datastructures-js/priority-queue`
- **Frontend**: (Optional) React.js or plain HTML/CSS/JavaScript for UI integration

---

## Project Structure

```
project/
├── setup_db.js          # Script to import CSV data into SQLite
├── app.js               # Main application file with API endpoints
├── banks.csv            # Input file containing bank charges
├── links.csv            # Input file containing links and time taken
├── routing.db           # SQLite database file
└── README.md            # This documentation file
```

---

## Setup Instructions

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **SQLite**

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/thealonemusk/hackathon.git
   cd hackathon
   ```
2. **Install Dependencies**:

   ```bash
   npm install
   ```
3. **Set Up the Database**:

   - Place `banks.csv` and `links.csv` in the project directory.
   - Run the database setup script:
     ```bash
     node setup_db.js
     ```
   - This will create an SQLite database (`routing.db`) and populate it with data from the CSV files.
4. **Start the Server**:

   ```bash
   node app.js
   ```

   The server will start running at `http://localhost:3000`.

---

## API Endpoints

### 1. Fastest Route

- **Endpoint**: `/api/fastestroute`
- **Method**: `GET`
- **Query Parameters**:
  - `fromBank`: Source bank BIC
  - `toBank`: Destination bank BIC
- **Response**:
  ```json
  {
      "route": "ABBBAU33XXX -> JPCHUS33XXX -> UBBBSGSGXXX",
      "time": 120
  }
  ```

### 2. Cheapest Route

- **Endpoint**: `/api/cheapestroute`
- **Method**: `GET`
- **Query Parameters**:
  - `fromBank`: Source bank BIC
  - `toBank`: Destination bank BIC
- **Response**:
  ```json
  {
      "route": "ABBBAU33XXX -> CTTTUS33XXX -> UBBBSGSGXXX",
      "cost": 30
  }
  ```

---

## Example Usage

### Fastest Route

```bash
curl "http://localhost:3000/api/fastestroute?fromBank=ABBBAU33XXX&toBank=UBBBSGSGXXX"
```

**Response**:

```json
{
    "route": "ABBBAU33XXX -> JPCHUS33XXX -> UBBBSGSGXXX",
    "time": 120
}
```

### Cheapest Route

```bash
curl "http://localhost:3000/api/cheapestroute?fromBank=ABBBAU33XXX&toBank=UBBBSGSGXXX"
```

**Response**:

```json
{
    "route": "ABBBAU33XXX -> CTTTUS33XXX -> UBBBSGSGXXX",
    "cost": 30
}
```

~Ashutosh
