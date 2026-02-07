
---
layout: default
title: "Home"
---

<nav class="terminal-nav">
  <div class="nav-terminal">
    <span class="nav-prompt">visitor@cryptolab:~$</span>
    <input 
      type="text" 
      id="navInput" 
      class="nav-input" 
      placeholder="type 'help' for commands"
      autocomplete="off"
      spellcheck="false">
  </div>
  <div id="navOutput" class="nav-output"></div>
</nav>

<section id="about" class="section">
 <p class="section-subtitle"><a href="{{ '/about' | relative_url }}" class="nav-button">About Me</a></p>
 </section>

<section id="logs" class="section">
  <h2>Latest Logs</h2>
  <p class="section-subtitle">Hey read these! It would make me happy ₊‧°𐐪♡𐑂°‧₊  </p>
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

<section id="portfolio" class="section">
  <h2>Digi-Expressionism Portfolio</h2>
  <p class="section-subtitle">Visual explorations :3 </p>
  
  <div id="portfolioContent" class="portfolio-content">
    <div class="portfolio-filters">
      <button class="filter-btn active" data-filter="all">All (47)</button>
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
  </div>
</section>

<section id="texts" class="section">
  <h2>Texts & Papers</h2>
  <p class="section-subtitle">Theoretical explorations on algorithmic beauty(?) and the art of hacking anything that interests you :3</p>
  <div class="texts-grid">
    <article class="text-item">
      <h3>On Recursive Deconstruction of the Digital Banal inside the Network of Art</h3>
      <p class="date">2025</p>
      <p>On hacking the network of art</p>
      <a href="{{ '/recursive-destruction' | relative_url }}" class="text-link">Read More →</a>
    </article>
  </div>
</section>
