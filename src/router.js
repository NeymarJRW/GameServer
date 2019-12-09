import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Home.vue'

/** 管理区 */
import Marilyn from './views/Manage/Marilyn.vue'
import Pending from './views/Manage/Pending.vue'
import Tag from './views/Manage/Tag.vue'
import Games from './views/Manage/Games.vue'
import Login from './views/Manage/Login.vue'
import Home from './views/Home.vue'
import RecomGame from './views/Manage/Recom_game.vue'
import RecomPlatform from './views/Manage/Recom_platform.vue'
import RecomRecommend from './views/Manage/Recom_recommend.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/home',
      name: 'home',
      component: Home,
      children: [{
          path: '/marilyn',
          /** 管理区 */
          name: 'marilyn',
          component: Marilyn
        },
        {
          path: '/tag',
          name: 'tag',
          component: Tag
        },
        {
          path: '/games',
          name: 'games',
          component: Games
        },
        {
          path: '/pending',
          name: 'pending',
          component: Pending
        },
        {
          path: '/recomGame',
          name: 'recomGame',
          component: RecomGame
        },
        {
          path: '/recomPlatform',
          name: 'recomPlatform',
          component: RecomPlatform
        },
        {
          path: '/recomRecommend',
          name: 'recomRecommend',
          component:RecomRecommend
        },
      ]

    },
    {
      path: '/',
      name: 'login',
      component: Login
    },

  ]
})
