complex_numbers_server <- function(id, coords) {
  moduleServer(id, function(input, output, session){

    complex_point <- complex(real = coords$real, imaginary = coords$imaginary)
    angle <- Arg(complex_point) %>% ifelse(. < 0, 2*pi + ., .)
    conj_angle <- Arg(Conj(complex_point)) %>% ifelse(. < 0, 2*pi + ., .)

    output$complex_comp <- renderUI({
      withMathJax(
        HTML(
          markdown(
            glue::glue("
            **Components**
            
            $z = {z}$  
            $\\text{{Re(z)}} = {real}$  
            $\\text{{Im(z)}} = {im}$  
            $|z| = \\sqrt{{({real})^2 + ({im})^2}} = {mag}$  
            $\\arg(z) = \\arctan\\left(\\frac{{{im}}}{{{real}}}\\right) = {rad} \\text{{ rad}} = {grados}^\\circ$  
            
            **Polar form**
            
            $z = {mag}e^{{{rad}i}}$  
            
            **Complex conjugate**
            
            $\\bar{{z}} = {conj}$  
            $\\arg(\\bar{{z}}) = 2 \\pi - \\arg(z) = {arg_grados}^\\circ$  
            
            **Multiplicative inverse**
            
            $z^{{-1}} = \\frac{{\\bar{{z}}}}{{|z|^2}} = \\frac{{{conj}}}{{\\left(\\sqrt{{({real})^2 + \\ ({im})^2}}\\right)^2}} = {inv}$  
            $z^{{-1}} = \\frac{{1}}{{{mag}}}e^{{-i{rad}}}$  
            ",
            z = round(complex_point, 2),
            real = round(Re(complex_point), 2),
            im = round(Im(complex_point), 2),
            mag = round(Mod(complex_point), 2),
            rad = round(angle, 2),
            grados = round(angle * 180 / pi, 2),
            conj = round(Conj(complex_point), 2),
            arg_grados = round(conj_angle * 180/pi, 2),
            inv = round(Conj(complex_point)/mag^2, 2),
            
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
              $z_2 = -{real} + {im}i$
  
              They can perform the next operations:
  
              **Sum**
  
              It is performed component by component
              ",
              z = round(complex_point, 2),
              real = round(cos(120), 2),
              im = round(sin(120), 2)
            )
          )
        )
      )
    })
  })
}
