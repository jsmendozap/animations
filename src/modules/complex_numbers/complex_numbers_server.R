complex_numbers_server <- function(id, coords) {
  moduleServer(id, function(input, output, session){

    complex_point <- complex(real = coords$real, imaginary = coords$imaginary)
    z2 <- complex(real = -cos(120), imaginary = sin(120))
    angle <- Arg(complex_point) %>% ifelse(. < 0, 2*pi + ., .)
    conj_angle <- Arg(Conj(complex_point)) %>% ifelse(. < 0, 2*pi + ., .)

    complexPower <- function(z, n) {
      r <- Mod(z)^(1/n)
      angles <- sapply(0:(n-1), \(k) (Arg(z) + 2 * pi * k) / n)
      roots <- sapply(angles, \(theta) complex(real = r * cos(theta), imaginary = r * sin(theta)))
      
      paste(imap(round(roots, 2), ~glue("$z_{.y - 1} = {.x}$  ")), collapse = "\n")
    }

    output$complex_comp <- renderUI({
      withMathJax(
        HTML(
          markdown(
            glue("
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
            inv = round(Conj(complex_point)/mag^2, 2)
            )
          )
        )
      )
    })
    
    output$complex_op <- renderUI({
      withMathJax(
        HTML(
          markdown(
            glue(
              "
              Given 2 complex numbers: 
  
              $z_1 = {z}$  
              $z_2 = {z2}$
  
              They can perform the next operations:
  
              **Addition/substrabtion**
  
              It is performed component by component  
              $z_3 = ({z}) + ({z2}) = {sum}$  

              **Multiplication**

              Given $z_1 = (a + bi)$ and $z_2 = (c + di)$ the product of these two
              complex numbers is given by: $$z_1 \\cdot z_2 = (ac - bd) + (ad + bc)i$$
              Or using polar coordinates:
              $$z_1 \\cdot z_2 = r_1e^{{i\\theta_1}} \\cdot r_2e^{{i\\theta_2}} = r_1r_2e^{{(\\theta_1 + \\theta_2)i}}$$
              $$z_3 = ({r1}\\cdot{r2})e^{{i({arg1} + {arg2})}} = {r3}e^{{{arg3}i}}$$

              **Power**

              Potentiation of complex numbers can be donde by: 
              $$z^n = (re^{{i\\theta}})^n = r^ne^{{in\\theta}}$$  

              >According to the Fundamental Theorem of Algebra, every polynomial of degree
              $n \\ge 1$ has exactly n roots in $\\mathbb{{C}}$. 

              In order to obtain the *k*-th root of $z$, $2\\pi$ must be added
              to the angle to calculate each new angle:
              $$z_k = r^{{1/n}}e^{{i(\\theta + 2\\pi k)/n}}, \\hspace{{0.5cm}} k = 0,\\cdots, n - 1$$
              $$z_k = r^{{1/{n}}}e^{{i({arg1} + 2\\pi k)/{n}}}$$
              With n = {n} the roots are: 

              {roots}
              ",
              z = round(complex_point, 2),
              z2 = round(z2, 2),
              sum = round(sum(z, z2), 2),
              r1 = round(Mod(z), 2),
              r2 = round(Mod(z2), 2),
              r3 = round(r1 * r2),
              arg1 = round(Arg(z), 2),
              arg2 = round(Arg(z2), 2),
              arg3 = round(arg1 + arg2, 2),
              n = coords$roots,
              roots = complexPower(complex_point, n)
            )
          )
        )
      )
    })
  })
}
