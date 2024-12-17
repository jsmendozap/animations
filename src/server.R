server <- function(input, output, session) {

  observeEvent(input$subject, {
    updateSelectInput(
      session = session,
      inputId =  "topic",
      choices = filter(topics, subject == input$subject) %>% pull(topic)
    )
  })
  
  observeEvent(input$topic, {
    output$title <- renderUI({
      name <- str_to_title(input$topic)
      card_header(name, style = "background-color: white; font-weight: bold")
    })
    
    output$dynamic_ui <- renderUI({
      modules[[input$topic]]$ui("topic_module")
    })  
  })
  
  observeEvent(input$vector_coords, {
    modules[[input$topic]]$server("topic_module", input$vector_coords)
  })
    
}