server <- function(input, output, session) {
  observeEvent(input$topic, {
    output$title <- renderUI({
      name <- which(topics == input$topic) |> names()
      card_header(name, style = "background-color: white; font-weight: bold")
    })

    session$sendCustomMessage("loadSketch", input$topic)
    output$dynamic_ui <- renderUI({
      modules[[input$topic]]$ui("topic_module")
    })

    modules[[input$topic]]$server("topic_module", reactive(input$data))
  })
}
