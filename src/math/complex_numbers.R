complex_numbers <- function(coords, output){
  
  complex_point <- complex(real = coords$real,
                           imaginary = coords$imaginary
                          )
  print(complex_point)
  
  magnitude <- Mod(complex_point) 
  angle <- Arg(complex_point) %>% ifelse(. < 0, 2*pi + ., .)
  conj_angle <- Arg(Conj(complex_point)) %>% ifelse(. < 0, 2*pi + ., .)
  
  output$complex_card <- renderUI({
    navset_card_tab(
      full_screen = TRUE,
      nav_panel(
        "Components",
        uiOutput("complex_comp")
      ),
      nav_panel(
        "Operations",
        uiOutput("complex_op")
      ),
      nav_panel(
        shiny::icon("circle-info"),
        markdown("Learn more about [complex numbers](https://en.wikipedia.org/wiki/Complex_number)")
      )
    )
  })
  
  output$complex_comp <- renderUI({
    withMathJax(
      HTML(
        markdown(
          glue::glue("
            **Components**
            
            $z = {real} + {im}i$  
            $\\text{{Re(z)}} = {real}$  
            $\\text{{Im(z)}} = {im}$  
            $|z| = \\sqrt{{{real}^2 + {im}^2}} = {mag}$  
            $\\arg(z) = \\arctan\\left(\\frac{{{im}}}{{{real}}}\\right) = {rad} \\text{{ rad}} = {grados}^\\circ$  
            
            **Polar form**
            
            $z = {magnitude}e^{{{rad}i}}$  
            
            **Conjugate**
            
            $\\bar{{z}} = {conj}$  
            $\\arg(\\bar{{z}}) = 2 \\pi - \\arg(z) = {arg_grados}^\\circ$  
            
            **Inverse**
            
            $z^{{-1}} = \\frac{{\\bar{{z}}}}{{|z|^2}} = \\frac{{{conj}}}{{(\\sqrt{{{real}^2 + {im}^2}})^2}} = {inv}$
          ",
          real = round(Re(complex_point), 2),
          im = round(Im(complex_point), 2),
          mag = round(magnitude, 2),
          rad = round(angle, 2),
          grados = round(angle * 180 / pi, 2),
          conj = round(Conj(complex_point), 2),
          arg_grados = round(conj_angle * 180/pi, 2),
          inv = round(Conj(complex_point)/magnitude^2, 2)
          )
        )
      )
    ) 
  })  

  output$complex_op <- renderUI({
    withMathJax(
      HTML(
        markdown(
          glue::glue(
            "
            Given 2 complex numbers: 

            $z_1 = {z}$
            $z_2 = {z}$

            They can perform the next operations:

            **Sum**

            It is performed component by component
            
            ",
            z = round(complex_point, 2)
          )
        )
      )
    )
  })

}
