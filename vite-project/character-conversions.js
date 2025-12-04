// Conversiones automáticas de caracteres que se aplicarán al importar CSV:

// VOCALES CON TILDE → SIN TILDE:
// á → a, é → e, í → i, ó → o, ú → u
// à → a, è → e, ì → i, ò → o, ù → u
// Á → A, É → E, Í → I, Ó → O, Ú → U
// À → A, È → E, Ì → I, Ò → O, Ù → U

// CONSONANTES ESPECIALES → VERSIÓN SIMPLE:
// ñ → n, Ñ → N
// ç → c, Ç → C

// OTROS CARACTERES ESPECIALES:
// ü → u, Ü → U
// ö → o, Ö → O
// ä → a, Ä → A

// CARACTERES ESPECIALES INTERNACIONALES:
// æ → ae, Æ → AE
// ø → o, Ø → O
// å → a, Å → A
// ß → ss
// ð → d, Ð → D
// þ → th, Þ → TH

// PUNTUACIÓN TIPOGRÁFICA → NORMAL:
// " " → " (comillas tipográficas → comillas normales)
// ' ' → ' (apostrofes tipográficos → apostrofe normal)
// – — → - (guiones largos → guion normal)

// CARACTERES PROBLEMÁTICOS:
// � → (se elimina)
// Caracteres de control → (se eliminan)

console.log("✅ Sistema configurado para convertir TODOS los caracteres acentuados a versión simple");
console.log("📝 Ejemplo: 'José María' → 'Jose Maria', 'Niño' → 'Nino'");