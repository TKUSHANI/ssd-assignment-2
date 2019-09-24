<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm12 md12>
            <v-container
            fluid
            grid-list-md
            >
            <v-layout row wrap>
              <v-flex
                md12
                d-flex
              >
                <v-card flat tile class="d-flex">
                  <v-img
                    :src="require(`@/assets/images/logo.jpg`)"
                    :lazy-src="require(`@/assets/images/logo.jpg`)"
                  >
                    <template v-slot:placeholder>
                      <v-layout
                        fill-height
                        align-center
                        justify-center
                        ma-0
                      >
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-layout>
                    </template>
                  </v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</v-app>
</template>
