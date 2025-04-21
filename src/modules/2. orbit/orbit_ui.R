orbit_ui <- function(id) {
  ns <- NS(id)

  navset_card_tab(
    full_screen = TRUE,
    nav_panel("Background", uiOutput(ns("info"))),
    nav_panel("Average radiation", uiOutput(ns("derivation"))),
    nav_panel(
      "Sensitive analysis",
      uiOutput(ns("sensitivity")),
      shiny::sliderInput(
        inputId = ns("ne"),
        label = "New eccentricity:",
        min = 0.005,
        max = 0.06,
        value = 0.017
      )
    ),
    nav_panel(
      icon("circle-info"),
      markdown(
        "Learn more about [complex numbers](https://en.wikipedia.org/wiki/Complex_number)"
      )
    )
  )
}
