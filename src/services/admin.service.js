import {axiosInstance} from "../refreshToken/axios-interceptor";

class AdminService {
    static async getUserList() {
        return await axiosInstance.get('http://localhost:8000/admin/userlist')
    }
    static async getSingers(){
        return await axiosInstance.get('http://localhost:8000/admin/singers')
    }
    static async getComposers(){
        return await axiosInstance.get('http://localhost:8000/admin/composers')
    }
    static async getTags(){
        return await axiosInstance.get('http://localhost:8000/admin/tags')
    }
    static async addSinger(data){
        return await axiosInstance.post('http://localhost:8000/admin/addsinger',data)
    }
    static async deleteSinger(id){
        return await axiosInstance.delete('http://localhost:8000/admin/deletesinger/'+id)
    }
    static async addComposer(data){
        return await axiosInstance.post('http://localhost:8000/admin/addcomposer',data)
    }
    static async deleteComposer(id){
        return await axiosInstance.delete('http://localhost:8000/admin/deletecomposer/'+id)
    }
    static async addTag(data){
        return await axiosInstance.post('http://localhost:8000/admin/addtag',data)
    }
    static async deleteTag(id){
        return await axiosInstance.delete('http://localhost:8000/admin/deletetag/'+id)
    }
    
}

export default AdminService