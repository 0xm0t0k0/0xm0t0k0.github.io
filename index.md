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
 <p><a href="{{ '/about' | relative_url }}" class="nav-button">About Me</a></p>
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


<section id="portfolio" class="section portfolio-locked">
  <h2>Digi-Expressionism Portfolio</h2>
  <p class="section-subtitle">Visual explorations :3 </p>
  
  <!-- Multi-Stage Encryption Puzzle -->
  <div id="portfolioPuzzle" class="encryption-puzzle">
    <div class="puzzle-container">
      <h3 class="puzzle-title">// ACCESS RESTRICTED //</h3>
      <p class="puzzle-hint">Solve the little ciphers to unlock the portfolio. U may want to code your own decoding or just use an online decoder 0.< </p>
      <p class="stage-counter">Stage <span id="currentStage">1</span> of 3</p>
      
      <!-- Stage 1: Binary -->
      <div id="stage1" class="puzzle-stage">
        <h4 class="stage-title">BINARY DECRYPTION</h4>
        <pre class="encrypted-message">
00110000 01111000 01101101 00110000 01110100
00110000 01101011 00110000
        </pre>
        <p class="cipher-hint">Cipher: <span class="cipher-type">Binary → ASCII</span></p>
      </div>
      
      <!-- Stage 2: Hex -->
      <div id="stage2" class="puzzle-stage" style="display: none;">
        <h4 class="stage-title">HEXADECIMAL DECRYPTION</h4>
        <pre class="encrypted-message">
30 78 74 68 30 30 72 66 31 6e 6e
        </pre>
        <p class="cipher-hint">Cipher: <span class="cipher-type">Hexadecimal → ASCII</span></p>
      </div>
      
      <!-- Stage 3: Base64 -->
      <div id="stage3" class="puzzle-stage" style="display: none;">
        <h4 class="stage-title">BASE64 DECRYPTION</h4>
        <pre class="encrypted-message">
NGNjM3NzX2dyNG50M2RfdzNsYzBtM18h
        </pre>
        <p class="cipher-hint">Cipher: <span class="cipher-type">Base64 → ASCII</span></p>
        <p class="final-hint">Sooo closee (๑>◡<๑) </p>
      </div>
      
      <div class="terminal-container">
        <div class="terminal-header">
          <span class="terminal-button red"></span>
          <span class="terminal-button yellow"></span>
          <span class="terminal-button green"></span>
          <span class="terminal-title">root@cryptolab:~#</span>
        </div>
        <div class="terminal-body">
          <div class="terminal-prompt">
            <span class="prompt-symbol">$</span>
            <input 
              type="text" 
              id="decryptInput" 
              placeholder="decrypt --key"
              class="terminal-input"
              autocomplete="off"
              spellcheck="false">
          </div>
        </div>
      </div>
      
      <button id="unlockBtn" class="unlock-btn">EXECUTE</button>
      
      <div id="errorMessage" class="terminal-output"></div>
      
      <div id="progressBar" class="progress-bar">
        <div id="progressFill" class="progress-fill"></div>
      </div>
      
      <div class="ascii-decoration">
        <pre>
 ____                                          __            __           ___                                               
/\  _`\                                       /\ \__      __/\ \__      /'___\                                              
\ \ \/\ \     __    ___   _ __   __  __  _____\ \ ,_\    /\_\ \ ,_\    /\ \__/  ___   _ __         ___ ___   __  __         
 \ \ \ \ \  /'__`\ /'___\/\`'__\/\ \/\ \/\ '__`\ \ \/    \/\ \ \ \/    \ \ ,__\/ __`\/\`'__\     /' __` __`\/\ \/\ \        
  \ \ \_\ \/\  __//\ \__/\ \ \/ \ \ \_\ \ \ \L\ \ \ \_    \ \ \ \ \_    \ \ \_/\ \L\ \ \ \/      /\ \/\ \/\ \ \ \_\ \       
   \ \____/\ \____\ \____\\ \_\  \/`____ \ \ ,__/\ \__\    \ \_\ \__\    \ \_\\ \____/\ \_\      \ \_\ \_\ \_\/`____ \      
    \/___/  \/____/\/____/ \/_/   `/___/> \ \ \/  \/__/     \/_/\/__/     \/_/ \/___/  \/_/       \/_/\/_/\/_/`/___/> \     
                                     /\___/\ \_\                                                                 /\___/     
                                     \/__/  \/_/                                                                 \/__/      
                      __       ___       ___                                                                                
                     /\ \__  /'___\     /\_ \    __                                                                         
 _____     ___   _ __\ \ ,_\/\ \__/  ___\//\ \  /\_\    ___                                                                 
/\ '__`\  / __`\/\`'__\ \ \/\ \ ,__\/ __`\\ \ \ \/\ \  / __`\                                                               
\ \ \L\ \/\ \L\ \ \ \/ \ \ \_\ \ \_/\ \L\ \\_\ \_\ \ \/\ \L\ \                                                              
 \ \ ,__/\ \____/\ \_\  \ \__\\ \_\\ \____//\____\\ \_\ \____/                                                              
  \ \ \/  \/___/  \/_/   \/__/ \/_/ \/___/ \/____/ \/_/\/___/                                                               
   \ \_\                                                                                                                    
    \/_/                                                                                                                    
        </pre>
      </div>
    </div>
  </div>
  
  <!-- Unlocked Portfolio (hidden initially) -->
  <div id="portfolioContent" class="portfolio-content" style="display: none;">
    <div class="unlock-success">
      <p>✓ ACCESS GRANTED - 4CC3SS_GR4NT3D_W3LC0M3_!</p>
    </div>
    
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