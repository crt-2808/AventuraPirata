module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
      },
      keyframes: {
        ping: {
          '75%, 100%': {
            transform: 'scale(1.5)',
            opacity: '0'
          }
        }
      }
    }
  },
  variants: {},
  plugins: []
}

// DONE