import {instance as axios} from "./config.service";

const url = '/user_storages';

const getUserStorages = (id, params) => ({url: `${url}/${id}`, method: 'get', params});

const postUserStorage = (data) => ({url, method: 'post', data});

const putUserStorage = (id, data) => ({url: `${url}/${id}`, method: 'put', data});

const deleteUserStorage = (id) => ({url: `${url}/${id}`, method: 'delete'});

export { getUserStorages, postUserStorage, putUserStorage, deleteUserStorage };