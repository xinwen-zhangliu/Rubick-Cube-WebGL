# Diseño
El diseño del modelo del cubo Rubik se hace utilizando el objeto Cubo creado en clase. Un cubo Rubik de 3x3x3 está conformado de 27 cubos más chicos.

Para poder diferenciar cada cubo a estos se le aplica una textura transparente la cual tiene un valor de color diferente para cada cubo, de esta manera sabemos cual cubos el usuario ha presionado. 

La lógica general para girar una cara se basa en 3 variables, el axis sobre el cual va a girar, la dirección del giro, y la capa sobre el axis. De esta manera podemos determinar todos los cubos adjuntos a la capa y girarlos de manera unificada. 

Para saber qué cubos conforman una cara solo es necesario saber la capa del axis sobre la que se encuentran y seleccionar todos los que conciden. 

Una vez que sabemos esto, podemos aplicar la rotación a estos. Para crear la animación de la rotación se dibujan rotaciones intermedias hasta llegar a los 90 grados. 

Una vez rotados y trasladados los cubos de la capa, estos se tiene que actualizar en nuestro arreglo, ya que ahora tiene una nueva posición.


# Rotaciones

Para rotar cada cara usamos la siguiente fórmula de rotación, la cual aplica la rotación sobre un axis arbitrario

![alt text](https://wikimedia.org/api/rest_v1/media/math/render/svg/80ff6ba71d60b7128098e1cbaf70c0e268421656)

después de cada rotación se actualizan los axises de cada cubo, por ejemplo si una cara  gira 90° hacia la derecha sobre el eje z, se aplica la siguiente transformación sobre la mantriz anterior
```
[  0, 1, 0,
  -1, 0, 0,
   0, 0, 1  ]
```

la relación del eje z sobre esa capa no cambia por lo que la última fila no cambia, sin embargo, los ejes x y y se intercambian y como la vista del plano se cambia, el nuevo eje y es el eje x previo con rotaciones de sentido contrario.

Entonces utilizando es dos conceptos para la rotación podemos actualizar los nuevos estados de cada cubo después de girarse. Así es como el cubo se dibuja de manera correcta al combinar múltiples rotaciones. 

# Selección de cubos

La habilidad de saber cual cubo es seleccionado y deseleccionado radica en la textura transparente que se dibuja. Esta sigue la misma transformación que los cubos, pero siempre manteniendo su estado relativo al eje. Por lo que la coordenada en cada punto en el espacio siempre se mantiene como la misma incluso si un nuevo  cubo toma ese lugar al rotarlo. 

Como el r,g,b recibe valores de 0 a 1, se tiene que normalizar los valores antes de utilizarlos.

# Controles

Una vez seleccionado un cubo, este se pude girar en base a los 3 ejes, x, y, z.
Los ejes siempre se mantienen estaticos en relación a la rotación del cubo, o sea, la cara superior del eje y siempre se mantendrá como la misma sin importar si se empiezan a girar las caras del cubo.
```
       y
     /    \ 
   /        \
   |\      / |
z  |  \  /   |     x
    \   |   /
      \ |  /
```

Para girar en relación a cada eje se presionan las siguientes teclas:
X : a
Y : s
Z : d

Presionar las teclas como minúsculas hace que giren las caras en sentido de las manecillas del reloj, y para que giren en sentido contrario a estas,  necesitamos presionar SHIFT al escoger un eje o usar la versión mayúscula.

