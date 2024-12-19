# Event Management Application

This is a web application for event management that simplifies the reservation of materials and locations, and helps manage attendee registrations more efficiently.

## Tech Stack

**Backend:**
- **Node.js**
- **Express.js**
- **Sequelize** (for database management)

**Frontend:**
- **React**

## Installation

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/AmalJaoua/EventPlanner
    cd EventPlanner
    ```

2. Navigate to the `back` folder:

    ```bash
    cd back
    ```

3. Create a `.env` file in the `back` folder and configure your database connection settings.

4. Install the necessary dependencies:

    ```bash
    npm install
    ```

5. Start the backend development server:

    ```bash
    npm run dev
    ```

### Frontend Setup

1. Open a new terminal window/tab and navigate to the `front` folder:

    ```bash
    cd ../front
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm run dev
    ```

### Important Note:
You will need **two terminals** running at the same time:
- One for the **backend** (`npm run dev` in the `back` folder).
- One for the **frontend** (`npm run dev` in the `front` folder).

### Final Step

Open your browser and go to the local address given by the frontend server (typically `http://localhost:XXXX` or as specified by the terminal). 

Once both servers are running, the application should be fully functional.

## Features

- Simplified reservation of materials and locations for events.
- Easy tracking and checking of attendees.
  

