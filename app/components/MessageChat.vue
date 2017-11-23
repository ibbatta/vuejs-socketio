<template>
    <div class="card">
      <div class="card-content">
          <div class="media">
              <div class="media-left">
                  <figure class="image is-48x48">
                      <a target="_blank" :href="'http://github.com/' + message.user">
                        <img :src="message.pict" alt="Profile Pict">
                      </a>
                  </figure>
              </div>
              <div class="media-content">
                  <p class="title is-4">
                      <a target="_blank" :href="'http://github.com/' + message.user" v-text="'@' + message.user"></a>
                  </p>
                  <p class="subtitle is-6" v-text="message.name"></p>
              </div>
          </div>
          <div class="content">
              <p v-text="message.message"></p>
              <a href="#">#hashtag1</a> <a href="#">#hashtag2</a>
              <br>
              <time class="is-size-7" v-bind:datetime="message.time" v-text="message.time"></time>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    props: ['message'],
};
</script>
