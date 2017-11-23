<template>
<div v-if="loading">
      <a class="button is-primary is-loading is-outlined">Loading</a>
  </div>
  <div v-else>
      <div v-if="user">
          <form v-on:submit.prevent="clickSubmit(input, $event)">
              <small>Press ENTER to submit</small>
              <p class="control">
                  <textarea v-model="input" v-on:keydown="keySubmit(input, $event)" class="textarea" placeholder="Write message"></textarea>
              </p>
              <br>
              <div class="control is-grouped">
                  <p class="control">
                      <button v-on:click="clickSubmit(input, $event)" class="button is-primary" :disabled="!input">Submit</button>
                  </p>
              </div>
          </form>
      </div>
      <div v-else class="control is-grouped">
          <p class="control">
              <button v-on:click="login($event)" class="button is-primary is-outlined">
                  <span class="icon">
                <i class="fa fa-github"></i>
              </span>
                  <span>GitHub login</span>
              </button>
          </p>
      </div>
  </div>
</template>

<script>
export default {
    props: ['loading', 'user', 'input', 'keySubmit', 'clickSubmit', 'login'],
};
</script>
