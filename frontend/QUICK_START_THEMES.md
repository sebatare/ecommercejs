# 🚀 Guía Rápida - Sistema de Temas

## Inicio Rápido

### 1. Ver Temas Disponibles

El selector de temas está en el navbar (ícono de engranaje). Haz clic para ver todos los temas disponibles.

### 2. Cambiar Tema Programáticamente

```typescript
import { useTheme } from "@/composables/useTheme";

const { setTheme } = useTheme();

// Cambiar a tema oscuro
setTheme("dark");

// Cambiar a tema minimalista
setTheme("minimalist");
```

### 3. Usar Colores en Componentes

**Opción A: Variables CSS**

```vue
<div :style="{ color: 'var(--color-primary)' }">
  Texto con color primario
</div>
```

**Opción B: Clases de Utilidad**

```vue
<p class="text-primary">Texto primario</p>
<button class="btn-primary">Botón primario</button>
```

**Opción C: Composable**

```vue
<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const { getColorValue } = useTheme();
const primaryColor = getColorValue("primary");
</script>

<template>
  <div :style="{ color: primaryColor }">Texto dinámico</div>
</template>
```

---

## 📋 Colores Disponibles

| Variable             | Uso                      |
| -------------------- | ------------------------ |
| `--color-primary`    | Color principal del tema |
| `--color-secondary`  | Color secundario         |
| `--color-success`    | Estados exitosos (verde) |
| `--color-danger`     | Estados de error (rojo)  |
| `--color-warning`    | Advertencias (naranja)   |
| `--color-info`       | Información (azul)       |
| `--color-text`       | Texto principal          |
| `--color-text-light` | Texto más claro          |
| `--color-bg`         | Fondo principal          |
| `--color-border`     | Bordes                   |

---

## 🎨 Clases de Utilidad

### Texto

```html
<p class="text-primary">Primario</p>
<p class="text-success">Éxito</p>
<p class="text-danger">Peligro</p>
<p class="text-warning">Advertencia</p>
<p class="text-default">Por defecto</p>
<p class="text-muted">Mutado</p>
```

### Botones

```html
<button class="btn-primary">Primario</button>
<button class="btn-secondary">Secundario</button>
<button class="btn-success">Éxito</button>
<button class="btn-danger">Peligro</button>
```

### Badges

```html
<span class="badge-primary">Etiqueta</span>
<span class="badge-success">Éxito</span>
<span class="badge-danger">Error</span>
<span class="badge-warning">Advertencia</span>
<span class="badge-info">Info</span>
```

### Fondos

```html
<div class="bg-primary">Fondo primario</div>
<div class="bg-secondary">Fondo secundario</div>
```

### Gradientes

```html
<div class="gradient-primary">Gradiente primario</div>
<div class="gradient-success">Gradiente éxito</div>
```

### Cards

```html
<div class="card">Contenido en tarjeta</div>
```

### Inputs

```html
<input type="text" class="input-primary" placeholder="Input temático" />
```

---

## 📱 Espaciado

```css
var(--spacing-xs)   /* 0.25rem */
var(--spacing-sm)   /* 0.5rem */
var(--spacing-md)   /* 1rem */
var(--spacing-lg)   /* 1.5rem */
var(--spacing-xl)   /* 2rem */
var(--spacing-2xl)  /* 3rem */
```

---

## 🔧 Crear Nuevo Tema

1. Abre `frontend/src/config/themes.ts`
2. Define un nuevo tema:

```typescript
export const miTema: Theme = {
  name: "mi-tema",
  colors: {
    primary: "#your-color",
    primaryLight: "#lighter-color",
    primaryDark: "#darker-color",
    secondary: "#your-color",
    success: "#your-color",
    danger: "#your-color",
    warning: "#your-color",
    info: "#your-color",
    bg: "#your-color",
    bgLight: "#your-color",
    bgDark: "#your-color",
    text: "#your-color",
    textLight: "#your-color",
    border: "#your-color",
  },
};
```

3. Agrégalo al objeto `themes`:

```typescript
export const themes: Record<string, Theme> = {
  "indigo-purple": defaultTheme,
  dark: darkTheme,
  minimalist: minimalistTheme,
  natural: naturalTheme,
  professional: professionalTheme,
  "mi-tema": miTema, // ← Nuevo tema
};
```

4. ¡Listo! El tema aparecerá en el selector

---

## 💡 Ejemplos Comunes

### Botón con Color Tema

```vue
<template>
  <button class="btn-primary" @click="handleClick">Haz clic</button>
</template>

<script setup lang="ts">
function handleClick() {
  console.log("Clicked!");
}
</script>
```

### Card con Tema

```vue
<template>
  <div class="card">
    <h3 class="text-primary">Título</h3>
    <p class="text-muted">Descripción</p>
    <button class="btn-primary">Acción</button>
  </div>
</template>
```

### Selector de Tema

```vue
<template>
  <select v-model="selectedTheme" @change="setTheme(selectedTheme)">
    <option v-for="theme in getAllThemeNames()" :key="theme" :value="theme">
      {{ theme }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import { ref } from "vue";

const { currentThemeName, setTheme, getAllThemeNames } = useTheme();
const selectedTheme = ref(currentThemeName.value);
</script>
```

---

## 🎯 Temas Disponibles

1. **indigo-purple** - Profesional (por defecto)
2. **dark** - Tema oscuro
3. **minimalist** - Minimalista
4. **natural** - Naturalista
5. **professional** - Profesional azul marino

---

## 📚 Documentación Completa

Para más detalles, consulta:

- [THEME_SYSTEM.md](./THEME_SYSTEM.md) - Documentación completa
- [CAMBIOS_REALIZADOS.md](./CAMBIOS_REALIZADOS.md) - Resumen de cambios

---

## ✅ Checklist

- [ ] He visto el selector de temas en el navbar
- [ ] He probado cambiar de tema
- [ ] He usado variables CSS en mis componentes
- [ ] He creado un nuevo tema personalizado
- [ ] He integrado el sistema en mi componente

---

## 🆘 Problemas Comunes

**P: Los colores no cambian**
R: Asegúrate de importar `useTheme` o usar variables CSS correctamente

**P: El selector no aparece**
R: Verifica que `ThemeSwitcher` esté importado en el Navbar

**P: Quiero resetear al tema por defecto**
R: Usa `setTheme('indigo-purple')`

---

**¡Felicidades! Ya estás usando el sistema de temas. 🎉**
