<template>
  <v-app id="inspire">
    <v-toolbar>
      <v-toolbar-side-icon>
        <v-icon>attach_file</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>File Uploader</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="/">Home</v-btn>
        <template v-if="isLoggedIn == false">
          <v-btn flat to="/login">Login</v-btn>
        </template>
        <template v-else-if="isLoggedIn == true">
          <v-btn flat to="/uploader">Uploader</v-btn>
          <v-btn flat icon @click="logout"><v-icon>power_settings_new</v-icon></v-btn>
        </template>
      </v-toolbar-items>
    </v-toolbar>
    <router-view/>
  </v-app>
</template>

<script>
  export default {
    name: 'panel',
    data () {
      return {
        authenticated:false,
      }
    },
    computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
    methods: {
      created: function () {
        this.$http.interceptors.response.use(undefined, function (err) {
          return new Promise(function (resolve, reject) {
            if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
              this.$store.dispatch(logout)
            }
            throw err;
          });
        });
      },
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/')
        })
      }
    },
  }
</script>
