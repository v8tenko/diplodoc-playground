# Плагины

Кроме базового синтаксиса [CommonMark Spec](https://spec.commonmark.org/), YFM предоставляет набор плагинов с дополнительными возможностями и уникальными элементами разметки.

{% note warning %}

Порядок добавления плагинов важен. При добавлении плагинов следует указать полный набор плагинов

{% endnote %}

{% include [plugins.md](../_includes/plugins.md) %}

Выше перечислены плагины, включенные в пакет YFM. Но вы можете [подключить дополнительные](import.md) или написать свой плагин, пользуясь [руководством от markdown-it](https://github.com/markdown-it/markdown-it/tree/master/docs). 