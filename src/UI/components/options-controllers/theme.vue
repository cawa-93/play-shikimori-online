<template>
    <v-list
        flat
        subheader
        two-line
    >
        <v-subheader>Внешний вид</v-subheader>

        <v-list-item-group
            multiple
            v-model="theme"
        >
            <v-list-item value="dark">
                <template v-slot:default="{ active, toggle }">
                    <v-list-item-action>
                        <v-checkbox
                            color="primary"
                            v-model="active"
                        ></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>Включить темную тему</v-list-item-title>
                        <v-list-item-subtitle>Все елементы управления на всех страницах будут иметь приглушенные тона</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
            </v-list-item>

        </v-list-item-group>
    </v-list>
</template>


<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';


    @Component({
        name: 'theme-option',
    })
    export default class ThemeOption extends Vue {
        get theme() {
            return this.$vuetify.theme.dark ? ['dark'] : [];
        }

        set theme(v) {
            const isDark = v.includes('dark');
            this.$vuetify.theme.dark = isDark;
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }


    }
</script>

<style scoped>

</style>
