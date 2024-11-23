
# DOCX to PDF Converter

This project is a **DOCX to PDF Converter** that allows users to upload `.docx` files, convert them to PDF, and optionally password-protect the resulting PDF. The application uses the **MERN stack** (MongoDB, Express, React, Node.js) with Docker for deployment and Render for hosting.

## Features

- **File Upload**: Upload `.docx` files.
- **PDF Conversion**: Convert the uploaded DOCX file to a PDF.
- **Password Protection**: Option to set a password for the PDF.
- **Download PDF**: After conversion, download the PDF.
- **Dockerized**: Backend and frontend are containerized using Docker.
- **Deployment**: The project is deployed on Render.

## Project Structure

/backend /Dockerfile /server.js /uploads /package.json /... (other backend files)

/frontend /Dockerfile /package.json /src /... (other frontend files)

/docker-compose.yml /README.md /.env (For storing environment variables)


### Docker Setup

The project is containerized with Docker, with separate Dockerfiles for both frontend and backend. Docker Compose is used to manage multi-container deployment.

### Backend

The backend handles file uploads, PDF conversion using LibreOffice, and password protection using `qpdf`. The backend listens on port `5000`.

### Frontend

The frontend is built using React. It allows users to upload `.docx` files, specify password protection, and download the converted PDF.

## Prerequisites

Before running the project, make sure you have the following installed:

- **Docker** and **Docker Compose**: For containerized deployment.
- **Node.js** and **npm** (for development purposes).
- **MongoDB** (if using locally instead of hosted on Render).
- **.env file**: To store environment variables like the backend URL.

### Set up `.env` for Frontend

In your frontend `.env` file, make sure you have the backend URL set:

```env
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com


PORT=5000

## Project Structure

