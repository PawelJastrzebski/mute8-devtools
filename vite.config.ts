import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  base: "/mute8-devtools/",
  build: {
    target: "ES2022",
  },
})
