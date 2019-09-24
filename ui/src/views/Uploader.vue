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
            <v-alert
                v-model="show"
                v-bind="border"
                :dismissible="true"
                :type="type"
                class="mb-4"
              >
                {{ message }}
              </v-alert>
            <v-card
              class="d-flex pa-2"
              outlined
              tile
              md12
              style="width:550px;"
            >
              <form
                ref="form"
                class="mt-2"
                action="http://localhost:3000/upload"
                method="post" 
                enctype="multipart/form-data"
                style="width:500px;"
                >
                    <v-file-input show-size counter multiple v-model="input_file" name="input_file" label="File input"></v-file-input> 
                    <input type="hidden" v-model="token" name="token">  
                    <v-btn
                    type="submit"
                    color="primary"
                    >
                    <v-icon>cloud_upload</v-icon>
                    </v-btn>
                </form>
                
            </v-card>
            
          </v-container>
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
                input_file: [],
                show:false,
                type:"",
                token:$cookies.get('token'),
                message:""
            }
        },
        methods:{
            upload_files: function () {
                let data = {
                    file_upload: this.input_file,
                }
                this.$store.dispatch('upload', data)
                .then(() => this.$router.push('/home'))
                .catch(err => console.log(err))
            }
        },
         mounted: function() {
            var stat = this.$route.query.file
            if(stat == 'uploaded'){
              this.type = "success"
              this.message = "File uploaded successfully !"
              this.show = true
            }else if(stat == 'notuploaded'){
              this.type = "error"
              this.message = "File uploading failed !"
              this.show = true
            }
            console.log(stat)
        },
    }
</script>