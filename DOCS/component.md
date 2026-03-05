# Правила создания компонента

## простой компонент

Напишем простой компонент `Card01.astro`

1. Пишу структуру карточки, в которой есть заголовок, подзаголовок, и описание
2. Пишу `interface` для карточки
3. Создаю переменную.

```astro
---
// Card01.astro

export interface Props {
  title: string;
  subtitle: string;
  description: string;
}

const {title, subtitle, description} = Astro.props;
---

<div>
  <h2>{title}</h2>
  <h3>{subtitle}</h3>
  <p>{description}</p>
</div>
```

**Далее**
Как использовать в другом компоненте `Section01.astro` (условие другой компонент имеет `data.ts`)

1. Нужно импортировать в `data.ts` типы из карточки

```astro
---
// data.ts

import type {Props as card01} from "@components/ui/card/Card01.astro"

export const card01: {
  title={title},
  subtitle={subtitle},
  description={description},
}
---


```
