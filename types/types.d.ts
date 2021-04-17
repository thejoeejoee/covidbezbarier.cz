declare module 'vue2-leaflet-markercluster' {
    import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster/Vue2LeafletMarkercluster.vue'
    export default Vue2LeafletMarkerCluster
}
declare module 'debounce-async';
declare module 'vue-typer';
declare module "*.vue" {
    import Vue from 'vue'
    export default Vue
}

interface GTM {
    push(obj: any) : any;
}

declare module 'vue/types/vue' {
    interface Vue {
        $gtm: GTM
    }
}
