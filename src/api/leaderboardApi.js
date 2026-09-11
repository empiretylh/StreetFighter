import { apiFetch } from "./api.js";

export const getLeaderboard = async () => {

    return await apiFetch(
        "/street-fighter/leaderboard"
    );
};
