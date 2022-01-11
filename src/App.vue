<template>
  <v-app id="app">
    <v-card>
      <v-toolbar color="green"
                 flat
                 tile
                 elevation="0">
        <v-toolbar-title>Чатик</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-switch v-model="$vuetify.theme.dark"
                  inset
                  hide-details
                  color="indigo darken-3"
                  flat
                  label="Темная тема"></v-switch>
      </v-toolbar>
    </v-card>
    <router-view />
  </v-app>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
