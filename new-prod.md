## Навигация

**Для пользователя:**

1. Интуитивно — привычная иерархия категорий
2. Гибко — можно углубиться в категорию или искать глобально
3. Быстро — предсказуемые URL и быстрая навигация

**Для SEO:**

1. Чистые URL — /courses/programming/javascript/
2. Структурированные данные — breadcrumbs, категории
3. Внутренние ссылки — перекрёстные рекомендации

**Для разработки:**

1. Масштабируемо — добавляешь коллекцию → автоматически появляется в навигации
2. Типизировано — TypeScript подсказывает доступные категории
3. Переиспользуемо — компоненты навигации работают для всех коллекций

**Возможная логика для выпадающего меню**

```astro
---
// src/components/partials/Header.astro
import { getCollection } from 'astro:content';

// Получаем все категории для меню
const courseCategories = [...new Set(
  (await getCollection('courses')).map(course => course.data.category)
)];

const recipeCategories = [...new Set(
  (await getCollection('recipes')).map(recipe => recipe.data.category)
)];
---

<nav>
  <a href="/">Главная</a>

  <!-- Выпадающее меню "Обучение" -->
  <div class="dropdown">
    <a href="/courses/">Обучение</a>
    <div class="dropdown-content">
      <a href="/courses/">Все курсы</a>
      {courseCategories.map(category => (
        <a href={`/courses/${category}/`}>
          {category}
        </a>
      ))}
    </div>
  </div>

  <!-- Аналогично для других разделов -->
</nav>
```

## Многоуровневая система навигации

### 1. Главное меню (верхний уровень)

```text
Главная       Обучение       Кулинария       Спорт       Кино       Поиск
    |            |              |             |           |           |
    index.astro  courses/       recipes/      workouts/   movies/     search.astro
                 index.astro    index.astro   index.astro index.astro
```

### 2. Второй уровень — категории внутри направлений

**Обучение (`/courses/`):**

```txt
/courses/
├── Программирование    → /courses/programming/
├── Дизайн             → /courses/design/
├── Маркетинг          → /courses/marketing/
└── Все курсы          → /courses/
```

**Кулинария (`/recipes/`):**

```text
/recipes/
├── Десерты            → /recipes/desserts/
├── Основные блюда     → /recipes/main-courses/
├── Салаты             → /recipes/salads/
└── Все рецепты        → /recipes/
```

**Кино (`/movies/`):**

```txt
/movies/
├── Фильмы             → /movies/
├── Сериалы            → /tv-shows/
├── Мультфильмы        → /cartoons/
└── Новинки            → /movies/new/
```

### 3. Третий уровень — фильтрация и теги

```txt
/courses/programming/
├── По сложности:
│   ├── Для начинающих  → /courses/programming/?difficulty=beginner
│   ├── Средний уровень → /courses/programming/?difficulty=intermediate
│   └── Продвинутые     → /courses/programming/?difficulty=advanced
│
├── По технологиям:
│   ├── JavaScript      → /browse/javascript/
│   ├── Python          → /browse/python/
│   ├── Astro           → /browse/astro/
│   └── Все теги        → /courses/programming/tags/
│
└── Сортировка:
    ├── По популярности → /courses/programming/?sort=popular
    ├── По новизне      → /courses/programming/?sort=newest
    └── По длительности → /courses/programming/?sort=duration
```

### 4. Хлебные крошки (на каждой странице)

```txt
Главная > Обучение > Программирование > JavaScript
Главная > Кулинария > Десерты > Торты
Главная > Кино > Сериалы > Новинки
```

## Масштабируемая система фильтрации

### Уровни фильтрации

**Глобальный поиск (по всем коллекциям)**

```ts
// utils/globalSearch.js
export async function searchAllContent(query) {
    const [courses, recipes, movies, tvShows, cartoons, workouts] =
        await Promise.all([
            getCollection('courses'),
            getCollection('recipes'),
            getCollection('movies'),
            getCollection('tv-shows'),
            getCollection('cartoons'),
            getCollection('workouts')
        ])

    // Объединяем с типом для различения
    return [
        ...courses.map((item) => ({ ...item, contentType: 'course' })),
        ...recipes.map((item) => ({ ...item, contentType: 'recipe' })),
        ...movies.map((item) => ({ ...item, contentType: 'movie' }))
        // ... и т.д.
    ].filter(
        (item) =>
            item.data.title.toLowerCase().includes(query.toLowerCase()) ||
            item.data.tags.some((tag) =>
                tag.toLowerCase().includes(query.toLowerCase())
            )
    )
}
```

**Фильтрация внутри категории**

```ts
// pages/courses.astro
const allCourses = await getCollection('courses')
const programmingCourses = allCourses.filter(
    (course) => course.data.category === 'programming'
)
```

**Кросс-категорийная фильтрация**

```ts
// Все контент с тегом "для начинающих"
const beginnerContent = [
    ...(await getCollection('courses')).filter(
        (item) => item.data.difficulty === 'beginner'
    ),
    ...(await getCollection('workouts')).filter((item) =>
        item.data.tags.includes('для-начинающих')
    )
]
```

## Система тегов и категорий

### Единая система тегов (опционально)

```ts
// utils/tagSystem.js
export const globalTags = {
    difficulty: ['beginner', 'intermediate', 'advanced'],
    duration: ['short', 'medium', 'long']
    // ... общие теги across коллекций
}
```

### Индекс тегов для быстрого поиска

```ts
// Генерируется при сборке
export async function buildTagIndex() {
    const allCollections = await Promise.all([
        getCollection('courses'),
        getCollection('recipes')
        // ... все коллекции
    ])

    const tagIndex = {}

    allCollections.flat().forEach((item) => {
        item.data.tags.forEach((tag) => {
            if (!tagIndex[tag]) tagIndex[tag] = []
            tagIndex[tag].push(item)
        })
    })

    return tagIndex
}
```

## Структура страниц (вариант 1)

```txt
src/pages/
┣ 📜index.astro              // Главная с глобальным поиском
┣ 📂courses/
┃ ┣ 📜index.astro           // Все курсы
┃ ┣ 📜programming.astro     // Курсы по программированию
┃ ┣ 📜cooking.astro         // Кулинарные курсы
┃ ┗ 📜[...slug].astro       // Детальная страница курса
┣ 📂recipes/
┃ ┣ 📜index.astro           // Все рецепты
┃ ┣ 📜desserts.astro        // Десерты
┃ ┗ 📜[...slug].astro       // Детальная страница рецепта
┣ 📂browse/
┃ ┗ 📜[tag].astro           // Глобальная страница тега
┗ 📜search.astro            // Глобальный поиск
```

### Преимущества этой архитектуры

**Для масштабирования:**

1. Добавление новых типов контента - просто создаёшь новую коллекцию
2. Изменение схем данных - не ломает другие коллекции
3. Разные команды могут работать над разными доменами

**Для производительности:**

1. Tree-shaking - загружаешь только нужные коллекции
2. Предсказуемые запросы - знаешь точно, к какой коллекции обращаешься

**Для разработки:**

1. TypeScript автодополнение для каждого типа контента
2. Валидация данных на уровне схем
3. Чёткое разделение ответственности
