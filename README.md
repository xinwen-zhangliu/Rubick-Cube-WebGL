# Diseño
El diseño del modelo del cubo Rubik se hace utilizando el objeto Cubo creado en clase. Un cubo Rubik de 3x3x3 está conformado de 27 cubos más chicos.

Para poder diferenciar cada cubo a estos se le aplica una textura transparente la cual tiene un valor de color diferente para cada cubo, de esta manera sabemos cual cubos el usuario ha presionado. 

La lógica general para girar una cara se basa en 3 variables, el axis sobre el cual va a girar, la dirección del giro, y la capa sobre el axis. De esta manera podemos determinar todos los cubos adjuntos a la capa y girarlos de manera unificada. 

Para saber qué cubos conforman una cara solo es necesario saber la capa del axis sobre la que se encuentran y seleccionar todos los que conciden. 

Una vez que sabemos esto, podemos aplicar la rotación a estos. Para crear la animación de la rotación se dibujan rotaciones intermedias hasta llegar a los 90 grados. 

Una vez rotados y trasladados los cubos de la capa, estos se tiene que actualizar en nuestro arreglo, ya que ahora tiene una nueva posición.


# Rotaciones

Como sabemos nuestr cubo tiene una

# Controles

Una vez seleccionado un cubo, este se pude girar en base a los 3 ejes, x, y, z.
Los ejes siempre se mantienen estaticos en relación a la rotación del cubo, o sea, a cara superior del eje y siempre se mantendrá como la misma sin importar si se empiezan a girar las caras del cubo.

       y
     /    \ 
   /        \
   |\      / |
z  |  \  /   |     x
    \   |   /
      \ |  /


Para girar en relación a cada eje se presionan las siguientes teclas:
X : a
Y : s
Z : d



También existe la opción girar las caras en sentido de las manecillas del reloj, o en sentido contrario a estas,  esto se logra presionando SHIFT al escoger un eje.

