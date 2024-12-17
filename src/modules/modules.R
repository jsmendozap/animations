topics <- tribble(
  ~subject,        ~topic,
  "Mathematics",  "Complex numbers"
)
  
modules <- list(
  "Complex numbers" = list(
    ui = complex_numbers_ui,
    server = complex_numbers_server
  )
)