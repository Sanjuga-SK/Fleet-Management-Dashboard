/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Green Primary System (Actions, Positive, Active, Navigation highlights)
        primary: {
          DEFAULT: '#15803D', // Primary green
          hover: '#166534',   // Dark green
          subtle: '#F0FDF4',  // Light green background
          border: '#BBF7D0',  // Light green border
        },
        // Orange Accent System (Attention, Warnings, Demo Mode, Selected Highlights)
        accent: {
          DEFAULT: '#F97316', // Primary orange
          hover: '#EA580C',   // Dark orange
          subtle: '#FFF7ED',  // Light orange background
          border: '#FED7AA',  // Light orange border
        },
        orange: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        green: {
          DEFAULT: '#15803D',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Sidebar styling (Clean crisp white theme with subtle slate borders and green/orange accents)
        sidebar: {
          bg: '#FFFFFF',
          surface: '#F8FAFC',
          border: '#E2E8F0',
          text: '#1E293B',
          muted: '#64748B',
          active: '#15803D',
        },
        // Clean Light Canvas
        canvas: {
          bg: '#F8FAFC',     // Main background
          card: '#FFFFFF',   // Card background
          hover: '#F1F5F9',
        },
        border: {
          subtle: '#E5E7EB', // Borders: #E5E7EB
          strong: '#D1D5DB',
        },
        content: {
          dominant: '#1F2937',   // Main text: #1F2937
          supportive: '#4B5563', // Secondary text
          muted: '#6B7280',      // Muted labels
        },
        // Accessible Status Indicators
        status: {
          active: {
            DEFAULT: '#15803D',
            bg: '#F0FDF4',
            text: '#166534',
            border: '#BBF7D0',
          },
          idle: {
            DEFAULT: '#F97316',
            bg: '#FFF7ED',
            text: '#C2410C',
            border: '#FED7AA',
          },
          alert: {
            DEFAULT: '#EF4444',
            bg: '#FEF2F2',
            text: '#991B1B',
            border: '#FECACA',
          },
          offline: {
            DEFAULT: '#6B7280',
            bg: '#F3F4F6',
            text: '#374151',
            border: '#E5E7EB',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        card: '10px',
        control: '6px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
