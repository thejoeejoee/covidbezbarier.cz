<template>
    <nuxt-link :to="switchLocalePath($i18n.locale == 'en' ? 'cs' : 'en')">
        {{ $t("switch") }}
    </nuxt-link>
</template>

<script>
export default {
    name: "LocaleSwitchLink"
}
</script>

<style scoped>

</style>

<i18n>
{
    "en": {
        "switch": "česky"
    },
    "cs": {
        "switch": "switch to english"
    }
}
</i18n>
