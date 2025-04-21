orbit_server <- function(id, data) {
  moduleServer(id, function(input, output, session) {
    avgRad <- function(e) {
      num <- 5.67e-8 * (5772**4) * (6.957e8**2)
      den <- (1.496e11**2) * ((1 - (e**2))**2)
      mean <- (num / den) * (1 + (e**2) / 2)
    }

    change <- function(ec, ne) {
      taylor(f = avgRad, var = list(e = ec), order = 5)$f %>%
        paste0("0 * ", .) %>%
        str2lang() %>%
        eval(list(e = ne)) %>%
        round(2)
    }

    output$info <- renderUI({
      withMathJax(
        HTML(
          markdown(
            "
             #### **Theoretical Background**

             The mean solar radiation at the top of Earth's atmosphere is influenced by Earth's orbital parameters, particularly its **orbital eccentricity** (ε). This demonstration investigates how ε affects the annual distribution of solar radiation by considering the following key aspects:

             1. **Geometry of Earth's orbit**: Earth's orbit is not perfectly circular but elliptical, which causes variations in the Earth-Sun distance throughout the year.  
             2. **Kepler's equation**: Describes orbital movement.  
             3. **Stefan-Boltzmann equation**: Relates the energy radiated by a black body to its temperature, providing the basis for calculating solar radiation.  

             **Key Definitions**

             - **True anomaly** ((\\nu)): The angle between the perihelion and Earth's current position, measured at the Sun.
             - **Mean anomaly** ((M)): The fraction of an orbital period that has elapsed since perihelion, expressed in angular terms.
             - **Eccentric anomaly** ((E)): An auxiliary angle used to relate the mean anomaly to the true anomaly.

             > **Kepler's Equation & Numerical Solution**
             >
             > Kepler's equation is a fundamental relationship in orbital mechanics:
             > $$M = E - \\varepsilon\\sin E$$
             >
             > Since this equation is transcendental, it cannot be solved algebraically. Instead, numerical methods are required. This implementation uses the **Newton-Raphson method**:
             >
             > ```
             > 1. Initialize E₀ = M
             > 2. Iterate: Eₙ₊₁ = Eₙ - (Eₙ - ε·sinEₙ - M)/(1 - ε·cosEₙ)
             > 3. Repeat until |Eₙ₊₁ - Eₙ| < tolerance
             > ```

             **Fundamental Parameters**

             - **Stefan-Boltzmann constant** ((\\sigma)): \\(5.67 \\times 10^{-8}\\) W/m²K⁴, which relates radiative energy to temperature.
             - **Sun's radius**: \\(6.957 \\times 10^8\\) m.
             - **Sun's temperature**: 5772 K.
             - **Semi-major axis**: \\(1.496 \\times 10^{11}\\) m, the average Earth-Sun distance.
             - **Orbital radius** \\(r(\\varphi)\\): The distance between Earth and the Sun at a given orbital angle \\(\\varphi\\), expressed as:
               $$r(\\varphi) = \\frac{a(1-\\varepsilon^2)}{1 + \\varepsilon \\cos(\\varphi)}$$

             This theoretical framework provides the foundation for understanding how variations in Earth's orbital eccentricity influence the distribution and intensity of solar radiation received throughout the year.
            "
          )
        )
      )
    })

    output$derivation <- renderUI({
      withMathJax(
        HTML(
          markdown(
            glue(
              "
              #### **Derivation of Mean Annual Radiation**
              
              **Step 1:** The energy emitted by the Sun must equal the energy received by the Earth at the top of its atmosphere. This is expressed as:  
              $$\\Rightarrow 4\\pi R_s^2 \\cdot \\sigma T^4 = S \\cdot 4\\pi R_{{S-E}}^2$$  
              Where \\(R_s\\) is the Sun's radius, \\(\\sigma\\) is the Stefan-Boltzmann constant, \\(T\\) is the Sun's temperature, and \\(R_{{S-E}}\\) is the distance between the Sun and the Earth.

              **Step 2:** The instantaneous solar constant \\(S\\) is defined as the energy per unit area received at the top of Earth's atmosphere:  
              $$\\Rightarrow S = \\sigma T^4 \\cdot \\left(\\frac{{R_s}}{{R_{{S-E}}}}\\right)^2$$  
              This relates solar radiation to the Earth-Sun distance.

              **Step 3:** To calculate the mean annual radiation \\(\\bar{{S}}\\), an orbital average is performed, accounting for the variation in \\(R_{{S-E}}\\) throughout the year:  
              $$\\Rightarrow \\bar{{S}} = \\sigma T^4 \\cdot R_s^2 \\cdot \\frac{{1}}{{2\\pi}} \\int_0^{{2\\pi}} \\frac{{1}}{{R_{{S-E}}(\\varphi)}} d\\varphi$$  
              Here, \\(\\varphi\\) is the orbital angle.

              **Step 4:** Substituting the expression for \\(R_{{S-E}}(\\varphi)\\) and solving the angular integral:  
              $$\\Rightarrow \\bar{{S}} = \\frac{{\\sigma T^4 \\cdot R_s^2}}{{2\\pi}} \\int_0^{{2\\pi}} \\left(\\frac{{1 + \\varepsilon \\cos(\\varphi)}}{{a(1-\\varepsilon^2)}}\\right)^2 d\\varphi$$  
              After expanding and simplifying:  
              $$\\Rightarrow \\bar{{S}} = \\frac{{\\sigma T^4 \\cdot R_s^2}}{{2\\pi \\cdot a^2(1-\\varepsilon^2)^2}} \\left[2\\pi + \\pi\\varepsilon^2\\right]$$

              **Step 5:** Finally, the simplified expression for \\(\\bar{{S}}\\) is obtained:  
              $$\\Rightarrow \\bar{{S}} = \\frac{{\\sigma T^4 \\cdot R_s^2}}{{a^2(1-\\varepsilon^2)^2}} \\left(1 + \\frac{{\\varepsilon^2}}{{2}}\\right)$$  
              This shows how the orbital eccentricity \\(\\varepsilon\\) affects the mean annual radiation.

              **Numerical result for ε = {e}:**  
              $$\\bar{{S}} = {s}$$
              ",
              e = data()$e,
              s = avgRad(data()$e) %>% round(2)
            )
          )
        )
      )
    })

    output$sensitivity <- renderUI({
      withMathJax(
        HTML(
          markdown(
            glue(
              "
              #### **Radiation Sensitivity to Eccentricity**

              To understand how small changes in Earth's orbit affect the radiation reaching the top of the atmosphere,
              a sensitivity analysis is performed by taking the derivative of the mean annual solar radiation at the 
              top of the atmosphere and evaluating it in terms of small ε changes. 
              
              Base expression:  
              $$\\Rightarrow \\bar{{S}} = \\frac{{\\sigma T^4 \\cdot R_s^2}}{{ a^2(1-\\varepsilon^2)^2}} \\cdot (1 + \\frac{{\\varepsilon^2}}{{2}})$$
              $$\\Rightarrow \\text{{Let }} C = \\frac{{\\sigma T^4 R_s^2}}{{a^2}}$$
              $$\\Rightarrow \\bar{{S}} = C \\cdot \\frac{{1 + \\varepsilon^2/2}}{{(1 - \\varepsilon^2)^2}}$$

              **Step 1:** Applying the quotient rule:  
              $$\\Rightarrow \\frac{{d\\bar{{S}}}}{{d\\varepsilon}} = C \\cdot \\frac{{[(1-\\varepsilon^2)^2 \\cdot \\varepsilon] - [(1 + \\varepsilon^2/2) \\cdot -4\\varepsilon(1 - \\varepsilon^2)]}}{{(1 - \\varepsilon^2)^4}}$$

              **Step 2:** Simplify the numerator
              $$\\Rightarrow \\frac{{d\\bar{{S}}}}{{d\\varepsilon}} = C \\cdot \\frac{{[(1-\\varepsilon^2)^2 \\cdot \\varepsilon] - [-4\\varepsilon(1 - \\varepsilon^2) - 2\\varepsilon^3(1 - \\varepsilon^2)]}}{{(1-\\varepsilon^2)^4}}$$  
              $$\\Rightarrow \\frac{{d\\bar{{S}}}}{{d\\varepsilon}} = C \\cdot \\frac{{\\varepsilon(1-\\varepsilon^2)^2 + 4\\varepsilon(1 - \\varepsilon^2) + 2\\varepsilon^3(1 - \\varepsilon^2)}}{{(1-\\varepsilon^2)^4}}$$

              **Step 3:** Factorizing common terms
              $$\\Rightarrow \\frac{{d\\bar{{S}}}}{{d\\varepsilon}} = C \\cdot \\frac{{(1-\\varepsilon^2) \\cdot [\\varepsilon(1-\\varepsilon^2) + 4\\varepsilon + 2\\varepsilon^3]}}{{(1-\\varepsilon^2)^4}}$$

              The final expression for the derivative is:  
              $$\\Rightarrow \\frac{{d\\bar{{S}}}}{{d\\varepsilon}} = \\frac{{\\sigma T^4 R_s^2}}{{a^2}} \\cdot \\frac{{\\varepsilon^3 + 5\\varepsilon}}{{(1-\\varepsilon^2)^3}}$$  
              This shows how sensitive the mean radiation is to changes in eccentricity \\(\\varepsilon\\).

              **W/m² {value} when ε changes from {e} to {ne}:**  
              $$\\Rightarrow \\frac{{d\\bar{{S}}}}{{d\\varepsilon}} = {ds}$$
              ",
              value = ifelse(
                change(data()$e, input$ne) > 0,
                "additional",
                "reduced"
              ),
              e = data()$e,
              ne = input$ne,
              ds = change(data()$e, input$ne)
            )
          )
        )
      )
    })
  })
}
