<template>
    <v-app id="inspire">
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Login</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-form>
                            <v-card-text>
                                <p>You can use your Google account or Facebook account to use our services</p>
                            </v-card-text>
                            <v-layout align-center justify-center>
                                <v-card-actions>
                                    <v-btn
                                        :loading="loading_g"
                                        :disabled="loading_g"
                                        color="#ea4335"
                                        class="white--text"
                                        @click="signin_g"
                                    >
                                        Signin with Google
                                    </v-btn>
                                    <v-btn
                                        :loading="loading_f"
                                        :disabled="loading_f"
                                        color="#3c57a4"
                                        class="white--text"
                                        @click="signin_f"
                                    >
                                        Signin with Facebook
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-layout>
                            </v-form>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>


<script>
    export default {
        data () {
            return {
                loading_g: false,
                loading_f: false
            }
        },
        watch: {
            loader () {
                const l = this.loader
                this[l] = !this[l]

                setTimeout(() => (this[l] = false), 3000)

                this.loader = null
            }
        },
        methods:{
          signin_g: function () {
             this.$store.dispatch('login_g')
            .then(() => this.$router.push('/'))
            .catch(err => console.log(err))
          },
          signin_f: function () {
             this.$store.dispatch('login_f')
            .then(() => this.$router.push('/'))
            .catch(err => console.log(err))
          }
        },
    }
</script>
