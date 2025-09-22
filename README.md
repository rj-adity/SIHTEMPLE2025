# 🛕 Temple Crowd Management / Temple Analytics

**Live Demo:** [Temple Analytics](https://adityasih2025templecrowdmanagement.vercel.app/)

---

## 📌 Overview

Temple Crowd Management (Temple Analytics) is a web application designed to help temples and religious institutions **monitor, analyze, and manage visitor flow**.  

It provides **real-time dashboards, crowd insights, and alerts** to ensure a safe and organized environment for devotees during daily operations and peak festival days.

---

## 🎯 Goals & Motivation

Temples often face **overcrowding** during festivals, special ceremonies, or weekends. This leads to:

- 🚨 Safety risks from high crowd density  
- 🧑‍🤝‍🧑 Inefficient staff/security allocation  
- ⏳ Long waiting times and poor visitor experience  
- 📉 Lack of historical data for planning future events  

👉 This project aims to solve these problems with a **data-driven digital solution**.

---

## ✨ Features

- 📊 **Real-time Crowd Dashboard** – Live view of visitors  
- 🕒 **Historical Analytics** – Hourly, daily & seasonal patterns  
- ⚠️ **Alerts & Notifications** – Trigger when thresholds are exceeded  
- 📍 **Visualizations** – Charts and (planned) heatmaps for temple zones  
- 📱 **Mobile Responsive** – Works seamlessly on all devices  
- 🔮 **Future Scope** – Forecasting, IoT integration, multilingual support  

---

## 🖼️ Screenshots

### Dashboard (Live Metrics)
![Dashboard Screenshot](<img width="1919" height="927" alt="image" src="https://github.com/user-attachments/assets/81d0f287-f229-48c3-aa8b-7237432517cf" />
)

### Analytics & Trends
![Analytics Screenshot](<img width="1918" height="827" alt="image" src="https://github.com/user-attachments/assets/38bca5c5-370e-46d7-bd9e-285aaff61695" />
)

### Temple Selector
![Temple Screenshots](<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/28f684ae-1cdc-49c2-acf7-c30940cb1c30" />
)



---

## 🛠️ Tech Stack

- **Frontend:** React / Next.js  
- **Hosting & Deployment:** Vercel  
- **Backend (Planned):** Node.js / Express or Serverless Functions  
- **Database (Planned):** PostgreSQL / MongoDB / Firebase  
- **Visualization:** Chart.js / D3.js (heatmaps coming soon)  

---

## ⚙️ How It Works

1. **Data Collection** – Visitor entries/exits logged manually or via IoT sensors  
2. **Storage** – Data stored in a database for real-time + historical analysis  
3. **Processing** – Aggregates visitor counts and checks thresholds  
4. **Visualization** – Displays real-time dashboards and charts  
5. **Alerts** – Sends alerts when safe crowd density is exceeded  

---

## 🚀 Setup / Installation

Run locally with:

```bash
# Clone the repository
git clone https://github.com/yourusername/temple-crowd-management.git
cd temple-crowd-management

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
