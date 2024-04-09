<template>
  <div class="p-8 pb-0 text-orange-500">
    <h1 class="text-4xl font-bold mb-4">Random Meals</h1>
  </div>
  <Meals :meals="meals" />
</template>

<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import store from "../store";
import Meals from "../components/Meals.vue";
import axiosClient from "../axiosClient.js";
import { useHead } from '@vueuse/head'

const meals = ref([]);
const meal = ref([]);
onMounted(async () => {
  for (let i = 0; i < 10; i++) {
    axiosClient
      .get(`random.php`)
      .then(({ data }) => meals.value.push(data.meals[0]));
  }
});
onMounted(async () => {
  axiosClient.get(`lookup.php?i=53057`)
    .then(({ data }) => {
      meal.value = data.meals[0] || {}
    })

  const canonicalLink = document.createElement('link');
  canonicalLink.rel = 'canonical';
  canonicalLink.href = document.location.href;
  document.head.appendChild(canonicalLink);
})

const siteData = reactive({
  title: `Meals Home`,
  description: `Meals Home Details`
})
const mealDetails = computed(() => ({
  title: meal.value.strMeal,
  description: meal.value.strInstructions,
  image: meal.value.strMealThumb,
  url: meal.value.strYoutube,
}))
useHead({
  // Can be static or computed
  title: computed(() => mealDetails.value.title),
  meta: [
    {
      name: `description`,
      content: computed(() => mealDetails.value.description),
    },
    {
      // Additional meta tag
      name: `keywords`,
      content: computed(() => "food, recipe, cooking"),
    },
    {
      property: 'og:locale',
      content: 'en_US'
    },
    {
      property: 'og:image',
      content: computed(() => mealDetails.value.image)
    },
    {
      property: 'og:name',
      content: 'website'
    },
    {
      property: 'og:type',
      content: 'meals.item'
    },
    {
      property: 'og:title',
      content: 'Meals App'
    },
    {
      property: 'og:description',
      content: 'Meals App Home'
    },
    {
      property: 'og:url',
      content: computed(() => document.location.href)
    },
    {
      property: 'og:site_name',
      content: 'Meals'
    },
    {
      property: 'og:image:alt',
      content: 'Meals App | Home'
    },
    {
      property: 'og:image:width',
      content: '1200'
    },
    {
      property: 'og:image:height',
      content: '630'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:image',
      content: computed(() => mealDetails.value.image)
    },
    {
      name: 'twitter:title',
      content: 'Meals App'
    },
    {
      name: 'twitter:description',
      content: 'Meals App Home'
    },
    {
      name: 'twitter:site',
      content: '@Meals'
    },
    {
      name: 'twitter:creator',
      content: '@Meals'
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: mealDetails.value.title,
        description: mealDetails.value.description,
        image: [mealDetails.value.image],
      })),
    },
  ],
})
</script>
