import React from "react"
import { ThemeProvider } from "theme-ui"
import { dark } from "@theme-ui/presets"

export default ({ element }) => {
  <ThemeProvider theme={dark}>{element}</ThemeProvider>
}
