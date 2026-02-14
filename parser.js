import fs from 'fs'
import path from 'path'

// Читаем HTML файл
const html = fs.readFileSync('./index.html', 'utf-8')

// Регулярное выражение для поиска ссылок вида /id123 или /outlab
// Ищет href="/...", где внутри только буквы и/или цифры
const regex = /href="\/([a-zA-Z0-9]+)"/g

// Находим все совпадения
const matches = [...html.matchAll(regex)]

// Извлекаем только пути
const links = matches.map((match) => `/${match[1]}`)

// Удаляем дубликаты
const uniqueLinks = [...new Set(links)]

// Записываем в файл
fs.writeFileSync('./links.txt', uniqueLinks.join('\n'))

console.log(`✅ Найдено ${uniqueLinks.length} уникальных ссылок`)
console.log('📄 Сохранены в links.txt')
