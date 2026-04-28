import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";

// Formatting presets
const titleOpts = { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 36, bold: true, color: "E61E46" };
const bodyOpts = { x: 0.5, y: 1.8, w: 9, h: 4.5, fontSize: 22, color: "363636", align: "left" as const, valign: "top" as const };

// Slide 1: Title
let slide1 = pptx.addSlide();
slide1.addText("GlowGuide AI", { x: 1, y: 2, w: 8, h: 1, fontSize: 54, bold: true, align: "center", color: "E61E46" });
slide1.addText("Domain-Specific Generative AI Chatbot", { x: 1, y: 3, w: 8, h: 1, fontSize: 24, align: "center", color: "363636" });

// Slide 2: Introduction
let slide2 = pptx.addSlide();
slide2.addText("1. Introduction", titleOpts);
slide2.addText([
    { text: "The Personal Beauty Crisis:", options: { bold: true, breakLine: true } },
    { text: "Navigating the cosmetic world is overwhelming without professional expertise.", options: { bullet: true, breakLine: true } },
    { text: "What is GlowGuide AI?", options: { bold: true, breakLine: true } },
    { text: "A domain-centric AI chatbot analyzing unique facial structures and skin tones.", options: { bullet: true, breakLine: true } },
    { text: "The Solution:", options: { bold: true, breakLine: true } },
    { text: "Instant, strictly personalized makeup and style formulas delivered quickly in the browser.", options: { bullet: true, breakLine: true } }
], bodyOpts);

// Slide 3: Problem Description
let slide3 = pptx.addSlide();
slide3.addText("2. Problem Description", titleOpts);
slide3.addText([
    { text: "Lack of Personalization", options: { bold: true, breakLine: true } },
    { text: "Generic tutorials fail to account for distinct face shapes and undertones.", options: { bullet: true, breakLine: true } },
    { text: "Analysis Paralysis", options: { bold: true, breakLine: true } },
    { text: "Consumers face thousands of shades, making pairing incredibly tedious.", options: { bullet: true, breakLine: true } },
    { text: "Accessibility Limits", options: { bold: true, breakLine: true } },
    { text: "High-end dermatologists and beauty consultants are expensive and geographically limited.", options: { bullet: true, breakLine: true } }
], bodyOpts);

// Slide 4: Objective
let slide4 = pptx.addSlide();
slide4.addText("3. Objective", titleOpts);
slide4.addText([
    { text: "Harness Multimodal AI:", options: { bold: true, breakLine: true } },
    { text: "To use Generative AI (Vision+Text) for solving a highly specific domain problem.", options: { bullet: true, breakLine: true } },
    { text: "Extract Visual Context:", options: { bold: true, breakLine: true } },
    { text: "To visually process user images locally securely from the camera.", options: { bullet: true, breakLine: true } },
    { text: "Generate Actionable Insight:", options: { bold: true, breakLine: true } },
    { text: "To generate accurate makeup hex-code recommendations via restricted JSON schema.", options: { bullet: true, breakLine: true } }
], bodyOpts);

// Slide 5: Methodology
let slide5 = pptx.addSlide();
slide5.addText("4. Methodology (System Architecture Flowchart)", titleOpts);
const shapeOpts = { w: 2.5, h: 1.2, fill: { color: "F8F9FA" }, align: "center" as const, fontFace: "Arial", fontSize: 13, color: "363636", line: { color: "E61E46", width: 1.5 } };
const alignCenter = "center" as const;

slide5.addText("User Input\n(Webcam Selfie & React UI)", { shape: pptx.ShapeType.rect, x: 0.5, y: 2.2, ...shapeOpts });
slide5.addShape(pptx.ShapeType.rightArrow, { x: 3.1, y: 2.6, w: 0.4, h: 0.4, fill: { color: "E61E46" }, line: { color: "E61E46" } });
slide5.addText("Pre-processing\n(Base64 Encode & System Prompt)", { shape: pptx.ShapeType.rect, x: 3.6, y: 2.2, ...shapeOpts });
slide5.addShape(pptx.ShapeType.rightArrow, { x: 6.2, y: 2.6, w: 0.4, h: 0.4, fill: { color: "E61E46" }, line: { color: "E61E46" } });
slide5.addText("Gemini 2.5 Vision API\n(Generate Output locked to JSON)", { shape: pptx.ShapeType.rect, x: 6.7, y: 2.2, ...shapeOpts });
slide5.addShape(pptx.ShapeType.downArrow, { x: 7.75, y: 3.5, w: 0.4, h: 0.4, fill: { color: "E61E46" }, line: { color: "E61E46" } });
slide5.addText("Parse Data\n(Extract Domain-Constrained JSON)", { shape: pptx.ShapeType.rect, x: 6.7, y: 4.0, ...shapeOpts });
slide5.addShape(pptx.ShapeType.leftArrow, { x: 6.2, y: 4.4, w: 0.4, h: 0.4, fill: { color: "E61E46" }, line: { color: "E61E46" } });
slide5.addText("Output Validation\n(Validate hex colors & makeup)", { shape: pptx.ShapeType.rect, x: 3.6, y: 4.0, ...shapeOpts });
slide5.addShape(pptx.ShapeType.leftArrow, { x: 3.1, y: 4.4, w: 0.4, h: 0.4, fill: { color: "E61E46" }, line: { color: "E61E46" } });
slide5.addText("UI Display\n(Render tailored cards)", { shape: pptx.ShapeType.rect, x: 0.5, y: 4.0, ...shapeOpts });

// Slide 6: Result
let slide6 = pptx.addSlide();
slide6.addText("5. Result", titleOpts);
slide6.addText([
    { text: "Operational Web App", options: { bold: true, breakLine: true } },
    { text: "A fully working, responsive web application with animated UI.", options: { bullet: true, breakLine: true } },
    { text: "Accurate Predictions", options: { bold: true, breakLine: true } },
    { text: "Effectively deduces skin tone, undertone, and face shape.", options: { bullet: true, breakLine: true } },
    { text: "Zero Hallucination UI", options: { bold: true, breakLine: true } },
    { text: "Limits model hallucinations by forcing a JSON object structure.", options: { bullet: true, breakLine: true } },
    { text: "Actionable Outputs", options: { bold: true, breakLine: true } },
    { text: "Provides tangible outputs (Hex Codes) that users can directly utilize for shopping.", options: { bullet: true, breakLine: true } }
], bodyOpts);

// Slide 7: Conclusion
let slide7 = pptx.addSlide();
slide7.addText("6. Conclusion", titleOpts);
slide7.addText([
    { text: "Multimodal AI is ready for hyper-niche industries.", options: { bullet: true, breakLine: true } },
    { text: "Structured API responses provide the safety mechanisms required for reliable software.", options: { bullet: true, breakLine: true } },
    { text: "Future Enhancements", options: { bold: true, breakLine: true } },
    { text: "• Live WebRTC Augmented Reality (AR) to test colors on the camera feed.", options: { breakLine: true } },
    { text: "• Persistent user memory and history storage.", options: { breakLine: true } },
    { text: "• Direct third-party e-commerce API integration for 1-click purchases.", options: { breakLine: true } }
], bodyOpts);

pptx.writeFile({ fileName: "./public/GlowGuide_Presentation.pptx" }).then(fileName => {
    console.log("created!");
});
