import Vue from 'vue'

interface GTM {
    push(obj: any) : any;
}

declare module 'vue/types/vue' {
    interface Vue {
        $gtm: GTM
    }
}
