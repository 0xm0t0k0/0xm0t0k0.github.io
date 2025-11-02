---
layout: default
title: "Home"
---

## Latest Logs

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url }})
{% endfor %}

