# Sistema de Temas y Colores - Documentación

## Descripción General

El sistema de temas permite cambiar fácilmente los colores de la aplicación sin necesidad de modificar el código. Se pueden seleccionar entre varios temas predefinidos o crear nuevos temas personalizados.

## Temas Disponibles

1. **Indigo & Purple** (por defecto) - Tema profesional con colores índigo y púrpura
2. **Dark** - Tema oscuro para trabajar en ambientes con poca luz
3. **Minimalist** - Tema minimalista con colores gris y azul
4. **Natural** - Tema naturalista con tonos verdes
5. **Professional** - Tema profesional con azul marino

## Estructura de Archivos

```
frontend/src/
├── config/
│   └── themes.ts              # Configuración de temas y colores
├── composables/
│   └── useTheme.ts            # Composable para manejar temas
├── assets/styles/
│   └── themes.css             # Variables CSS y clases de utilidad
├── components/
│   └── ThemeSwitcher.vue      # Componente para cambiar temas
└── main.ts                    # Importación de estilos (incluye themes.css)
```

## Cómo Usar

### 1. En Componentes

Usa el composable `useTheme` para acceder al tema actual y sus funcionalidades:

```vue
<template>
  <div>
    <p>Tema actual: {{ currentThemeName }}</p>
    <button @click="setTheme('dark')">Cambiar a Dark</button>
    <p :style="{ color: getColorValue('primary') }">
      Este texto usa el color primario del tema
    </p>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const { currentThemeName, setTheme, getColorValue } = useTheme();
</script>
```

### 2. Con Variables CSS

Usa las variables CSS directamente en tus estilos. Las variables se actualizan automáticamente cuando cambias de tema:

```vue
<style scoped>
.button {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.button:hover {
  background-color: var(--color-primary-dark);
}
</style>
```

### 3. Clases de Utilidad

Usa las clases predefinidas para estilos comunes:

```vue
<template>
  <div>
    <!-- Colores de texto -->
    <p class="text-primary">Texto en color primario</p>
    <p class="text-success">Texto en color éxito</p>

    <!-- Fondos -->
    <div class="bg-primary">Fondo primario</div>
    <div class="bg-secondary">Fondo secundario</div>

    <!-- Botones -->
    <button class="btn-primary">Botón Primario</button>
    <button class="btn-secondary">Botón Secundario</button>
    <button class="btn-danger">Botón Peligro</button>

    <!-- Badges -->
    <span class="badge-primary">Etiqueta Primaria</span>
    <span class="badge-success">Éxito</span>
    <span class="badge-danger">Peligro</span>

    <!-- Cards -->
    <div class="card">Contenido dentro de una tarjeta</div>

    <!-- Gradientes -->
    <div class="gradient-primary">Gradiente Primario</div>
  </div>
</template>
```

### 4. ThemeSwitcher - Componente de Selección

Integra el componente `ThemeSwitcher` en el navbar:

```vue
<template>
  <nav>
    <div>Logo</div>
    <ul>
      <li><router-link to="/">Inicio</router-link></li>
      <li><ThemeSwitcher /></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
</script>
```

## Variables CSS Disponibles

### Colores

```css
--color-primary          /* Color primario del tema */
--color-primary-light    /* Versión clara del primario */
--color-primary-dark     /* Versión oscura del primario */
--color-secondary        /* Color secundario */
--color-success          /* Color para estados exitosos */
--color-danger           /* Color para estados peligrosos */
--color-warning          /* Color para advertencias */
--color-info             /* Color para información */
--color-bg               /* Fondo principal */
--color-bg-light         /* Fondo claro */
--color-bg-dark          /* Fondo oscuro */
--color-text             /* Texto principal */
--color-text-light       /* Texto más claro */
--color-border           /* Color de bordes */
```

### Espaciado

```css
--spacing-xs    /* 0.25rem */
--spacing-sm    /* 0.5rem */
--spacing-md    /* 1rem */
--spacing-lg    /* 1.5rem */
--spacing-xl    /* 2rem */
--spacing-2xl   /* 3rem */
```

### Bordes

```css
--border-radius-sm  /* 6px */
--border-radius-md  /* 12px */
--border-radius-lg  /* 16px */
--border-radius-xl  /* 20px */
```

### Sombras

```css
--shadow-sm    /* Sombra pequeña */
--shadow-md    /* Sombra media */
--shadow-lg    /* Sombra grande */
--shadow-xl    /* Sombra extra grande */
```

### Transiciones

```css
--transition-fast   /* 150ms */
--transition-base   /* 300ms */
--transition-slow   /* 500ms */
```

## Crear un Nuevo Tema

Para crear un nuevo tema personalizado, edita el archivo `frontend/src/config/themes.ts`:

```typescript
export const miTema: Theme = {
  name: "mi-tema",
  colors: {
    primary: "#ff0000",
    primaryLight: "#ff6666",
    primaryDark: "#cc0000",
    secondary: "#0000ff",
    success: "#00ff00",
    danger: "#ff0000",
    warning: "#ffff00",
    info: "#00ffff",
    bg: "#ffffff",
    bgLight: "#f5f5f5",
    bgDark: "#e0e0e0",
    text: "#000000",
    textLight: "#666666",
    border: "#cccccc",
  },
};

// Agregar al objeto de temas
export const themes: Record<string, Theme> = {
  "indigo-purple": defaultTheme,
  dark: darkTheme,
  minimalist: minimalistTheme,
  natural: naturalTheme,
  professional: professionalTheme,
  "mi-tema": miTema, // Nuevo tema
};
```

El nuevo tema estará automáticamente disponible en el `ThemeSwitcher`.

## Persistencia del Tema

El tema seleccionado se guarda automáticamente en `localStorage` bajo la clave `app_theme`, por lo que cuando el usuario regrese, tendrá el mismo tema que seleccionó antes.

## Compatibilidad

El sistema de temas es completamente compatible con Tailwind CSS. Puedes seguir usando clases de Tailwind mientras usas las variables CSS para los colores temáticos.

### Ejemplo Mixto

```vue
<style scoped>
.card {
  /* Variables CSS para el tema */
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);

  /* Clases de Tailwind */
  padding: 1rem;
  rounded-lg;
  shadow-md;
}
</style>
```

## Notas Importantes

1. El tema se aplica globalmente a toda la aplicación a través de variables CSS en el `:root`
2. Los cambios de tema son instantáneos en toda la aplicación
3. Los temas se cargan del localStorage al iniciar la aplicación
4. Se puede programatically acceder al tema actual usando el composable `useTheme`

## Troubleshooting

### Los colores no cambian cuando cambio de tema

Asegúrate de:

1. Haber importado `themes.css` en `main.ts`
2. Estés usando variables CSS (`var(--color-*)`) o clases de utilidad
3. El tema esté correctamente definido en `config/themes.ts`

### Las clases de utilidad no funcionan

Verifica que:

1. El archivo `themes.css` esté correctamente importado
2. No haya conflictos de estilos CSS
3. Las clases estén siendo aplicadas correctamente en los elementos
