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
        "
        #### **Bibliography**

        - Stull, R. (2016) Practical Meteorology: An Algebra-Based Survey of Atmospheric Science. University of British Columbia, British Columbia.
        - Bonan, G. (2015) Ecological Climatology: Concepts and Applications. Cambridge University Press, Cambridge.
        - https://www.csun.edu/~hcmth017/master/node13.html

        Animation source code available on [Github](https://github.com/jsmendozap/animations/blob/main/www/js/orbit.js)
        "
      )
    )
  )
}
