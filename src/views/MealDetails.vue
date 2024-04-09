<template>
  <div class="max-w-[800px] mx-auto p-8">
    <h1 class="text-4xl font-bold mb-5 text-orange-500">{{ meal.strMeal }}</h1>
    <img :src="meal.strMealThumb" :alt="meal.strMeal" class="max-w-[100%]">
    <div class="grid grid-cols-1 sm:grid-cols-3 text-lg py-2">
      <div>
        <strong class="font-bold">Category:</strong> {{ meal.strCategory }}
      </div>
      <div>
        <strong class="font-bold">Area:</strong> {{ meal.strArea }}
      </div>
      <div>
        <strong class="font-bold">Tags:</strong> {{ meal.strTags }}
      </div>
    </div>

    <div class="my-3">
      {{ meal.strInstructions }}
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2">
      <div>
        <h2 class="text-2xl font-semibold mb-2">Ingredients</h2>
        <ul>
          <template v-for="(el, ind) of new Array(20)">
            <li v-if="meal[`strIngredient${ind + 1}`]">
              {{ ind + 1 }}. {{ meal[`strIngredient${ind + 1}`] }}
            </li>
          </template>
        </ul>
      </div>
      <div>
        <h2 class="text-2xl font-semibold mb-2">Measures</h2>
        <ul>
          <template v-for="(el, ind) of new Array(20)">
            <li v-if="meal[`strMeasure${ind + 1}`]">
              {{ ind + 1 }}. {{ meal[`strMeasure${ind + 1}`] }}
            </li>
          </template>
        </ul>
      </div>
      <div class="mt-4">
        <YouTubeButton :href="meal.strYoutube" />
        <a :href="meal.strSource" target="_blank"
          class="ml-3 px-3 py-2 rounded border-2 border-transparent text-indigo-600 transition-colors">
          View Original Source
        </a>
      </div>
    </div>


  </div>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router';
import axiosClient from '../axiosClient';
import YouTubeButton from '../components/YouTubeButton.vue';
import { useHead } from '@vueuse/head'

const route = useRoute();
const meal = ref({})

onMounted(async () => {
  axiosClient.get(`lookup.php?i=${route.params.id}`)
    .then(({ data }) => {
      meal.value = data.meals[0] || {}
    })

  const canonicalLink = document.createElement('link');
  canonicalLink.rel = 'canonical';
  canonicalLink.href = document.location.href;
  document.head.appendChild(canonicalLink);
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
      name: 'keywords',
      content: 'food, recipe, cooking'
    },
    {
      property: 'og:title',
      content: computed(() => mealDetails.value.title)
    },
    {
      property: 'og:description',
      content: computed(() => mealDetails.value.description)
    },
    {
      property: 'og:image',
      content: computed(() => mealDetails.value.image)
    },
    {
      property: 'og:url',
      content: computed(() => document.location.href)
    },
    {
      property: 'og:type',
      content: 'article'
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
