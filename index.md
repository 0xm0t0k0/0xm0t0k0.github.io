---
layout: default
title: "Home"
---

<nav class="main-nav">
  <a href="{{ '/about' | relative_url }}" class="nav-button">About Me</a>
  <a href="#portfolio" class="nav-button">Portfolio</a>
  <a href="#logs" class="nav-button">Latest Logs</a>
</nav>

<section id="portfolio" class="section">
  <h2>Artistic Portfolio</h2>
  
  <div class="portfolio-filters">
    <button class="filter-btn active" data-filter="all">All (47)</button>
    <button class="filter-btn" data-filter="digital">Digital</button>
    <button class="filter-btn" data-filter="crypto">Cryptography</button>
    <button class="filter-btn" data-filter="experimental">Experimental</button>
  </div>

  <div class="portfolio-masonry" id="portfolioGrid">
    {% for item in site.data.portfolio %}
    <article class="portfolio-item" data-category="{{ item.category }}">
      <div class="portfolio-img-wrapper">
        <img 
          data-src="{{ '/assets/images/portfolio/full/' | append: item.image | relative_url }}" 
          alt="{{ item.title | default: 'Portfolio item' }}"
          class="portfolio-img lazy"
          loading="lazy">
        {% if item.title %}
        <div class="portfolio-overlay">
          <div class="overlay-content">
            <h4>{{ item.title }}</h4>
            {% if item.year %}<p class="year">{{ item.year }}</p>{% endif %}
          </div>
        </div>
        {% endif %}
      </div>
    </article>
    {% endfor %}
  </div>

  <div class="load-more-container">
    <button id="loadMore" class="load-more-btn">Load More</button>
    <p class="items-count"><span id="shownCount">12</span> of <span id="totalCount">47</span> shown</p>
  </div>
</section>

<section id="logs" class="section">
  <h2>Latest Logs</h2>
  <div class="posts">
    {% for post in site.posts %}
    <article class="post">
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p class="date">{{ post.date | date: "%B %d, %Y" }}</p>
      {% if post.excerpt %}
      <p>{{ post.excerpt | strip_html | truncate: 150 }}</p>
      {% endif %}
    </article>
    {% endfor %}
  </div>
</section>