server <- function(input, output, session) {
  observeEvent(input$subject, {
    updateSelectInput(
      session = session,
      inputId =  "topic",
      choices = topics[topics$subject == input$subject, "topic"]
    )
  })
  
  observeEvent(input$topic, {
    output$title <- renderUI({
      name <- str_to_title(input$topic)
      card_header(name, 
                  style = "background-color: white; font-weight: bold")
    })
  })
  
  observeEvent(input$vector_coords,
               complex_numbers(coords = input$vector_coords, output = output))
    
}