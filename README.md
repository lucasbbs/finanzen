# Finanzen <img src="https://github.com/lucasbbs/finanzen/blob/master/public/logo.png" width="200" height="auto">

Financial Independence Calculator (FIRE Simulator)

## Overview

The Finanzen Calculator, provides a Financial Independence and Retire Early (FIRE) Simulator. It is a comprehensive tool designed to assist investors in achieving financial independence. By leveraging various features, the application provides a clear view of investment performance, budgeting, and progress towards financial goals.

|[![](https://img.youtube.com/vi/muOiWuPezYU/0.jpg)](https://youtu.be/muOiWuPezYU)| Watch the demo video |
|---------------------------------------------------------------------------------|------------------|

## Key Features

### Investment Performance Analysis
- **Spreadsheet Upload**: Investors can upload a spreadsheet containing their investment returns.
- **Immediate Indicators**: Provides immediate insights into various indicators of monthly returns, annualized measures, and tracks the journey towards financial independence.

![](https://github.com/lucasbbs/finanzen/blob/master/image-1.png)

### Budget Control and Reporting
- **Expense Tracking**: Manages and categorizes expenses with detailed reports.
- **Monthly Reports**: Generates monthly reports indicating spending by categories.
- **Financial Independence Calculator**: Calculates the progress towards financial independence.

![](https://github.com/lucasbbs/finanzen/blob/master/image-3.png)

### Inflation and Deflator Tools
- **Inflation History**: Tools to verify historical inflation rates.
- **Income Deflator**: Adjusts income for inflation to present real returns.
- **Tax Reports**: Detailed reports of taxes paid monthly and in total.

### Comprehensive Financial Management
- **Investment Management**: Classic services for investment tracking and management.
- **Budget Monitoring**: Tools for monitoring monthly budgets.
- **Expense Reports**: Monthly expense reports categorized by spending.
- **Return Calculations**: Calculates the returns on investments.
- **Tax Calculations**: Computes taxes paid on investments.
- **Currency Conversion**: Converts between different currencies.
- **Inflation Calculation**: Calculates inflation impacts on investments.

![](https://github.com/lucasbbs/finanzen/blob/master/image-4.png)

![](https://github.com/lucasbbs/finanzen/blob/master/image-5.png)

### Unique Value Propositions
- **Neglected Niches**: Offers unique insights not available in competing platforms.
- **Real Returns Calculation**: Calculates real returns by discounting for inflation.
- **Monthly Goal Tracking**: Tracks monthly progress towards financial independence.

### Internationalization
- **Global Inflation API**: Provides inflation data for nearly all countries (189 countries).
- **Global Currency API**: Offers currency data for almost all countries (201 countries).

## Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 16.15.1)
- [MongoDB](https://www.mongodb.com/) (ensure MongoDB server is running or MongoDB Atlas)
- [Git](https://git-scm.com/)

### Steps to Install and Run the Application

1. **Clone the Repository**
   ```sh
   git clone https://github.com/yourusername/financial-independence-calculator.git
   cd financial-independence-calculator
    ```
2. Install Server Dependencies
Navigate to the server directory and install the dependencies.
    ```sh
    cd server
    npm install
    ```

3. Configure Environment Variables
Create a .env file in the server directory and add the following environment variables:
    ```sh
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/yourdatabase
    JWT_SECRET=your_jwt_secret
    ```

4. Start the Server
Start the backend server.
    ```sh
    npm start
    ```
    
5. Install Client Dependencies
Open a new terminal window, navigate to the client directory and install the dependencies.
    ```sh
    cd ../client
    npm install
    ```

6. Start the Client
Start the frontend development server.
    ```sh
    npm start
    ```
7. Access the Application
Open your browser and navigate to http://localhost:3000 to access the Financial Independence Calculator application.

# :closed_book: License

Released in 2022 :closed_book: License

Made with :heart: by [Lucas Breno de Souza Noronha Braga](https://github.com/lucasbbs) 🚀.
This project is under the [MIT license](https://github.com/lucasbbs/iMonitor-Backend/master/LICENSE).


## Contact

Lucas Breno de Souza Noronha Braga

[![Static Badge](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://api.whatsapp.com/send?phone=12267247739)
[![Static Badge](https://img.shields.io/badge/Microsoft_Outlook-0078D4?style=for-the-badge&logo=microsoft-outlook&logoColor=white)](mailto:lucasbbs@live.fr)
[![Static Badge](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lucasbbs/)
[![Static Badge](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/lucasbbs/)
