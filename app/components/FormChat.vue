<template>
<div v-if="loading">
      <a class="button is-link is-loading is-outlined">Loading</a>
  </div>
  <div v-else>
      <div v-if="user">
          <form>
              <small>Press ENTER to submit</small>
              <p class="control">
                  <textarea v-model="inputBind" v-on:keyup="keySubmit(inputBind, $event)" class="textarea" placeholder="Write message"></textarea>
              </p>
              <br>
              <div class="control is-grouped">
                  <p class="control">
                      <button type="submit" v-on:click="clickSubmit(inputBind, $event)" class="button is-link" :disabled="!inputBind || !inputBind.trim()">Submit</button>
                  </p>
              </div>
          </form>
      </div>
      <div v-else class="control is-grouped">
          <p class="control">
              <button v-on:click="login($event)" class="button is-link is-outlined">
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
    name: 'FormChat',
    props: ['loading', 'user', 'input', 'keySubmit', 'clickSubmit', 'login'],
    data: () => {
      return {
        inputBind: this.input
      }
    }
}
</script>
