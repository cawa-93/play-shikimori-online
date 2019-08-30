import {Player} from '@/UI/store/player';
import {Profile} from '@/UI/store/profile';
import {Shikimori} from '@/UI/store/shikimori';

export interface RootState {
    profile: Profile;
    shikimori: Shikimori;
    player: Player;
}
