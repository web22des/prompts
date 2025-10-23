## Для создания блога, нужно

1. В дирректории `src/pages` создать страницу для постов - `src/pages/blog.astro`
2. Далее в той же дирректории `src/pages` создать папку с постами `src/pages/posts/`
3. Создать файл(ы) для постов `src/pages/posts/post-1.md`
4. В файле с постом создаем поле с метаданными

```md
---
# src/pages/posts/post-1.md
layout: '../../layouts/MarkdownPostLayout.astro'
title: Моя вторая запись в блоге
author: Ученик Astro
description: 'После изучения Astro я не смог остановиться!'
image:
    url: '/images/01.webp'
    alt: 'Миниатюра со смайликами.'
pubDate: '2022-07-08'
tags: ['astro', 'ведение блога', 'обучение в открытом доступе', 'успехи']
---
```
