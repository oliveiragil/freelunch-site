# Freelunch - AI Intelligence Platform Landing Page

A modern, responsive landing page built with Next.js 14 for Freelunch, an upcoming AI intelligence platform. The page features a sleek black and orange design with smooth animations and a waitlist signup functionality.

## 🚀 Features

- **Modern Design**: Clean, professional layout with black and orange color scheme
- **Responsive**: Fully responsive design that works on all devices
- **Animations**: Smooth animations powered by Framer Motion
- **Waitlist Form**: Email validation and signup functionality
- **SEO Optimized**: Meta tags and Open Graph for social media sharing
- **Fast Performance**: Built with Next.js 14 and optimized for speed
- **TypeScript**: Fully typed for better development experience

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Optimized for Vercel

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fl-landing-page
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Add your logo:
   - Replace `/public/logo1.png.placeholder` with your actual logo file
   - Rename it to `logo1.png`

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure the custom domain `freelunch.dev`
4. Deploy!

### Environment Configuration

The site is pre-configured to work with the domain `freelunch.dev`. Update the metadata in `src/app/layout.tsx` if you're using a different domain.

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/             # Reusable components (empty - ready for expansion)
public/
├── logo1.png              # Your logo file (replace placeholder)
└── ...                    # Other static assets
```

## 🎨 Design Features

- **Color Scheme**: Black (#000000) and Orange (#FF6B35) primary colors
- **Typography**: Modern system fonts (Geist Sans)
- **Animations**: Floating elements, fade-ins, and hover effects
- **Interactive Elements**: Animated buttons and form states
- **Visual Effects**: Gradient backgrounds and glowing elements

## 🔧 Customization

### Colors
Edit `tailwind.config.ts` to modify the color scheme:
```typescript
colors: {
  primary: {
    orange: "#FF6B35", // Your orange color
    black: "#000000",  // Your black color
    gray: "#1a1a1a",   // Your gray color
  },
}
```

### Content
Update the text content in `src/app/page.tsx`:
- Hero headline
- Subtitle description
- Button text
- Footer information

### Logo
Replace `/public/logo1.png.placeholder` with your actual logo file and rename it to `logo1.png`.

## 📈 Performance

- **Lighthouse Score**: Optimized for 100% performance
- **Core Web Vitals**: Excellent LCP, FID, and CLS scores
- **SEO**: Comprehensive meta tags and structured data
- **Accessibility**: WCAG compliant design


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary to Freelunch.

## 🌐 Live Site


Once deployed, the site will be available at: [https://freelunch.dev](https://freelunch.dev)

---

Built with ❤️ using Next.js and deployed on Vercel.
