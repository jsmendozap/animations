complex_numbers_ui <- function(id) {
    
  ns <- NS(id)
    
  navset_card_tab(
    full_screen = TRUE,
    nav_panel("Components", uiOutput(ns("complex_comp"))),
    nav_panel("Operations", uiOutput(ns("complex_op"))),
    nav_panel(
      icon("circle-info"),
      markdown("Learn more about [complex numbers](https://en.wikipedia.org/wiki/Complex_number)")
    )
  )    
}
