<template>
    <div>
        <h1>No existen registros aún</h1>
    </div>
</template>

<script>
export default {
    created(){
        this.$store.dispatch('camera/stopCamera')
    }
}
</script>