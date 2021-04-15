import { Plugin } from '@nuxt/types'
import { initializeAxios } from './../utils/api'

const acc: Plugin = ({ $axios }) => {
    initializeAxios($axios)
}

export default acc;
