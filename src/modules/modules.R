topics <- c(
  "Complex numbers" = "complex",
  "Earth's Orbit" = "orbit"
)

modules <- list(
  "complex" = list(
    ui = complex_numbers_ui,
    server = complex_numbers_server
  ),

  "orbit" = list(
    ui = orbit_ui,
    server = orbit_server
  )
)
