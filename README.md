# TaskEase Web Application

This is a simple ToDo list web application built using Node.js and Express, with a PostgreSQL database for storing ToDo items and their associated periods. Users can add, edit, and delete ToDo items, as well as switch between different periods to view their respective ToDo lists.

## Features

- Add new ToDo items
- Edit existing ToDo items
- Delete ToDo items
- Switch between different periods to view ToDo lists for each period

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js
- PostgreSQL

## Installation

1. Clone this repository:

   ```bash
   https://github.com/akinmertbur/TaskEase-Project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd TaskEase-Project
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root directory and specify your PostgreSQL database configuration:

  ```bash
  user=your_username
  host=your_host
  database=your_database
  password=your_password
  port=your_port
  ```

5. Start the server:
   
 ```bash
 npm start
 ```

6. Open your web browser and navigate to `http://localhost:3000` to use the application.

## Usage

1. Upon opening the application, you'll see the ToDo list for the default period ("Today").
2. To add a new ToDo item, enter the item in the input field and click the "Add" button.
3. To edit an existing ToDo item, click on the "Edit" button, make your changes in the input field, and then click the "Save" button.
4. To delete a ToDo item, click the 'Delete' checkbox next to the item.
5. To switch between different periods, select a period from the menu buttons.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/improvement).
3. Make your changes.
4. Commit your changes (git commit -am 'Add new feature').
5. Push to the branch (git push origin feature/improvement).
6. Create a new Pull Request.

## License

This project is licensed under the `MIT License`.
