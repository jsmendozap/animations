ui <- page_sidebar(
    title = 'Animations',
    theme = bs_theme(bootswatch = "minty"),
    tags$head(
      withMathJax(),
      includeCSS("www/styles.css"),
      tags$script(src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"),
      tags$script(
        "MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [['$','$'], ['\\(','\\)']],
            processEscapes: true
          }
        });"),
      tags$script(src = 'complex.js')
    ),
    sidebar = sidebar(
      selectInput("subject", "Subject", topics$subject),
      selectInput("topic", "Topic", topics$topic)
    ),
    card(
      full_screen = TRUE,
      uiOutput("title"),
      layout_columns(
        card(
          card_header(
            popover(
              title = 'Plot settings',
              icon("gear", class = "ms-auto"),
              div(id = "sketch-settings"),
              placement = 'left'
            ),
            'Plot'
          ),
          div(id = "sketch-container", 
              style = "width: 400px; height: 400px;"), 
        ),
        uiOutput('dynamic_ui'),
        col_widths = c(6, 6)
      )
    )
    
)