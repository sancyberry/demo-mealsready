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
  try {
    const { data } = await axiosClient.get(`lookup.php?i=${route.params.id}`);
    meal.value = data.meals?.[0] || {};
  } catch (error) {
    console.error('Error fetching meal data:', error);
  }

  const canonicalLink = document.createElement('link');
  canonicalLink.rel = 'canonical';
  canonicalLink.href = document.location.href;
  document.head.appendChild(canonicalLink);
})

useHead({
  // Can be static or computed
  title: computed(() => meal.value.strMeal),
  meta: [
    {
      name: `description`,
      content: computed(() => meal.value.strInstructions),
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
      content: computed(() => meal.value.strMealThumb)
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
      content: computed(() => meal.value.strMealThumb)
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
        name: meal.value.strMeal,
        description: meal.value.strInstructions,
        image: [meal.value.strMealThumb],
      })),
    },
  ],
})

</script>
