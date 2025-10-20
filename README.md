# 🚢 Titanic Project

A full-stack web application built with **React**, **Tailwind CSS**, and **FastAPI** that predicts survival on the Titanic.
Users can input passenger details, and the app returns survival predictions using a machine learning model.

---

## 🧠 Overview

This project combines **modern web development** with **data analysis** and **machine learning** concepts.
Key features include:

* Dynamic header with SVG background
* Informational section about the project
* Interactive form to collect passenger details:
  * Name
  * Age (range slider)
  * Gender
  * Passenger class
  * Siblings/Spouses aboard
  * Parents/Children aboard
  * Embarkation point
* Display of survival prediction results
* Backend API powered by **FastAPI** to handle predictions

---

## ⚙️ Technologies

* **Frontend:** React, Tailwind CSS
* **Backend:** Python, FastAPI
* **Machine Learning:** Pre-trained Titanic survival model (e.g., scikit-learn / TensorFlow)
* **Other Tools:** Git, GitHub, VS Code

---

## 🧩 Features

* Responsive and interactive UI with Tailwind CSS
* Safe data handling — only numerical and categorical inputs
* Dynamic SVG headers and form components
* Prediction results returned instantly via FastAPI
* Clean and maintainable project structure

---

## 📝 Usage

1. Open the app in your browser.
2. Fill out the passenger information form.
3. Click **Predict**.
4. View the survival prediction result below the form.

---

### Installation

1. **Frontend Setup**
```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
```
   The frontend will run on `http://localhost:5173`

2. **Backend Setup**
```bash
   # Navigate to backend folder
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # Windows CMD:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start FastAPI server
   python app.py
```
   The backend will run on `http://localhost:8000`

---

## 🗂 Dataset

The Titanic dataset used in this project is publicly available from [Kaggle](https://www.kaggle.com/competitions/titanic).  

**Citation:**  
Will Cukierski. *Titanic - Machine Learning from Disaster*. 2012. Kaggle. https://www.kaggle.com/competitions/titanic


---
## 📈 Project Status

✅ Fully functional frontend and backend
✅ Integrated ML model for predictions
✅ Form validation and state management with React

---

## 👨‍💻 Author

Developed by **Baran Buluc**

---

## 📜 License

MIT License
