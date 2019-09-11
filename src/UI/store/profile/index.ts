import {ShikimoriProvider} from '@/helpers/API/ShikimoriProvider';
import {updateAuth} from '@/helpers/oauth-provider';
import store from '@/UI/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';

@Module({
    dynamic: true,
    namespaced: true,
    name: 'profile',
    store,
})
export class Profile extends VuexModule {
    public user: shikimori.User | null = null;
    public credentials: shikimori.Oauth | null = null;


    @Mutation
    public setUser(user: shikimori.User) {
        this.user = user;
    }

    @Mutation
    public saveCredentials(credentials: shikimori.Oauth) {
        this.credentials = credentials;
    }


    @Mutation
    public loadCredentialsFromServer(credentials: shikimori.Oauth) {
        this.credentials = credentials;
    }

    @Mutation
    public logout() {
        this.user = null;
        if (!this.credentials || !this.credentials.access_token) {
            return;
        }
        this.credentials.access_token = undefined;
    }


    @Action
    public async loadUser() {
        const auth = await this.getValidCredentials();
        if (!auth) {
            return;
        }

        try {
            /** @type {shikimori.User} */
            const user = await ShikimoriProvider.fetch<shikimori.User>(`/api/users/whoami`, {
                headers: {
                    Authorization: `${auth.token_type} ${auth.access_token}`,
                },
                errorMessage: 'Невозможно загрузить ваш профиль',
            });

            if (user) {
                this.setUser(user);
            }
        } catch (e) {
            console.error(e);
            e.alert().track();
        }
    }

    @Action
    public async getValidCredentials(force: boolean = false) {

        let auth = this.credentials;
        const isLoggedIn = (auth && auth.access_token);
        const isFresh = (
            isLoggedIn
            && auth
            && auth.created_at
            && auth.expires_in
            && (
                1000 * (auth.created_at + auth.expires_in) > Date.now()
            )
        );

        if (!isLoggedIn && !force) {
            return null;
        }


        if (isFresh) {
            return auth;
        }

        try {
            auth = await updateAuth();
            this.saveCredentials(auth);
            return auth;
        } catch (e) {
            console.error(e);
            e.alert().track();

            // Если сервер ответил ошибкой 401 — принудительно розлогинить пользователя
            if (e.response && e.response.status && e.response.status === 401) {
                this.logout();
            }
        }

    }
}

export default getModule(Profile);
