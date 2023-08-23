import {axiosInstance} from "../refreshToken/axios-interceptor";

class UserService {
    static async getSongs() {
        return await axiosInstance.get("http://localhost:8000/user/list/songs");
    }

    static async getOneSong(songId) {
        return await axiosInstance.get("http://localhost:8000/user/song/detail/" + songId);
    }

    static async addSong(data) {
        return await axiosInstance.post("http://localhost:8000/user/upload/song", data);
    }

    static async editPassword(data) {
        return await axiosInstance.put("http://localhost:8000/user/editpassword", data);
    }

    static async getInfo(id) {
        return await axiosInstance.get("http://localhost:8000/user/info/" + id);
    }

    static async editInfo(data) {
        return await axiosInstance.put("http://localhost:8000/user/editinfo",data);
    }

    static async deleteSong(data) {
        return await axiosInstance.delete("http://localhost:8000/user/song/delete", {
            data: data,
        });
    }

    static async getPlaylist() {
        return await axiosInstance.get("http://localhost:8000/user/playlist");
    }

    static async getSongInPlaylist(playlistId) {
        return await axiosInstance.get("http://localhost:8000/user/playlist/" + playlistId);
    }

    static async addPlayList(data) {
        return await axiosInstance.post("http://localhost:8000/user/playlist/create", data);
    }

    static async searchSong(playlistName, accessToken) {
        return await axiosInstance.get(`http://localhost:8000/user/search?songName=${playlistName}`);
    }

    static async addSongToPlaylist(playlistId, songId) {
        return await axiosInstance.post(`http://localhost:8000/user/playlist/add-song/` + playlistId, {songId: songId});
    }

    static async removeSongFromPlaylist(playlistId, songId) {
        return await axiosInstance.post(`http://localhost:8000/user/playlist/remove-song/` + playlistId, {songId: songId});
    }

    static async deletePlaylist(data) {
        return await axiosInstance.delete("http://localhost:8000/user/playlist/delete", {
            data: data,
        });
    }

    static async editPlaylist(data) {
        return await axiosInstance.put("http://localhost:8000/user/playlist/update", data);
    }

    static async updateSongState(data) {
        return await axiosInstance.put("http://localhost:8000/user/song/update-state", data);
    }

    static async editSong(data){
        return await axiosInstance.put("http://localhost:8000/user/song/update", data)
    }

    static async showCommentInSong(songId){
        return await axiosInstance.get("http://localhost:8000/user/song/show-comment/" + songId);
    }

    static async submitComment(comment, songId) {
        return await axiosInstance.post("http://localhost:8000/user/song/add-comment/" + songId, {comment: comment});
    }

    static async deleteComment(commentId) {
        return await axiosInstance.get("http://localhost:8000/user/song/delete-comment/" + commentId);
    }

    static async submitLikeOfSong(songId){
        return await axiosInstance.get("http://localhost:8000/user/song/like/" + songId);
    }

    static async submitDislikeOfSong(songId){
        return await axiosInstance.get("http://localhost:8000/user/song/dislike/" + songId)
    }

    static async submitLikePlaylist(playlist){
        return await axiosInstance.get("http://localhost:8000/user/playlist/like/" + playlist);
    }

    static async submitDislikePlaylist(playlist){
        return await axiosInstance.get("http://localhost:8000/user/playlist/dislike/" + playlist);
    }
    static async submitCommentPlaylist(comment, playlistId) {
        return await axiosInstance.post("http://localhost:8000/user/playlist/add-comment/" + playlistId, {comment: comment});
    }

    static async changeToSeen(notifyId){
        return await axiosInstance.patch("http://localhost:8000/user/notify/change-to-seen/" + notifyId);
    }
}

export default UserService;
