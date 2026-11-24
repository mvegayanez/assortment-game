# Juego del surtido · «La Despensa» (UD5 Category Management)

Juego web bilingüe (ES/EN) para practicar el surtido: niveles jerárquicos y criterios de clasificación.
5 rondas cronometradas (25 min), 2 pistas por ronda, revisión de fallos, ranking arcade y panel del profesor.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | El juego (enlace para los alumnos) |
| `ranking.html` | TOP 10 estilo arcade para proyectar en clase (se actualiza solo cada 10 s) |
| `profesor.html` | Panel del profesor (con PIN): notas, aciertos por ronda, ítems más fallados, CSV |
| `config.js` | **Lo único que hay que editar**: URL y clave de Supabase, PIN y tiempos |
| `supabase.sql` | Crea la tabla `surtido_partidas` con sus permisos |
| `assets/data.js` | Banco de productos, cadenas, lineales y encargos (copiado de la hoja de revisión) |

## Puesta en marcha (unos 10 minutos)

1. **Supabase.** En tu proyecto (puede ser el mismo del simulacro CRM): *SQL Editor → New query*, pega `supabase.sql` y pulsa *Run*.
2. **config.js.** Copia *Project Settings → API → Project URL* y la clave *anon public* en `SUPABASE_URL` y `SUPABASE_ANON_KEY`. Cambia `PROFESOR_PIN`.
3. **GitHub Pages.** Sube la carpeta completa a un repositorio (o a una subcarpeta del repo del CRM) y activa *Settings → Pages*.
4. **Prueba.** Juega una partida con el grupo `PRUEBA` y bórrala después con la línea comentada al final de `supabase.sql`.

## Enlaces para clase

- Alumnos: `https://TU-USUARIO.github.io/REPO/index.html?grupo=MKT-2A`
  (con `?grupo=` el alumno no tiene que escribir su grupo y el ranking sale por clase)
- Proyector: `https://TU-USUARIO.github.io/REPO/ranking.html?grupo=MKT-2A`
- Profesor: `https://TU-USUARIO.github.io/REPO/profesor.html`

Truco para probar rápido: añade `&tiempo=0.1` a la URL del juego y cada ronda dura un 10 % del tiempo (solo permite acortar).

## Puntuación

- 100 puntos por ronda, repartidos entre los ítems. Bonus de hasta +10 si se termina antes de tiempo (proporcional a los aciertos).
- Cada pista resta 10 puntos. Máximo 2 por ronda: la 1.ª recuerda la teoría y la 2.ª ayuda en concreto.
- Puesto final según el % sobre 500: Category Manager del mes (≥90), Category Manager (≥75), Jefe de sección (≥60), Reponedor (≥40), Reponedor en prácticas.
- El ranking muestra la mejor partida de cada alumno (nombre + grupo).

## Nota sobre privacidad

La clave *anon* de Supabase es pública por diseño. Con los permisos del SQL, cualquiera con el enlace puede añadir y leer partidas (nombre, grupo, puntos), pero nadie puede modificarlas ni borrarlas. El PIN del panel solo es una barrera ligera.
