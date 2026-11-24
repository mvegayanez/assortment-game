// =====================================================================
//  CONFIGURACIÓN · rellena estos datos con los de tu proyecto Supabase
//  (Supabase → Project Settings → API → Project URL y anon public key)
//  Si los dejas vacíos, el juego funciona en "modo prueba" y guarda las
//  partidas solo en el navegador de cada alumno.
// =====================================================================
window.CONFIG = {
  SUPABASE_URL: "https://znxeznaumvkaxddmwuty.supabase.co",          // p. ej. "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: "sb_publishable_lltjI6VjgwNiZRnsXEl00A_481EyGaq",     // la clave "anon public" (no la service_role)

  // PIN para abrir el panel del profesor (profesor.html).
  // Es solo una barrera ligera: no guardes aquí nada confidencial.
  PROFESOR_PIN: "4321",

  // Segundos por ronda: [R1, R2, R3, R4, R5]  → 25 minutos en total
  TIEMPOS: [300, 180, 360, 300, 360]
};
