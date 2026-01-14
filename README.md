# ✍️ drafts  
*A private, data-driven birthday website built as a digital memory archive*

🌐 **Live Site:** https://drafts-opal.vercel.app/  
🚀 **Hosted on:** Vercel  
📄 **SheetDB API:** https://sheetdb.io/api/v1/yjusytgjlvwox  

---

## 📌 Project Overview

**drafts** is a custom-built birthday website created as a private digital archive of messages, photos, and memories for one person — Sakshi.  
It is not a reusable platform or a public product, but a purpose-built web experience that transforms structured form responses into a warm, human-centric storytelling interface.

The goal of the project is to demonstrate how simple web technologies can be used to convert raw data into something emotionally meaningful — a living collection of words written by real people, preserved in a clean and elegant interface.

---

## 🧠 Problem It Solves

Most of what people feel about someone is never written down.

Affection, memories, admiration, and quiet love often stay unspoken — things people carry but rarely express. Because of this, a person rarely gets to see how they are truly experienced by those around them.

**drafts** creates a space where those invisible thoughts can finally be written, gathered, and preserved as private notes for one person.

It is not about organizing messages — it is about revealing how someone is seen, remembered, and loved.

---

## 🧩 System Architecture

The entire system is built around a **no-code → API → frontend** pipeline:

Google Form  
↓  
Google Sheets  
↓  
SheetDB API  
↓  
drafts Web App  

Image uploads are handled using a **Google Apps Script** that sends uploaded photos directly to **Cloudinary**, ensuring fast, reliable image hosting while keeping the form workflow simple for contributors.

This allows contributors to submit content through a simple form while the website dynamically renders everything in real time without manual updates.

---

## 📥 Data Collected

Each contributor submits:

- A photo with Sakshi  
- A song that reminds them of her  
- Why that song reminds them of her  
- A personal written message  

These fields are intentionally designed to capture both **context** and **emotion**, making each message card feel personal rather than generic.

---

## 🖼 Frontend Experience

The website displays the data as a series of beautifully formatted message cards.  
Each card combines:

- Visual memory (photo)  
- Emotional anchor (song)  
- Personal explanation  
- Written message  

This transforms a spreadsheet into something that feels like a collection of handwritten letters.

---

## 🧪 Tech Stack

- **Frontend:** [insert — e.g. React + Vite]  
- **Styling:** [insert — e.g. Tailwind CSS]  
- **Database:** Google Sheets  
- **API Layer:** SheetDB  
- **Hosting:** Vercel  

---

## 🔐 Privacy & Scope

This project is:

- Not publicly indexed  
- Not designed for scale  
- Not built for multiple users  

It is intentionally scoped to a single recipient to preserve emotional authenticity and privacy.

No authentication, tracking, or analytics are used.

---

## 🛠 Local Setup

```bash
git clone [insert repo link]
cd drafts
npm install
npm run dev
```
Add the SheetDB endpoint: 
VITE_SHEETDB_URL=https://sheetdb.io/api/v1/yjusytgjlvwox

## 🧾 Why This Project Matters

From a technical perspective, drafts demonstrates:

 - API-driven UI rendering
 - No-code backend integration
 - Clean data-to-interface pipelines

From a human perspective, it shows how software can be used to preserve relationships, not just information.

It is a reminder that code doesn’t only build products — it can also build moments.