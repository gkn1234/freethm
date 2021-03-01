/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-28 18:28:49
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-01 11:33:40
 */
const path = require('path')

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: path.join(__dirname, './src') }
    ]
  }
})
