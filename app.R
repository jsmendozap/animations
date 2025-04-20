pacman::p_load(tidyverse, bslib, shiny, glue)

map(
    .x = dir(path = "src", pattern = "*.R", full.names = T, recursive = T),
    .f = ~ source(.x)
)

shinyApp(ui = ui, server = server)
