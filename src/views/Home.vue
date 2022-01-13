<template>
  <v-container>
    <v-flex md6
            offset-md3
            offset-sm3
            offset-xs1
            sm6
            xs10>
      <div v-if="!ready">
        <h4>Введите свое имя</h4>
        <v-form v-model="valid">
          <v-text-field v-model="username"
                        counter
                        :rules="nameRules"
                        label="Имя"
                        required></v-text-field>
          <v-btn :disabled="!valid"
                 color="success"
                 class="mr-4"
                 @click="addUser">
            Войти
          </v-btn>
        </v-form>
      </div>
      <h2 v-else>Ваше имя: {{username}}</h2>
      <div v-if="ready">
        <v-card class="message-layout">
          <v-card-text class="text-end">
            Людей онлайн: {{connections}}
          </v-card-text>
          <small v-if="typing"
                 class="text-white">{{typing}} is typing</small>
          <div v-for="message in messages"
               :key="message"
               class="message"
               :class="{message__own: message.isYou === true}">
            <p class="content message"
               :class="{message__green: message.isYou === true}">{{ message.body }}</p>
            <small>:{{message.username}}</small>
          </div>
          <v-text-field v-model="newMessage"
                        label="Введите сообщение"
                        :rules="rules"
                        hide-details="auto"
                        @keyup.enter="send">
          </v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary"
                   large
                   outlined
                   rounded
                   text
                   @click="send">Отправить</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div v-if="ready">
        <p v-for="user in userInfo"
           :key="user">
          {{user.username}} {{user.type}}
        </p>
      </div>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { io } from 'socket.io-client';
import { MessageArray, Message, UserInfo, UserInfoArray } from '../types';
export default Vue.extend({
  name: 'Home',
  data() {
    return {
      valid: false as boolean,
      newMessage: '' as string,
      username: '' as string,
      typing: null as null | string,
      ready: false as boolean,
      userInfo: [] as Record<string, never> | UserInfoArray,
      connections: 0 as number,
      messages: [] as Record<string, never> | MessageArray,
      nameRules: [
        (v: string) => !!v || 'Нужно ввести имя',
        (v: string) => (v && v.length >= 3 && v.length <= 20) || 'Имя должен быть длиннее 3 и короче 20 символов',
        (v: string) =>
          /^[A-zА-я0-9]+([-_]?[A-zА-я0-9]+){0,2}$/i.test(v) || 'Имя не может содержать символы кроме - и _',
      ],
    };
  },
  computed: {
    socket() {
      return io('/', {
        closeOnBeforeunload: false,
      });
    },
  },
  watch: {
    newMessage(value: string) {
      value ? this.socket.emit('typing', this.username as string) : this.socket.emit('stopTyping');
    },
  },
  async created() {
    this.socket.connect();
    this.socket.on('connections', (count: number) => {
      this.connections = count;
    });

    this.socket.on('typing', (username: string) => {
      this.typing = username;
    });

    this.socket.on('stopTyping', () => {
      this.typing = null;
    });

    this.socket.on('chat-message', (receivedMessageData: Message) => {
      this.messages.push({
        body: receivedMessageData.body,
        isYou: false,
        username: receivedMessageData.username,
      } as Message);
    });

    this.socket.on('joined', (username: string) => {
      this.userInfo.push({
        username: username,
        type: 'вошел',
      } as UserInfo);

      setTimeout(() => {
        this.userInfo = [];
      }, 5000);
    });

    this.socket.on('leave', (username: string) => {
      this.userInfo.push({
        username: username,
        type: 'вышел',
      } as UserInfo);

      setTimeout(() => {
        this.userInfo = [];
      }, 5000);
    });

    window.onbeforeunload = () => {
      this.socket.emit('leave', this.username);
    };
    try {
      const response = await fetch('/messages', {
        method: 'GET',
      });
      const mes = await response.json();
      this.messages.push(...mes);
    } catch (error: any) {
      console.error(error.message);
    }
  },
  methods: {
    addUser() {
      this.ready = true;
      this.socket.emit('joined', this.username);
    },
    async send() {
      const message = this.newMessage;
      if (message !== '') {
        this.messages.push({
          body: message,
          isYou: true,
          username: 'Вы',
        } as Message);

        this.socket.emit('chat-message', {
          body: message,
          isYou: false,
          username: this.username,
        } as Message);
      }
      this.newMessage = '';

      try {
        await fetch('/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ body: message, username: this.username }),
        });
      } catch (error: any) {
        console.log(error.message);
        throw new Error('Что-то пошло не так');
      }
    },
  },
});
</script>

<style scoped>
.content {
  padding: 8px;
  background-color: lightskyblue;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  max-width: 50%;
  word-wrap: break-word;
}
.message {
  margin-bottom: 3px;
  text-align: left;
}
.message__green {
  background-color: lightgreen;
}
.message__own {
  text-align: right !important;
}
.message-layout {
  max-height: 82vh;
  overflow: auto;
}
</style>
