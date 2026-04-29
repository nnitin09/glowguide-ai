# 🌟 GlowGuide AI

Your AI-powered personal beauty guide. GlowGuide AI leverages advanced vision models to analyze your facial features, skin tone, and undertones purely from a photograph to provide hyper-personalized makeup and beauty recommendations.

![GlowGuide AI Preview](https://via.placeholder.com/800x400?text=GlowGuide+AI)

## ✨ What Makes It Unique

Instead of long quizzes or guessing your own undertones, GlowGuide AI offers:

* **Instant AI Photo Analysis:** It scans your facial features and skin tone directly from your photo.
* **Exact Color Matches:** Gives you visual swatches and precise exact hex codes for lipsticks, blushes, and eyeshadows.
* **One-Click Shopping:** Instantly searches for real products matching your exact recommended shades.
* **Downloadable Guide:** Save your personalized beauty profile to your device for your next makeup shopping trip.

## 🚀 Features

* **📷 Live Camera & Upload Integration:** Take a selfie instantly using your device's webcam or upload an existing photo.
* **🧠 AI Feature Extraction:** Precisely identifies Skin Tone, Undertone, Face Shape, and Skin Type.
* **💄 Tailored Recommendations:**
  * Foundation matching strategies.
  * Curated Lipsticks, Blushes, and Eyeshadows with hex color swatches.
  * Overall style aesthetic suggestions.
* **📱 Responsive & Polished UI:** Fluid animations via Framer Motion, a beautiful glassmorphism-inspired interface, and rich markdown explanations.

## 🛠️ Technology Stack

GlowGuide AI is built using a modern, fast, and scalable frontend stack:

* **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite 6](https://vitejs.dev/)
* **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
* **Animations:** [Motion (Framer Motion)](https://motion.dev/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown)
* **AI Engine:** [Google Gemini API (`@google/genai`)](https://ai.google.dev/) (Using `gemini-2.5-flash` or similar multimodal models)

## 🏃‍♂️ Getting Started

### Prerequisites

You will need a [Google Gemini API Key](https://aistudio.google.com/app/apikey) to run the AI analysis.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd glowguide-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000` to start exploring your beauty profile!

## 🛡️ Privacy Note

Your images are processed efficiently and safely. Large images are automatically compressed directly in the browser using HTML5 Canvas before ever being sent to the AI service. This ensures faster analysis times and reduces bandwidth usage.

## 📄 License

MIT License - feel free to use this project for your own beauty and tech endeavors!
