<template>
  <div class="relative h-[500px] overflow-hidden">
    <!-- Slides -->
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-all duration-700 ease-in-out"
      :class="index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'"
    >
      <div class="absolute inset-0" :class="`bg-gradient-to-r ${slide.bg} opacity-90`"></div>
      <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />

      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-white px-4">
          <h2 class="text-5xl md:text-7xl font-bold mb-4">{{ slide.title }}</h2>
          <p class="text-xl md:text-2xl mb-8">{{ slide.subtitle }}</p>
          <button
            class="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
          >
            Explorar Ahora
          </button>
        </div>
      </div>
    </div>

    <!-- Dots -->
    <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="setCurrentSlide(index)"
        class="w-3 h-3 rounded-full transition-all"
        :class="index === currentSlide ? 'bg-white w-8' : 'bg-white/50'"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const slides = [
  {
    title: "Bienvenido a Nuestro Ecommerce",
    subtitle: "Descubre los mejores productos al mejor precio",
    image: "/images/banner1.jpg",
    bg: "from-blue-600 to-indigo-700",
  },
  {
    title: "Nuevas Colecciones",
    subtitle: "Explora las últimas tendencias",
    image: "/images/banner2.jpg",
    bg: "from-pink-500 to-red-500",
  },
  {
    title: "Ofertas Especiales",
    subtitle: "Descuentos exclusivos por tiempo limitado",
    image: "/images/banner3.jpg",
    bg: "from-green-500 to-emerald-700",
  },
];

const currentSlide = ref(0);

const setCurrentSlide = (index) => {
  currentSlide.value = index;
};

// Cambio automático cada 5 segundos
let interval;
onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 5000);
});
onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
/* Animación simple opcional */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 1s ease-in-out;
}
</style>
